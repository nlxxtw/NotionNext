/**
 * AI 相关配置
 * 文章摘要：OpenAI 兼容 /chat/completions
 * Notion Config 可配同名项：AI_SUMMARY_API / AI_SUMMARY_KEY / AI_SUMMARY_MODEL
 */
module.exports = {
  // OpenAI 兼容接口：可填 base（如 https://api.openai.com/v1）或完整 .../chat/completions
  AI_SUMMARY_API: process.env.AI_SUMMARY_API || '',
  // Bearer Key（Notion 后台也可填 AI_SUMMARY_KEY / TianliGPT_KEY）
  AI_SUMMARY_KEY: process.env.AI_SUMMARY_KEY || '',
  AI_SUMMARY_MODEL: process.env.AI_SUMMARY_MODEL || 'gpt-4o-mini',
  AI_SUMMARY_CACHE_TIME: process.env.AI_SUMMARY_CACHE_TIME || 1800,
  AI_SUMMARY_WORD_LIMIT: process.env.AI_SUMMARY_WORD_LIMIT || 1000,

  // 兼容旧键名（勿再填内置演示 Key；留空则不显示摘要）
  TianliGPT_CSS:
    process.env.NEXT_PUBLIC_TIANLI_GPT_CSS ||
    'https://cdn1.tianli0.top/gh/zhheo/Post-Abstract-AI@0.15.2/tianli_gpt.css',
  TianliGPT_JS:
    process.env.NEXT_PUBLIC_TIANLI_GPT_JS ||
    'https://cdn.jsdmirror.com/gh/nlxxtw/Post-Abstract-AI-NotionNext@master/pastking_gpt.js',
  TianliGPT_KEY: process.env.NEXT_PUBLIC_TIANLI_GPT_KEY || '',

  // Coze AI 机器人 @see https://www.coze.cn/
  COZE_BOT_ID: process.env.NEXT_PUBLIC_COZE_BOT_ID || '',
  COZE_SRC_URL:
    process.env.NEXT_PUBLIC_COZE_SRC_URL ||
    'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/0.1.0-beta.6/libs/cn/index.js',
  COZE_TITLE: process.env.NEXT_PUBLIC_COZE_TITLE || 'NotionNext助手',

  // Chatbase 机器人 @see https://www.chatbase.co/
  CHATBASE_ID: process.env.NEXT_PUBLIC_CHATBASE_ID || null,

  // OpenAI compatible AI chat proxy. Keep API keys on the server only.
  AI_CHAT_API: process.env.NEXT_PUBLIC_AI_CHAT_API || '',
  AI_CHAT_TITLE: process.env.NEXT_PUBLIC_AI_CHAT_TITLE || 'AI 助手',
  AI_CHAT_WELCOME:
    process.env.NEXT_PUBLIC_AI_CHAT_WELCOME ||
    '你好，我是这个站点的 AI 助手。你可以问我站点内容相关问题。',

  // 自建 AI 助手服务端代理；为空时不显示
  DOCS_CHAT_API: process.env.NEXT_PUBLIC_DOCS_CHAT_API || '',
  DOCS_CHAT_TITLE: process.env.NEXT_PUBLIC_DOCS_CHAT_TITLE || 'AI 助手',
  DOCS_CHAT_WELCOME:
    process.env.NEXT_PUBLIC_DOCS_CHAT_WELCOME ||
    '你好，我是这个站点的 AI 助手。你可以问我站点内容相关问题。',

  // Dify 聊天机器人 @see https://dify.ai/
  DIFY_CHATBOT_ENABLED: process.env.NEXT_PUBLIC_DIFY_CHATBOT_ENABLED || false,
  DIFY_CHATBOT_BASE_URL: process.env.NEXT_PUBLIC_DIFY_CHATBOT_BASE_URL || '',
  DIFY_CHATBOT_TOKEN: process.env.NEXT_PUBLIC_DIFY_CHATBOT_TOKEN || '',

  // Webwhiz AI 机器人 @see https://github.com/webwhiz-ai/webwhiz
  WEB_WHIZ_ENABLED: process.env.NEXT_PUBLIC_WEB_WHIZ_ENABLED || false,
  WEB_WHIZ_BASE_URL:
    process.env.NEXT_PUBLIC_WEB_WHIZ_BASE_URL || 'https://api.webwhiz.ai',
  WEB_WHIZ_CHAT_BOT_ID: process.env.NEXT_PUBLIC_WEB_WHIZ_CHAT_BOT_ID || null
}
