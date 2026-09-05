/* eslint-disable camelcase */
import { siteConfig } from '@/lib/config'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

/**
 * NotionNext 文章 AI 摘要（客户端）
 * 不依赖 pastking 脚本的 pathname 限制（原脚本只认 /posts|/article）
 */
export default function TianLiGPT() {
  const router = useRouter()
  const tianliKey = resolveTianliKey()
  const wordLimit = Number(siteConfig('AI_SUMMARY_WORD_LIMIT') || 1000) || 1000
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const reqRef = useRef(0)

  useEffect(() => {
    if (!tianliKey) {
      setVisible(false)
      setSummary('')
      return undefined
    }

    // 仅在文章详情容器存在时跑；不再用 /posts|/article 路径限制
    let cancelled = false
    const reqId = ++reqRef.current

    const run = async () => {
      const container = await waitForSelector(
        '#article-wrapper #notion-article',
        8000
      )
      if (cancelled || reqId !== reqRef.current) return
      if (!container) {
        setVisible(false)
        return
      }

      setVisible(true)
      setLoading(true)
      setSummary('')

      const content = extractArticleText(container, wordLimit)
      if (!content) {
        setLoading(false)
        setVisible(false)
        return
      }

      try {
        const text = await fetchTianliSummary(content, tianliKey)
        if (cancelled || reqId !== reqRef.current) return
        if (text) {
          setSummary(text)
        } else {
          setVisible(false)
        }
      } catch (e) {
        console.error('TianliGPT summary failed', e)
        if (!cancelled && reqId === reqRef.current) setVisible(false)
      } finally {
        if (!cancelled && reqId === reqRef.current) setLoading(false)
      }
    }

    const timer = setTimeout(run, 50)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [tianliKey, wordLimit, router.asPath])

  if (!tianliKey || !visible) return null

  return (
    <div className='post-ai mb-5 font-sans'>
      <div className='overflow-hidden rounded-[10px] border border-black/[0.06] bg-gradient-to-br from-[#f9f9f9] to-[#f5f5f5] shadow-[0_4px_6px_rgba(0,0,0,0.08)] dark:border-white/10 dark:from-[#2a2a30] dark:to-[#232328]'>
        <div className='flex items-center gap-2.5 bg-gradient-to-br from-[#e74c3c] to-[#c0392b] px-5 py-3 text-white'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            width='22'
            height='22'
            aria-hidden>
            <path
              fill='#ffffff'
              d='M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z'
            />
          </svg>
          <div className='flex-1 text-[17px] font-bold'>AI智能摘要</div>
          <div className='rounded-full bg-white/20 px-2 py-0.5 text-[11px]'>
            GPT
          </div>
        </div>
        <div className='px-5 py-4 text-[15px] leading-relaxed text-gray-800 dark:text-gray-100'>
          {loading && !summary ? '生成中…' : summary}
        </div>
      </div>
    </div>
  )
}

function resolveTianliKey() {
  const raw = siteConfig('TianliGPT_KEY')
  const key = String(raw || '').trim()
  // Notion 配置中心若留空会盖掉默认值，这里回退到内置 Key
  return key || '57X8Ht6R9a8GX548ggS'
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

function extractArticleText(container, wordLimit) {
  try {
    const title = document.title || ''
    const headings = container.querySelectorAll('h1,h2,h3,h4,h5')
    const paragraphs = container.getElementsByTagName('p')
    let content = ''
    headings.forEach(h => {
      content += `${h.innerText || ''} `
    })
    for (const p of paragraphs) {
      content += String(p.innerText || '').replace(/https?:\/\/[^\s]+/g, '')
    }
    return `${title} ${content}`.slice(0, wordLimit)
  } catch {
    return ''
  }
}

async function fetchTianliSummary(content, token) {
  // 与 pastking 脚本同一接口；token 走 query
  const url = `https://summary.qixing1217.top/api/summary?token=${encodeURIComponent(
    token
  )}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  })
  if (!res.ok) throw new Error(`summary ${res.status}`)
  const data = await res.json()
  return String(data?.summary || '').trim()
}
