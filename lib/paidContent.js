/**
 * Notion 付费内容：识别 Callout【付费】/【隐藏】，公开渲染前剥离正文
 */

const PAID_TITLE_RE = /^【\s*(付费|隐藏)\s*】/

export function getPlainTitle(propertiesTitle) {
  if (!Array.isArray(propertiesTitle)) return ''
  return propertiesTitle
    .map(seg => (Array.isArray(seg) ? String(seg[0] || '') : ''))
    .join('')
    .trim()
}

export function parsePaidCalloutMeta(titleText, blockId) {
  const raw = String(titleText || '').trim()
  if (!PAID_TITLE_RE.test(raw)) return null

  const rest = raw.replace(PAID_TITLE_RE, '').trim()
  let price = null
  const priceMatch =
    rest.match(/(?:¥|￥|\$)?\s*(\d+(?:\.\d{1,2})?)\s*(?:元|块)?/) ||
    raw.match(/(?:¥|￥)\s*(\d+(?:\.\d{1,2})?)/)
  if (priceMatch) {
    price = Number(priceMatch[1])
  }

  let label = rest
    .replace(/(?:¥|￥|\$)?\s*\d+(?:\.\d{1,2})?\s*(?:元|块)?/g, '')
    .replace(/[|｜\-—]/g, ' ')
    .trim()
  if (!label) label = '付费资源'

  return {
    key: String(blockId),
    price: Number.isFinite(price) && price >= 0.01 ? price : null,
    label,
    marker: 'paid'
  }
}

function collectTextFromBlock(blockMap, blockId, depth = 0) {
  if (depth > 8 || !blockId) return ''
  const entry = blockMap[blockId]
  const value = entry?.value || entry
  if (!value) return ''

  const parts = []
  const title = getPlainTitle(value.properties?.title)
  if (title) parts.push(title)

  const source = value.properties?.source?.[0]?.[0]
  if (typeof source === 'string' && /^https?:\/\//i.test(source)) {
    parts.push(source)
  }
  const link = value.properties?.link?.[0]?.[0]
  if (typeof link === 'string' && /^https?:\/\//i.test(link)) {
    parts.push(link)
  }

  const children = Array.isArray(value.content) ? value.content : []
  for (const childId of children) {
    const childText = collectTextFromBlock(blockMap, childId, depth + 1)
    if (childText) parts.push(childText)
  }
  return parts.filter(Boolean).join('\n')
}

/**
 * 公开页：清空付费 Callout 子块，写入 format.paid_wall 元数据
 * @returns {{ block: object, paidKeys: string[] }}
 */
export function maskPaidCalloutBlocks(block) {
  if (!block || typeof block !== 'object') {
    return { block, paidKeys: [] }
  }

  // flatten 已在 formatNotionBlock 里做过；这里再做一次保证单独调用也安全
  flattenAllCallouts(block)

  const paidKeys = []
  const defaultPrice = Number(
    process.env.NEXT_PUBLIC_BLOG_PAY_DEFAULT_PRICE ||
      process.env.BLOG_PAY_DEFAULT_PRICE ||
      3
  )

  for (const [id, entry] of Object.entries(block)) {
    const value = entry?.value
    if (!value || value.type !== 'callout') continue

    // 只取第一行做【付费】识别（后面可能是链接正文）
    const titleText = getPlainTitle(value.properties?.title).split('\n')[0] || ''
    const meta = parsePaidCalloutMeta(titleText, value.id || id)
    if (!meta) continue

    if (meta.price == null) {
      meta.price = Number.isFinite(defaultPrice) && defaultPrice >= 0.01 ? defaultPrice : 3
    }

    // 删除子块，避免链接进 HTML / __NEXT_DATA__
    const childIds = Array.isArray(value.content) ? [...value.content] : []
    for (const childId of childIds) {
      deleteSubtree(block, childId)
    }
    value.content = []
    value.format = value.format || {}
    value.format.paid_wall = {
      key: meta.key,
      price: meta.price,
      label: meta.label
    }
    // 标题只保留标记与展示名，去掉可能夹带的 URL / 正文
    value.properties = value.properties || {}
    value.properties.title = [[`【付费】${meta.label}`]]
    paidKeys.push(meta.key)
  }

  return { block, paidKeys }
}

/**
 * 把 Callout 子块纯文本并入 title（react-notion-x 自定义 Callout 不会渲染 children）
 */
export function flattenAllCallouts(block) {
  if (!block || typeof block !== 'object') return
  for (const [, entry] of Object.entries(block)) {
    const value = entry?.value
    if (!value || value.type !== 'callout') continue

    const title = getPlainTitle(value.properties?.title)
    const childIds = Array.isArray(value.content) ? [...value.content] : []
    if (!childIds.length) continue

    const childTexts = []
    for (const cid of childIds) {
      const text = collectTextFromBlock(block, cid)
      if (text) childTexts.push(text)
    }
    if (!childTexts.length) continue

    const lines = []
    if (title) lines.push(title)
    for (const t of childTexts) {
      for (const line of String(t).split('\n')) {
        const s = line.trim()
        if (s && !lines.includes(s)) lines.push(s)
      }
    }
    value.properties = value.properties || {}
    value.properties.title = [[lines.join('\n')]]

    for (const cid of childIds) {
      deleteSubtree(block, cid)
    }
    value.content = []
  }
}

function deleteSubtree(block, blockId) {
  const entry = block[blockId]
  const value = entry?.value
  if (!value) {
    delete block[blockId]
    return
  }
  const children = Array.isArray(value.content) ? [...value.content] : []
  for (const childId of children) {
    deleteSubtree(block, childId)
  }
  delete block[blockId]
}

/**
 * 已解锁后：从完整 blockMap 提取某付费块明文
 */
export function extractPaidCalloutContent(blockMapBlocks, contentKey) {
  if (!blockMapBlocks || !contentKey) return null
  const entry = blockMapBlocks[contentKey]
  const value = entry?.value || entry
  if (!value || value.type !== 'callout') {
    // 有时 id 带连字符差异，宽松匹配
    const found = Object.entries(blockMapBlocks).find(([id, e]) => {
      const v = e?.value || e
      return v?.type === 'callout' && (id === contentKey || v.id === contentKey)
    })
    if (!found) return null
    return buildExtractResult(blockMapBlocks, found[1]?.value || found[1], found[0])
  }
  return buildExtractResult(blockMapBlocks, value, contentKey)
}

function buildExtractResult(blockMapBlocks, value, key) {
  const titleText = getPlainTitle(value.properties?.title)
  const meta = parsePaidCalloutMeta(titleText, key) || {
    key,
    label: '付费资源',
    price: null
  }
  let body = collectTextFromBlock(blockMapBlocks, key)
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
    .filter(line => line !== titleText && !PAID_TITLE_RE.test(line))
    .join('\n')

  // 扁平化后正文可能都在 title 里（多行）
  if (!body && titleText.includes('\n')) {
    body = titleText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .filter(line => !PAID_TITLE_RE.test(line))
      .join('\n')
  }

  return {
    key,
    label: meta.label,
    price: meta.price,
    title: titleText,
    text: body || titleText.replace(PAID_TITLE_RE, '').trim()
  }
}
