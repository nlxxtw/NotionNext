/**
 * 服务端代理不蒜子：浏览器直连常被墙/失败，导致「总浏览」空白
 * GET /api/busuanzi
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const proto = String(req.headers['x-forwarded-proto'] || 'https')
    const host = String(req.headers['x-forwarded-host'] || req.headers.host || '')
    const referer =
      String(req.headers.referer || '').trim() ||
      (host ? `${proto}://${host}/` : 'https://bg.19492035.xyz/')

    const urls = [
      'https://busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback',
      'http://busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback'
    ]

    let data = null
    for (const url of urls) {
      try {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 8000)
        const r = await fetch(url, {
          method: 'GET',
          headers: {
            Referer: referer,
            'User-Agent':
              'Mozilla/5.0 (compatible; NotionNextBusuanzi/1.0; +https://github.com/tangly1024/NotionNext)'
          },
          signal: controller.signal
        })
        clearTimeout(timer)
        if (!r.ok) continue
        const text = await r.text()
        data = parseJsonp(text)
        if (data) break
      } catch {
        // try next
      }
    }

    if (!data) {
      return res.status(200).json({ ok: false, site_pv: null, site_uv: null, page_pv: null })
    }

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    return res.status(200).json({
      ok: true,
      site_pv: toNum(data.site_pv),
      site_uv: toNum(data.site_uv),
      page_pv: toNum(data.page_pv)
    })
  } catch (e) {
    console.error('[busuanzi]', e)
    return res.status(200).json({ ok: false, site_pv: null, site_uv: null, page_pv: null })
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
