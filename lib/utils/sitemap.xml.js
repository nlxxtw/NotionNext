import BLOG from '@/blog.config'
import fs from 'fs'
import { siteConfig } from '../config'
import {
  buildSitemapLoc,
  normalizeSitemapBaseUrl,
  toSitemapDateString
} from '../sitemap-utils'
/**
 * 生成站点地图（静态构建 / export）
 * @param {*} param0
 */
export function generateSitemapXml({
  allPages,
  categoryOptions,
  tagOptions,
  NOTION_CONFIG
}) {
  const link = normalizeSitemapBaseUrl(
    siteConfig('LINK', BLOG.LINK, NOTION_CONFIG)
  )
  const dateNow = toSitemapDateString(new Date())

  const push = (urls, slug, priority = '0.7', lastmod = dateNow) => {
    const loc = buildSitemapLoc({ baseUrl: link, slug })
    if (!loc) return
    urls.push({ loc, lastmod, changefreq: 'daily', priority })
  }

  const urls = []
  push(urls, '', '1.0')
  push(urls, 'archive', '0.8')
  push(urls, 'category', '0.8')
  push(urls, 'tag', '0.8')
  push(urls, 'rss/feed.xml', '0.7')
  push(urls, 'rss', '0.6')
  push(urls, 'stats', '0.5')
  push(urls, 'search', '0.3')

  const publishStatus = BLOG.NOTION_PROPERTY_NAME?.status_publish || 'Published'

  allPages
    ?.filter(p => p?.status === publishStatus)
    ?.filter(p => {
      const type = String(p?.type || '')
      return type === 'Post' || type === 'Page'
    })
    ?.filter(p => p?.slug && !String(p.slug).startsWith('http') && !String(p.slug).startsWith('#'))
    ?.filter(p => !p?.password)
    ?.forEach(post => {
      push(
        urls,
        post?.slug,
        String(post?.type) === 'Post' ? '0.9' : '0.6',
        toSitemapDateString(post?.lastEditedDay || post?.publishDay, dateNow)
      )
    })

  ;(Array.isArray(categoryOptions) ? categoryOptions : []).forEach(c => {
    if (c?.name) push(urls, `category/${encodeURIComponent(c.name)}`, '0.6')
  })

  ;(Array.isArray(tagOptions) ? tagOptions : []).slice(0, 200).forEach(t => {
    if (t?.name) push(urls, `tag/${encodeURIComponent(t.name)}`, '0.5')
  })

  const xml = createSitemapXml(urls)
  try {
    fs.writeFileSync('sitemap.xml', xml)
    fs.writeFileSync('./public/sitemap.xml', xml)
  } catch (error) {
    console.warn('无法写入文件', error)
  }
}

/**
 * 生成站点地图
 * @param {*} urls
 * @returns
 */
function createSitemapXml(urls) {
  let urlsXml = ''
  urls.forEach(u => {
    urlsXml += `<url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority || '0.7'}</priority>
    </url>
    `
  })

  return `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    ${urlsXml}
    </urlset>
    `
}
