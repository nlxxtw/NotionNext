import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

/**
 * 页脚统计：总浏览量 + 最近访客
 * compact：右下角小条；默认大卡片（已不再单独占一整行）
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

  if (compact) {
    return (
      <div
        id='heo-footer-stats'
        className='inline-flex max-w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-black/[0.05] bg-white/80 px-3 py-1.5 text-[12px] text-gray-500 shadow-[0_6px_18px_-14px_rgba(40,50,90,0.35)] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.06] dark:text-gray-400'>
        <span className='inline-flex min-w-0 items-center gap-1.5'>
          <i
            className='fas fa-eye text-[11px] text-[var(--heo-color-primary)] dark:text-[var(--heo-color-accent)]'
            aria-hidden
          />
          <span className='shrink-0 text-gray-400 dark:text-gray-500'>
            总浏览
          </span>
          {pvText ? (
            <span className='font-bold tabular-nums text-gray-700 dark:text-gray-200'>
              {pvText}
            </span>
          ) : (
            <span className='busuanzi_container_site_pv font-bold text-gray-700 dark:text-gray-200'>
              <span className='busuanzi_value_site_pv tabular-nums' />
            </span>
          )}
        </span>
        <span className='h-3 w-px shrink-0 bg-black/10 dark:bg-white/15' aria-hidden />
        <span className='inline-flex min-w-0 items-center gap-1.5'>
          <i
            className='fas fa-location-dot text-[11px] text-amber-500'
            aria-hidden
          />
          <span className='shrink-0 text-gray-400 dark:text-gray-500'>
            访客
          </span>
          <span className='truncate font-bold text-gray-700 dark:text-gray-200'>
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
      <div className='mx-auto max-w-6xl'>
        <div className='relative overflow-hidden rounded-2xl border border-black/[0.05] bg-gradient-to-br from-[#f7f9fe] via-white to-[#eef2ff]/70 shadow-[0_12px_36px_-24px_rgba(40,50,90,0.55)] dark:border-white/10 dark:from-[#24242a] dark:via-[#1e1e24] dark:to-[#1a191d]'>
          <div className='relative flex flex-col divide-y divide-black/[0.05] sm:flex-row sm:divide-x sm:divide-y-0 dark:divide-white/10'>
            <div className='flex min-h-[64px] flex-1 items-center gap-3 px-4 py-3'>
              <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--heo-color-primary)]/12 text-[var(--heo-color-primary)] dark:bg-[var(--heo-color-primary)]/20 dark:text-[var(--heo-color-accent)]'>
                <i className='fas fa-eye text-[13px]' aria-hidden />
              </div>
              <div className='min-w-0'>
                <div className='text-[11px] text-gray-400'>总浏览量</div>
                <div className='mt-1 text-[16px] font-extrabold text-gray-800 dark:text-gray-100'>
                  {pvText || (
                    <span className='busuanzi_container_site_pv'>
                      <span className='busuanzi_value_site_pv' />
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className='flex min-h-[64px] flex-[1.35] items-center gap-3 px-4 py-3'>
              <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300'>
                <i className='fas fa-location-dot text-[13px]' aria-hidden />
              </div>
              <div className='min-w-0'>
                <div className='text-[11px] text-gray-400'>最近访客来自</div>
                <div className='mt-1 truncate text-[16px] font-extrabold text-gray-800 dark:text-gray-100'>
                  {visitorLabel || '定位中…'}
                </div>
              </div>
            </div>
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
