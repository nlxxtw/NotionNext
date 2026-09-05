import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

/**
 * 右下角欢迎挂件：横向气泡 + 狗头图
 * 首页滑到底隐藏，往上滑再悬浮显示
 */
export default function WelcomeMascot() {
  const enabled = parseBool(siteConfig('HEO_MASCOT_ENABLE', true, CONFIG))
  const defaultImg = 'https://bu.dusays.com/2023/08/24/64e6ce9c507bb.png'
  const rawImg = String(
    siteConfig('HEO_MASCOT_IMG', defaultImg, CONFIG) || defaultImg
  ).trim()
  // 空 / 旧白底 png → 用默认狗头图
  const imgSrc =
    !rawImg ||
    /\/images\/heo-mascot\.png$/i.test(rawImg) ||
    rawImg === '/images/heo-mascot.png'
      ? defaultImg
      : rawImg
  const useCustomImg = Boolean(imgSrc)

  const size = Math.max(
    64,
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
          className='heo-mascot-3d block select-none bg-transparent p-0'>
          {useCustomImg ? (
            <img
              src={imgSrc}
              alt='欢迎挂件'
              width={size}
              height={size}
              className='heo-mascot-img h-auto w-auto bg-transparent object-contain drop-shadow-[0_10px_16px_rgba(40,50,90,0.28)]'
              style={{ width: size, height: 'auto', maxHeight: size + 16 }}
            />
          ) : (
            <MascotDogSvg
              className='heo-mascot-img'
              style={{ width: size, height: size }}
            />
          )}
        </button>

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

/** 透明背景矢量小狗（无白底方块） */
function MascotDogSvg({ className = '', style }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox='0 0 120 120'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden
      role='img'>
      <title>欢迎挂件</title>
      {/* 阴影 */}
      <ellipse cx='60' cy='108' rx='28' ry='6' fill='rgba(0,0,0,0.18)' />
      {/* 身体 */}
      <ellipse cx='60' cy='78' rx='32' ry='26' fill='#F5E6D3' />
      {/* 头 */}
      <circle cx='60' cy='48' r='30' fill='#F8ECDD' />
      {/* 耳朵 */}
      <ellipse
        cx='32'
        cy='42'
        rx='14'
        ry='20'
        fill='#E8C9A8'
        transform='rotate(-18 32 42)'
      />
      <ellipse
        cx='88'
        cy='42'
        rx='14'
        ry='20'
        fill='#E8C9A8'
        transform='rotate(18 88 42)'
      />
      <ellipse
        cx='32'
        cy='44'
        rx='7'
        ry='11'
        fill='#D4A574'
        transform='rotate(-18 32 44)'
      />
      <ellipse
        cx='88'
        cy='44'
        rx='7'
        ry='11'
        fill='#D4A574'
        transform='rotate(18 88 44)'
      />
      {/* 脸斑 */}
      <ellipse cx='42' cy='55' rx='10' ry='8' fill='#FFE4EC' opacity='0.9' />
      <ellipse cx='78' cy='55' rx='10' ry='8' fill='#FFE4EC' opacity='0.9' />
      {/* 眼睛 */}
      <circle cx='48' cy='46' r='4.2' fill='#2C2A28' />
      <circle cx='72' cy='46' r='4.2' fill='#2C2A28' />
      <circle cx='49.2' cy='44.8' r='1.4' fill='#fff' />
      <circle cx='73.2' cy='44.8' r='1.4' fill='#fff' />
      {/* 鼻子嘴巴 */}
      <ellipse cx='60' cy='56' rx='5' ry='3.8' fill='#2C2A28' />
      <path
        d='M54 60 Q60 66 66 60'
        fill='none'
        stroke='#2C2A28'
        strokeWidth='2'
        strokeLinecap='round'
      />
      {/* 前爪 */}
      <ellipse cx='46' cy='92' rx='9' ry='7' fill='#F8ECDD' />
      <ellipse cx='74' cy='92' rx='9' ry='7' fill='#F8ECDD' />
      {/* 项圈 */}
      <path
        d='M38 68 Q60 78 82 68'
        fill='none'
        stroke='#E85D4C'
        strokeWidth='4'
        strokeLinecap='round'
      />
      <circle cx='60' cy='74' r='4' fill='#FFD666' />
    </svg>
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
