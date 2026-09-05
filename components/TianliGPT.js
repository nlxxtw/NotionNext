/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

/**
 * TianliGpt AI 文章摘要 @see https://docs_s.tianli0.top/
 * 对齐老项目：注入 CSS/JS，并在文章路由切换后重新触发
 */
const TianLiGPT = () => {
  const router = useRouter()
  const loadedRef = useRef(false)
  const tianliKey = siteConfig('TianliGPT_KEY')
  const tianliCss = siteConfig('TianliGPT_CSS')
  const tianliJs = siteConfig('TianliGPT_JS')

  useEffect(() => {
    if (!tianliKey) return undefined

    let cancelled = false

    const boot = async () => {
      try {
        if (!loadedRef.current) {
          await loadExternalResource(tianliCss, 'css')
          window.tianliGPT_postSelector = '#notion-article'
          window.tianliGPT_key = tianliKey
          await loadExternalResource(tianliJs, 'js')
          loadedRef.current = true
        } else {
          // SPA 切文章后刷新摘要
          window.tianliGPT_postSelector = '#notion-article'
          window.tianliGPT_key = tianliKey
          if (typeof window.tianliGPT === 'function') {
            window.tianliGPT()
          } else if (typeof window.chuanchuanGPT === 'function') {
            window.chuanchuanGPT()
          } else if (typeof window.pastkingGPT === 'function') {
            window.pastkingGPT()
          } else {
            // 部分脚本挂在自定义名上：尝试重新拉一次脚本
            await loadExternalResource(tianliJs, 'js')
          }
        }
      } catch (e) {
        if (!cancelled) console.error('TianliGPT load failed', e)
      }
    }

    // 等文章 DOM 就绪再注入
    const timer = setTimeout(boot, 400)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [tianliKey, tianliCss, tianliJs, router.asPath])

  if (!tianliKey) {
    return null
  }

  return <></>
}

export default TianLiGPT
