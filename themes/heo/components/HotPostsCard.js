import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 侧栏「今日热门」：编号列表，第 1 名紫色圆标
 */
export default function HotPostsCard(props) {
  const { latestPosts, allNavPages } = props
  const max = Number(siteConfig('HEO_HOT_POSTS_COUNT', 5, CONFIG)) || 5
  const tag = siteConfig('HEO_HOT_POSTS_TAG', '热门', CONFIG)
  const moreHref = siteConfig('HEO_HOT_POSTS_MORE_URL', '/tag/热门', CONFIG)

  let source = []
  if (tag && Array.isArray(allNavPages)) {
    source = allNavPages.filter(post => post?.tags?.includes(tag))
  }
  if (!source.length) {
    source = Array.isArray(latestPosts) ? latestPosts : []
  }
  const posts = source.slice(0, max)
  if (!posts.length) return null

  return (
    <div className='heo-aside-card wow fadeInUp rounded-xl border border-[var(--heo-card-border,#e3e8f7)] bg-[var(--heo-color-card)] p-3 dark:border-gray-700 dark:bg-[var(--heo-color-card-dark)]'>
      <div className='mb-2 flex items-center gap-1.5 px-1'>
        <i className='fas fa-fire text-[15px] text-gray-800 dark:text-gray-100' />
        <span className='text-[15px] font-bold text-gray-900 dark:text-white'>
          今日热门
        </span>
        <SmartLink
          href={moreHref}
          className='ml-auto inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-[13px] text-gray-400 transition hover:bg-[var(--heo-color-card-muted)] hover:text-[var(--heo-color-primary)] dark:hover:bg-white/5 dark:hover:text-[var(--heo-color-accent)]'>
          更多
          <i className='fas fa-arrow-up-right-from-square text-[10px]' />
        </SmartLink>
      </div>

      <ol className='space-y-1'>
        {posts.map((post, i) => (
          <li key={post.id || post.slug || i}>
            <SmartLink
              href={post.href || `${siteConfig('SUB_PATH', '')}/${post.slug}`}
              className='group flex items-start gap-2.5 rounded-xl px-1.5 py-2 transition hover:bg-[var(--heo-color-primary)] hover:text-white dark:hover:bg-[var(--heo-color-accent)]'>
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  i === 0
                    ? 'bg-[var(--heo-color-primary)] text-white group-hover:bg-white group-hover:text-[var(--heo-color-primary)] dark:bg-[var(--heo-color-accent)]'
                    : 'bg-[var(--heo-color-card-muted)] text-gray-600 group-hover:bg-white/25 group-hover:text-white dark:bg-white/10 dark:text-gray-300'
                }`}>
                {i + 1}
              </span>
              <span className='line-clamp-2 text-[13px] font-medium leading-snug text-gray-800 group-hover:text-white dark:text-gray-100'>
                {post.title}
              </span>
            </SmartLink>
          </li>
        ))}
      </ol>
    </div>
  )
}
