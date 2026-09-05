import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import WechatSubscribeCard from './WechatSubscribeCard'

/**
 * 侧栏公众号订阅条（非首页；首页用英雄区订阅，避免重复）
 */
export default function TouchMeCard() {
  const enabled = parseBool(siteConfig('HEO_SOCIAL_CARD', true, CONFIG))
  if (!enabled) return null
  return <WechatSubscribeCard className='w-full' />
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
