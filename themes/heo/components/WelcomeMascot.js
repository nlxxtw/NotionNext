import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

/**
 * 右下角欢迎挂件：横向气泡 + 轻 3D 浮动图
 * 首页滑到底隐藏，往上滑再悬浮显示
 */
export default function WelcomeMascot() {
  const enabled = parseBool(siteConfig('HEO_MASCOT_ENABLE', true, CONFIG))
  const img =
    siteConfig('HEO_MASCOT_IMG', '/images/heo-mascot.png', CONFIG) ||
    '/images/heo-mascot.png'
  const size = Math.max(
    56,
    Number(siteConfig('HEO_MASCOT_SIZE', 88, CONFIG)) || 88
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

    const tipKey = 'heo-mascot-welcome-shown'
    const already =
      typeof window !== 'undefined' && sessionStorage.getItem(tipKey)

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
      setVisible(distanceToBottom >= 120)
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
      <div className='pointer-events-auto relative flex flex-row-reverse items-end gap-2'>
        <button
          type='button'
          aria-label={welcome || '欢迎挂件'}
          onClick={() => {
            if (welcome) {
              setShowTip(true)
              window.setTimeout(() => setShowTip(false), tipMs)
            }
          }}
          className='heo-mascot-3d block select-none'>
          <LazyImage
            src={img}
            alt='欢迎挂件'
            width={size}
            height={size}
            className='heo-mascot-img h-auto w-auto object-contain'
            style={{ width: size, height: 'auto', maxHeight: size + 12 }}
          />
        </button>

        {/* 横向气泡，避免竖排压扁 */}
        <div
          className={`heo-mascot-tip mb-6 max-w-[14rem] origin-bottom-right transition-all duration-500 sm:max-w-[16rem] ${
            showTip && welcome
              ? 'translate-y-0 scale-100 opacity-100'
              : 'pointer-events-none translate-y-2 scale-95 opacity-0'
          }`}>
          <div
            className='rounded-2xl border border-black/[0.06] bg-white px-3.5 py-2.5 text-[13px] font-semibold leading-relaxed tracking-normal text-gray-700 shadow-[0_14px_32px_-14px_rgba(40,50,90,0.5)] dark:border-white/10 dark:bg-[#2a2b31] dark:text-gray-100'
            style={{
              writingMode: 'horizontal-tb',
              whiteSpace: 'normal',
              wordBreak: 'keep-all'
            }}>
            {welcome}
          </div>
        </div>
      </div>
    </div>
  )
}

function buildWelcome(geo) {
  if (!geo) return '欢迎远道而来的友友！'
  const province = cleanPlace(geo.province)
  const city = cleanPlace(geo.city)
  const country = cleanPlace(geo.country)

  const p = stripAdminSuffix(province)
  const c = stripAdminSuffix(city)

  let place = ''
  if (p && c) {
    if (p === c || p.includes(c) || c.includes(p)) {
      place = p.length >= c.length ? p : c
    } else {
      place = `${p}${c}`
    }
  } else if (p) {
    place = p
  } else if (c) {
    place = c
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

function stripAdminSuffix(s) {
  if (!s) return ''
  return (
    s
      .replace(
        /(特别行政区|自治区|壮族|回族|维吾尔|省|市|地区|都|县|州)$/g,
        ''
      )
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
