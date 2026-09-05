import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'

/**
 * 标签组：胶囊 #标签名 数量，对齐 blog.zhheo.com 侧栏
 */
const TagGroups = ({ tags, className, max = 24, showHeader = true }) => {
  const router = useRouter()
  const { tag: currentTag } = router.query
  if (!tags?.length) return null

  const list = tags.slice(0, max)

  return (
    <div className={className || ''}>
      {showHeader && (
        <div className='mb-2 flex items-center gap-1.5 px-1'>
          <i className='fas fa-tags text-[15px] text-gray-800 dark:text-gray-100' />
          <span className='text-[15px] font-bold text-gray-900 dark:text-white'>
            标签
          </span>
          <SmartLink
            href='/tag'
            className='ml-auto inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-[13px] text-gray-400 transition hover:bg-[var(--heo-color-card-muted)] hover:text-[var(--heo-color-primary)] dark:hover:bg-white/5 dark:hover:text-[var(--heo-color-accent)]'>
            更多
            <i className='fas fa-arrow-up-right-from-square text-[10px]' />
          </SmartLink>
        </div>
      )}

      <div
        id='tags-group'
        className='card-tag-cloud flex flex-wrap gap-1.5 px-0.5'>
        {list.map((tag, index) => {
          const selected = currentTag === tag.name
          return (
            <SmartLink
              key={index}
              href={`/tag/${encodeURIComponent(tag.name)}`}
              className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] transition ${
                selected
                  ? 'border-[var(--heo-color-primary)] bg-[var(--heo-color-primary)] text-white dark:border-[var(--heo-color-accent)] dark:bg-[var(--heo-color-accent)]'
                  : 'border-[var(--heo-card-border,#e3e8f7)] bg-[var(--heo-color-card-muted)] text-gray-700 hover:border-[var(--heo-color-primary)] hover:bg-[var(--heo-color-primary)] hover:text-white dark:border-gray-600 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-[var(--heo-color-accent)]'
              }`}>
              <span># {tag.name}</span>
              {tag.count != null && (
                <span
                  className={`ml-1.5 ${
                    selected ? 'opacity-90' : 'opacity-55'
                  }`}>
                  {tag.count}
                </span>
              )}
            </SmartLink>
          )
        })}
      </div>
    </div>
  )
}

export default TagGroups
