import { siteConfig } from '@/lib/config'
import { getDataFromCache, setDataToCache } from '@/lib/cache/cache_manager'

const DEFAULT_SYSTEM =
  '你是博客文章摘要助手。请用简洁流畅的中文总结文章要点，2～4 句话，不要标题、不要列表、不要开头套话。'

/**
 * OpenAI 兼容摘要
 */
export async function getAiSummary(aiSummaryAPI, aiSummaryKey, truncatedText) {
  try {
    const model = siteConfig('AI_SUMMARY_MODEL') || 'gpt-4o-mini'
    const endpoint = toChatCompletionsUrl(aiSummaryAPI)
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aiSummaryKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        max_tokens: 400,
        messages: [
          { role: 'system', content: DEFAULT_SYSTEM },
          {
            role: 'user',
            content: `请总结以下文章：\n\n${truncatedText}`
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`Response ${response.status}`)
    }
    const data = await response.json()
    const summary =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text ||
      data?.summary ||
      ''
    return String(summary).trim() || null
  } catch (error) {
    console.error('[AI Summary] request failed', error)
    return null
  }
}

/**
 * 获取文章摘要（写入 post.aiSummary）；失败则不写入
 */
export async function getPageAISummary(post, pageContentText, notionConfig = {}) {
  const aiSummaryAPI = siteConfig('AI_SUMMARY_API', '', notionConfig)
  const aiSummaryKey =
    siteConfig('AI_SUMMARY_KEY', '', notionConfig) ||
    siteConfig('TianliGPT_KEY', '', notionConfig)
  if (!aiSummaryAPI || !aiSummaryKey || !post) return

  const cacheKey = `ai_summary_${post.id}`
  let aiSummary = await getDataFromCache(cacheKey)
  if (aiSummary) {
    post.aiSummary = aiSummary
    return
  }

  const aiSummaryCacheTime = siteConfig(
    'AI_SUMMARY_CACHE_TIME',
    1800,
    notionConfig
  )
  const wordLimit =
    Number(siteConfig('AI_SUMMARY_WORD_LIMIT', '1000', notionConfig)) || 1000
  let content = ''
  if (Array.isArray(post.toc)) {
    for (const heading of post.toc) {
      content += (heading?.text || '') + ' '
    }
  }
  content += pageContentText || ''
  const combinedText = `${post.title || ''} ${content}`
  const truncatedText = combinedText.slice(0, wordLimit)
  aiSummary = await getAiSummary(aiSummaryAPI, aiSummaryKey, truncatedText)
  if (aiSummary) {
    await setDataToCache(cacheKey, aiSummary, aiSummaryCacheTime)
    post.aiSummary = aiSummary
  }
}

function toChatCompletionsUrl(api) {
  const raw = String(api || '').trim().replace(/\/+$/, '')
  if (/\/chat\/completions$/i.test(raw)) return raw
  if (/\/v\d+$/i.test(raw)) return `${raw}/chat/completions`
  return `${raw}/chat/completions`
}
