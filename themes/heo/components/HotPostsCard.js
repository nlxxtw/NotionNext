import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 侧栏「今日热门」
 * 优先「热门」标签；不足时用最新文章补齐，默认多篇
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
    const key = post.id || post.slug
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

  const taggedKeys = new Set(tagged.map(t => t.id || t.slug))
  const rest = unique.filter(p => !taggedKeys.has(p.id || p.slug))
  const list = [...tagged, ...rest].slice(0, max)

  if (!list.length) return null

  return (
    <div className='heo-aside-card wow fadeInUp rounded-xl bg-[var(--heo-color-card)] p-3 dark:bg-[var(--heo-color-card-dark)]'>
      <div className='mb-1.5 flex items-center gap-1.5 px-1'>
        <i className='fas fa-fire text-[15px] text-gray-800 dark:text-gray-100' />
        <span className='text-[15px] font-bold text-gray-900 dark:text-white'>
          今日热门
        </span>
        <SmartLink
          href={moreHref}
          className='ml-auto inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-[13px] text-gray-400 transition hover:bg-black/5 hover:text-[var(--heo-color-primary)] dark:hover:bg-white/5 dark:hover:text-[var(--heo-color-accent)]'>
          更多
          <i className='fas fa-arrow-up-right-from-square text-[10px]' />
        </SmartLink>
      </div>

      <ol className='space-y-0.5'>
        {list.map((post, i) => (
          <li key={post.id || post.slug || i}>
            <SmartLink
              href={post.href || `${siteConfig('SUB_PATH', '')}/${post.slug}`}
              className='group flex items-start gap-2.5 rounded-xl px-1.5 py-2 text-gray-800 duration-75 hover:bg-[#2c2f36] hover:text-white dark:text-gray-100 dark:hover:bg-[#3a3d46]'>
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold duration-75 ${
                  i === 0
                    ? 'bg-[#2c2f36] text-white group-hover:bg-white/20 dark:bg-[#3a3d46]'
                    : 'bg-[#eef0f4] text-gray-600 group-hover:bg-white/20 group-hover:text-white dark:bg-white/10 dark:text-gray-300'
                }`}>
                {i + 1}
              </span>
              <span className='line-clamp-2 text-[13px] font-medium leading-snug'>
                {post.title}
              </span>
            </SmartLink>
          </li>
        ))}
      </ol>
    </div>
  )
}
