import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import CONFIG from '../config'

/**
 * 相关推荐（对齐 anheyu-app-frontend PostRelatedPosts）
 * 左封面 45% / 右标题 55%，悬停右侧变主色
 */
export default function PostRecommend({
  recommendPosts,
  siteInfo,
  latestPosts
}) {
  const { locale } = useGlobal()
  const router = useRouter()

  if (
    !siteConfig('HEO_ARTICLE_RECOMMEND', null, CONFIG) ||
    !recommendPosts ||
    recommendPosts.length === 0
  ) {
    return null
  }

  const list = recommendPosts.slice(0, 4)
  const defaultCover = siteInfo?.pageCover || ''

  const handleRandom = () => {
    const pool = (latestPosts?.length ? latestPosts : recommendPosts).filter(
      Boolean
    )
    if (!pool.length) return
    const pick = pool[Math.floor(Math.random() * pool.length)]
    if (pick?.slug || pick?.href) {
      router.push(pick.href || `/${pick.slug}`)
    }
  }

  return (
    <div className='heo-related-posts'>
      <div className='heo-related-posts__head'>
        <h3 className='heo-related-posts__title'>
          <i className='fas fa-star heo-related-posts__star' aria-hidden />
          喜欢这篇文章的人也看了
        </h3>
        <button
          type='button'
          className='heo-related-posts__random'
          onClick={handleRandom}
          title={locale.MENU.WALK_AROUND}>
          {locale.MENU.WALK_AROUND}
        </button>
      </div>

      <div className='heo-related-posts__list'>
        {list.map(post => {
          const cover =
            post?.pageCoverThumbnail ||
            post?.pageCover ||
            defaultCover ||
            ''
          return (
            <SmartLink
              key={post?.id || post?.slug}
              title={post?.title}
              href={post?.href || `/${post?.slug}`}
              className='heo-related-card'>
              <div className='heo-related-card__cover'>
                {cover ? (
                  <LazyImage
                    src={cover}
                    alt={post?.title || ''}
                    className='heo-related-card__img'
                  />
                ) : (
                  <div className='heo-related-card__fallback' />
                )}
              </div>
              <div className='heo-related-card__body'>
                <span className='heo-related-card__title'>{post.title}</span>
              </div>
            </SmartLink>
          )
        })}
      </div>
    </div>
  )
}
