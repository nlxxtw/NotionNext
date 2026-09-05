import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import {
  collectPublishUrls,
  isIndexNowEnabled,
  submitIndexNowUrls
} from '@/lib/seo/indexnow'

/**
 * IndexNow 推送 API（发文通知必应等搜索引擎）
 *
 * POST /api/indexnow
 * Authorization: Bearer <REVALIDATION_TOKEN>
 * Body:
 *   { "urls": ["https://bg.19492035.xyz/article/xxx"] }
 *   { "paths": ["/article/xxx", "/"] }
 *   { "sync": true }   — 同步最近已发布文章（默认 200 篇）
 *   { "sync": true, "limit": 50 }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      ok: false,
      message: 'Method Not Allowed. Use POST.'
    })
  }

  const token = process.env.REVALIDATION_TOKEN || BLOG.REVALIDATION_TOKEN
  if (!token) {
    return res.status(503).json({
      ok: false,
      message: 'Set REVALIDATION_TOKEN first (same token as /api/revalidate).'
    })
  }

  const authHeader = req.headers.authorization || ''
  const receivedToken = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : req.body?.token || ''

  if (receivedToken !== token) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' })
  }

  if (!isIndexNowEnabled()) {
    return res.status(200).json({
      ok: false,
      skipped: true,
      message: 'INDEXNOW_ENABLE is false'
    })
  }

  try {
    const { urls, paths, sync, limit } = req.body || {}
    let targetUrls = Array.isArray(urls) ? [...urls] : []

    if (Array.isArray(paths) && paths.length) {
      const link = siteConfig('LINK', BLOG.LINK)
      paths.forEach(p => {
        if (!p) return
        targetUrls.push(String(p).startsWith('http') ? p : `${link}${p.startsWith('/') ? p : `/${p}`}`)
      })
    }

    let notionConfig
    if (sync || !targetUrls.length) {
      const siteData = await fetchGlobalAllData({ from: 'api-indexnow' })
      notionConfig = siteData?.NOTION_CONFIG
      const link = siteConfig(
        'LINK',
        siteData?.siteInfo?.link,
        notionConfig
      )
      const published = collectPublishUrls(siteData?.allPages, link, {
        limit: Number(limit) > 0 ? Number(limit) : 200
      })
      targetUrls = sync ? published : targetUrls.concat(published.slice(0, 20))
    }

    const result = await submitIndexNowUrls({
      urls: targetUrls,
      notionConfig
    })

    return res.status(200).json({
      ok: result.ok,
      message: result.ok
        ? `Submitted ${result.submitted} URL(s) to IndexNow`
        : result.reason || 'IndexNow submit failed',
      ...result
    })
  } catch (error) {
    console.error('[indexnow] Error:', error)
    return res.status(500).json({
      ok: false,
      message: 'IndexNow submit failed',
      error: error.message
    })
  }
}
