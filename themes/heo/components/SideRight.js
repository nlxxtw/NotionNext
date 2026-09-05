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
 * 右侧栏
 */
export default function SideRight(props) {
  const { post, lock, tagOptions, rightAreaSlot, notice } = props
  const router = useRouter()
  const isHome = router.route === '/'
  const showHot = siteConfig('HEO_WIDGET_HOT_POSTS', true, CONFIG)
  const showLatest = siteConfig('HEO_WIDGET_LATEST_POSTS', false, CONFIG)
  // 首页英雄区已有公众号订阅时，侧栏不再重复
  const heroSubscribe = parseBool(
    siteConfig('HEO_HERO_SUBSCRIBE_ENABLE', true, CONFIG)
  )
  const showSocial =
    parseBool(siteConfig('HEO_SOCIAL_CARD', true, CONFIG)) &&
    !(isHome && heroSubscribe)
  const showInfoOnHome = siteConfig('HEO_HOME_SHOW_INFO_CARD', false, CONFIG)
  const tagLimit = Number(siteConfig('HEO_SIDE_TAG_LIMIT', 24, CONFIG)) || 24
  const sortedTags = tagOptions?.slice(0, tagLimit) || []
  const hasNotice = Boolean(notice)

  return (
    <aside
      id='sideRight'
      className='hidden w-[272px] shrink-0 xl:block xl:w-[292px]'>
      <div className='flex w-full flex-col gap-3'>
        {(!isHome || showInfoOnHome || hasNotice) && (
          <InfoCard {...props} className='w-full wow fadeInUp' />
        )}

        <div className='sticky top-20 flex w-full flex-col gap-3'>
          {!lock && post?.toc?.length > 0 && (
            <div className='heo-aside-card wow fadeInUp rounded-xl bg-[var(--heo-color-card)] p-3 dark:bg-[var(--heo-color-card-dark)]'>
              <Catalog toc={post.toc} />
            </div>
          )}

          {showSocial && (
            <div className='wow fadeInUp w-full'>
              <TouchMeCard />
            </div>
          )}

          {showHot && <HotPostsCard {...props} />}

          {showLatest && (
            <div className='heo-aside-card wow fadeInUp rounded-xl bg-[var(--heo-color-card)] p-3 dark:bg-[var(--heo-color-card-dark)]'>
              <LatestPostsGroupMini {...props} />
            </div>
          )}

          {rightAreaSlot}

          {sortedTags.length > 0 && (
            <div className='heo-aside-card wow fadeInUp rounded-xl bg-[var(--heo-color-card)] p-3 dark:bg-[var(--heo-color-card-dark)] dark:text-white'>
              <TagGroups tags={sortedTags} max={tagLimit} />
            </div>
          )}

          <div className='heo-aside-card wow fadeInUp rounded-xl bg-[var(--heo-color-card)] p-3 dark:bg-[var(--heo-color-card-dark)] dark:text-white'>
            <AnalyticsCard {...props} />
          </div>

          <FaceBookPage />
          <Live2D />
        </div>
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
