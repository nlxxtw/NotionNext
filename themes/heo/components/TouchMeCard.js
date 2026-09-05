import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'

const SUBSCRIBE_GREEN =
  'linear-gradient(135deg, #3ddc5a 0%, #22c43e 55%, #1db954 100%)'

/**
 * 侧栏公众号订阅条（非首页；首页用英雄区订阅，避免重复）
 */
export default function TouchMeCard() {
  const enabled = parseBool(siteConfig('HEO_SOCIAL_CARD', true, CONFIG))
  if (!enabled) return null

  const title =
    siteConfig('HEO_SOCIAL_CARD_TITLE_1', null, CONFIG) || '公众号订阅'
  const href =
    siteConfig('HEO_HERO_SUBSCRIBE_URL', null, CONFIG) ||
    siteConfig('HEO_SOCIAL_CARD_URL', null, CONFIG) ||
    '/rss'
  const color = siteConfig('HEO_HERO_SUBSCRIBE_COLOR', SUBSCRIBE_GREEN, CONFIG)
  const icon = siteConfig('HEO_HERO_SUBSCRIBE_ICON', 'fab fa-weixin', CONFIG)
  const style = String(color).includes('gradient')
    ? { backgroundImage: color }
    : { backgroundColor: color || '#22c43e' }

  return (
    <SmartLink
      href={href}
      className='group flex h-[54px] w-full items-center justify-between rounded-[18px] px-4 text-white shadow-[var(--heo-shadow-border)] transition hover:brightness-105'
      style={style}>
      <span className='flex items-center gap-2.5 text-[15px] font-bold'>
        <i className={`${icon} text-lg`} />
        {title === '交流频道' ? '公众号订阅' : title}
      </span>
      <span className='flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white transition group-hover:translate-x-0.5'>
        <i className='fas fa-arrow-right text-sm' />
      </span>
    </SmartLink>
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
