/* eslint-disable camelcase */
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * 文章 AI 摘要（OpenAI 兼容）
 * Notion 可配：AI_SUMMARY_API / AI_SUMMARY_KEY / AI_SUMMARY_MODEL / TianliGPT_KEY
 * 未配置或失败时整块不渲染
 */
export default function TianLiGPT() {
  const router = useRouter()
  const { NOTION_CONFIG } = useGlobal() || {}
  const cfg = useMemo(() => resolveSummaryConfig(NOTION_CONFIG), [NOTION_CONFIG])
  const wordLimit = Number(cfg.wordLimit) || 1000
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const reqRef = useRef(0)
  const pagePath = String(router.asPath || '').split(/[?#]/)[0]

  useEffect(() => {
    if (!cfg.configured) {
      setSummary('')
      setLoading(false)
      return undefined
    }

    let cancelled = false
    const reqId = ++reqRef.current

    const run = async () => {
      const container = await waitForSelector(
        '#article-wrapper #notion-article',
        8000
      )
      if (cancelled || reqId !== reqRef.current) return
      if (!container) return

      const content = await waitForArticleText(container, wordLimit, 6000)
      if (cancelled || reqId !== reqRef.current) return
      if (!content) return

      setLoading(true)
      setSummary('')

      try {
        const text = await fetchOpenAISummary(content, cfg)
        if (cancelled || reqId !== reqRef.current) return
        if (text) setSummary(text)
      } catch (e) {
        console.warn('[AI Summary]', e?.message || e)
        if (!cancelled && reqId === reqRef.current) setSummary('')
      } finally {
        if (!cancelled && reqId === reqRef.current) setLoading(false)
      }
    }

    const timer = setTimeout(run, 120)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [cfg, wordLimit, pagePath])

  // 未配置 / 失败无内容：不显示；加载中可短暂占位
  if (!cfg.configured) return null
  if (!loading && !summary) return null

  return (
    <div className='post-ai mb-5 font-sans'>
      <div className='overflow-hidden rounded-2xl border border-[var(--heo-color-primary)]/15 bg-gradient-to-br from-[#f4f6ff] via-white to-[#f7f9fe] shadow-[0_10px_28px_-18px_rgba(66,90,239,0.45)] dark:border-white/10 dark:from-[#25262e] dark:via-[#1f2027] dark:to-[#1a1b22]'>
        <div className='flex items-center gap-2.5 bg-gradient-to-r from-[var(--heo-color-primary)] to-[#6b7cff] px-4 py-2.5 text-white dark:from-[var(--heo-color-accent)] dark:to-[#f0c674] dark:text-gray-900'>
          <span className='flex h-8 w-8 items-center justify-center rounded-full bg-white/20'>
            <i className='fas fa-wand-magic-sparkles text-[13px]' aria-hidden />
          </span>
          <div className='flex-1 text-[15px] font-bold tracking-wide'>
            AI 智能摘要
          </div>
          <div className='rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-semibold'>
            GPT
          </div>
        </div>
        <div className='px-4 py-3.5 text-[14px] leading-7 text-gray-700 dark:text-gray-200'>
          {loading && !summary ? (
            <span className='inline-flex items-center gap-2 text-gray-400'>
              <i className='fas fa-circle-notch animate-spin text-[12px]' />
              正在生成摘要…
            </span>
          ) : (
            summary
          )}
        </div>
      </div>
    </div>
  )
}

function resolveSummaryConfig(notionConfig = {}) {
  const pick = (...keys) => {
    for (const k of keys) {
      const fromNotion = notionConfig?.[k]
      const fromSite = siteConfig(k)
      const v = String(fromNotion || fromSite || '').trim()
      if (v) return v
    }
    return ''
  }

  const api = pick('AI_SUMMARY_API')
  const key = pick('AI_SUMMARY_KEY', 'TianliGPT_KEY', 'NEXT_PUBLIC_TIANLI_GPT_KEY')
  const model = pick('AI_SUMMARY_MODEL') || 'gpt-4o-mini'
  const wordLimit = Number(pick('AI_SUMMARY_WORD_LIMIT') || 1000) || 1000

  // 去掉内置占位 Key：必须显式配置才启用
  const placeholder = '57X8Ht6R9a8GX548ggS'
  const validKey = key && key !== placeholder ? key : ''

  return {
    api,
    key: validKey,
    model,
    wordLimit,
    configured: Boolean(api && validKey)
  }
}

async function fetchOpenAISummary(content, cfg) {
  const res = await fetch('/api/ai-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content,
      api: cfg.api,
      key: cfg.key,
      model: cfg.model
    })
  })
  if (res.status === 204) return ''
  if (!res.ok) throw new Error(`summary ${res.status}`)
  const data = await res.json()
  return String(data?.summary || '').trim()
}

function waitForSelector(selector, timeoutMs = 8000) {
  return new Promise(resolve => {
    const existing = document.querySelector(selector)
    if (existing) {
      resolve(existing)
      return
    }
    const start = Date.now()
    const timer = setInterval(() => {
      const el = document.querySelector(selector)
      if (el) {
        clearInterval(timer)
        resolve(el)
        return
      }
      if (Date.now() - start > timeoutMs) {
        clearInterval(timer)
        resolve(null)
      }
    }, 80)
  })
}

async function waitForArticleText(container, wordLimit, timeoutMs = 6000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const text = extractArticleText(container, wordLimit)
    if (text && text.replace(/\s+/g, '').length >= 40) return text
    await sleep(120)
  }
  return extractArticleText(container, wordLimit)
}

function extractArticleText(container, wordLimit) {
  try {
    const title = document.title || ''
    const nodes = container.querySelectorAll(
      'h1,h2,h3,h4,h5,.notion-h,.notion-text,.notion-list,.notion-quote,p,li'
    )
    let content = ''
    nodes.forEach(node => {
      const t = String(node.innerText || node.textContent || '')
        .replace(/https?:\/\/[^\s]+/g, '')
        .trim()
      if (t) content += `${t} `
    })
    if (!content.trim()) {
      content = String(container.innerText || '')
        .replace(/https?:\/\/[^\s]+/g, '')
        .trim()
    }
    return `${title} ${content}`.replace(/\s+/g, ' ').trim().slice(0, wordLimit)
  } catch {
    return ''
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
