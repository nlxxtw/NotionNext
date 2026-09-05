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
import WechatSubscribeCard from './WechatSubscribeCard'
import CONFIG from '../config'

const RecentCommentsCard = dynamic(
  () => import('./RecentCommentsCard'),
  { ssr: false }
)

const FaceBookPage = dynamic(
  () => {
    try {
      return import('@/components/FacebookPage')
    } catch (err) {
      console.error(err)
      return Promise.resolve(() => null)
    }
  },
  { ssr: false }
)

/**
 * 右侧栏：整列拉高 + sticky，随文章滚到底仍贴在视口
 */
export default function SideRight(props) {
  const { post, lock, tagOptions, rightAreaSlot } = props
  const router = useRouter()
  const isHome = router.route === '/'
  const showHot = siteConfig('HEO_WIDGET_HOT_POSTS', true, CONFIG)
  const showLatest = siteConfig('HEO_WIDGET_LATEST_POSTS', false, CONFIG)
  const showComments = siteConfig('HEO_WIDGET_RECENT_COMMENTS', true, CONFIG)
  const showAnalytics = siteConfig('HEO_WIDGET_ANALYTICS', true, CONFIG)
  const heroSubscribe = parseBool(
    siteConfig('HEO_HERO_SUBSCRIBE_ENABLE', true, CONFIG)
  )
  const showHomeSubscribe = isHome && heroSubscribe
  const showSocial =
    parseBool(siteConfig('HEO_SOCIAL_CARD', true, CONFIG)) &&
    !(isHome && heroSubscribe)
  const showInfoOnHome = siteConfig('HEO_HOME_SHOW_INFO_CARD', false, CONFIG)
  const tagLimit = Number(siteConfig('HEO_SIDE_TAG_LIMIT', 24, CONFIG)) || 24
  const sortedTags = tagOptions?.slice(0, tagLimit) || []
  // 文章页始终显示资料卡（对齐 Heo）；首页按配置
  const showInfoCard = Boolean(post) || !isHome || showInfoOnHome
  const showToc = !lock && Array.isArray(post?.toc) && post.toc.length > 0

  return (
    <aside
      id='sideRight'
      className='heo-side-right hidden w-[300px] shrink-0 self-stretch xl:block xl:w-[320px]'>
      <div className='heo-side-sticky sticky top-20 flex w-full flex-col gap-4'>
        {showHomeSubscribe && <WechatSubscribeCard className='w-full' />}

        {showInfoCard && (
          <InfoCard {...props} className='w-full wow fadeInUp' />
        )}

        {showToc && (
          <div
            id='card-toc-wrap'
            className='heo-aside-card heo-aside-toc wow fadeInUp rounded-2xl bg-[var(--heo-color-card)] p-3.5 dark:bg-[var(--heo-color-card-dark)]'>
            <Catalog toc={post.toc} />
          </div>
        )}

        {/* 文章页：资料卡 + 目录优先；其余挂件仍保留在下方 */}
        {showSocial && (
          <div className='wow fadeInUp w-full'>
            <TouchMeCard />
          </div>
        )}

        {showHot && <HotPostsCard {...props} />}

        {showLatest && (
          <div className='heo-aside-card wow fadeInUp rounded-2xl bg-[var(--heo-color-card)] p-4 dark:bg-[var(--heo-color-card-dark)]'>
            <LatestPostsGroupMini {...props} />
          </div>
        )}

        {showComments && <RecentCommentsCard {...props} />}

        {rightAreaSlot}

        {sortedTags.length > 0 && (
          <div className='heo-aside-card wow fadeInUp rounded-2xl bg-[var(--heo-color-card)] px-4 py-4 dark:bg-[var(--heo-color-card-dark)] dark:text-white'>
            <TagGroups tags={sortedTags} max={tagLimit} />
          </div>
        )}

        {showAnalytics && (
          <div className='heo-aside-card wow fadeInUp rounded-2xl bg-[var(--heo-color-card)] px-4 py-4 dark:bg-[var(--heo-color-card-dark)] dark:text-white'>
            <AnalyticsCard {...props} />
          </div>
        )}

        <FaceBookPage />
      </div>
    </aside>
  )
}

function parseBool(value) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return value.toLowerCase() === 'true'
    }
  }
  return Boolean(value)
}
