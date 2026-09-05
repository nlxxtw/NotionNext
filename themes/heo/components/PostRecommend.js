import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import CONFIG from '../config'

/**
 * 安知鱼风格相关推荐：左右分栏封面卡 +「随便逛逛」
 */
export default function PostRecommend({ recommendPosts, siteInfo, latestPosts }) {
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
          <span className='heo-related-posts__star' aria-hidden>
            ★
          </span>
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
            siteInfo?.pageCover ||
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
                    className='h-full w-full object-cover'
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
