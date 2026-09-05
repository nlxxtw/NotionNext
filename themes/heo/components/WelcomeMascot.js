import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

/**
 * 右下角欢迎挂件：小图 + 省市欢迎语（自动消失）
 * 首页滑到底隐藏，往上滑再悬浮显示
 */
export default function WelcomeMascot() {
  const enabled = parseBool(siteConfig('HEO_MASCOT_ENABLE', true, CONFIG))
  const img =
    siteConfig('HEO_MASCOT_IMG', '/images/heo-mascot.png', CONFIG) ||
    '/images/heo-mascot.png'
  const size = Math.max(
    48,
    Number(siteConfig('HEO_MASCOT_SIZE', 72, CONFIG)) || 72
  )
  const tipMs = Math.max(
    2000,
    Number(siteConfig('HEO_MASCOT_TIP_MS', 5200, CONFIG)) || 5200
  )
  const bottomOffset = siteConfig('HEO_MASCOT_BOTTOM', '5.5rem', CONFIG)
  const rightOffset = siteConfig('HEO_MASCOT_RIGHT', '1.25rem', CONFIG)

  const router = useRouter()
  const [welcome, setWelcome] = useState('')
  const [showTip, setShowTip] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    let tipTimer

    // 每个会话只自动弹出一次欢迎语
    const tipKey = 'heo-mascot-welcome-shown'
    const already = typeof window !== 'undefined' && sessionStorage.getItem(tipKey)

    ;(async () => {
      try {
        const res = await fetch('/api/visitor')
        if (!res.ok) throw new Error('visitor failed')
        const data = await res.json()
        const geo = data?.current || data?.lastVisitor || null
        const text = buildWelcome(geo)
        if (cancelled || !text) return
        setWelcome(text)
        if (!already) {
          setShowTip(true)
          sessionStorage.setItem(tipKey, '1')
          tipTimer = window.setTimeout(() => {
            if (!cancelled) setShowTip(false)
          }, tipMs)
        }
      } catch {
        if (cancelled) return
        const text = '欢迎远道而来的友友！'
        setWelcome(text)
        if (!already) {
          setShowTip(true)
          sessionStorage.setItem(tipKey, '1')
          tipTimer = window.setTimeout(() => {
            if (!cancelled) setShowTip(false)
          }, tipMs)
        }
      }
    })()

    return () => {
      cancelled = true
      if (tipTimer) window.clearTimeout(tipTimer)
    }
  }, [enabled, tipMs])

  useEffect(() => {
    if (!enabled) return undefined

    const onScroll = () => {
      const doc = document.documentElement
      const scrollTop = window.scrollY || doc.scrollTop || 0
      const viewH = window.innerHeight || doc.clientHeight || 0
      const fullH = Math.max(
        doc.scrollHeight,
        document.body?.scrollHeight || 0
      )
      const distanceToBottom = fullH - (scrollTop + viewH)
      // 接近页脚底部时隐藏；往上离开底部再显示
      const nearBottom = distanceToBottom < 120
      setVisible(!nearBottom)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [enabled, router.asPath])

  if (!enabled) return null

  return (
    <div
      id='heo-welcome-mascot'
      className={`pointer-events-none fixed z-[60] transition-all duration-300 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-6 opacity-0'
      }`}
      style={{
        right: rightOffset,
        bottom: bottomOffset
      }}>
      <div className='pointer-events-auto relative flex items-end justify-end'>
        {/* 欢迎气泡 */}
        <div
          className={`absolute bottom-[72%] right-[88%] z-10 max-w-[11.5rem] origin-bottom-right transition-all duration-500 sm:max-w-[13rem] ${
            showTip && welcome
              ? 'translate-y-0 scale-100 opacity-100'
              : 'pointer-events-none translate-y-2 scale-95 opacity-0'
          }`}>
          <div className='rounded-2xl rounded-br-md border border-black/[0.06] bg-white px-3 py-2 text-[12px] font-semibold leading-snug text-gray-700 shadow-[0_12px_28px_-14px_rgba(40,50,90,0.55)] dark:border-white/10 dark:bg-[#2a2b31] dark:text-gray-100'>
            {welcome}
          </div>
        </div>

        <button
          type='button'
          aria-label={welcome || '欢迎挂件'}
          onClick={() => {
            // 再点一次可重看欢迎语
            if (welcome) {
              setShowTip(true)
              window.setTimeout(() => setShowTip(false), tipMs)
            }
          }}
          className='block select-none transition hover:scale-105 active:scale-95'>
          <LazyImage
            src={img}
            alt='欢迎挂件'
            width={size}
            height={size}
            className='h-auto w-auto object-contain drop-shadow-[0_10px_18px_rgba(40,50,90,0.22)]'
            style={{ width: size, height: 'auto', maxHeight: size + 8 }}
          />
        </button>
      </div>
    </div>
  )
}

function buildWelcome(geo) {
  if (!geo) return '欢迎远道而来的友友！'
  const province = cleanPlace(geo.province)
  const city = cleanPlace(geo.city)
  const country = cleanPlace(geo.country)

  let place = ''
  if (province && city && province !== city) {
    place = `${stripSuffix(province)}${stripSuffix(city)}`
  } else if (province) {
    place = stripSuffix(province)
  } else if (city) {
    place = stripSuffix(city)
  } else if (country && country !== '中国') {
    place = country
  }

  if (!place || place === '本地' || place.includes('开发')) {
    return '欢迎远道而来的友友！'
  }
  return `欢迎${place}来的友友！`
}

function cleanPlace(v) {
  if (!v || typeof v !== 'string') return ''
  const s = v.trim()
  if (!s || s === 'XX' || s === '未知' || /unknown/i.test(s)) return ''
  return s
}

function stripSuffix(s) {
  return (
    s
      .replace(/(特别行政区|自治区|壮族|回族|维吾尔|省|市|地区)$/g, '')
      .trim() || s
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
