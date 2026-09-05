import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'
import CONFIG from '../config'
import AsideWidgetHeader from './AsideWidgetHeader'

/**
 * 侧栏「网站统计」：文章/建站/字数 + 评论总数(Waline) + 总浏览(不蒜子)
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
  const viewTitle = siteConfig('HEO_SITE_VIEW_TITLE', '总浏览量', CONFIG)
  const moreHref = siteConfig('HEO_STATS_MORE_URL', '/stats', CONFIG)
  const showHeader = siteConfig('HEO_ANALYTICS_SHOW_HEADER', true, CONFIG)

  const overrideWords = siteConfig('HEO_SITE_WORD_COUNT', '', CONFIG)
  const overrideComments = siteConfig('HEO_SITE_COMMENT_COUNT', '', CONFIG)
  const walineURL = String(siteConfig('COMMENT_WALINE_SERVER_URL') || '').trim()

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

  const [commentDisplay, setCommentDisplay] = useState(
    overrideComments !== '' && overrideComments != null
      ? formatCount(overrideComments)
      : '—'
  )
  const [viewDisplay, setViewDisplay] = useState('—')

  useEffect(() => {
    if (overrideComments !== '' && overrideComments != null) return
    if (!walineURL) return
    let cancelled = false
    const base = walineURL.replace(/\/$/, '')
    ;(async () => {
      try {
        const res = await fetch(`${base}/api/comment?type=count`, {
          method: 'GET',
          mode: 'cors'
        })
        if (!res.ok) return
        const data = await res.json()
        const n = Number(
          Array.isArray(data) ? data[0] : data?.data ?? data?.count ?? data
        )
        if (!cancelled && Number.isFinite(n) && n >= 0) {
          setCommentDisplay(formatCount(n))
        }
      } catch (e) {
        console.warn('[AnalyticsCard] comment count', e)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [walineURL, overrideComments])

  useEffect(() => {
    const apply = n => {
      if (!Number.isFinite(n) || n < 0) return
      setViewDisplay(formatCount(n))
    }

    const loadApi = async () => {
      try {
        const res = await fetch('/api/busuanzi')
        if (!res.ok) return
        const data = await res.json()
        if (data?.ok && data.site_pv != null) apply(Number(data.site_pv))
      } catch {
        // ignore
      }
    }

    const readPv = () => {
      const nodes = document.querySelectorAll('.busuanzi_value_site_pv')
      for (const el of nodes) {
        const raw = (el.textContent || '').replace(/[,\s]/g, '').trim()
        if (!raw || !/^\d+$/.test(raw)) continue
        apply(Number(raw))
        return true
      }
      return false
    }

    const onReady = e => apply(Number(e?.detail?.site_pv))

    loadApi()
    readPv()
    window.addEventListener('heo-busuanzi-ready', onReady)
    const t = window.setInterval(readPv, 800)
    const stop = window.setTimeout(() => window.clearInterval(t), 25000)
    return () => {
      window.removeEventListener('heo-busuanzi-ready', onReady)
      window.clearInterval(t)
      window.clearTimeout(stop)
    }
  }, [])

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
        <Row
          label={viewTitle}
          value={
            viewDisplay !== '—' ? (
              viewDisplay
            ) : (
              <span className='busuanzi_container_site_pv'>
                <span className='busuanzi_value_site_pv' />
              </span>
            )
          }
        />
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
