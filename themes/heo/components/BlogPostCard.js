import LazyImage from '@/components/LazyImage'
import NotionIcon from './NotionIcon'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import TagItemMini from './TagItemMini'

/**
 * 文章卡：大屏双列、封面在上；无蓝色描边
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
        className={`heo-card wow fadeInUp group flex h-full w-full flex-col overflow-hidden rounded-xl bg-[var(--heo-color-card)] dark:bg-[var(--heo-color-card-dark)] ${
          POST_TWO_COLS ? '' : 'md:h-52 md:flex-row'
        }`}>
        {showPageCover && (
          <SmartLink href={post?.href} className='block shrink-0'>
            <div
              className={`w-full overflow-hidden ${
                POST_TWO_COLS ? 'aspect-[16/9]' : 'h-48 md:h-full md:w-5/12'
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
          className={`flex flex-1 flex-col justify-between p-5 ${
            POST_TWO_COLS ? '' : 'md:w-7/12'
          }`}>
          <header>
            {post?.category && (
              <div className='mb-1 hidden text-xs text-gray-500 md:block dark:text-gray-400'>
                <SmartLink
                  href={`/category/${post.category}`}
                  className='hover:text-[var(--heo-color-primary)] dark:hover:text-[var(--heo-color-accent)]'>
                  {post.category}
                </SmartLink>
              </div>
            )}
            <SmartLink
              href={post?.href}
              className='line-clamp-2 text-lg font-extrabold leading-snug text-gray-900 transition group-hover:text-[var(--heo-color-primary)] dark:text-gray-100 dark:group-hover:text-[var(--heo-color-accent)]'>
              {siteConfig('POST_TITLE_ICON') && (
                <NotionIcon
                  icon={post.pageIcon}
                  className='heo-icon mr-1 inline h-5 w-5 align-middle'
                />
              )}
              <span>{post.title}</span>
            </SmartLink>
          </header>

          {(!showPreview || showSummary) && post.summary && (
            <main className='mt-2 line-clamp-2 text-sm font-light leading-relaxed text-gray-600 dark:text-gray-300'>
              {post.summary}
            </main>
          )}

          <div className='mt-3 flex flex-wrap gap-1'>
            {post.tagItems?.map(tag => (
              <TagItemMini key={tag.name} tag={tag} />
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogPostCard
