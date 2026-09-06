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
 * 侧栏资料卡：与 Heo .card-info .card-content 同高 320px，
 * 与左侧轮播同高顶对齐，底边与公众号条形成十字缝
 */
export function InfoCard(props) {
  const { siteInfo, className = '' } = props

  return (
    <div className={`heo-info-card w-full shrink-0 ${className}`}>
      <AuthorCard
        siteInfo={siteInfo}
        className='heo-info-card__body w-full'
        minHeightClass='h-[320px] min-h-[320px]'
      />
    </div>
  )
}
