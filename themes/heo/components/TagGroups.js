import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

/**
 * 侧栏标签组（胶囊样式，对齐 Heo card-tag-cloud）
 */
const TagGroups = ({ tags, className, max = 24, showHeader = true }) => {
  const router = useRouter()
  const { tag: currentTag } = router.query
  if (!tags?.length) return null

  const list = tags.slice(0, max)

  return (
    <div id='tags-group-outer' className={className || ''}>
      {showHeader && (
        <div className='mb-2.5 flex items-center justify-between px-0.5'>
          <div className='flex items-center gap-2 text-[15px] font-extrabold'>
            <i className='fas fa-tags text-[15px] text-gray-800 dark:text-gray-100' />
            标签
          </div>
          {tags.length > max && (
            <SmartLink
              href='/tag'
              className='text-xs font-bold text-gray-400 transition hover:text-[var(--heo-color-primary)] dark:hover:text-[var(--heo-color-accent)]'>
              更多
            </SmartLink>
          )}
        </div>
      )}
      <div id='tags-group' className='heo-tag-cloud flex flex-wrap gap-1.5 px-0.5'>
        {list.map(tag => {
          const selected = currentTag === tag.name
          return (
            <SmartLink
              key={tag.name}
              href={`/tag/${encodeURIComponent(tag.name)}`}
              className={`heo-tag-chip inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-bold transition ${
                selected
                  ? 'border-transparent bg-[var(--heo-color-primary)] text-white dark:bg-[var(--heo-color-accent)] dark:text-black'
                  : 'border-black/[0.05] bg-[var(--heo-color-card-muted)] text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-100'
              }`}>
              <span># {tag.name}</span>
              {tag.count != null && (
                <sup className='text-[10px] font-semibold opacity-60'>
                  {tag.count}
                </sup>
              )}
            </SmartLink>
          )
        })}
      </div>
    </div>
  )
}

export default TagGroups
