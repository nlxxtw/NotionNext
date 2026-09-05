import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { createSiteUrl, normalizeSiteUrl } from '@/lib/sitemap-utils'

const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow'
]

/**
 * 解析 IndexNow key（Notion Config / 环境变量 / 由域名生成）
 */
export function resolveIndexNowKey(notionConfig) {
  const configured = String(
    siteConfig('INDEXNOW_KEY', '', notionConfig) || ''
  ).trim()
  if (configured) return configured.slice(0, 128)

  const link = siteConfig('LINK', BLOG.LINK, notionConfig)
  try {
    const host = new URL(normalizeSiteUrl(link)).hostname.replace(/[^a-zA-Z0-9_-]/g, '')
    return `indexnow-${host}`.slice(0, 128)
  } catch {
    return 'indexnow-notionnext'
  }
}

export function isIndexNowEnabled(notionConfig) {
  const raw = siteConfig('INDEXNOW_ENABLE', true, notionConfig)
  return raw !== false && raw !== 'false' && raw !== 0 && raw !== '0'
}

export function getIndexNowKeyLocation(siteUrl, notionConfig) {
  const custom = String(
    siteConfig('INDEXNOW_KEY_LOCATION', '', notionConfig) || ''
  ).trim()
  if (custom) {
    return custom.startsWith('http')
      ? custom
      : createSiteUrl(siteUrl, custom.replace(/^\//, ''))
  }
  return createSiteUrl(siteUrl, 'indexnow-key.txt')
}

/**
 * 向 IndexNow / Bing 批量提交 URL（发文即通知搜索引擎）
 * @returns {{ ok: boolean, submitted: number, results: any[] }}
 */
export async function submitIndexNowUrls({
  urls = [],
  notionConfig,
  host,
  key,
  keyLocation
} = {}) {
  if (!isIndexNowEnabled(notionConfig)) {
    return { ok: false, skipped: true, reason: 'disabled', submitted: 0, results: [] }
  }

  const siteUrl = normalizeSiteUrl(
    siteConfig('LINK', BLOG.LINK, notionConfig)
  )
  const resolvedHost =
    host ||
    (() => {
      try {
        return new URL(siteUrl).hostname
      } catch {
        return ''
      }
    })()

  const resolvedKey = key || resolveIndexNowKey(notionConfig)
  const resolvedKeyLocation =
    keyLocation || getIndexNowKeyLocation(siteUrl, notionConfig)

  const urlList = normalizeUrlList(urls, siteUrl).slice(0, 10000)
  if (!resolvedHost || !resolvedKey || !urlList.length) {
    return {
      ok: false,
      submitted: 0,
      results: [],
      reason: 'missing-host-key-or-urls'
    }
  }

  const payload = {
    host: resolvedHost,
    key: resolvedKey,
    keyLocation: resolvedKeyLocation,
    urlList
  }

  const results = await Promise.all(
    INDEXNOW_ENDPOINTS.map(async endpoint => {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify(payload)
        })
        const text = await response.text().catch(() => '')
        return {
          endpoint,
          status: response.status,
          ok: response.status === 200 || response.status === 202,
          body: text?.slice(0, 200)
        }
      } catch (error) {
        return {
          endpoint,
          ok: false,
          status: 0,
          error: error.message
        }
      }
    })
  )

  const ok = results.some(r => r.ok)
  return {
    ok,
    submitted: urlList.length,
    host: resolvedHost,
    keyLocation: resolvedKeyLocation,
    results
  }
}

/**
 * 把相对路径/slug 转成绝对 URL 列表
 */
export function normalizeUrlList(urls, siteUrl) {
  const base = normalizeSiteUrl(siteUrl)
  const set = new Set()

  ;(urls || []).forEach(item => {
    if (!item) return
    let value = String(item).trim()
    if (!value) return

    if (value.startsWith('/')) {
      value = `${base}${value}`
    } else if (!/^https?:\/\//i.test(value)) {
      value = createSiteUrl(base, value) || `${base}/${value}`
    }

    try {
      const u = new URL(value)
      if (base && u.hostname !== new URL(base).hostname) return
      set.add(u.toString().replace(/\/$/, '') === base ? base : u.toString().replace(/\/+$/, ''))
    } catch {
      // ignore invalid
    }
  })

  return Array.from(set)
}

/**
 * 从 allPages 提取可收录文章 URL
 */
export function collectPublishUrls(allPages, siteUrl, { limit = 200 } = {}) {
  const publishStatus =
    BLOG.NOTION_PROPERTY_NAME?.status_publish || 'Published'
  const base = normalizeSiteUrl(siteUrl)

  const list =
    allPages
      ?.filter(p => p?.status === publishStatus)
      ?.filter(p => String(p?.type || '') === 'Post')
      ?.filter(p => p?.slug && !String(p.slug).startsWith('http') && !String(p.slug).startsWith('#'))
      ?.filter(p => !p?.password)
      ?.sort((a, b) => (b?.publishDate || 0) - (a?.publishDate || 0))
      ?.slice(0, limit)
      ?.map(p => createSiteUrl(base, p.slug))
      ?.filter(Boolean) || []

  // 首页一并提交，便于刷新摘要
  return normalizeUrlList([base, ...list], base)
}
