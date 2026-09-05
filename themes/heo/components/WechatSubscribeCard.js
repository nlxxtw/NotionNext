import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/** 对齐 blog.zhheo.com #card-wechat 绿色订阅条 */
export const HEO_WECHAT_GRADIENT =
  'linear-gradient(135deg, #a2d662 0%, #56ab2f 100%)'

/**
 * 公众号订阅条（Heo 同款：浅绿→深绿 + 三瓣图标 + 右侧圆箭头）
 */
export default function WechatSubscribeCard({
  className = '',
  title,
  href,
  color
} = {}) {
  const text =
    title ||
    siteConfig('HEO_HERO_SUBSCRIBE_TITLE', null, CONFIG) ||
    siteConfig('HEO_SOCIAL_CARD_TITLE_1', null, CONFIG) ||
    '公众号订阅'
  const link =
    href ||
    siteConfig('HEO_HERO_SUBSCRIBE_URL', null, CONFIG) ||
    siteConfig('HEO_SOCIAL_CARD_URL', null, CONFIG) ||
    '/rss'
  const bg =
    color ||
    siteConfig('HEO_HERO_SUBSCRIBE_COLOR', HEO_WECHAT_GRADIENT, CONFIG) ||
    HEO_WECHAT_GRADIENT
  const style = String(bg).includes('gradient')
    ? { backgroundImage: bg }
    : { backgroundColor: bg }

  return (
    <SmartLink
      id='heo-wechat-card'
      href={link}
      className={`heo-wechat-card group ${className}`}
      style={style}>
      <div className='heo-wechat-card-left'>
        <WechatMarkIcon className='heo-wechat-card-icon' />
        <span className='heo-wechat-card-text'>
          {text === '交流频道' ? '公众号订阅' : text}
        </span>
      </div>
      <span className='heo-wechat-card-arrow' aria-hidden>
        <i className='fas fa-arrow-right' />
      </span>
    </SmartLink>
  )
}

function WechatMarkIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox='0 0 120 116'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'>
      <g fill='currentColor'>
        <path d='M47.5360966,2.11813832 C82.1030966,-8.42086168 99.7190966,23.7951383 99.7190966,23.7951383 C93.3530966,20.3221383 74.2520966,16.4641383 53.8020966,27.0751383 C33.3520966,37.6861383 29.1070966,60.8391383 29.1070966,60.8391383 C20.7940966,51.9691383 20.4170966,37.6691383 20.4170966,37.6691383 C21.4000966,10.8301383 47.5360966,2.11813832 47.5360966,2.11813832 Z' />
        <path d='M36.8570966,112.563138 C-13.1669034,102.868138 -1.78590339,59.1671383 10.7210966,39.9161383 C10.7210966,39.9161383 10.1580966,66.8951383 36.1550966,81.7911383 C36.1550966,81.7911383 39.2460966,83.1961383 38.2630966,87.6921383 L37.2790966,93.4531383 C37.2790966,93.4531383 35.9790966,97.3881383 38.4560966,97.8091383 C38.4560966,97.8091383 39.2470966,97.8091383 41.0730966,96.5441383 L50.6290966,90.2211383 C50.6290966,90.2211383 52.5960966,88.8161383 55.1250966,89.2371383 C57.6540966,89.6591383 73.8140966,93.8751383 89.8330966,80.5261383 C89.8320966,80.5261383 86.8820966,122.259138 36.8570966,112.563138 Z' />
        <path d='M87.0220966,108.770138 C90.2540966,107.225138 105.992097,88.6751383 98.5430966,63.5231383 C91.0940966,38.3711383 65.8030966,32.7501383 65.8030966,32.7501383 C78.7310966,27.2701383 93.9070966,31.3441383 93.9070966,31.3441383 C116.952097,38.0891383 119.622097,60.0111383 119.622097,60.0111383 C124.118097,99.2141383 87.0220966,108.770138 87.0220966,108.770138 L87.0220966,108.770138 Z' />
      </g>
    </svg>
  )
}
