import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef } from 'react'
import CONFIG from '../config'
import SearchInput from './SearchInput'

/**
 * 搜索页（对齐 blog.zhheo.com/search）
 * 标题 + 胶囊搜索框 + 随机推荐 / 热门文章封面栅格
 */
export default function SearchNav(props) {
  const { latestPosts, allNavPages, posts } = props
  const cRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    cRef?.current?.focus()
  }, [])

  const pool = useMemo(() => collectPosts({ latestPosts, allNavPages, posts }), [
    latestPosts,
    allNavPages,
    posts
  ])

  const randomCount =
    Number(siteConfig('HEO_SEARCH_RANDOM_COUNT', 6, CONFIG)) || 6
  const hotCount = Number(siteConfig('HEO_SEARCH_HOT_COUNT', 6, CONFIG)) || 6
  const hotTag = siteConfig('HEO_HOT_POSTS_TAG', '热门', CONFIG)
  const hotMore = siteConfig('HEO_HOT_POSTS_MORE_URL', '/tag/热门', CONFIG)
  const randomMore = siteConfig('HEO_SEARCH_RANDOM_MORE_URL', '/', CONFIG)

  const randomPosts = useMemo(
    () => pickRandom(pool, randomCount),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pool, randomCount]
  )
  const hotPosts = useMemo(
    () => pickHot(pool, hotCount, hotTag),
    [pool, hotCount, hotTag]
  )

  const closeSearch = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <div id='heo-search-page' className='heo-search-page w-full pb-10 pt-2'>
      {/* 顶栏：搜索 + 关闭 */}
      <div className='mb-5 flex items-center justify-between gap-3'>
        <h1 className='text-[28px] font-extrabold tracking-tight text-[var(--heo-color-primary)] md:text-[32px]'>
          搜索
        </h1>
        <button
          type='button'
          aria-label='关闭搜索'
          onClick={closeSearch}
          className='flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-[var(--heo-color-card-muted)] hover:text-gray-900 active:scale-95 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white'>
          <i className='fas fa-xmark text-xl' />
        </button>
      </div>

      {/* 胶囊搜索框 */}
      <SearchInput
        cRef={cRef}
        variant='pill'
        className='mb-8'
        {...props}
      />

      <PostCoverSection
        title='随机推荐'
        moreHref={randomMore}
        posts={randomPosts}
      />

      <PostCoverSection
        title='热门文章'
        moreHref={hotMore}
        posts={hotPosts}
        className='mt-8'
      />

      {randomPosts.length === 0 && hotPosts.length === 0 && (
        <div className='rounded-2xl bg-[var(--heo-color-card)] px-4 py-12 text-center text-sm text-gray-400 dark:bg-[var(--heo-color-card-dark)]'>
          暂无可推荐文章，试试输入关键词搜索
        </div>
      )}
    </div>
  )
}

function PostCoverSection({ title, moreHref, posts, className = '' }) {
  if (!posts?.length) return null
  return (
    <section className={className}>
      <div className='mb-3 flex items-end justify-between gap-3 px-0.5'>
        <h2 className='text-lg font-extrabold text-gray-900 dark:text-white md:text-xl'>
          {title}
        </h2>
        {moreHref && (
          <SmartLink
            href={moreHref}
            className='inline-flex items-center gap-1 text-[13px] font-medium text-gray-400 transition hover:text-[var(--heo-color-primary)] dark:hover:text-[var(--heo-color-accent)]'>
            更多
            <i className='fas fa-arrow-up-right-from-square text-[10px]' />
          </SmartLink>
        )}
      </div>
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6'>
        {posts.map((post, i) => (
          <CoverCard key={post.id || post.slug || i} post={post} />
        ))}
      </div>
    </section>
  )
}

function CoverCard({ post }) {
  const href = post.href || `${siteConfig('SUB_PATH', '')}/${post.slug}`
  const cover =
    post.pageCoverThumbnail || post.pageCover || post.page_cover || ''
  const title = post.title || '未命名'

  return (
    <SmartLink
      href={href}
      className='heo-search-cover-card group flex flex-col gap-2'>
      <div className='relative aspect-[4/3] overflow-hidden rounded-[14px] bg-[var(--heo-color-card-muted)] shadow-[0_8px_20px_-12px_rgba(40,50,90,0.35)] ring-1 ring-black/[0.04] dark:bg-white/5 dark:ring-white/10'>
        {cover ? (
          <LazyImage
            src={cover}
            alt={title}
            className='h-full w-full object-cover transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--heo-color-primary)]/80 to-[#5b4cdb]'>
            <i className='fas fa-file-alt text-2xl text-white/80' />
          </div>
        )}
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition group-hover:opacity-100' />
      </div>
      <div className='line-clamp-2 px-0.5 text-[13px] font-semibold leading-snug text-gray-800 transition group-hover:text-[var(--heo-color-primary)] dark:text-gray-100 dark:group-hover:text-[var(--heo-color-accent)]'>
        {title}
      </div>
    </SmartLink>
  )
}

function collectPosts({ latestPosts, allNavPages, posts }) {
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
  return Array.from(byId.values())
}

function pickRandom(list, count) {
  if (!list.length) return []
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, count)
}

function pickHot(list, count, tag) {
  const sorted = [...list].sort(
    (a, b) =>
      new Date(b?.publishDate || b?.lastEditedDate || 0) -
      new Date(a?.publishDate || a?.lastEditedDate || 0)
  )
  let tagged = []
  if (tag) {
    tagged = sorted.filter(p =>
      Array.isArray(p?.tags) ? p.tags.includes(tag) : false
    )
  }
  const keys = new Set(tagged.map(t => t.id || t.slug))
  const rest = sorted.filter(p => !keys.has(p.id || p.slug))
  return [...tagged, ...rest].slice(0, count)
}
