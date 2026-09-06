import { callBlogUnlock, jsonFail, jsonOk } from '@/lib/blogPayServer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return jsonFail(res, 405, 'Method Not Allowed')
  }
  try {
    const body = req.body || {}
    const data = await callBlogUnlock('blog_unlock/status', body)
    return jsonOk(res, data)
  } catch (e) {
    return jsonFail(res, e.status || 500, e.message || 'status failed')
  }
}
