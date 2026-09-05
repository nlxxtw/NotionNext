/**
 * 访客省市：解析客户端 IP → 中文省/市，并记住「最近访客」
 * 无外部 DB：进程内缓存（多实例/冷启动会重置，属预期）
 *
 * 定位优先级：太平洋网络（国内准）→ useragentinfo → ip-api
 */

let lastVisitor = null

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const ip = getClientIp(req)
    const geo = await lookupGeo(ip)
    if (geo?.label) {
      lastVisitor = {
        ...geo,
        at: Date.now()
      }
    }

    return res.status(200).json({
      ok: true,
      ip: maskIp(ip),
      current: geo,
      lastVisitor: lastVisitor || geo || null
    })
  } catch (e) {
    console.error('[visitor]', e)
    return res.status(200).json({
      ok: true,
      lastVisitor: lastVisitor || null,
      current: null
    })
  }
}

function getClientIp(req) {
  // CDN / 反代常见头：优先取真实访客 IP，避免定位到机房
  const candidates = [
    req.headers['cf-connecting-ip'],
    req.headers['true-client-ip'],
    req.headers['x-real-ip'],
    req.headers['x-client-ip'],
    req.headers['x-forwarded-for']
  ]

  for (const raw of candidates) {
    const ip = firstPublicIp(raw)
    if (ip) return ip
  }

  return (
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    ''
  ).replace(/^::ffff:/, '')
}

function firstPublicIp(value) {
  if (!value) return ''
  const list = Array.isArray(value) ? value : String(value).split(',')
  for (const part of list) {
    const ip = String(part || '')
      .trim()
      .replace(/^::ffff:/, '')
    if (!ip || isPrivateIp(ip)) continue
    return ip
  }
  // 全是内网时仍返回第一个，便于本地调试
  const first = String(list[0] || '')
    .trim()
    .replace(/^::ffff:/, '')
  return first
}

function maskIp(ip) {
  if (!ip || ip === '::1' || ip === '127.0.0.1') return 'local'
  if (ip.includes(':')) return ip.split(':').slice(0, 3).join(':') + ':*'
  const parts = ip.split('.')
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.*.*`
  return 'unknown'
}

function isPrivateIp(ip) {
  if (!ip) return true
  if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') return true
  if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('127.'))
    return true
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return true
  return false
}

async function lookupGeo(ip) {
  if (isPrivateIp(ip)) {
    return {
      country: '中国',
      province: '本地',
      city: '开发环境',
      label: '本地 · 开发环境'
    }
  }

  const providers = [
    () => lookupPconline(ip),
    () => lookupUserAgentInfo(ip),
    () => lookupIpApi(ip)
  ]

  for (const run of providers) {
    try {
      const geo = await run()
      if (geo?.label) return geo
    } catch (e) {
      console.warn('[visitor] geo provider failed', e?.message || e)
    }
  }
  return null
}

/** 太平洋网络 IP 库（国内归属更准）；响应常为 GBK */
async function lookupPconline(ip) {
  const url = `https://whois.pconline.com.cn/ipJson.jsp?json=true&ip=${encodeURIComponent(
    ip
  )}`
  const data = await fetchPconlineJson(url, 4000)
  if (!data || data.err === 'noprovince') return null

  const province = cleanPlace(data.pro)
  const city = cleanPlace(data.city)
  // 有些只给 addr，如「广东省深圳市 电信」
  if (!province && !city && data.addr) {
    const parsed = parseAddr(data.addr)
    return normalizeGeo(parsed)
  }

  return normalizeGeo({
    country: '中国',
    province,
    city
  })
}

async function lookupUserAgentInfo(ip) {
  const url = `https://ip.useragentinfo.com/json?ip=${encodeURIComponent(ip)}`
  const data = await fetchJson(url, 3500)
  if (!data) return null
  return normalizeGeo({
    country: data.country,
    province: data.province,
    city: data.city
  })
}

async function lookupIpApi(ip) {
  const url = `http://ip-api.com/json/${encodeURIComponent(
    ip
  )}?lang=zh-CN&fields=status,message,country,regionName,city`
  const data = await fetchJson(url, 3500)
  if (!data || data.status !== 'success') return null
  return normalizeGeo({
    country: data.country,
    province: data.regionName,
    city: data.city
  })
}

function parseAddr(addr) {
  const s = String(addr || '').trim()
  if (!s) return { country: '中国', province: '', city: '' }
  // 「广东省深圳市 电信」/「北京市 联通」
  const m = s.match(
    /^(?<pro>.+?(?:省|自治区|特别行政区|市))(?<city>.+?(?:市|州|盟|地区))?/
  )
  if (m?.groups) {
    return {
      country: '中国',
      province: m.groups.pro || '',
      city: m.groups.city || ''
    }
  }
  return { country: '中国', province: s.split(/\s+/)[0] || '', city: '' }
}

function normalizeGeo({ country, province, city }) {
  const c = cleanPlace(country)
  const p = cleanPlace(province)
  const cityClean = cleanPlace(city)

  let label = ''
  if (p && cityClean && p !== cityClean) {
    label = `${stripSuffix(p)} · ${stripSuffix(cityClean)}`
  } else if (p) {
    label = stripSuffix(p)
  } else if (cityClean) {
    label = stripSuffix(cityClean)
  } else if (c) {
    label = c
  }

  if (!label) return null
  return { country: c, province: p, city: cityClean, label }
}

function cleanPlace(v) {
  if (!v || typeof v !== 'string') return ''
  const s = v.trim()
  if (!s || s === 'XX' || s === '未知' || /unknown/i.test(s)) return ''
  return s
}

function stripSuffix(s) {
  return (
    s
      .replace(
        /(特别行政区|自治区|壮族|回族|维吾尔|省|市|都|府|县|地区)$/g,
        ''
      )
      .trim() || s
  )
}

async function fetchPconlineJson(url, timeoutMs) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        Accept: 'application/json,text/plain,*/*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    // 太平洋接口常见 GBK；先试 GBK，失败再 UTF-8
    let text = ''
    try {
      text = new TextDecoder('gbk').decode(buf)
    } catch {
      text = buf.toString('utf8')
    }
    text = text.replace(/^\uFEFF/, '').trim()
    if (!text) return null
    try {
      return JSON.parse(text)
    } catch {
      // 偶发包一层 callback / 杂讯
      const m = text.match(/\{[\s\S]*\}/)
      if (!m) return null
      return JSON.parse(m[0])
    }
  } finally {
    clearTimeout(timer)
  }
}

async function fetchJson(url, timeoutMs) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: 'application/json' }
    })
    if (!res.ok) return null
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}
