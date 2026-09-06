/**
 * 服务端转发博客付费解锁到 backend
 */

function getConfig() {
  const base = String(process.env.BLOG_PAY_API_BASE || '').replace(/\/$/, '')
  const appId = String(process.env.BLOG_PAY_APP_ID || '1000')
  return { base, appId }
}

export async function callBlogUnlock(path, body = {}) {
  const { base, appId } = getConfig()
  if (!base) {
    const err = new Error('未配置 BLOG_PAY_API_BASE（backend API 根地址）')
    err.status = 503
    throw err
  }
  const url = `${base}/${String(path).replace(/^\//, '')}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      appId,
      appPlatform: '10'
    },
    body: JSON.stringify(body)
  })
  const json = await res.json().catch(() => ({}))
  // ThinkPHP 常见：code=1 成功
  const ok = res.ok && (json.code === 1 || json.code === '1' || json.ok === true)
  if (!ok) {
    const err = new Error(json.info || json.message || `backend error ${res.status}`)
    err.status = res.status || 502
    err.payload = json
    throw err
  }
  return json.data ?? json
}

export function jsonOk(res, data, message = 'ok') {
  return res.status(200).json({ ok: true, message, data })
}

export function jsonFail(res, status, message) {
  return res.status(status).json({ ok: false, message })
}
