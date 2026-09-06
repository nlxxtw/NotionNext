/**
 * 统一读取全站 PV：优先 /api/busuanzi，再读不蒜子 DOM，最后用本地缓存兜底
 * 解决「总浏览」偶发空白
 */

const CACHE_KEY = 'heo_site_pv_cache'

export function formatViews(n) {
  if (!Number.isFinite(n) || n < 0) return ''
  if (n >= 100000000) {
    return `${(n / 100000000).toFixed(n % 100000000 === 0 ? 0 : 1)}亿`
  }
  if (n >= 10000) {
    const v = n / 10000
    return `${v >= 100 ? Math.round(v) : v.toFixed(1)}万`
  }
  return n.toLocaleString('zh-CN')
}

export function readCachedSitePv() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const n = Number(raw)
    return Number.isFinite(n) && n >= 0 ? n : null
  } catch {
    return null
  }
}

export function writeCachedSitePv(n) {
  if (typeof window === 'undefined') return
  if (!Number.isFinite(n) || n < 0) return
  try {
    window.localStorage.setItem(CACHE_KEY, String(Math.round(n)))
  } catch {
    // ignore
  }
}

export function readDomSitePv() {
  if (typeof document === 'undefined') return null
  const nodes = document.querySelectorAll('.busuanzi_value_site_pv')
  for (const el of nodes) {
    const raw = (el.textContent || '').replace(/[,\s]/g, '').trim()
    if (!raw || !/^\d+$/.test(raw)) continue
    const n = Number(raw)
    if (Number.isFinite(n) && n >= 0) return n
  }
  return null
}

export async function fetchSitePvApi(retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch('/api/busuanzi', {
        method: 'GET',
        cache: 'no-store'
      })
      if (!res.ok) {
        if (i < retries) {
          await sleep(400 * (i + 1))
          continue
        }
        break
      }
      const data = await res.json()
      if (data?.site_pv != null) {
        const n = Number(data.site_pv)
        if (Number.isFinite(n) && n >= 0) return n
      }
    } catch {
      if (i < retries) await sleep(400 * (i + 1))
    }
  }
  return null
}

/**
 * @param {(n: number) => void} apply
 * @returns {() => void} cleanup
 */
export function subscribeSitePv(apply) {
  let cancelled = false

  const safeApply = n => {
    if (cancelled || !Number.isFinite(n) || n < 0) return false
    writeCachedSitePv(n)
    apply(n)
    return true
  }

  const cached = readCachedSitePv()
  if (cached != null) safeApply(cached)

  const tryDom = () => {
    const n = readDomSitePv()
    return n != null ? safeApply(n) : false
  }

  fetchSitePvApi(2).then(n => {
    if (n != null) safeApply(n)
    else if (!cancelled) tryDom()
  })

  const onReady = e => safeApply(Number(e?.detail?.site_pv))
  window.addEventListener('heo-busuanzi-ready', onReady)

  const t = window.setInterval(() => {
    if (!cancelled) tryDom()
  }, 800)
  const stop = window.setTimeout(() => window.clearInterval(t), 25000)

  return () => {
    cancelled = true
    window.removeEventListener('heo-busuanzi-ready', onReady)
    window.clearInterval(t)
    window.clearTimeout(stop)
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
