import { callBlogUnlock, jsonFail, jsonOk } from '@/lib/blogPayServer'
import { fetchNotionPageBlocks, formatNotionBlock } from '@/lib/db/notion/getPostBlocks'
import { adapterNotionBlockMap } from '@/lib/utils/notion.util'
import { extractPaidCalloutContent } from '@/lib/paidContent'

/**
 * 已解锁后，服务端重拉 Notion 原文并返回付费块明文（不经过公开 HTML）
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return jsonFail(res, 405, 'Method Not Allowed')
  }
  try {
    const body = req.body || {}
    const guestToken = String(body.guest_token || '')
    const postSlug = String(body.post_slug || '')
    const contentKey = String(body.content_key || '')
    const pageId = String(body.page_id || '')

    if (!guestToken || !postSlug || !contentKey || !pageId) {
      return jsonFail(res, 400, '缺少参数')
    }

    const st = await callBlogUnlock('blog_unlock/check', {
      guest_token: guestToken,
      post_slug: postSlug,
      content_key: contentKey
    })
    if (!st?.unlocked) {
      return jsonFail(res, 403, '未解锁')
    }

    const raw = await fetchNotionPageBlocks(pageId, 'blog-pay-content')
    if (!raw) {
      return jsonFail(res, 404, '文章不存在')
    }
    const blockMap = adapterNotionBlockMap(raw)
    const blocks = formatNotionBlock(blockMap?.block || {}, { maskPaid: false })
    const extracted = extractPaidCalloutContent(blocks, contentKey)
    if (!extracted?.text) {
      return jsonFail(res, 404, '未找到付费内容')
    }
    return jsonOk(res, extracted)
  } catch (e) {
    return jsonFail(res, e.status || 500, e.message || 'content failed')
  }
}
