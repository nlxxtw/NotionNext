/**
 * 访客省市：解析客户端 IP → 中文省/市，并记住「最近访客」
 * 无外部 DB：进程内缓存（多实例/冷启动会重置，属预期）
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
  const xf = req.headers['x-forwarded-for']
  if (typeof xf === 'string' && xf.trim()) {
    return xf.split(',')[0].trim()
  }
  if (Array.isArray(xf) && xf[0]) return String(xf[0]).trim()
  const real = req.headers['x-real-ip']
  if (real) return String(real).trim()
  return (
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    ''
  ).replace(/^::ffff:/, '')
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
    () => lookupIpApi(ip),
    () => lookupUserAgentInfo(ip)
  ]

  for (const run of providers) {
    try {
      const geo = await run()
      if (geo?.label) return geo
    } catch {
      // try next
    }
  }
  return null
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
  return s
    .replace(/(特别行政区|自治区|壮族|回族|维吾尔|省|市|地区)$/g, '')
    .trim() || s
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
