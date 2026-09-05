import LazyImage from '@/components/LazyImage'
import NotionIcon from './NotionIcon'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import CommentAvatarStack from './CommentAvatarStack'

/**
 * 文章卡（对齐 blog.zhheo.com）
 * 标签在上 → 标题 → 底部评论头像 + 日期
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
  const tags = Array.isArray(post?.tagItems)
    ? post.tagItems
    : Array.isArray(post?.tags)
      ? post.tags.map(name => ({ name }))
      : []
  const tipLabels = []
  if (post?.category) tipLabels.push(String(post.category))
  tags.slice(0, 3).forEach(t => {
    const name = typeof t === 'string' ? t : t?.name
    if (name && !tipLabels.includes(name)) tipLabels.push(name)
  })

  const href = post?.href || `/${post?.slug || ''}`
  const dateLabel = formatHeoCardDate(
    post?.publishDate || post?.date?.start_date || post?.publishDay
  )

  return (
    <article className='h-full'>
      <div
        data-wow-delay='.2s'
        className={`heo-card wow fadeInUp group flex h-full w-full flex-col overflow-hidden rounded-[18px] bg-[var(--heo-color-card)] dark:bg-[var(--heo-color-card-dark)] ${
          POST_TWO_COLS ? '' : 'md:h-44 md:flex-row'
        }`}>
        {showPageCover && (
          <SmartLink href={href} className='block shrink-0'>
            <div
              className={`w-full overflow-hidden ${
                POST_TWO_COLS
                  ? 'aspect-[2/1] max-h-[160px]'
                  : 'h-36 md:h-full md:w-5/12'
              }`}>
              <LazyImage
                priority={index === 0}
                src={post?.pageCoverThumbnail}
                alt={post?.title}
                className='h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-90'
              />
            </div>
          </SmartLink>
        )}

        <div
          className={`flex flex-1 flex-col px-4 py-3.5 ${
            POST_TWO_COLS ? 'min-h-[132px]' : 'md:w-7/12'
          }`}>
          {/* 标签行 */}
          {tipLabels.length > 0 && (
            <div className='recent-post-info-top-tips mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] leading-none text-gray-400 dark:text-gray-500'>
              {tipLabels.map((label, i) => (
                <span key={`${label}-${i}`} className='whitespace-nowrap'>
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* 标题 */}
          <SmartLink
            href={href}
            className='line-clamp-2 flex-1 text-[17px] font-extrabold leading-snug text-gray-900 transition group-hover:text-[var(--heo-color-primary)] dark:text-gray-100 dark:group-hover:text-[var(--heo-color-accent)]'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon
                icon={post.pageIcon}
                className='heo-icon mr-1 inline h-4 w-4 align-middle'
              />
            )}
            <span>{post.title}</span>
          </SmartLink>

          {showSummary && post.summary ? (
            <p className='mt-1 line-clamp-1 text-[12px] text-gray-400'>
              {post.summary}
            </p>
          ) : null}

          {/* 底部：评论头像 | 日期 */}
          <div className='mt-3 flex items-center justify-between gap-3'>
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
