import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 侧栏「网站统计」卡片
 */
export function AnalyticsCard(props) {
  const targetDate = new Date(siteConfig('HEO_SITE_CREATE_TIME', null, CONFIG))
  const today = new Date()
  const diffTime = today.getTime() - targetDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const postCountTitle = siteConfig('HEO_POST_COUNT_TITLE', '文章数', CONFIG)
  const siteTimeTitle = siteConfig('HEO_SITE_TIME_TITLE', '建站天数', CONFIG)
  const siteVisitTitle = siteConfig('HEO_SITE_VISIT_TITLE', '访问量', CONFIG)
  const siteVisitorTitle = siteConfig('HEO_SITE_VISITOR_TITLE', '访客数', CONFIG)
  const moreHref = siteConfig('HEO_STATS_MORE_URL', '/stats', CONFIG)
  const showHeader = siteConfig('HEO_ANALYTICS_SHOW_HEADER', true, CONFIG)

  const { postCount } = props

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

      <div className='flex flex-col space-y-2 px-1 text-[13px] text-gray-700 dark:text-gray-200'>
        <div className='flex justify-between'>
          <span className='text-gray-500 dark:text-gray-400'>{postCountTitle}</span>
          <span className='font-semibold'>{postCount ?? 0}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-500 dark:text-gray-400'>{siteTimeTitle}</span>
          <span className='font-semibold'>{diffDays} 天</span>
        </div>
        <div className='hidden busuanzi_container_site_pv'>
          <div className='flex justify-between'>
            <span className='text-gray-500 dark:text-gray-400'>{siteVisitTitle}</span>
            <span className='busuanzi_value_site_pv font-semibold' />
          </div>
        </div>
        <div className='hidden busuanzi_container_site_uv'>
          <div className='flex justify-between'>
            <span className='text-gray-500 dark:text-gray-400'>{siteVisitorTitle}</span>
            <span className='busuanzi_value_site_uv font-semibold' />
          </div>
        </div>
      </div>
    </div>
  )
}
