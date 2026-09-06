import { siteConfig } from '@/lib/config'
import { useLayoutEffect } from 'react'
import CONFIG from '../config'
import {
  buildHeoThemeStyleCss,
  extractDominantColorFromUrl,
  fetchCoverColorFromApi,
  normalizeHex,
  resolveInstantCoverColor,
  resolvePostCoverColor,
  setCachedCoverColor,
  tuneCoverColor
} from '../lib/coverColor'

const STYLE_ID = 'heo-post-cover-theme'

/**
 * 文章页：根据封面主色动态改主题色
 * - 优先同步应用「手动色 / 本地缓存」，避免先闪默认紫再跳变
 * - 再异步精取并回写缓存
 */
export default function PostCoverTheme({ post }) {
  useLayoutEffect(() => {
    const enabled = parseBool(
      siteConfig('HEO_POST_COVER_COLOR', true, CONFIG)
    )
    if (!enabled || !post) {
      clearTheme()
      return undefined
    }

    let cancelled = false
    const cover =
      post?.pageCover ||
      post?.pageCoverThumbnail ||
      post?.page_cover ||
      ''

    // 同步瞬时色：不走默认主题紫
    const instant = resolveInstantCoverColor(post)
    if (instant) {
      injectTheme(instant)
      dispatchReady(instant)
    }

    async function refine() {
      let hex = resolvePostCoverColor(post)

      if (!hex && cover) {
        const apiSuffix = siteConfig('HEO_POST_COVER_COLOR_API', '', CONFIG)
        if (apiSuffix) {
          try {
            hex = await fetchCoverColorFromApi(cover, apiSuffix)
          } catch {
            /* ignore */
          }
        }
      }

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
      const color = tuneCoverColor(normalizeHex(hex))
      if (!color) {
        // 没有取到色时：若已有瞬时色就保持；否则不套默认紫
        if (!instant) clearTheme()
        return
      }

      setCachedCoverColor(cover, color)
      // 与瞬时色相同则不必重绘，减少二次跳变
      if (color.toLowerCase() === String(instant || '').toLowerCase()) return
      injectTheme(color)
      dispatchReady(color)
    }

    refine()

    return () => {
      cancelled = true
      // 离开文章页才清；切文章时留给下一次 layout 覆盖，避免回闪默认紫
      if (!post) clearTheme()
    }
  }, [
    post?.id,
    post?.pageCover,
    post?.pageCoverThumbnail,
    post?.coverColor,
    post?.themeColor
  ])

  // 真正离开文章（post 变空）时清理
  useLayoutEffect(() => {
    if (post) return undefined
    clearTheme()
    return undefined
  }, [post])

  return null
}

function dispatchReady(color) {
  try {
    window.dispatchEvent(
      new CustomEvent('heo-cover-theme-ready', { detail: { color } })
    )
  } catch {
    /* ignore */
  }
}

function injectTheme(hex) {
  const color = tuneCoverColor(normalizeHex(hex))
  if (!color) return
  const root = document.getElementById('theme-heo')
  if (root) root.classList.add('heo-cover-theme')

  let style = document.getElementById(STYLE_ID)
  if (!style) {
    style = document.createElement('style')
    style.id = STYLE_ID
    document.head.appendChild(style)
  }
  style.textContent = buildHeoThemeStyleCss(color)

  const meta =
    document.querySelector('meta[name="theme-color"]') ||
    (() => {
      const m = document.createElement('meta')
      m.setAttribute('name', 'theme-color')
      document.head.appendChild(m)
      return m
    })()
  meta.setAttribute('content', color)
  meta.dataset.heoCoverTheme = '1'
}

function clearTheme() {
  const root = document.getElementById('theme-heo')
  if (root) root.classList.remove('heo-cover-theme')
  document.getElementById(STYLE_ID)?.remove()
  const meta = document.querySelector(
    'meta[name="theme-color"][data-heo-cover-theme]'
  )
  if (meta) {
    meta.removeAttribute('data-heo-cover-theme')
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
