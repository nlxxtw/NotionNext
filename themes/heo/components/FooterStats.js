import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

/**
 * 页脚统计条：总浏览量（Busuanzi）+ 最近访客省市
 * 不含「N 人在线」
 */
export default function FooterStats() {
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

  return (
    <div
      id='heo-footer-stats'
      className='border-t border-black/[0.04] bg-white px-4 py-5 dark:border-white/10 dark:bg-[#1a191d]'>
      <div className='mx-auto max-w-6xl'>
        <div className='relative overflow-hidden rounded-2xl border border-black/[0.05] bg-gradient-to-br from-[#f7f9fe] via-white to-[#eef2ff]/70 shadow-[0_12px_36px_-24px_rgba(40,50,90,0.55)] dark:border-white/10 dark:from-[#24242a] dark:via-[#1e1e24] dark:to-[#1a191d]'>
          <div
            aria-hidden
            className='pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[var(--heo-color-primary)]/10 blur-3xl dark:bg-[var(--heo-color-accent)]/10'
          />
          <div className='relative flex flex-col divide-y divide-black/[0.05] sm:flex-row sm:divide-x sm:divide-y-0 dark:divide-white/10'>
            <StatCell
              icon='fas fa-eye'
              label='总浏览量'
              tone='primary'>
              {pvText ? (
                <span className='tabular-nums'>{pvText}</span>
              ) : (
                <>
                  <span className='busuanzi_container_site_pv'>
                    <span className='busuanzi_value_site_pv tabular-nums' />
                  </span>
                  <span className='text-[15px] font-semibold text-gray-300 dark:text-gray-600'>
                    ···
                  </span>
                </>
              )}
            </StatCell>

            <StatCell
              icon='fas fa-location-dot'
              label='最近访客来自'
              tone='accent'
              grow>
              <span className='truncate'>
                {visitorLabel || '定位中…'}
              </span>
            </StatCell>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCell({
  icon,
  label,
  children,
  tone = 'primary',
  grow = false
}) {
  const iconTone =
    tone === 'accent'
      ? 'bg-amber-400/15 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300'
      : 'bg-[var(--heo-color-primary)]/12 text-[var(--heo-color-primary)] dark:bg-[var(--heo-color-primary)]/20 dark:text-[var(--heo-color-accent)]'

  return (
    <div
      className={`flex min-h-[76px] items-center gap-3.5 px-5 py-4 ${
        grow ? 'sm:flex-[1.4]' : 'sm:flex-1'
      }`}>
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconTone}`}>
        <i className={`${icon} text-[15px]`} aria-hidden />
      </div>
      <div className='min-w-0 flex-1'>
        <div className='text-[12px] font-medium leading-none tracking-wide text-gray-400 dark:text-gray-500'>
          {label}
        </div>
        <div className='mt-2 flex min-h-[1.15em] items-center text-[19px] font-extrabold leading-none tracking-tight text-gray-800 dark:text-gray-100'>
          {children}
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
