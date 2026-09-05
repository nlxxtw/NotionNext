import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { getPwaConfig } from '@/lib/pwa'
import { createSiteUrl, normalizeSiteUrl } from '@/lib/sitemap-utils'
import { isHttpLink, loadExternalResource } from '@/lib/utils'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

/**
 * 页面的Head头，有用于SEO
 * @param {*} param0
 * @returns
 */
const SEO = props => {
  const { children, siteInfo, post, NOTION_CONFIG } = props
  const PATH = siteConfig('PATH')
  const LINK = normalizeSiteUrl(
    siteConfig('LINK', siteInfo?.link, NOTION_CONFIG)
  )
  const SUB_PATH = siteConfig('SUB_PATH', '')
  let url = PATH?.length ? createSiteUrl(LINK, SUB_PATH) || LINK : LINK
  let image
  const router = useRouter()
  const meta = getSEOMeta(props, router, useGlobal()?.locale)
  const webFontUrl = siteConfig('FONT_URL')
  const hasWebFontUrl = Array.isArray(webFontUrl)
    ? webFontUrl.filter(Boolean).length > 0
    : Boolean(webFontUrl)

  useEffect(() => {
    if (!hasWebFontUrl) return

    const timeoutId = window.setTimeout(() => {
      loadExternalResource(
        'https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js',
        'js'
      ).then(() => {
        const WebFont = window?.WebFont
        if (WebFont) {
          WebFont.load({
            custom: {
              urls: webFontUrl
            }
          })
        }
      })
    }, 1500)

    return () => window.clearTimeout(timeoutId)
  }, [hasWebFontUrl, webFontUrl])

  const KEYWORDS = siteConfig('KEYWORDS')
  let keywords = meta?.tags || KEYWORDS
  if (post?.tags && post?.tags?.length > 0) {
    keywords = post?.tags?.join(',')
  }
  if (meta) {
    url = createSiteUrl(url, meta.slug) || url
    image = getAbsoluteImageUrl(meta.image || '/bg_image.jpg', LINK)
  }
  const TITLE = siteConfig('TITLE')
  const title = meta?.title || TITLE
  const description =
    meta?.description ||
    getSiteDescription(siteInfo, NOTION_CONFIG) ||
    TITLE
  const type = meta?.type === 'Post' ? 'article' : meta?.type || 'website'
  const language =
    router?.locale || siteConfig('LANG', 'zh-CN', NOTION_CONFIG)
  const lang = String(language).replace('-', '_')
  const category = Array.isArray(meta?.category)
    ? meta?.category?.[0]
    : meta?.category || KEYWORDS
  const favicon = siteConfig('BLOG_FAVICON')
  const BACKGROUND_DARK = siteConfig('BACKGROUND_DARK', '', NOTION_CONFIG)

  const SEO_BAIDU_SITE_VERIFICATION = siteConfig(
    'SEO_BAIDU_SITE_VERIFICATION',
    null,
    NOTION_CONFIG
  )

  const SEO_GOOGLE_SITE_VERIFICATION = siteConfig(
    'SEO_GOOGLE_SITE_VERIFICATION',
    null,
    NOTION_CONFIG
  )

  const SEO_BING_SITE_VERIFICATION = siteConfig(
    'SEO_BING_SITE_VERIFICATION',
    null,
    NOTION_CONFIG
  )

  const BLOG_FAVICON = siteConfig('BLOG_FAVICON', null, NOTION_CONFIG)
  const pwaEnabled = siteConfig('PWA_ENABLE', false, NOTION_CONFIG)
  const pwaConfig = pwaEnabled
    ? getPwaConfig({ siteInfo, notionConfig: NOTION_CONFIG })
    : null

  const COMMENT_WEBMENTION_ENABLE = siteConfig(
    'COMMENT_WEBMENTION_ENABLE',
    null,
    NOTION_CONFIG
  )

  const COMMENT_WEBMENTION_HOSTNAME = siteConfig(
    'COMMENT_WEBMENTION_HOSTNAME',
    null,
    NOTION_CONFIG
  )
  const COMMENT_WEBMENTION_AUTH = siteConfig(
    'COMMENT_WEBMENTION_AUTH',
    null,
    NOTION_CONFIG
  )
  const ANALYTICS_BUSUANZI_ENABLE = siteConfig(
    'ANALYTICS_BUSUANZI_ENABLE',
    null,
    NOTION_CONFIG
  )
  const ENABLE_RSS = siteConfig('ENABLE_RSS', true, NOTION_CONFIG)

  const FACEBOOK_PAGE = siteConfig('FACEBOOK_PAGE', null, NOTION_CONFIG)
  const TWITTER_SITE = siteConfig('TWITTER_SITE', '', NOTION_CONFIG)
  const TWITTER_CREATOR = siteConfig('TWITTER_CREATOR', '', NOTION_CONFIG)

  const AUTHOR = siteConfig('AUTHOR')
  const siteName = trimText(siteInfo?.title) || TITLE
  const structuredData = generateStructuredData({
    meta,
    siteInfo,
    url,
    image,
    author: AUTHOR,
    siteUrl: LINK,
    notionConfig: NOTION_CONFIG,
    categoryOptions: props.categoryOptions,
    tagOptions: props.tagOptions
  })

  return (
    <Head>
      <link rel='icon' href={favicon} />
      <title>{title}</title>
      <meta
        name='theme-color'
        content={pwaEnabled ? pwaConfig.themeColor : BACKGROUND_DARK}
      />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0, viewport-fit=cover'
      />
      <meta
        name='robots'
        content='follow, index, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
      />
      <meta charSet='UTF-8' />
      <meta name='format-detection' content='telephone=no' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content={siteName} />
      {pwaEnabled && (
        <>
          <link rel='manifest' href='/manifest.json' />
          <meta name='application-name' content={pwaConfig.name} />
          <link rel='apple-touch-icon' href={pwaConfig.icon} />
        </>
      )}

      {SEO_GOOGLE_SITE_VERIFICATION && (
        <meta
          name='google-site-verification'
          content={SEO_GOOGLE_SITE_VERIFICATION}
        />
      )}
      {SEO_BAIDU_SITE_VERIFICATION && (
        <meta
          name='baidu-site-verification'
          content={SEO_BAIDU_SITE_VERIFICATION}
        />
      )}
      {SEO_BING_SITE_VERIFICATION && (
        <meta name='msvalidate.01' content={SEO_BING_SITE_VERIFICATION} />
      )}

      <link rel='canonical' href={url} />
      {ENABLE_RSS && (
        <link
          rel='alternate'
          type='application/rss+xml'
          title={`${siteName} RSS`}
          href={createSiteUrl(LINK, 'rss/feed.xml') || `${LINK}/rss/feed.xml`}
        />
      )}
      <meta name='keywords' content={keywords} />
      <meta name='description' content={description} />
      <meta name='author' content={AUTHOR} />
      <meta name='generator' content='NotionNext' />

      <meta httpEquiv='content-language' content={language} />
      <meta name='geo.region' content={siteConfig('GEO_REGION', 'CN')} />
      <meta name='geo.country' content={siteConfig('GEO_COUNTRY', 'CN')} />

      <meta property='og:locale' content={lang} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={url} />
      <meta property='og:image' content={image} />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta property='og:image:alt' content={title} />
      <meta property='og:site_name' content={siteName} />
      <meta property='og:type' content={type} />

      <meta name='twitter:card' content='summary_large_image' />
      {TWITTER_SITE && <meta name='twitter:site' content={TWITTER_SITE} />}
      {TWITTER_CREATOR && (
        <meta name='twitter:creator' content={TWITTER_CREATOR} />
      )}
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />
      <meta name='twitter:image:alt' content={title} />

      <link rel='icon' href={BLOG_FAVICON} />

      {COMMENT_WEBMENTION_ENABLE && (
        <>
          <link
            rel='webmention'
            href={`https://webmention.io/${COMMENT_WEBMENTION_HOSTNAME}/webmention`}
          />
          <link
            rel='pingback'
            href={`https://webmention.io/${COMMENT_WEBMENTION_HOSTNAME}/xmlrpc`}
          />
          {COMMENT_WEBMENTION_AUTH && (
            <link href={COMMENT_WEBMENTION_AUTH} rel='me' />
          )}
        </>
      )}

      {ANALYTICS_BUSUANZI_ENABLE && (
        <meta name='referrer' content='no-referrer-when-downgrade' />
      )}

      {meta?.type === 'Post' && (
        <>
          {meta.publishTime && (
            <meta property='article:published_time' content={meta.publishTime} />
          )}
          {meta.modifiedTime && (
            <meta
              property='article:modified_time'
              content={meta.modifiedTime}
            />
          )}
          <meta property='article:author' content={AUTHOR} />
          <meta property='article:section' content={category} />
          <meta property='article:tag' content={keywords} />
          {FACEBOOK_PAGE && (
            <meta property='article:publisher' content={FACEBOOK_PAGE} />
          )}
        </>
      )}

      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      {hasWebFontUrl && <link rel='dns-prefetch' href='//fonts.googleapis.com' />}
      <link rel='dns-prefetch' href='//www.google-analytics.com' />
      <link rel='dns-prefetch' href='//www.googletagmanager.com' />
      {hasWebFontUrl && (
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
      )}

      {children}
    </Head>
  )
}

/**
 * 生成结构化数据（WebSite + SearchAction + Sitelinks + 文章/面包屑）
 */
export const generateStructuredData = (
  metaOrOptions,
  siteInfoArg,
  urlArg,
  imageArg,
  authorArg,
  siteUrlArg
) => {
  // 兼容旧签名：generateStructuredData(meta, siteInfo, url, image, author, siteUrl)
  const options =
    metaOrOptions &&
    typeof metaOrOptions === 'object' &&
    ('siteInfo' in metaOrOptions || 'notionConfig' in metaOrOptions)
      ? metaOrOptions
      : {
          meta: metaOrOptions,
          siteInfo: siteInfoArg,
          url: urlArg,
          image: imageArg,
          author: authorArg,
          siteUrl: siteUrlArg
        }

  const {
    meta,
    siteInfo,
    url,
    image,
    author,
    siteUrl,
    notionConfig,
    categoryOptions,
    tagOptions
  } = options

  const siteName = trimText(siteInfo?.title) || siteConfig('TITLE')
  const siteDescription = getSiteDescription(siteInfo, notionConfig)
  const logoUrl = getAbsoluteImageUrl(siteInfo?.icon, siteUrl)
  const searchTemplatePath = siteConfig(
    'SEO_SEARCH_URL_TEMPLATE',
    '/search/{search_term_string}',
    notionConfig
  )
  const searchUrlTemplate = buildAbsoluteUrl(siteUrl, searchTemplatePath)

  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: siteName,
    description: siteDescription,
    url: siteUrl,
    inLanguage: siteConfig('LANG', 'zh-CN', notionConfig),
    publisher: { '@id': `${siteUrl}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchUrlTemplate
      },
      'query-input': 'required name=search_term_string'
    }
  }

  const organization = {
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: siteName,
    url: siteUrl,
    logo: logoUrl
      ? {
          '@type': 'ImageObject',
          url: logoUrl
        }
      : undefined,
    sameAs: collectSameAs(notionConfig)
  }

  const person = {
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: author,
    url: siteUrl
  }

  const graph = [website, organization, person]

  const sitelinks = resolveSitelinks({
    notionConfig,
    categoryOptions,
    tagOptions,
    siteUrl
  })
  if (sitelinks.length) {
    graph.push({
      '@type': 'ItemList',
      '@id': `${siteUrl}/#sitelinks`,
      name: `${siteName} 站内导航`,
      itemListElement: sitelinks.map((item, index) => ({
        '@type': 'SiteNavigationElement',
        position: index + 1,
        name: item.name,
        url: item.url
      }))
    })
  }

  if (meta?.type === 'Post') {
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: meta.title,
      description: meta.description,
      image: image,
      url: url,
      datePublished: meta.publishTime,
      dateModified: meta.modifiedTime || meta.publishTime,
      author: { '@id': `${siteUrl}/#person` },
      publisher: { '@id': `${siteUrl}/#organization` },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url
      },
      keywords: Array.isArray(meta.tags) ? meta.tags.join(', ') : meta.tags,
      articleSection: meta.category,
      isPartOf: { '@id': `${siteUrl}/#website` }
    })

    const crumbs = [
      { name: siteName, url: siteUrl },
      meta.category
        ? {
            name: String(
              Array.isArray(meta.category) ? meta.category[0] : meta.category
            ),
            url: createSiteUrl(
              siteUrl,
              `category/${encodeURIComponent(
                Array.isArray(meta.category) ? meta.category[0] : meta.category
              )}`
            )
          }
        : null,
      { name: meta.title, url }
    ].filter(Boolean)

    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: crumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    })
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  }
}

const trimText = value => String(value || '').trim()

const getSiteDescription = (siteInfo, notionConfig) => {
  const configured = trimText(
    siteConfig('SEO_DESCRIPTION', '', notionConfig) ||
      siteConfig('BIO', '', notionConfig)
  )
  const fromSite = trimText(siteInfo?.description)
  // 优先用更长、更像「个人博客介绍」的文案
  if (configured && configured.length >= 12) return configured
  if (fromSite && fromSite.length >= 12) return fromSite
  return configured || fromSite || ''
}

const getHomeTitle = (siteInfo, notionConfig) => {
  const name = trimText(siteInfo?.title) || siteConfig('TITLE', '', notionConfig)
  const separator = siteConfig('SEO_TITLE_SEPARATOR', ' - ', notionConfig) || ' - '
  const tagline =
    trimText(siteConfig('SEO_SITE_TAGLINE', '', notionConfig)) ||
    trimText(siteInfo?.description)
  if (!tagline || tagline === name) return name
  return `${name}${separator}${tagline}`
}

const buildAbsoluteUrl = (siteUrl, pathOrUrl) => {
  if (!pathOrUrl) return siteUrl
  if (isHttpLink(pathOrUrl) || pathOrUrl.startsWith('data:')) return pathOrUrl
  return createSiteUrl(siteUrl, String(pathOrUrl).replace(/^\//, '')) || siteUrl
}

const parseJsonArray = value => {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

const resolveSitelinks = ({
  notionConfig,
  categoryOptions,
  tagOptions,
  siteUrl
}) => {
  const configured = parseJsonArray(
    siteConfig('SEO_SITELINKS', [], notionConfig)
  )
    .map(item => {
      const name = trimText(item?.name || item?.title)
      const url = trimText(item?.url || item?.href)
      if (!name || !url) return null
      return { name, url: buildAbsoluteUrl(siteUrl, url) }
    })
    .filter(Boolean)

  if (configured.length) return configured.slice(0, 8)

  const fromCategories = (Array.isArray(categoryOptions) ? categoryOptions : [])
    .slice(0, 4)
    .map(c => ({
      name: c.name,
      url: buildAbsoluteUrl(siteUrl, `category/${encodeURIComponent(c.name)}`)
    }))

  const fallback = [
    { name: '文章分类', url: buildAbsoluteUrl(siteUrl, 'category') },
    { name: '文章标签', url: buildAbsoluteUrl(siteUrl, 'tag') },
    { name: '历史归档', url: buildAbsoluteUrl(siteUrl, 'archive') },
    { name: 'RSS订阅', url: buildAbsoluteUrl(siteUrl, 'rss') }
  ]

  return [...fromCategories, ...fallback].slice(0, 8)
}

const collectSameAs = notionConfig => {
  const keys = [
    'CONTACT_GITHUB',
    'CONTACT_TWITTER',
    'CONTACT_BILIBILI',
    'CONTACT_YOUTUBE',
    'CONTACT_WEIBO',
    'CONTACT_TELEGRAM',
    'CONTACT_LINKEDIN',
    'CONTACT_INSTAGRAM'
  ]
  return keys
    .map(key => trimText(siteConfig(key, '', notionConfig)))
    .filter(v => isHttpLink(v))
}

const getAbsoluteImageUrl = (image, siteUrl) => {
  if (typeof image !== 'string') return ''

  const rawImage = image.trim()
  if (!rawImage) return ''
  if (isHttpLink(rawImage) || rawImage.startsWith('data:')) {
    return rawImage
  }

  return createSiteUrl(siteUrl, rawImage) || rawImage
}

const getIsoTime = value => {
  if (!value) return undefined

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined

  return date.toISOString()
}

/**
 * 获取SEO信息
 * @param {*} props
 * @param {*} router
 */
const getSEOMeta = (props, router, locale) => {
  const { post, siteInfo, tag, category, page, NOTION_CONFIG } = props
  const keyword = router?.query?.s
  const siteDescription = getSiteDescription(siteInfo, NOTION_CONFIG)
  const cover = siteInfo?.pageCover

  switch (router.route) {
    case '/':
      return {
        title: getHomeTitle(siteInfo, NOTION_CONFIG),
        description: siteDescription,
        image: cover,
        slug: '',
        type: 'website'
      }
    case '/archive':
    case '/archives':
      return {
        title: `${locale.NAV.ARCHIVE} | ${siteInfo?.title}`,
        description: siteDescription,
        image: cover,
        slug: router.route === '/archives' ? 'archives' : 'archive',
        type: 'website'
      }
    case '/page/[page]':
      return {
        title: `${page} | Page | ${siteInfo?.title}`,
        description: siteDescription,
        image: cover,
        slug: 'page/' + page,
        type: 'website'
      }
    case '/category/[category]':
    case '/category/[category]/page/[page]':
      return {
        title: `${category} | ${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: `${category} - ${siteDescription}`,
        slug: 'category/' + category,
        image: cover,
        type: 'website'
      }
    case '/tag/[tag]':
    case '/tag/[tag]/page/[page]':
      return {
        title: `${tag} | ${locale.COMMON.TAGS} | ${siteInfo?.title}`,
        description: `${tag} - ${siteDescription}`,
        image: cover,
        slug: 'tag/' + tag,
        type: 'website'
      }
    case '/search':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
        description: siteDescription,
        image: cover,
        slug: 'search',
        type: 'website'
      }
    case '/search/[keyword]':
    case '/search/[keyword]/page/[page]':
      return {
        title: `${keyword || ''}${keyword ? ' | ' : ''}${locale.NAV.SEARCH} | ${siteInfo?.title}`,
        description: siteDescription,
        image: cover,
        slug: 'search/' + (keyword || ''),
        type: 'website'
      }
    case '/404':
      return {
        title: `${siteInfo?.title} | ${locale.NAV.PAGE_NOT_FOUND}`,
        description: siteDescription,
        image: cover
      }
    case '/tag':
      return {
        title: `${locale.COMMON.TAGS} | ${siteInfo?.title}`,
        description: siteDescription,
        image: cover,
        slug: 'tag',
        type: 'website'
      }
    case '/category':
    case '/categories':
      return {
        title: `${locale.COMMON.CATEGORY} | ${siteInfo?.title}`,
        description: siteDescription,
        image: cover,
        slug: router.route === '/categories' ? 'categories' : 'category',
        type: 'website'
      }
    case '/rss':
      return {
        title: `RSS | ${siteInfo?.title}`,
        description: siteDescription,
        image: cover,
        slug: 'rss',
        type: 'website'
      }
    case '/stats':
      return {
        title: `网站统计 | ${siteInfo?.title}`,
        description: siteDescription,
        image: cover,
        slug: 'stats',
        type: 'website'
      }
    default: {
      const postCategory = Array.isArray(post?.category)
        ? post?.category?.[0]
        : post?.category
      const postDescription =
        trimText(post?.summary) ||
        trimText(post?.title) ||
        siteDescription
      return {
        title: post
          ? `${post?.title} | ${trimText(siteInfo?.title)}`
          : `${siteInfo?.title}`,
        description: postDescription,
        type: post?.type || 'website',
        slug: post?.slug,
        image: post?.pageCoverThumbnail || cover,
        category: postCategory,
        tags: post?.tags,
        publishDay: post?.publishDay,
        lastEditedDay: post?.lastEditedDay,
        publishTime:
          getIsoTime(post?.publishDate) ||
          getIsoTime(post?.date?.start_date),
        modifiedTime: getIsoTime(post?.lastEditedTime || post?.lastEditedDate)
      }
    }
  }
}

export default SEO
