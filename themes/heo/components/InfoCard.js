import Announcement from './Announcement'
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
 * 侧栏社交信息卡（与首页 Hero 资料卡同一套悬停介绍）
 */
export function InfoCard(props) {
  const { siteInfo, notice, className = '' } = props

  return (
    <div className={`w-full ${className}`}>
      <AuthorCard siteInfo={siteInfo} minHeightClass='min-h-[240px]' />
      {notice && (
        <div className='mt-3'>
          <Announcement post={notice} />
        </div>
      )}
    </div>
  )
}
