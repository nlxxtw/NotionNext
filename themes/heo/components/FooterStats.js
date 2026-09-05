import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

/**
 * 页脚统计：单行「标签 + 结果」，不加粗
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

    const readPv = () => {
      const nodes = document.querySelectorAll('.busuanzi_value_site_pv')
      for (const el of nodes) {
        const raw = (el.textContent || '').replace(/[,\s]/g, '').trim()
        if (!raw || !/^\d+$/.test(raw)) continue
        const n = Number(raw)
        if (!Number.isFinite(n) || n <= 0) continue
        if (!cancelled) setPvText(formatViews(n))
        return true
      }
      return false
    }

    readPv()
    const t = window.setInterval(readPv, 600)
    const stop = window.setTimeout(() => window.clearInterval(t), 20000)

    return () => {
      cancelled = true
      window.clearInterval(t)
      window.clearTimeout(stop)
    }
  }, [enabled])

  if (!enabled) return null

  const pvDisplay = pvText || null

  if (compact) {
    return (
      <div
        id='heo-footer-stats'
        className='flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] leading-5 text-gray-600 dark:text-gray-300'>
        <span className='inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap'>
          <i
            className='fas fa-eye text-[11px] text-[var(--heo-color-primary)] dark:text-[var(--heo-color-accent)]'
            aria-hidden
          />
          <span className='text-gray-400 dark:text-gray-500'>总浏览</span>
          {pvDisplay ? (
            <span className='tabular-nums text-gray-700 dark:text-gray-200'>
              {pvDisplay}
            </span>
          ) : (
            <span className='busuanzi_container_site_pv tabular-nums text-gray-700 dark:text-gray-200'>
              <span className='busuanzi_value_site_pv' />
            </span>
          )}
        </span>
        <span className='inline-flex min-w-0 max-w-full items-center gap-1.5'>
          <i
            className='fas fa-location-dot shrink-0 text-[11px] text-amber-500'
            aria-hidden
          />
          <span className='shrink-0 text-gray-400 dark:text-gray-500'>
            访客来自
          </span>
          <span className='truncate font-normal text-gray-700 dark:text-gray-200'>
            {visitorLabel || '定位中…'}
          </span>
        </span>
      </div>
    )
  }

  return (
    <div
      id='heo-footer-stats'
      className='border-t border-black/[0.04] bg-white px-4 py-5 dark:border-white/10 dark:bg-[#1a191d]'>
      <div className='mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 text-[14px]'>
        <span className='inline-flex items-center gap-2'>
          <span className='text-gray-400'>总浏览量</span>
          {pvDisplay ? (
            <span className='tabular-nums text-gray-800 dark:text-gray-100'>
              {pvDisplay}
            </span>
          ) : (
            <span className='busuanzi_container_site_pv tabular-nums text-gray-800 dark:text-gray-100'>
              <span className='busuanzi_value_site_pv' />
            </span>
          )}
        </span>
        <span className='inline-flex min-w-0 items-center gap-2'>
          <span className='shrink-0 text-gray-400'>最近访客来自</span>
          <span className='truncate font-normal text-gray-800 dark:text-gray-100'>
            {visitorLabel || '定位中…'}
          </span>
        </span>
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
