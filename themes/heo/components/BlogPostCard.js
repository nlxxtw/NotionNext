import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { isPostPinned } from '@/lib/utils/pinnedPosts'
import { useEffect, useMemo, useState } from 'react'
import CONFIG from '../config'
import CommentAvatarStack from './CommentAvatarStack'
import { isPostRead, postReadKey } from '../lib/readPosts'

/**
 * 文章卡（对齐 blog.zhheo.com）
 * 标题上方：分类 + 标签 + 未读；底栏头像与日期
 */
const BlogPostCard = ({ index, post, showSummary, siteInfo }) => {
  const showPreview =
    siteConfig('HEO_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap
  if (
    post &&
    !post.pageCoverThumbnail &&
    siteConfig('HEO_POST_LIST_COVER_DEFAULT', null, CONFIG)
  ) {
    post.pageCoverThumbnail = siteInfo?.pageCover
  }
  const showPageCover =
    siteConfig('HEO_POST_LIST_COVER', null, CONFIG) &&
    post?.pageCoverThumbnail &&
    !showPreview

  const POST_TWO_COLS = siteConfig('HEO_HOME_POST_TWO_COLS', true, CONFIG)
  const href = post?.href || `/${post?.slug || ''}`
  const dateLabel = formatHeoCardDate(
    post?.publishDate || post?.date?.start_date || post?.publishDay
  )
  const readKey = postReadKey(post)
  const [unread, setUnread] = useState(false)
  const topTag = siteConfig('TOP_TAG', '置顶')
  const pinned = isPostPinned(post, topTag)

  const cardTags = useMemo(() => {
    const items = Array.isArray(post?.tagItems)
      ? post.tagItems
      : Array.isArray(post?.tags)
        ? post.tags.map(t => (typeof t === 'string' ? { name: t } : t))
        : []
    return items
      .map(t => ({
        name: String(t?.name || t?.title || '').trim()
      }))
      .filter(t => t.name && t.name !== topTag)
      .slice(0, 3)
  }, [post?.tagItems, post?.tags, topTag])

  const categoryName = String(post?.category || '').trim()
  const showMeta =
    Boolean(categoryName) ||
    cardTags.length > 0 ||
    unread ||
    (pinned && !showPageCover)

  useEffect(() => {
    const sync = () => setUnread(Boolean(readKey) && !isPostRead(readKey))
    sync()
    window.addEventListener('heo-read-posts-changed', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('heo-read-posts-changed', sync)
      window.removeEventListener('storage', sync)
    }
  }, [readKey])

  // 预热封面主色缓存，点进文章时可瞬时上色、避免先闪默认紫
  useEffect(() => {
    const cover = post?.pageCoverThumbnail || post?.pageCover || ''
    if (!cover) return undefined
    let idleId
    const run = () => {
      import('../lib/coverColor')
        .then(m => m.prefetchCoverColor?.(cover))
        .catch(() => {})
    }
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(run, { timeout: 2500 })
      return () => window.cancelIdleCallback?.(idleId)
    }
    idleId = window.setTimeout(run, 600)
    return () => window.clearTimeout(idleId)
  }, [post?.pageCoverThumbnail, post?.pageCover])

  return (
    <article className='h-full'>
      <div
        data-wow-delay='.2s'
        className={`heo-card wow fadeInUp group relative flex h-full w-full flex-col overflow-hidden rounded-[18px] bg-[var(--heo-color-card)] dark:bg-[var(--heo-color-card-dark)] ${
          POST_TWO_COLS ? '' : 'md:h-44 md:flex-row'
        }`}>
        {pinned && showPageCover ? (
          <span className='absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-[#ef4444] px-2 py-0.5 text-[11px] font-bold text-white shadow-sm'>
            <i className='fas fa-thumbtack text-[9px]' aria-hidden />
            置顶
          </span>
        ) : null}

        {showPageCover && (
          <SmartLink href={href} className='block shrink-0'>
            <div
              className={`w-full overflow-hidden ${
                POST_TWO_COLS
                  ? 'aspect-[16/9] h-auto min-h-[180px] sm:h-[210px] sm:min-h-0 sm:aspect-auto'
                  : 'h-36 md:h-full md:w-5/12'
              }`}>
              <LazyImage
                priority={index === 0}
                src={post?.pageCoverThumbnail}
                alt={post?.title}
                className='h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:brightness-90'
              />
            </div>
          </SmartLink>
        )}

        <div
          className={`flex flex-1 flex-col px-4 pb-4 pt-3.5 ${
            POST_TWO_COLS ? 'min-h-[148px]' : 'md:w-7/12'
          }`}>
          {/* 分类 / 标签 / 未读 —— 对齐 Heo 灰字标签行 */}
          {showMeta ? (
            <div className='mb-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12px] font-medium leading-none text-gray-400 dark:text-gray-500'>
              {pinned && !showPageCover ? (
                <span className='inline-flex items-center gap-1 rounded-full bg-[#ef4444]/12 px-2 py-0.5 text-[11px] font-bold text-[#ef4444] dark:bg-[#ef4444]/20 dark:text-[#f87171]'>
                  <i className='fas fa-thumbtack text-[9px]' aria-hidden />
                  置顶
                </span>
              ) : null}
              {categoryName ? (
                <SmartLink
                  href={`/category/${encodeURIComponent(categoryName)}`}
                  className='transition hover:text-[var(--heo-color-primary)] dark:hover:text-[var(--heo-color-accent)]'>
                  {categoryName}
                </SmartLink>
              ) : null}
              {cardTags.map(tag => (
                <SmartLink
                  key={tag.name}
                  href={`/tag/${encodeURIComponent(tag.name)}`}
                  className='transition hover:text-[var(--heo-color-primary)] dark:hover:text-[var(--heo-color-accent)]'>
                  {tag.name}
                </SmartLink>
              ))}
              {unread ? <span>未读</span> : null}
            </div>
          ) : null}

          <SmartLink
            href={href}
            className={`line-clamp-2 flex-1 text-[20px] font-bold leading-[1.5] transition dark:group-hover:text-[var(--heo-color-accent)] ${
              unread
                ? 'text-[var(--heo-color-primary)] group-hover:opacity-90 dark:text-[var(--heo-color-accent)]'
                : 'text-gray-900 group-hover:text-[var(--heo-color-primary)] dark:text-gray-100'
            }`}>
            <span>{post.title}</span>
          </SmartLink>

          {showSummary && post.summary ? (
            <p className='mt-1.5 line-clamp-1 text-[13px] text-gray-400'>
              {post.summary}
            </p>
          ) : null}

          <div className='mt-4 flex items-center justify-between gap-3'>
            <CommentAvatarStack
              postUrl={href}
              fallbackAvatar={siteInfo?.icon}
            />
            <time className='shrink-0 text-[12px] text-gray-400 dark:text-gray-500'>
              {dateLabel}
            </time>
          </div>
        </div>
      </div>
    </article>
  )
}

function formatHeoCardDate(dateInput) {
  if (!dateInput) return ''
  const date = new Date(dateInput)
  if (Number.isNaN(date.getTime())) {
    return String(dateInput)
  }
  const diff = Date.now() - date.getTime()
  const dayMs = 24 * 60 * 60 * 1000
  if (diff < dayMs) return '今天'
  if (diff < 2 * dayMs) return '1天前'
  if (diff < 7 * dayMs) return `${Math.floor(diff / dayMs)}天前`
  return `${date.getMonth() + 1}/${date.getDate()}`
}

export default BlogPostCard
