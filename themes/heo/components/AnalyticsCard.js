import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 侧栏「网站统计」卡片
 * 文章总数 / 建站天数 / 全站字数 / 评论总数（可配置覆盖）
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
    <div>
      {showHeader && (
        <div className='mb-2 flex items-center gap-1.5 px-1'>
          <i className='fas fa-gauge-high text-[15px] text-gray-800 dark:text-gray-100' />
          <span className='text-[15px] font-bold text-gray-900 dark:text-white'>
            网站统计
          </span>
          <SmartLink
            href={moreHref}
            className='ml-auto inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-[13px] text-gray-400 transition hover:bg-[var(--heo-color-card-muted)] hover:text-[var(--heo-color-primary)] dark:hover:bg-white/5 dark:hover:text-[var(--heo-color-accent)]'>
            更多
            <i className='fas fa-arrow-up-right-from-square text-[10px]' />
          </SmartLink>
        </div>
      )}

      <div className='flex flex-col space-y-2.5 px-1 text-[13px] text-gray-700 dark:text-gray-200'>
        <Row
          label={`${postCountTitle}：`}
          value={postCount ?? pages.length ?? 0}
        />
        <Row label={`${siteTimeTitle}：`} value={formatSiteDays(diffDays)} />
        <Row label={`${wordTitle}：`} value={wordDisplay} />
        <Row label={`${commentTitle}：`} value={commentDisplay} />
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className='flex justify-between gap-3'>
      <span className='text-gray-500 dark:text-gray-400'>{label}</span>
      <span className='font-semibold tabular-nums'>{value}</span>
    </div>
  )
}

function formatSiteDays(days) {
  if (!Number.isFinite(days) || days < 0) return '0 天'
  if (days < 365) return `${days} 天`
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
