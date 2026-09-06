/**
 * 服务端代理不蒜子：浏览器直连常被墙/失败，导致「总浏览」空白
 * GET /api/busuanzi
 * 带短重试 + 内存缓存，减轻偶发超时
 */

const CACHE_TTL_MS = 60 * 1000
let memoryCache = { at: 0, data: null }

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const now = Date.now()
    if (
      memoryCache.data?.ok &&
      memoryCache.data.site_pv != null &&
      now - memoryCache.at < CACHE_TTL_MS
    ) {
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=60, stale-while-revalidate=300'
      )
      return res.status(200).json(memoryCache.data)
    }

    const proto = String(req.headers['x-forwarded-proto'] || 'https')
    const host = String(
      req.headers['x-forwarded-host'] || req.headers.host || ''
    )
    const referer =
      String(req.headers.referer || '').trim() ||
      (host ? `${proto}://${host}/` : 'https://bg.19492035.xyz/')

    const urls = [
      'https://busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback',
      'http://busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback'
    ]

    let data = null
    for (const url of urls) {
      for (let attempt = 0; attempt < 2 && !data; attempt++) {
        try {
          const controller = new AbortController()
          const timer = setTimeout(() => controller.abort(), 6000)
          const r = await fetch(url, {
            method: 'GET',
            headers: {
              Referer: referer,
              'User-Agent':
                'Mozilla/5.0 (compatible; NotionNextBusuanzi/1.1; +https://github.com/tangly1024/NotionNext)'
            },
            signal: controller.signal
          })
          clearTimeout(timer)
          if (!r.ok) continue
          const text = await r.text()
          data = parseJsonp(text)
        } catch {
          // try next
        }
      }
      if (data) break
    }

    if (!data) {
      // 上游失败时仍返回上次成功缓存，避免页脚「总浏览」闪空
      if (memoryCache.data?.ok) {
        res.setHeader(
          'Cache-Control',
          'public, s-maxage=30, stale-while-revalidate=120'
        )
        return res.status(200).json({ ...memoryCache.data, stale: true })
      }
      return res
        .status(200)
        .json({ ok: false, site_pv: null, site_uv: null, page_pv: null })
    }

    const payload = {
      ok: true,
      site_pv: toNum(data.site_pv),
      site_uv: toNum(data.site_uv),
      page_pv: toNum(data.page_pv)
    }
    memoryCache = { at: Date.now(), data: payload }

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    )
    return res.status(200).json(payload)
  } catch (e) {
    console.error('[busuanzi]', e)
    if (memoryCache.data?.ok) {
      return res.status(200).json({ ...memoryCache.data, stale: true })
    }
    return res
      .status(200)
      .json({ ok: false, site_pv: null, site_uv: null, page_pv: null })
  }
}

function parseJsonp(text) {
  if (!text) return null
  const m = String(text).match(/\{[\s\S]*\}/)
  if (!m) return null
  try {
    return JSON.parse(m[0])
  } catch {
    return null
  }
}

function toNum(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}
