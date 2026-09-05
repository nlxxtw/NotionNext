import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import AsideWidgetHeader from './AsideWidgetHeader'

/**
 * 侧栏「今日热门」
 * 优先「热门」标签；不足时用最新文章补齐
 */
export default function HotPostsCard(props) {
  const { latestPosts, allNavPages, posts } = props
  const max = Math.max(
    1,
    Number(siteConfig('HEO_HOT_POSTS_COUNT', 6, CONFIG)) || 6
  )
  const tag = siteConfig('HEO_HOT_POSTS_TAG', '热门', CONFIG)
  const moreHref = siteConfig('HEO_HOT_POSTS_MORE_URL', '/tag/热门', CONFIG)

  const pool = [
    ...(Array.isArray(allNavPages) ? allNavPages : []),
    ...(Array.isArray(latestPosts) ? latestPosts : []),
    ...(Array.isArray(posts) ? posts : [])
  ]

  const byId = new Map()
  pool.forEach(post => {
    if (!post || !String(post.title || '').trim()) return
    const key = post.slug || post.short_id || post.id
    if (!key || byId.has(key)) return
    byId.set(key, post)
  })
  const unique = Array.from(byId.values()).sort(
    (a, b) =>
      new Date(b?.publishDate || b?.lastEditedDate || 0) -
      new Date(a?.publishDate || a?.lastEditedDate || 0)
  )

  let tagged = []
  if (tag) {
    tagged = unique.filter(post =>
      Array.isArray(post?.tags) ? post.tags.includes(tag) : false
    )
  }

  const postKey = p => p.slug || p.short_id || p.id
  const taggedKeys = new Set(tagged.map(postKey))
  const rest = unique.filter(p => !taggedKeys.has(postKey(p)))
  const list = [...tagged, ...rest].slice(0, max)

  if (!list.length) return null

  return (
    <div className='heo-aside-card wow fadeInUp rounded-2xl bg-[var(--heo-color-card)] px-4 py-4 dark:bg-[var(--heo-color-card-dark)]'>
      <AsideWidgetHeader
        icon='fas fa-fire'
        title='今日热门'
        moreHref={moreHref}
      />

      <ol className='space-y-1'>
        {list.map((post, i) => (
          <li key={post.slug || post.short_id || post.id || i}>
            <SmartLink
              href={post.href || `${siteConfig('SUB_PATH', '')}/${post.slug}`}
              className='group flex items-center gap-3 rounded-xl px-2 py-2.5 text-gray-800 transition duration-150 hover:bg-[var(--heo-color-primary)] hover:text-white dark:text-gray-100 dark:hover:bg-[var(--heo-color-accent)] dark:hover:text-gray-900'>
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition ${
                  i === 0
                    ? 'bg-[var(--heo-color-primary)] text-white group-hover:bg-white/25 dark:bg-[var(--heo-color-accent)] dark:text-gray-900 dark:group-hover:bg-black/15'
                    : 'bg-[#eef0f4] text-gray-600 group-hover:bg-white/25 group-hover:text-white dark:bg-white/10 dark:text-gray-300 dark:group-hover:bg-black/15 dark:group-hover:text-gray-900'
                }`}>
                {i + 1}
              </span>
              <span className='line-clamp-2 text-[14px] font-medium leading-snug'>
                {post.title}
              </span>
            </SmartLink>
          </li>
        ))}
      </ol>
    </div>
  )
}
