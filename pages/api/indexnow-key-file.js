import {
  isIndexNowEnabled,
  resolveIndexNowKey
} from '@/lib/seo/indexnow'

/**
 * IndexNow 密钥校验文件内容
 * GET /api/indexnow-key-file?key=xxx
 * 也可经 rewrite：/{key}.txt → 本接口
 */
export default function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    return res.status(405).end('Method Not Allowed')
  }

  if (!isIndexNowEnabled()) {
    return res.status(404).end('IndexNow disabled')
  }

  const expected = resolveIndexNowKey()
  const requested = String(req.query.key || '').trim()

  // 允许：标准 {key}.txt，或兼容旧路径 indexnow-key.txt
  if (
    requested &&
    requested !== expected &&
    requested !== 'indexnow-key'
  ) {
    return res.status(404).end('Not Found')
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader(
    'Cache-Control',
    'public, max-age=86400, stale-while-revalidate=3600'
  )
  res.status(200).send(expected)
}
