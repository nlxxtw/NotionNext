/**
 * 文章已读记录（localStorage）
 * 对齐 Heo：未读显示「未读」，打开文章后标记已读
 */
const STORAGE_KEY = 'heo_read_posts'

export function getReadPostKeys() {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return new Set(Array.isArray(list) ? list.map(String) : [])
  } catch {
    return new Set()
  }
}

export function isPostRead(postKey) {
  const key = String(postKey || '').trim()
  if (!key) return false
  return getReadPostKeys().has(key)
}

export function markPostRead(postKey) {
  if (typeof window === 'undefined') return
  const key = String(postKey || '').trim()
  if (!key) return
  try {
    const set = getReadPostKeys()
    if (set.has(key)) return
    set.add(key)
    // 控制体积，最多保留最近 500 条
    const next = Array.from(set)
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(next.slice(-500))
    )
    window.dispatchEvent(
      new CustomEvent('heo-read-posts-changed', { detail: { key } })
    )
  } catch {
    /* ignore quota / private mode */
  }
}

export function postReadKey(post) {
  if (!post) return ''
  return String(post.slug || post.short_id || post.id || post.href || '').trim()
}
