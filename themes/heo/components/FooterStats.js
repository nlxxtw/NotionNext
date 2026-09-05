import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

/**
 * 页脚统计：两栏左右对齐（标签+数值），无中间分隔线
 */
export default function FooterStats({ compact = false }) {
  const enabled = siteConfig('HEO_FOOTER_STATS_ENABLE', true, CONFIG)
  const [visitorLabel, setVisitorLabel] = useState('')
  const [pvText, setPvText] = useState('')

  useEffect(() => {
    if (!enabled) return
    let cancelled = false

    const loadVisitor = async () => {
      try {
        const res = await fetch('/api/visitor', { method: 'GET' })
        if (!res.ok) return
        const data = await res.json()
        const label =
          data?.lastVisitor?.label || data?.current?.label || ''
        if (!cancelled && label) setVisitorLabel(label)
      } catch {
        // ignore
      }
    }

    loadVisitor()

    const formatPv = () => {
      const el =
        document.querySelector('#heo-footer-stats .busuanzi_value_site_pv') ||
        document.querySelector('.busuanzi_value_site_pv')
      if (!el) return
      const raw = (el.textContent || '').replace(/[,\s]/g, '').trim()
      if (!raw || !/^\d+$/.test(raw)) return
      const n = Number(raw)
      if (!Number.isFinite(n) || n <= 0) return
      if (!cancelled) setPvText(formatViews(n))
    }

    formatPv()
    const t = window.setInterval(formatPv, 800)
    const stop = window.setTimeout(() => window.clearInterval(t), 12000)

    return () => {
      cancelled = true
      window.clearInterval(t)
      window.clearTimeout(stop)
    }
  }, [enabled])

  if (!enabled) return null

  const pvNode = pvText ? (
    <span className='font-extrabold tabular-nums text-gray-800 dark:text-gray-100'>
      {pvText}
    </span>
  ) : (
    <span className='busuanzi_container_site_pv font-extrabold text-gray-800 dark:text-gray-100'>
      <span className='busuanzi_value_site_pv tabular-nums' />
    </span>
  )

  if (compact) {
    return (
      <div
        id='heo-footer-stats'
        className='grid w-full max-w-[280px] grid-cols-2 gap-x-5 gap-y-0.5 text-left'>
        <div className='min-w-0'>
          <div className='inline-flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500'>
            <i
              className='fas fa-eye text-[10px] text-[var(--heo-color-primary)] dark:text-[var(--heo-color-accent)]'
              aria-hidden
            />
            总浏览
          </div>
          <div className='mt-0.5 truncate text-[13px] leading-5'>{pvNode}</div>
        </div>
        <div className='min-w-0'>
          <div className='inline-flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500'>
            <i
              className='fas fa-location-dot text-[10px] text-amber-500'
              aria-hidden
            />
            访客来自
          </div>
          <div className='mt-0.5 truncate text-[13px] font-extrabold leading-5 text-gray-800 dark:text-gray-100'>
            {visitorLabel || '定位中…'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      id='heo-footer-stats'
      className='border-t border-black/[0.04] bg-white px-4 py-5 dark:border-white/10 dark:bg-[#1a191d]'>
      <div className='mx-auto grid max-w-6xl grid-cols-2 gap-6'>
        <div className='min-w-0'>
          <div className='text-[11px] text-gray-400'>总浏览量</div>
          <div className='mt-1 text-[16px]'>{pvNode}</div>
        </div>
        <div className='min-w-0'>
          <div className='text-[11px] text-gray-400'>最近访客来自</div>
          <div className='mt-1 truncate text-[16px] font-extrabold text-gray-800 dark:text-gray-100'>
            {visitorLabel || '定位中…'}
          </div>
        </div>
      </div>
    </div>
  )
}

function formatViews(n) {
  if (n >= 100000000) {
    return `${(n / 100000000).toFixed(n % 100000000 === 0 ? 0 : 1)}亿`
  }
  if (n >= 10000) {
    const v = n / 10000
    return `${v >= 100 ? Math.round(v) : v.toFixed(1)}万`
  }
  return n.toLocaleString('zh-CN')
}
