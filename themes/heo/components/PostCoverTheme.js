import { siteConfig } from '@/lib/config'
import { useEffect } from 'react'
import CONFIG from '../config'
import {
  buildHeoThemeStyleCss,
  extractDominantColorFromUrl,
  fetchCoverColorFromApi,
  normalizeHex,
  resolvePostCoverColor,
  tuneCoverColor
} from '../lib/coverColor'

const STYLE_ID = 'heo-post-cover-theme'

/**
 * 文章页：根据封面主色动态改主题色（对齐 Heo coverColor）
 * 优先级：Notion 手动色 > 图床 API > 浏览器采样
 */
export default function PostCoverTheme({ post }) {
  useEffect(() => {
    const enabled = parseBool(
      siteConfig('HEO_POST_COVER_COLOR', true, CONFIG)
    )
    if (!enabled || !post) {
      clearTheme()
      return undefined
    }

    let cancelled = false

    async function apply() {
      const manual = resolvePostCoverColor(post)
      let hex = manual

      const cover =
        post?.pageCover ||
        post?.pageCoverThumbnail ||
        post?.page_cover ||
        ''

      if (!hex && cover) {
        const apiSuffix = siteConfig(
          'HEO_POST_COVER_COLOR_API',
          '',
          CONFIG
        )
        if (apiSuffix) {
          try {
            hex = await fetchCoverColorFromApi(cover, apiSuffix)
          } catch {
            /* ignore */
          }
        }
      }

      // 优先走同源 API（sharp），规避图床 CORS
      if (!hex && cover) {
        try {
          const endpoint = `/api/cover-color?url=${encodeURIComponent(cover)}`
          const res = await fetch(endpoint)
          if (res.ok) {
            const data = await res.json()
            hex = data?.color
          }
        } catch {
          /* ignore */
        }
      }

      if (!hex && cover) {
        try {
          hex = await extractDominantColorFromUrl(cover)
        } catch {
          try {
            const bare = cover.split('?')[0]
            if (bare !== cover) {
              hex = await extractDominantColorFromUrl(bare)
            }
          } catch {
            /* ignore */
          }
        }
      }

      if (cancelled) return
      hex = tuneCoverColor(normalizeHex(hex))
      if (!hex) {
        clearTheme()
        return
      }
      injectTheme(hex)
    }

    // 不阻塞首屏：空闲后再取色
    const schedule =
      typeof window !== 'undefined' && window.requestIdleCallback
        ? cb => window.requestIdleCallback(cb, { timeout: 1200 })
        : cb => setTimeout(cb, 200)
    const cancel =
      typeof window !== 'undefined' && window.cancelIdleCallback
        ? id => window.cancelIdleCallback(id)
        : id => clearTimeout(id)

    const idleId = schedule(() => {
      apply()
    })
    return () => {
      cancelled = true
      cancel(idleId)
      clearTheme()
    }
  }, [
    post?.id,
    post?.pageCover,
    post?.pageCoverThumbnail,
    post?.coverColor,
    post?.themeColor
  ])

  return null
}

function injectTheme(hex) {
  const root = document.getElementById('theme-heo')
  if (root) root.classList.add('heo-cover-theme')

  let style = document.getElementById(STYLE_ID)
  if (!style) {
    style = document.createElement('style')
    style.id = STYLE_ID
    document.head.appendChild(style)
  }
  style.textContent = buildHeoThemeStyleCss(hex)

  const meta =
    document.querySelector('meta[name="theme-color"]') ||
    (() => {
      const m = document.createElement('meta')
      m.setAttribute('name', 'theme-color')
      document.head.appendChild(m)
      return m
    })()
  meta.setAttribute('content', hex)
  meta.dataset.heoCoverTheme = '1'
}

function clearTheme() {
  const root = document.getElementById('theme-heo')
  if (root) root.classList.remove('heo-cover-theme')
  document.getElementById(STYLE_ID)?.remove()
  const meta = document.querySelector('meta[name="theme-color"][data-heo-cover-theme]')
  if (meta) {
    meta.removeAttribute('data-heo-cover-theme')
    // 恢复站点默认主色
    const fallback =
      siteConfig('HEO_COLOR_PRIMARY', null, CONFIG) || '#7a5dfa'
    meta.setAttribute('content', fallback)
  }
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
