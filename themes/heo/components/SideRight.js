import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { siteConfig } from '@/lib/config'
import { AnalyticsCard } from './AnalyticsCard'
import Catalog from './Catalog'
import { InfoCard } from './InfoCard'
import HotPostsCard from './HotPostsCard'
import LatestPostsGroupMini from './LatestPostsGroupMini'
import TagGroups from './TagGroups'
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
 * 右侧栏（对齐 blog.zhheo.com #aside-content）
 * - 资料卡 / 公众号：普通流，跟正文一起滚走
 * - 今日热门 / 标签 / 统计等：放进 sticky_layout，滚到顶再吸住
 *   （整栏 sticky 且高于视口时会出现「小工具滚不动」）
 */
export default function SideRight(props) {
  const { post, lock, tagOptions, rightAreaSlot } = props
  const router = useRouter()
  const isHome = router.route === '/'
  const showHot = siteConfig('HEO_WIDGET_HOT_POSTS', true, CONFIG)
  const showLatest = siteConfig('HEO_WIDGET_LATEST_POSTS', false, CONFIG)
  const showComments = siteConfig('HEO_WIDGET_RECENT_COMMENTS', true, CONFIG)
  const showAnalytics = siteConfig('HEO_WIDGET_ANALYTICS', true, CONFIG)
  const subscribeEnable = parseBool(
    siteConfig('HEO_HERO_SUBSCRIBE_ENABLE', true, CONFIG)
  )
  const socialEnable = parseBool(siteConfig('HEO_SOCIAL_CARD', true, CONFIG))
  const showSubscribe = subscribeEnable || socialEnable
  const showInfoOnHome = siteConfig('HEO_HOME_SHOW_INFO_CARD', true, CONFIG)
  const tagLimit = Number(siteConfig('HEO_SIDE_TAG_LIMIT', 24, CONFIG)) || 24
  const sortedTags = tagOptions?.slice(0, tagLimit) || []
  const showInfoCard = Boolean(post) || !isHome || showInfoOnHome
  const showToc = !lock && Array.isArray(post?.toc) && post.toc.length > 0

  const hasStickyBlock =
    showToc ||
    showHot ||
    showLatest ||
    Boolean(rightAreaSlot) ||
    sortedTags.length > 0 ||
    showAnalytics

  return (
    <aside
      id='sideRight'
      className={`heo-side-right hidden w-[300px] shrink-0 self-stretch xl:flex xl:w-[320px] xl:flex-col ${
        isHome ? 'gap-3' : 'gap-4'
      }`}>
      {/* 顶部模块：不 sticky，跟文章一起滚（评论也放这里，避免 sticky 过高+wow 导致「消失」） */}
      {showInfoCard && (
        <InfoCard {...props} className='w-full wow fadeInUp' />
      )}

      {showSubscribe && (
        <div className='wow fadeInUp w-full'>
          <WechatSubscribeCard className='w-full' />
        </div>
      )}

      {showComments && <RecentCommentsCard {...props} />}

      {/* 下方模块：Heo .sticky_layout（热门 / 标签 / 统计） */}
      {hasStickyBlock && (
        <div
          className={`heo-side-sticky sticky top-20 flex w-full flex-col ${
            isHome ? 'gap-3' : 'gap-4'
          }`}>
          {showToc && (
            <div
              id='card-toc-wrap'
              className='heo-aside-card heo-aside-toc wow fadeInUp rounded-2xl bg-[var(--heo-color-card)] p-3.5 dark:bg-[var(--heo-color-card-dark)]'>
              <Catalog toc={post.toc} />
            </div>
          )}

          {showHot && <HotPostsCard {...props} />}

          {showLatest && (
            <div className='heo-aside-card wow fadeInUp rounded-2xl bg-[var(--heo-color-card)] p-4 dark:bg-[var(--heo-color-card-dark)]'>
              <LatestPostsGroupMini {...props} />
            </div>
          )}

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
      )}
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
