import Live2D from '@/components/Live2D'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { siteConfig } from '@/lib/config'
import { AnalyticsCard } from './AnalyticsCard'
import Catalog from './Catalog'
import { InfoCard } from './InfoCard'
import HotPostsCard from './HotPostsCard'
import LatestPostsGroupMini from './LatestPostsGroupMini'
import TagGroups from './TagGroups'
import TouchMeCard from './TouchMeCard'
import CONFIG from '../config'

const FaceBookPage = dynamic(
  () => {
    let facebook = <></>
    try {
      facebook = import('@/components/FacebookPage')
    } catch (err) {
      console.error(err)
    }
    return facebook
  },
  { ssr: false }
)

/**
 * 右侧栏：今日热门 / 标签 / 网站统计（对齐 blog.zhheo.com）
 */
export default function SideRight(props) {
  const { post, lock, tagOptions, rightAreaSlot } = props
  const router = useRouter()
  const isHome = router.route === '/'
  const showHot = siteConfig('HEO_WIDGET_HOT_POSTS', true, CONFIG)
  const showLatest = siteConfig('HEO_WIDGET_LATEST_POSTS', false, CONFIG)
  const tagLimit = Number(siteConfig('HEO_SIDE_TAG_LIMIT', 24, CONFIG)) || 24
  const sortedTags = tagOptions?.slice(0, tagLimit) || []

  return (
    <div id='sideRight' className='hidden h-full w-72 space-y-3 xl:block'>
      {!isHome && <InfoCard {...props} className='w-72 wow fadeInUp' />}

      <div className='sticky top-20 space-y-3'>
        {!lock && post && post.toc && post.toc.length > 0 && (
          <div className='heo-aside-card wow fadeInUp rounded-xl border border-[var(--heo-card-border,#e3e8f7)] bg-[var(--heo-color-card)] p-3 dark:border-gray-700 dark:bg-[var(--heo-color-card-dark)]'>
            <Catalog toc={post.toc} />
          </div>
        )}

        {!isHome && (
          <div className='wow fadeInUp'>
            <TouchMeCard />
          </div>
        )}

        {showHot && <HotPostsCard {...props} />}

        {showLatest && (
          <div className='heo-aside-card wow fadeInUp rounded-xl border border-[var(--heo-card-border,#e3e8f7)] bg-[var(--heo-color-card)] p-3 dark:border-gray-700 dark:bg-[var(--heo-color-card-dark)]'>
            <LatestPostsGroupMini {...props} />
          </div>
        )}

        {rightAreaSlot}

        <FaceBookPage />
        <Live2D />

        {sortedTags.length > 0 && (
          <div className='heo-aside-card wow fadeInUp rounded-xl border border-[var(--heo-card-border,#e3e8f7)] bg-[var(--heo-color-card)] p-3 dark:border-gray-700 dark:bg-[var(--heo-color-card-dark)] dark:text-white'>
            <TagGroups tags={sortedTags} max={tagLimit} />
          </div>
        )}

        <div className='heo-aside-card wow fadeInUp rounded-xl border border-[var(--heo-card-border,#e3e8f7)] bg-[var(--heo-color-card)] p-3 dark:border-gray-700 dark:bg-[var(--heo-color-card-dark)] dark:text-white'>
          <AnalyticsCard {...props} />
        </div>
      </div>
    </div>
  )
}
