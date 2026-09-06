/**
 * 封面主色提取与 Heo 风格配色处理
 */

export function normalizeHex(input) {
  if (!input || typeof input !== 'string') return null
  let s = input.trim()
  if (/^rgb\(/i.test(s)) {
    const m = s.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
    if (!m) return null
    return rgbToHex(+m[1], +m[2], +m[3])
  }
  if (s[0] !== '#') s = `#${s}`
  if (/^#[0-9a-fA-F]{3}$/.test(s)) {
    s = `#${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`
  }
  if (!/^#[0-9a-fA-F]{6}$/.test(s)) return null
  return s.toLowerCase()
}

export function rgbToHex(r, g, b) {
  const clamp = n => Math.max(0, Math.min(255, Math.round(n)))
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map(n => n.toString(16).padStart(2, '0'))
      .join('')
  )
}

export function hexToRgb(hex) {
  const h = normalizeHex(hex)
  if (!h) return null
  return {
    r: parseInt(h.slice(1, 3), 16),
    g: parseInt(h.slice(3, 5), 16),
    b: parseInt(h.slice(5, 7), 16)
  }
}

/** 与 Heo getContrastYIQ 一致：偏亮则需压暗 */
export function getContrastYIQ(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return 'dark'
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 255000
  return brightness >= 0.5 ? 'light' : 'dark'
}

/** 与 Heo LightenDarkenColor 一致 */
export function lightenDarkenColor(hex, amt) {
  const h = normalizeHex(hex)?.slice(1)
  if (!h) return hex
  const num = parseInt(h, 16)
  let r = (num >> 16) + amt
  let g = ((num >> 8) & 0xff) + amt
  let b = (num & 0xff) + amt
  r = Math.max(0, Math.min(255, r))
  g = Math.max(0, Math.min(255, g))
  b = Math.max(0, Math.min(255, b))
  return rgbToHex(r, g, b)
}

/**
 * 若主色过亮/过黄则压暗（夜间更友好）
 */
export function tuneCoverColor(hex) {
  let color = normalizeHex(hex)
  if (!color) return null
  if (getContrastYIQ(color) === 'light') {
    color = lightenDarkenColor(color, -50)
  }
  // 高饱和黄/橙再压一档，避免夜间刺眼
  const rgb = hexToRgb(color)
  if (rgb) {
    const max = Math.max(rgb.r, rgb.g, rgb.b)
    const min = Math.min(rgb.r, rgb.g, rgb.b)
    const sat = max === 0 ? 0 : (max - min) / max
    const isWarm = rgb.r > 180 && rgb.g > 120 && rgb.b < 120
    if (isWarm && sat > 0.35) {
      color = lightenDarkenColor(color, -35)
    }
  }
  return color
}

/**
 * 从图片 URL 采样主色（浏览器端，需 CORS）
 */
export function extractDominantColorFromUrl(url) {
  return new Promise((resolve, reject) => {
    if (!url || typeof window === 'undefined') {
      reject(new Error('no url'))
      return
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.decoding = 'async'
    const timer = setTimeout(() => {
      reject(new Error('timeout'))
    }, 8000)
    img.onload = () => {
      clearTimeout(timer)
      try {
        resolve(sampleImageColor(img))
      } catch (e) {
        reject(e)
      }
    }
    img.onerror = () => {
      clearTimeout(timer)
      reject(new Error('image load failed'))
    }
    // 加时间戳易破坏缓存/签名；尽量原样请求
    img.src = url
  })
}

export function sampleImageColor(img) {
  const canvas = document.createElement('canvas')
  const size = 48
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('no canvas')
  ctx.drawImage(img, 0, 0, size, size)
  const { data } = ctx.getImageData(0, 0, size, size)

  // 按粗粒度色桶统计，避开近白/近黑
  const buckets = new Map()
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]
    if (a < 128) continue
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    if (max < 28 || min > 240) continue
    const key = `${r >> 4},${g >> 4},${b >> 4}`
    const cur = buckets.get(key) || { r: 0, g: 0, b: 0, n: 0 }
    cur.r += r
    cur.g += g
    cur.b += b
    cur.n += 1
    buckets.set(key, cur)
  }

  let best = null
  for (const cur of buckets.values()) {
    if (!best || cur.n > best.n) best = cur
  }
  if (!best || best.n < 4) {
    // 退回全局平均（仍排除透明）
    let r = 0
    let g = 0
    let b = 0
    let n = 0
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
      n++
    }
    if (!n) throw new Error('empty pixels')
    return rgbToHex(r / n, g / n, b / n)
  }
  return rgbToHex(best.r / best.n, best.g / best.n, best.b / best.n)
}

/**
 * 可选：七牛 imageAve 等图床主色 API
 * 期望返回 JSON `{ RGB: "0xRRGGBB" }` 或纯 hex
 */
export async function fetchCoverColorFromApi(imageUrl, apiSuffix) {
  if (!imageUrl || !apiSuffix) return null
  const url = imageUrl.includes('?')
    ? `${imageUrl}&${apiSuffix.replace(/^\?/, '')}`
    : `${imageUrl}${apiSuffix.startsWith('?') || apiSuffix.startsWith('!') ? apiSuffix : `?${apiSuffix}`}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`color api ${res.status}`)
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('json') || ct.includes('text')) {
    const text = await res.text()
    try {
      const obj = JSON.parse(text)
      const rgb = obj.RGB || obj.rgb || obj.color
      if (typeof rgb === 'string') {
        if (rgb.startsWith('0x') || rgb.startsWith('0X')) {
          return normalizeHex(`#${rgb.slice(2)}`)
        }
        return normalizeHex(rgb)
      }
    } catch {
      return normalizeHex(text)
    }
  }
  return null
}

export function buildHeoThemeStyleCss(hex) {
  const color = tuneCoverColor(hex)
  if (!color) return ''
  const hover = lightenDarkenColor(color, -18)
  return `
#theme-heo.heo-cover-theme {
  --heo-color-primary: ${color} !important;
  --heo-color-primary-hover: ${hover} !important;
  --heo-color-primary-text: #ffffff !important;
  --heo-post-bg-accent: ${color} !important;
  --heo-cover-main: ${color};
  --heo-cover-main-op: ${color}23;
  --heo-cover-main-op-deep: ${color}dd;
}
#theme-heo.heo-cover-theme #post-bg {
  --heo-post-bg-accent: ${color};
}
`
}

export function resolvePostCoverColor(post) {
  if (!post) return null
  const candidates = [
    post.coverColor,
    post.themeColor,
    post['封面色'],
    post['主题色'],
    post?.ext?.coverColor,
    post?.ext?.themeColor,
    post?.ext?.封面色,
    post?.ext?.主题色
  ]
  for (const c of candidates) {
    const hex = normalizeHex(c)
    if (hex) return hex
  }
  return null
}

const COVER_COLOR_CACHE_KEY = 'heo_cover_color_v1'

function readCoverColorStore() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(COVER_COLOR_CACHE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeCoverColorStore(store) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(COVER_COLOR_CACHE_KEY, JSON.stringify(store))
  } catch {
    // ignore quota
  }
}

/** 读取本地缓存的封面主色（同步，避免先闪默认紫） */
export function getCachedCoverColor(coverUrl) {
  const key = String(coverUrl || '').trim()
  if (!key) return null
  const store = readCoverColorStore()
  return tuneCoverColor(normalizeHex(store[key]))
}

export function setCachedCoverColor(coverUrl, hex) {
  const key = String(coverUrl || '').trim()
  const color = tuneCoverColor(normalizeHex(hex))
  if (!key || !color) return
  const store = readCoverColorStore()
  store[key] = color
  // 控制体积：最多留 80 条
  const keys = Object.keys(store)
  if (keys.length > 80) {
    keys.slice(0, keys.length - 80).forEach(k => delete store[k])
  }
  writeCoverColorStore(store)
}

/** 后台预取封面色，供下次打开文章瞬时应用 */
export async function prefetchCoverColor(coverUrl) {
  const key = String(coverUrl || '').trim()
  if (!key || typeof window === 'undefined') return null
  const cached = getCachedCoverColor(key)
  if (cached) return cached
  try {
    const res = await fetch(
      `/api/cover-color?url=${encodeURIComponent(key)}`,
      { cache: 'force-cache' }
    )
    if (!res.ok) return null
    const data = await res.json()
    const color = tuneCoverColor(normalizeHex(data?.color))
    if (color) setCachedCoverColor(key, color)
    return color
  } catch {
    return null
  }
}

/** 同步解析文章可用的瞬时主色：手动色 > 缓存 */
export function resolveInstantCoverColor(post) {
  const manual = tuneCoverColor(resolvePostCoverColor(post))
  if (manual) return manual
  const cover =
    post?.pageCoverThumbnail || post?.pageCover || post?.page_cover || ''
  return getCachedCoverColor(cover)
}
