import busuanzi from '@/lib/plugins/busuanzi'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import { useEffect } from 'react'

let path = ''

/**
 * 不蒜子：先走本站 /api/busuanzi 代理（含重试），失败再 JSONP
 */
export default function Busuanzi() {
  const { theme } = useGlobal()
  const router = useRouter()

  useEffect(() => {
    refresh()
  }, [])

  useEffect(() => {
    if (theme) refresh()
  }, [theme])

  useEffect(() => {
    const onComplete = url => {
      if (url !== path) {
        path = url
        refresh()
      }
    }
    router.events.on('routeChangeComplete', onComplete)
    return () => {
      router.events.off('routeChangeComplete', onComplete)
    }
  }, [router.events])

  return null
}

async function refresh() {
  const ok = await fillFromApi()
  if (!ok) {
    try {
      busuanzi.fetch()
    } catch {
      // ignore
    }
  }
}

async function fillFromApi() {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch('/api/busuanzi', { cache: 'no-store' })
      if (!res.ok) {
        await sleep(350 * (attempt + 1))
        continue
      }
      const data = await res.json()
      // ok 或 stale 缓存都可用
      if (data?.site_pv == null && data?.site_uv == null && data?.page_pv == null) {
        await sleep(350 * (attempt + 1))
        continue
      }

      const map = {
        site_pv: data.site_pv,
        site_uv: data.site_uv,
        page_pv: data.page_pv
      }
      Object.entries(map).forEach(([key, value]) => {
        if (value == null) return
        document.querySelectorAll(`.busuanzi_value_${key}`).forEach(el => {
          el.textContent = String(value)
        })
        document.querySelectorAll(`.busuanzi_container_${key}`).forEach(el => {
          el.style.display = ''
          el.style.visibility = 'visible'
        })
      })
      try {
        if (map.site_pv != null) {
          window.localStorage.setItem(
            'heo_site_pv_cache',
            String(Math.round(Number(map.site_pv)))
          )
        }
      } catch {
        // ignore
      }
      window.dispatchEvent(
        new CustomEvent('heo-busuanzi-ready', { detail: map })
      )
      return map.site_pv != null
    } catch {
      await sleep(350 * (attempt + 1))
    }
  }
  return false
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
