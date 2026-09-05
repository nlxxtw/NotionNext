import AuthorCard from './AuthorCard'

export function normalizeInfoCardGreetings(value) {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean)
  }

  if (typeof value !== 'string') {
    return []
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return []
  }

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed.replace(/'/g, '"'))
      return normalizeInfoCardGreetings(parsed)
    } catch {
      return trimmed
        .slice(1, -1)
        .split(',')
        .map(item => item.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    }
  }

  return [trimmed]
}

/** @deprecated 保留兼容旧测试 */
export function shouldUseInfoCardBlurAvatar(isSlugPage, avatarBlurEnabled) {
  return Boolean(isSlugPage && avatarBlurEnabled)
}

/**
 * 侧栏资料卡（不再挂 Notion Notice，避免 &emsp;/番外 垃圾内容）
 */
export function InfoCard(props) {
  const { siteInfo, className = '' } = props

  return (
    <div className={`w-full ${className}`}>
      <AuthorCard siteInfo={siteInfo} minHeightClass='min-h-[240px]' />
    </div>
  )
}
