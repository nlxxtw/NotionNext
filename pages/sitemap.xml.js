// pages/sitemap.xml.js
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import {
  buildSitemapLoc,
  normalizeSitemapBaseUrl,
  normalizeSitemapLocale,
  toSitemapDateString
} from '@/lib/sitemap-utils'
import { extractLangId, extractLangPrefix } from '@/lib/utils/pageId'
import { getServerSideSitemap } from 'next-sitemap'
import { submitIndexNowUrls } from '@/lib/seo/indexnow'

// 避免每次爬 sitemap 都狂推 IndexNow
let lastIndexNowPingAt = 0
const INDEXNOW_PING_INTERVAL_MS = 6 * 60 * 60 * 1000

export const getServerSideProps = async ctx => {
  let fields = []

  try {
    const siteIds = String(BLOG.NOTION_PAGE_ID || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    for (let index = 0; index < siteIds.length; index++) {
      const siteId = siteIds[index]
      const id = extractLangId(siteId)
      const locale = extractLangPrefix(siteId)
      const siteData = await fetchGlobalAllData({
        pageId: id,
        from: 'sitemap.xml'
      })
      const link = siteConfig(
        'LINK',
        siteData?.siteInfo?.link,
        siteData?.NOTION_CONFIG
      )
      const localeFields = generateLocalesSitemap({
        link,
        allPages: siteData?.allPages,
        categoryOptions: siteData?.categoryOptions,
        tagOptions: siteData?.tagOptions,
        locale
      })
      fields = fields.concat(localeFields)
    }

    fields = getUniqueFields(fields)

    // 至多每 6 小时顺带通知一次 IndexNow（不阻塞失败）
    const now = Date.now()
    if (now - lastIndexNowPingAt > INDEXNOW_PING_INTERVAL_MS) {
      lastIndexNowPingAt = now
      const recent = fields
        .filter(f => String(f?.priority) === '0.9' || String(f?.priority) === '1.0')
        .map(f => f?.loc)
        .filter(Boolean)
        .slice(0, 40)
      if (recent.length) {
        submitIndexNowUrls({ urls: recent }).catch(e =>
          console.warn('[sitemap.xml] IndexNow ping skipped:', e?.message || e)
        )
      }
    }
  } catch (error) {
    console.error('[sitemap.xml] generate failed:', error)
    const fallbackLink = normalizeSitemapBaseUrl(siteConfig('LINK', BLOG.LINK))
    fields = [
      {
        loc: buildSitemapLoc({ baseUrl: fallbackLink }),
        lastmod: toSitemapDateString(new Date()),
        changefreq: 'daily',
        priority: '1.0'
      }
    ].filter(f => Boolean(f?.loc))
  }

  ctx.res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=59'
  )
  return getServerSideSitemap(ctx, fields)
}

function generateLocalesSitemap({
  link,
  allPages,
  categoryOptions,
  tagOptions,
  locale
}) {
  const normalizedLink = normalizeSitemapBaseUrl(link)
  const normalizedLocale = normalizeSitemapLocale(locale)
  const dateNow = toSitemapDateString(new Date())

  const pushField = (slug, priority = '0.7', lastmod = dateNow) => {
    const loc = buildSitemapLoc({
      baseUrl: normalizedLink,
      locale: normalizedLocale,
      slug
    })
    if (!loc) return null
    return {
      loc,
      lastmod,
      changefreq: 'daily',
      priority
    }
  }

  const defaultFields = [
    pushField('', '1.0'),
    pushField('archive', '0.8'),
    pushField('archives', '0.6'),
    pushField('category', '0.8'),
    pushField('categories', '0.6'),
    pushField('tag', '0.8'),
    pushField('rss', '0.6'),
    pushField('rss/feed.xml', '0.7'),
    pushField('stats', '0.5'),
    pushField('search', '0.3')
  ].filter(Boolean)

  const publishStatus = BLOG.NOTION_PROPERTY_NAME?.status_publish || 'Published'

  const postFields =
    allPages
      ?.filter(p => p?.status === publishStatus)
      ?.filter(p => {
        const type = String(p?.type || '')
        return type === 'Post' || type === 'Page'
      })
      ?.filter(p => p?.slug && !p.slug.startsWith('http') && !p.slug.startsWith('#'))
      ?.filter(p => !p?.password)
      ?.map(post => {
        const isPost = String(post?.type || '') === 'Post'
        return pushField(
          post?.slug,
          isPost ? '0.9' : '0.6',
          toSitemapDateString(
            post?.lastEditedDay || post?.publishDay,
            dateNow
          )
        )
      })
      ?.filter(Boolean) ?? []

  const categoryFields = (Array.isArray(categoryOptions) ? categoryOptions : [])
    .map(c => {
      const name = c?.name
      if (!name) return null
      return pushField(`category/${encodeURIComponent(name)}`, '0.6')
    })
    .filter(Boolean)

  const tagFields = (Array.isArray(tagOptions) ? tagOptions : [])
    .slice(0, 200)
    .map(t => {
      const name = t?.name
      if (!name) return null
      return pushField(`tag/${encodeURIComponent(name)}`, '0.5')
    })
    .filter(Boolean)

  return defaultFields
    .concat(postFields)
    .concat(categoryFields)
    .concat(tagFields)
}

function getUniqueFields(fields) {
  const uniqueFieldsMap = new Map()

  fields.forEach(field => {
    if (!field?.loc) return
    const existingField = uniqueFieldsMap.get(field.loc)

    if (
      !existingField ||
      new Date(field.lastmod) > new Date(existingField.lastmod)
    ) {
      uniqueFieldsMap.set(field.loc, field)
    }
  })

  return Array.from(uniqueFieldsMap.values())
}

export default () => {}
