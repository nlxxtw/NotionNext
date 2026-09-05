import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

/**
 * /rss 订阅页（对齐 blog.zhheo.com/rss 信息架构）
 */
export default function RssPage() {
  const feedPath = siteConfig('HEO_RSS_FEED_URL', '/rss/feed.xml', CONFIG)
  const [feedAbsolute, setFeedAbsolute] = useState(feedPath)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const path = feedPath.startsWith('/') ? feedPath : `/${feedPath}`
    setFeedAbsolute(`${window.location.origin}${path}`)
  }, [feedPath])

  const wechatTitle = siteConfig('HEO_RSS_WECHAT_TITLE', '公众号订阅', CONFIG)
  const wechatDesc = siteConfig(
    'HEO_RSS_WECHAT_DESC',
    '推送精选文章 · 推送全文',
    CONFIG
  )
  const wechatUrl =
    siteConfig('HEO_RSS_WECHAT_URL', '', CONFIG) ||
    siteConfig('HEO_HERO_SUBSCRIBE_URL', '', CONFIG) ||
    siteConfig('HEO_SOCIAL_CARD_URL', '/', CONFIG)
  const wechatQr = siteConfig('HEO_RSS_WECHAT_QR', '', CONFIG)
  const wechatName =
    siteConfig('HEO_RSS_WECHAT_NAME', '', CONFIG) ||
    siteConfig('AUTHOR', '本站公众号')

  const feedTitle = siteConfig('HEO_RSS_FEED_TITLE', 'RSS', CONFIG)
  const feedDesc = siteConfig(
    'HEO_RSS_FEED_DESC',
    '推送全部文章 · 推送简介',
    CONFIG
  )

  const introTitle = siteConfig('HEO_RSS_INTRO_TITLE', '本站主要分享', CONFIG)
  const introDesc = siteConfig(
    'HEO_RSS_INTRO_DESC',
    '首先感谢你对本站的文章产生一些兴趣。如果你对以上内容感兴趣，欢迎通过下方的订阅方式关注本站。',
    CONFIG
  )
  const introKeywords = normalizeList(
    siteConfig('HEO_RSS_INTRO_KEYWORDS', ['设计分享', '资源分享', '实用技巧'], CONFIG)
  )

  const copyFeed = async () => {
    try {
      await navigator.clipboard.writeText(feedAbsolute)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className='rss-page px-5 pb-16 md:px-0'>
      <h1 className='mb-6 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-4xl'>
        订阅本站与运营模式。
      </h1>

      {/* 顶部三入口 */}
      <div className='mb-8 grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
        <SmartLink
          href={wechatUrl || '/'}
          className='group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#35d033] to-[#1fa51d] p-6 text-white shadow-[var(--heo-shadow-border)] transition hover:brightness-105'>
          <span className='absolute right-4 top-4 rounded-full bg-white/25 px-2.5 py-0.5 text-xs font-bold backdrop-blur'>
            推荐
          </span>
          <div className='text-sm leading-relaxed opacity-95 whitespace-pre-line'>
            {String(wechatDesc).replace(/ · /g, '\n')}
          </div>
          <div>
            <div className='text-2xl font-extrabold'>{wechatTitle}</div>
            <div className='mt-1 text-sm opacity-75'>推荐的订阅方式</div>
          </div>
          <i className='fab fa-weixin absolute -bottom-4 -right-2 text-[6.5rem] opacity-20 transition group-hover:translate-x-1' />
        </SmartLink>

        <div className='relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#ffa94d] to-[#e38100] p-6 text-white shadow-[var(--heo-shadow-border)]'>
          <div className='text-sm leading-relaxed opacity-95 whitespace-pre-line'>
            {String(feedDesc).replace(/ · /g, '\n')}
          </div>
          <div>
            <div className='text-2xl font-extrabold'>{feedTitle}</div>
            <div className='mt-1 text-sm opacity-75'>及时的订阅方式</div>
            <div className='mt-3 flex flex-wrap gap-2'>
              <SmartLink
                href={feedPath}
                className='inline-flex items-center rounded-full bg-white/20 px-3 py-1.5 text-sm font-bold backdrop-blur hover:bg-white hover:text-orange-600'>
                打开 Feed
              </SmartLink>
              <button
                type='button'
                onClick={copyFeed}
                className='inline-flex items-center rounded-full bg-black/20 px-3 py-1.5 text-sm font-bold hover:bg-black/30'>
                {copied ? '已复制' : '复制链接'}
              </button>
            </div>
          </div>
          <i className='fas fa-rss absolute -bottom-4 -right-2 text-[6.5rem] opacity-20' />
        </div>

        <SmartLink
          href={siteConfig('HEO_RSS_EXTRA_URL', '/about', CONFIG)}
          className='group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#6c7cff] to-[#425AEF] p-6 text-white shadow-[var(--heo-shadow-border)] transition hover:brightness-105 md:col-span-2 xl:col-span-1'>
          <div className='text-sm leading-relaxed opacity-95'>
            {siteConfig('HEO_RSS_EXTRA_DESC', '了解站点 · 联系作者', CONFIG)}
          </div>
          <div>
            <div className='text-2xl font-extrabold'>
              {siteConfig('HEO_RSS_EXTRA_TITLE', '关于本站', CONFIG)}
            </div>
            <div className='mt-1 text-sm opacity-75'>更多订阅与说明</div>
          </div>
          <i className='fas fa-circle-info absolute -bottom-4 -right-2 text-[6.5rem] opacity-20' />
        </SmartLink>
      </div>

      {/* 关于本站 */}
      <section className='heo-card mb-4 rounded-2xl bg-white p-6 dark:bg-[var(--heo-color-card-dark)]'>
        <div className='text-xs font-bold uppercase tracking-wide text-[var(--heo-color-primary)] dark:text-[var(--heo-color-accent)]'>
          关于本站
        </div>
        <h2 className='mt-1 text-xl font-extrabold text-gray-900 dark:text-white'>
          {introTitle}
        </h2>
        {introKeywords.length > 0 && (
          <div className='mt-4 flex flex-wrap gap-2'>
            {introKeywords.map((kw, i) => (
              <span
                key={kw}
                className='inline-flex items-center gap-2 rounded-full bg-[var(--heo-color-card-muted)] px-3 py-1.5 text-sm font-semibold text-gray-700 dark:bg-white/5 dark:text-gray-200'>
                <span className='text-xs opacity-50'>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {kw}
              </span>
            ))}
          </div>
        )}
        <p className='mt-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400'>
          {introDesc}
        </p>
      </section>

      <div className='grid gap-4 lg:grid-cols-2'>
        <section className='heo-card rounded-2xl bg-white p-6 dark:bg-[var(--heo-color-card-dark)]'>
          <div className='text-xs font-bold text-[var(--heo-color-primary)] dark:text-[var(--heo-color-accent)]'>
            精选 · 公众号
          </div>
          <h2 className='mt-1 text-xl font-extrabold text-gray-900 dark:text-white'>
            精选文章订阅
          </h2>
          <p className='mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400'>
            公众号可收到更有价值、比较精彩的文章。并非所有博客文章都会发到公众号，建议优先订阅。
          </p>
          {wechatQr ? (
            <div className='mt-4 flex items-center gap-4 rounded-xl bg-[var(--heo-color-card-muted)] p-3 dark:bg-white/5'>
              <LazyImage
                src={wechatQr}
                alt='公众号二维码'
                className='h-24 w-24 rounded-lg object-cover'
              />
              <div>
                <div className='text-xs font-bold text-gray-400'>公众号名称</div>
                <div className='mt-1 text-lg font-extrabold text-gray-900 dark:text-white'>
                  {wechatName}
                </div>
                <div className='mt-1 text-xs text-gray-400'>扫码或搜索关注</div>
              </div>
            </div>
          ) : null}
          <div className='mt-5 flex items-center justify-between gap-3'>
            <span className='text-xs text-gray-400'>建议所有用户订阅</span>
            <SmartLink
              href={wechatUrl || '/'}
              className='inline-flex h-10 items-center rounded-full bg-[var(--heo-color-primary)] px-5 text-sm font-bold text-white dark:bg-[var(--heo-color-accent)] dark:text-black'>
              前往关注
            </SmartLink>
          </div>
        </section>

        <section className='heo-card rounded-2xl bg-white p-6 dark:bg-[var(--heo-color-card-dark)]'>
          <div className='text-xs font-bold text-[var(--heo-color-primary)] dark:text-[var(--heo-color-accent)]'>
            全部 · RSS
          </div>
          <h2 className='mt-1 text-xl font-extrabold text-gray-900 dark:text-white'>
            全部文章订阅
          </h2>
          <p className='mt-3 text-sm leading-relaxed text-gray-500 dark:text-gray-400'>
            想看全部更新时，把下方地址加入 Feedly、Inoreader、NetNewsWire 等阅读器即可。
          </p>
          <div className='mt-4 rounded-xl bg-[var(--heo-color-card-muted)] p-3 dark:bg-white/5'>
            <div className='mb-2 text-xs font-bold text-gray-400'>RSS 订阅地址</div>
            <button
              type='button'
              onClick={copyFeed}
              className='flex w-full items-center justify-between gap-3 text-left'>
              <code className='break-all text-sm text-gray-800 dark:text-gray-200'>
                {feedAbsolute}
              </code>
              <span className='shrink-0 rounded-full bg-[var(--heo-color-primary)] px-3 py-1 text-xs font-bold text-white dark:bg-[var(--heo-color-accent)] dark:text-black'>
                {copied ? '已复制' : '复制'}
              </span>
            </button>
          </div>
          <div className='mt-5 flex items-center justify-between gap-3'>
            <span className='text-xs text-gray-400'>支持任意 RSS 客户端</span>
            <SmartLink
              href={feedPath}
              className='inline-flex h-10 items-center rounded-full bg-[var(--heo-color-primary)] px-5 text-sm font-bold text-white dark:bg-[var(--heo-color-accent)] dark:text-black'>
              订阅更新
            </SmartLink>
          </div>
        </section>
      </div>
    </div>
  )
}

function normalizeList(value) {
  if (!value) return []
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean)
    } catch {
      return value
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    }
  }
  return Array.isArray(value) ? value.map(String).filter(Boolean) : []
}
