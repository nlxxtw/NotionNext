import { callBlogUnlock, jsonFail, jsonOk } from '@/lib/blogPayServer'

/**
 * 拉取后台「博客付费解锁」公开配置
 */
export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return jsonFail(res, 405, 'Method Not Allowed')
  }
  try {
    const data = await callBlogUnlock('blog_unlock/config', {})
    return jsonOk(res, data)
  } catch (e) {
    return jsonFail(res, e.status || 502, e.message || 'config failed')
  }
}
