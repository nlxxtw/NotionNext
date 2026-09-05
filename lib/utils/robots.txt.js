import fs from 'fs'
import { siteConfig } from '@/lib/config'
import { normalizeSiteUrl } from '@/lib/sitemap-utils'

export function generateRobotsTxt(props) {
  const { siteInfo, NOTION_CONFIG } = props || {}
  const LINK = normalizeSiteUrl(
    siteConfig('LINK', siteInfo?.link, NOTION_CONFIG) || siteInfo?.link || ''
  )
  if (!LINK) return

  const content = `# robots.txt — ${LINK}
User-agent: *
Allow: /

# 避免把搜索结果页当作内容页收录
Disallow: /search?
Disallow: /*?*s=

Host: ${LINK}
Sitemap: ${LINK}/sitemap.xml
`

  try {
    fs.mkdirSync('./public', { recursive: true })
    fs.writeFileSync('./public/robots.txt', content)
  } catch (error) {
    // vercel 运行时只读；编译阶段 / VPS 会成功写入
  }
}
