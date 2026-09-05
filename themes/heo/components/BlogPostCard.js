import LazyImage from '@/components/LazyImage'
import NotionIcon from './NotionIcon'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import CommentAvatarStack from './CommentAvatarStack'
import { TagCloverIcon } from './TagGroups'

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
          {/* 分类/标签行：四瓣图标 + 文案，无 #、无线框 */}
          {tipLabels.length > 0 && (
            <div className='recent-post-info-top-tips mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] leading-none text-gray-500 dark:text-gray-400'>
              {tipLabels.map((label, i) => (
                <span
                  key={`${label}-${i}`}
                  className='inline-flex items-center gap-1.5 whitespace-nowrap font-medium'>
                  {i === 0 && (
                    <TagCloverIcon className='h-3 w-3 text-gray-500 dark:text-gray-400' />
                  )}
                  {label}
                </span>
              ))}
            </div>
          )}

          {/* 标题：对齐 Heo article-title 20px / 700 */}
          <SmartLink
            href={href}
            className='line-clamp-2 flex-1 text-[20px] font-bold leading-[1.5] text-gray-900 transition group-hover:text-[var(--heo-color-primary)] dark:text-gray-100 dark:group-hover:text-[var(--heo-color-accent)]'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon
                icon={post.pageIcon}
                className='heo-icon mr-1 inline h-[1.1em] w-[1.1em] align-middle'
              />
            )}
            <span>{post.title}</span>
          </SmartLink>

          {showSummary && post.summary ? (
            <p className='mt-1.5 line-clamp-1 text-[13px] text-gray-400'>
              {post.summary}
            </p>
          ) : null}

          {/* 底部：评论头像 | 日期 */}
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
