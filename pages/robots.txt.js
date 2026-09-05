import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { normalizeSiteUrl } from '@/lib/sitemap-utils'

/**
 * 动态 robots.txt，避免 public 静态文件过期或格式错误
 */
export const getServerSideProps = async ({ res }) => {
  let link = normalizeSiteUrl(siteConfig('LINK', BLOG.LINK))

  try {
    const siteData = await fetchGlobalAllData({ from: 'robots.txt' })
    link =
      normalizeSiteUrl(
        siteConfig('LINK', siteData?.siteInfo?.link, siteData?.NOTION_CONFIG)
      ) || link
  } catch (error) {
    console.error('[robots.txt] fallback to config LINK', error)
  }

  const body = `# robots.txt — ${link}
User-agent: *
Allow: /

Disallow: /search?
Disallow: /*?*s=

Host: ${link}
Sitemap: ${link}/sitemap.xml
`

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader(
    'Cache-Control',
    'public, max-age=3600, stale-while-revalidate=59'
  )
  res.write(body)
  res.end()

  return { props: {} }
}

export default function RobotsTxt() {
  return null
}
