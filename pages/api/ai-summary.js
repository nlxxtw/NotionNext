/**
 * OpenAI 兼容文章摘要代理
 * POST { content, api?, key?, model? }
 * api / key 优先用服务端环境变量；Notion 配置可由前端传入（与站点公开配置一致）
 */
import BLOG from '@/blog.config'

const DEFAULT_SYSTEM =
  '你是博客文章摘要助手。请用简洁流畅的中文总结文章要点，2～4 句话，不要标题、不要列表、不要开头套话。'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
    const content = String(body.content || '').trim()
    if (!content || content.length < 20) {
      return res.status(400).json({ ok: false, error: 'content_too_short' })
    }

    const api =
      pick(process.env.AI_SUMMARY_API) ||
      pick(BLOG.AI_SUMMARY_API) ||
      pick(body.api)
    const key =
      pick(process.env.AI_SUMMARY_KEY) ||
      pick(BLOG.AI_SUMMARY_KEY) ||
      pick(process.env.TianliGPT_KEY) ||
      pick(BLOG.TianliGPT_KEY) ||
      pick(body.key)
    const model =
      pick(process.env.AI_SUMMARY_MODEL) ||
      pick(BLOG.AI_SUMMARY_MODEL) ||
      pick(body.model) ||
      'gpt-4o-mini'

    if (!api || !key) {
      return res.status(204).end()
    }

    const endpoint = toChatCompletionsUrl(api)
    const truncated = content.slice(0, Number(BLOG.AI_SUMMARY_WORD_LIMIT) || 1000)

    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 400,
        messages: [
          { role: 'system', content: DEFAULT_SYSTEM },
          {
            role: 'user',
            content: `请总结以下文章：\n\n${truncated}`
          }
        ]
      })
    })

    if (!upstream.ok) {
      const errText = await upstream.text().catch(() => '')
      console.error('[ai-summary]', upstream.status, errText.slice(0, 300))
      return res.status(502).json({ ok: false, error: 'upstream_failed' })
    }

    const data = await upstream.json()
    const summary = extractSummary(data)
    if (!summary) {
      return res.status(502).json({ ok: false, error: 'empty_summary' })
    }

    return res.status(200).json({ ok: true, summary })
  } catch (e) {
    console.error('[ai-summary]', e)
    return res.status(500).json({ ok: false, error: 'server_error' })
  }
}

function pick(v) {
  const s = String(v || '').trim()
  return s || ''
}

/** 支持填完整 chat/completions，或仅填 base（如 https://api.openai.com/v1） */
function toChatCompletionsUrl(api) {
  const raw = String(api || '').trim().replace(/\/+$/, '')
  if (/\/chat\/completions$/i.test(raw)) return raw
  if (/\/v\d+$/i.test(raw)) return `${raw}/chat/completions`
  return `${raw}/chat/completions`
}

function extractSummary(data) {
  const choice = data?.choices?.[0]
  const msg = choice?.message?.content || choice?.text || ''
  return String(msg || data?.summary || '')
    .trim()
    .replace(/^["「]|["」]$/g, '')
}
