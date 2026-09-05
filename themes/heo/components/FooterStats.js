import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

/**
 * 页脚统计：与快捷链接左对齐；总浏览走服务端代理，避免不蒜子直连失败
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
        const label = data?.lastVisitor?.label || data?.current?.label || ''
        if (!cancelled && label) setVisitorLabel(label)
      } catch {
        // ignore
      }
    }

    const applyPv = n => {
      if (!Number.isFinite(n) || n < 0 || cancelled) return false
      setPvText(formatViews(n))
      return true
    }

    const loadPvApi = async () => {
      try {
        const res = await fetch('/api/busuanzi', { method: 'GET' })
        if (!res.ok) return false
        const data = await res.json()
        if (data?.ok && data.site_pv != null) {
          return applyPv(Number(data.site_pv))
        }
      } catch {
        // ignore
      }
      return false
    }

    const readDomPv = () => {
      const nodes = document.querySelectorAll('.busuanzi_value_site_pv')
      for (const el of nodes) {
        const raw = (el.textContent || '').replace(/[,\s]/g, '').trim()
        if (!raw || !/^\d+$/.test(raw)) continue
        if (applyPv(Number(raw))) return true
      }
      return false
    }

    const onReady = e => {
      applyPv(Number(e?.detail?.site_pv))
    }

    loadVisitor()
    loadPvApi().then(ok => {
      if (!ok && !cancelled) readDomPv()
    })

    window.addEventListener('heo-busuanzi-ready', onReady)
    const t = window.setInterval(() => {
      if (!cancelled) readDomPv()
    }, 800)
    const stop = window.setTimeout(() => window.clearInterval(t), 20000)

    return () => {
      cancelled = true
      window.removeEventListener('heo-busuanzi-ready', onReady)
      window.clearInterval(t)
      window.clearTimeout(stop)
    }
  }, [enabled])

  if (!enabled) return null

  const pvDisplay = pvText || '—'

  if (compact) {
    return (
      <div
        id='heo-footer-stats'
        className='flex w-full flex-wrap items-center gap-x-5 gap-y-1 text-[13px] leading-5 text-gray-600 dark:text-gray-300'>
        <span className='inline-flex items-center gap-1.5 whitespace-nowrap'>
          <i
            className='fas fa-eye text-[11px] text-[var(--heo-color-primary)] dark:text-[var(--heo-color-accent)]'
            aria-hidden
          />
          <span className='text-gray-400 dark:text-gray-500'>总浏览</span>
          <span className='tabular-nums text-gray-700 dark:text-gray-200'>
            {pvDisplay}
          </span>
          {/* 隐藏节点供不蒜子脚本回填 */}
          <span className='busuanzi_container_site_pv sr-only'>
            <span className='busuanzi_value_site_pv' />
          </span>
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
          <span className='tabular-nums text-gray-800 dark:text-gray-100'>
            {pvDisplay}
          </span>
          <span className='busuanzi_container_site_pv sr-only'>
            <span className='busuanzi_value_site_pv' />
          </span>
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
