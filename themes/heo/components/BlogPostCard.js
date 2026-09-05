import LazyImage from '@/components/LazyImage'
import NotionIcon from './NotionIcon'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import TagItemMini from './TagItemMini'

/**
 * 文章卡：双列紧凑比例，封面略矮，避免压过分类条
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

  return (
    <article className='h-full'>
      <div
        data-wow-delay='.2s'
        className={`heo-card wow fadeInUp group flex h-full w-full flex-col overflow-hidden rounded-[18px] bg-[var(--heo-color-card)] dark:bg-[var(--heo-color-card-dark)] ${
          POST_TWO_COLS ? '' : 'md:h-44 md:flex-row'
        }`}>
        {showPageCover && (
          <SmartLink href={post?.href} className='block shrink-0'>
            <div
              className={`w-full overflow-hidden ${
                POST_TWO_COLS
                  ? 'aspect-[2/1] max-h-[168px]'
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
          className={`flex flex-1 flex-col justify-between px-4 py-3.5 ${
            POST_TWO_COLS ? '' : 'md:w-7/12'
          }`}>
          <header>
            {post?.category && (
              <div className='mb-0.5 hidden text-[11px] text-gray-500 md:block dark:text-gray-400'>
                <SmartLink
                  href={`/category/${post.category}`}
                  className='hover:text-[var(--heo-color-primary)] dark:hover:text-[var(--heo-color-accent)]'>
                  {post.category}
                </SmartLink>
              </div>
            )}
            <SmartLink
              href={post?.href}
              className='line-clamp-2 text-[15px] font-extrabold leading-snug text-gray-900 transition group-hover:text-[var(--heo-color-primary)] dark:text-gray-100 dark:group-hover:text-[var(--heo-color-accent)] sm:text-base'>
              {siteConfig('POST_TITLE_ICON') && (
                <NotionIcon
                  icon={post.pageIcon}
                  className='heo-icon mr-1 inline h-4 w-4 align-middle'
                />
              )}
              <span>{post.title}</span>
            </SmartLink>
          </header>

          {(!showPreview || showSummary) && post.summary && (
            <main className='mt-1.5 line-clamp-2 text-[13px] font-light leading-relaxed text-gray-500 dark:text-gray-400'>
              {post.summary}
            </main>
          )}

          <div className='mt-2 flex flex-wrap gap-1'>
            {post.tagItems?.slice(0, 3).map(tag => (
              <TagItemMini key={tag.name} tag={tag} />
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogPostCard
