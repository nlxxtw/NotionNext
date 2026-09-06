/**
 * SEO / 搜索引擎相关配置
 * 也可在 Notion Config 表中用同名键覆盖
 */
module.exports = {
  // 首页标题后缀（站名 - 标语），对齐「张洪Heo - 分享设计与科技生活」
  SEO_SITE_TAGLINE: process.env.NEXT_PUBLIC_SEO_SITE_TAGLINE || '',
  // 站点级 meta description；留空则用 Notion 站点描述 / BIO（输出时自动规范到约 50–160 字）
  SEO_DESCRIPTION: process.env.NEXT_PUBLIC_SEO_DESCRIPTION || '',
  // 标题分隔符
  SEO_TITLE_SEPARATOR: process.env.NEXT_PUBLIC_SEO_TITLE_SEPARATOR || ' - ',
  // 站内搜索结构化数据模板，{search_term_string} 为占位符
  SEO_SEARCH_URL_TEMPLATE:
    process.env.NEXT_PUBLIC_SEO_SEARCH_URL_TEMPLATE || '/search/{search_term_string}',
  // 必应站长工具验证码（meta name="msvalidate.01"）
  SEO_BING_SITE_VERIFICATION:
    process.env.NEXT_PUBLIC_SEO_BING_SITE_VERIFICATION || '',
  // IndexNow：发文自动通知必应等引擎（标题+正文都可被检索）
  INDEXNOW_ENABLE:
    process.env.NEXT_PUBLIC_INDEXNOW_ENABLE !== 'false',
  // 可选自定义密钥；不填则按域名自动生成
  INDEXNOW_KEY: process.env.INDEXNOW_KEY || '',
  // 密钥文件地址；留空则自动用 https://域名/{INDEXNOW_KEY}.txt
  INDEXNOW_KEY_LOCATION: process.env.INDEXNOW_KEY_LOCATION || '',
  /**
   * 站内链接候选（利于 Google/Bing Sitelinks），JSON 数组：
   * [{"name":"文章分类","url":"/category"},{"name":"历史归档","url":"/archive"}]
   */
  SEO_SITELINKS: process.env.NEXT_PUBLIC_SEO_SITELINKS || [
    { name: '文章分类', url: '/category' },
    { name: '文章标签', url: '/tag' },
    { name: '历史归档', url: '/archive' },
    { name: 'RSS订阅', url: '/rss' },
    { name: '网站统计', url: '/stats' }
  ]
}
