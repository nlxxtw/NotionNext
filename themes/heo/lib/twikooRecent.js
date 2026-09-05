import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'

let twikooRecentPromise = null

/**
 * 拉取 Twikoo 最近评论（进程内缓存，供侧栏与头像堆叠共用）
 */
export async function loadTwikooRecent(pageSize = 40) {
  if (typeof window === 'undefined') return []

  const envId = siteConfig('COMMENT_TWIKOO_ENV_ID')
  if (!envId) return []

  const cdn = siteConfig(
    'COMMENT_TWIKOO_CDN_URL',
    'https://s4.zstatic.net/npm/twikoo@1.7.9/dist/twikoo.min.js'
  )

  if (!twikooRecentPromise) {
    twikooRecentPromise = (async () => {
      await loadExternalResource(cdn, 'js')
      const twikoo = window.twikoo
      if (!twikoo?.getRecentComments) return []
      const list = await twikoo.getRecentComments({
        envId,
        pageSize
      })
      return Array.isArray(list) ? list : []
    })().catch(err => {
      twikooRecentPromise = null
      throw err
    })
  }

  return twikooRecentPromise
}

export function stripCommentHtml(html) {
  if (!html) return ''
  return String(html)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

export function commentPostPath(url) {
  if (!url) return '/'
  try {
    if (String(url).startsWith('http')) {
      return new URL(url).pathname.replace(/\/+$/, '') || '/'
    }
  } catch {
    // ignore
  }
  const path = String(url).split('?')[0].split('#')[0]
  return path.replace(/\/+$/, '') || '/'
}

export function commentPostTitle(item, pages = []) {
  const explicit =
    item?.title || item?.postTitle || item?.urlTitle || item?.hrefTitle
  if (explicit) return String(explicit)

  const path = commentPostPath(item?.url || item?.href)
  const hit = pages.find(p => {
    const href = commentPostPath(p?.href || `/${p?.slug || ''}`)
    return href === path
  })
  if (hit?.title) return hit.title

  if (path === '/' || !path) return '首页'
  const seg = path.split('/').filter(Boolean).pop()
  try {
    return decodeURIComponent(seg || '文章')
  } catch {
    return seg || '文章'
  }
}
