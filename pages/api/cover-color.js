import sharp from 'sharp'
import {
  normalizeHex,
  rgbToHex,
  tuneCoverColor
} from '../../themes/heo/lib/coverColor'

/**
 * GET /api/cover-color?url=编码后的图片地址
 * 服务端取封面主色，规避浏览器 CORS
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const raw = typeof req.query.url === 'string' ? req.query.url : ''
  let url = ''
  try {
    url = decodeURIComponent(raw)
  } catch {
    url = raw
  }

  if (!isSafeImageUrl(url)) {
    return res.status(400).json({ error: 'invalid url' })
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        'User-Agent': 'NotionNext-CoverColor/1.0',
        Accept: 'image/*,*/*'
      }
    })
    if (!upstream.ok) {
      return res.status(502).json({ error: `upstream ${upstream.status}` })
    }
    const buf = Buffer.from(await upstream.arrayBuffer())
    const { data, info } = await sharp(buf)
      .resize(48, 48, { fit: 'cover' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    const hex = sampleRawPixels(data, info.width * info.height)
    const color = tuneCoverColor(hex)
    if (!color) {
      return res.status(422).json({ error: 'no color' })
    }

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=86400, stale-while-revalidate=604800'
    )
    return res.status(200).json({ color })
  } catch (e) {
    console.error('[cover-color]', e?.message || e)
    return res.status(500).json({ error: 'extract failed' })
  }
}

function isSafeImageUrl(url) {
  if (!url || url.length > 2048) return false
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

function sampleRawPixels(data, pixelCount) {
  const buckets = new Map()
  for (let i = 0; i < pixelCount; i++) {
    const o = i * 4
    const r = data[o]
    const g = data[o + 1]
    const b = data[o + 2]
    const a = data[o + 3]
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
  if (best && best.n >= 4) {
    return rgbToHex(best.r / best.n, best.g / best.n, best.b / best.n)
  }

  let r = 0
  let g = 0
  let b = 0
  let n = 0
  for (let i = 0; i < pixelCount; i++) {
    const o = i * 4
    if (data[o + 3] < 128) continue
    r += data[o]
    g += data[o + 1]
    b += data[o + 2]
    n++
  }
  if (!n) return null
  return normalizeHex(rgbToHex(r / n, g / n, b / n))
}
