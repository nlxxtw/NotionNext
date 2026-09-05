import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

/**
 * 侧栏公众号订阅条（对齐 zhheo 绿色 wechat 卡）
 */
export default function TouchMeCard() {
  if (!JSON.parse(siteConfig('HEO_SOCIAL_CARD', null, CONFIG))) {
    return <></>
  }

  const title =
    siteConfig('HEO_SOCIAL_CARD_TITLE_1', null, CONFIG) || '公众号订阅'
  const href =
    siteConfig('HEO_HERO_SUBSCRIBE_URL', null, CONFIG) ||
    siteConfig('HEO_SOCIAL_CARD_URL', null, CONFIG) ||
    '/rss'
  const color = siteConfig('HEO_HERO_SUBSCRIBE_COLOR', '#57bd6a', CONFIG)
  const icon = siteConfig('HEO_HERO_SUBSCRIBE_ICON', 'fab fa-weixin', CONFIG)

  return (
    <SmartLink
      href={href}
      className='group flex h-[54px] w-full items-center justify-between rounded-[18px] px-4 text-white shadow-[var(--heo-shadow-border)] transition hover:brightness-105'
      style={{ backgroundColor: color }}>
      <span className='flex items-center gap-2.5 text-[15px] font-bold'>
        <i className={`${icon} text-lg`} />
        {title === '交流频道' ? '公众号订阅' : title}
      </span>
      <span className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-800 transition group-hover:translate-x-0.5'>
        <i className='fas fa-arrow-right text-sm' />
      </span>
    </SmartLink>
  )
}
