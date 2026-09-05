import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import AsideWidgetHeader from './AsideWidgetHeader'

/**
 * 侧栏「网站统计」卡片
 */
export function AnalyticsCard(props) {
  const { postCount, allNavPages, latestPosts } = props
  const createTime = siteConfig('HEO_SITE_CREATE_TIME', '2021-09-21', CONFIG)
  const targetDate = new Date(createTime)
  const today = new Date()
  const diffDays = Math.max(
    0,
    Math.ceil((today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24))
  )

  const postCountTitle = siteConfig('HEO_POST_COUNT_TITLE', '文章总数', CONFIG)
  const siteTimeTitle = siteConfig('HEO_SITE_TIME_TITLE', '建站天数', CONFIG)
  const wordTitle = siteConfig('HEO_SITE_WORD_TITLE', '全站字数', CONFIG)
  const commentTitle = siteConfig('HEO_SITE_COMMENT_TITLE', '评论总数', CONFIG)
  const moreHref = siteConfig('HEO_STATS_MORE_URL', '/stats', CONFIG)
  const showHeader = siteConfig('HEO_ANALYTICS_SHOW_HEADER', true, CONFIG)

  const overrideWords = siteConfig('HEO_SITE_WORD_COUNT', '', CONFIG)
  const overrideComments = siteConfig('HEO_SITE_COMMENT_COUNT', '', CONFIG)

  const pages = Array.isArray(allNavPages)
    ? allNavPages
    : Array.isArray(latestPosts)
      ? latestPosts
      : []

  const estimatedWords = pages.reduce((sum, p) => {
    if (typeof p?.wordCount === 'number') return sum + p.wordCount
    const s = String(p?.summary || p?.title || '')
    return sum + s.length
  }, 0)

  const wordDisplay =
    overrideWords !== '' && overrideWords != null
      ? formatCount(overrideWords)
      : formatCount(estimatedWords)

  const commentDisplay =
    overrideComments !== '' && overrideComments != null
      ? formatCount(overrideComments)
      : '—'

  return (
    <div className='heo-analytics-card'>
      {showHeader && (
        <AsideWidgetHeader
          icon='fas fa-chart-simple'
          title='网站统计'
          moreHref={moreHref}
        />
      )}

      <div className='flex flex-col gap-3.5 px-0.5 pb-0.5 pt-0.5'>
        <Row label={postCountTitle} value={postCount ?? pages.length ?? 0} />
        <Row label={siteTimeTitle} value={formatSiteDays(diffDays)} />
        <Row label={wordTitle} value={wordDisplay} />
        <Row label={commentTitle} value={commentDisplay} />
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className='flex items-baseline justify-between gap-3 text-[14px] leading-none'>
      <span className='shrink-0 font-medium text-gray-500 dark:text-gray-400'>
        {label}
      </span>
      <span className='min-w-0 truncate text-right text-[14px] font-bold tabular-nums text-gray-900 dark:text-gray-100'>
        {value}
      </span>
    </div>
  )
}

function formatSiteDays(days) {
  if (!Number.isFinite(days) || days < 0) return '0天'
  if (days < 365) return `${days}天`
  const years = Math.floor(days / 365)
  const rest = days % 365
  return rest ? `${years}年${rest}天` : `${years}年`
}

function formatCount(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return String(value)
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}m`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(Math.round(n))
}
