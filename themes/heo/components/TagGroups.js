import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import AsideWidgetHeader from './AsideWidgetHeader'

/**
 * 侧栏标签组
 */
const TagGroups = ({ tags, className, max = 24, showHeader = true }) => {
  const router = useRouter()
  const { tag: currentTag } = router.query
  if (!tags?.length) return null

  const list = tags.slice(0, max)

  return (
    <div id='tags-group-outer' className={className || ''}>
      {showHeader && (
        <AsideWidgetHeader
          icon={<TagCloverIcon className='h-3.5 w-3.5' />}
          title='标签'
          moreHref='/tag'
        />
      )}
      <div id='tags-group' className='heo-tag-cloud flex flex-wrap gap-2.5 px-0.5'>
        {list.map(tag => {
          const selected = currentTag === tag.name
          return (
            <SmartLink
              key={tag.name}
              href={`/tag/${encodeURIComponent(tag.name)}`}
              className={`heo-tag-chip inline-flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[13px] font-bold transition duration-150 ${
                selected
                  ? 'heo-tag-chip--active bg-[var(--heo-color-primary)] text-white dark:bg-[var(--heo-color-accent)] dark:text-gray-900'
                  : 'bg-[#f2f3f8] text-gray-700 hover:bg-[var(--heo-color-primary)] hover:text-white dark:bg-white/[0.07] dark:text-gray-100 dark:hover:bg-[var(--heo-color-accent)] dark:hover:text-gray-900'
              }`}>
              <span>{tag.name}</span>
              {tag.count != null && (
                <sup className='ml-0.5 text-[10px] font-semibold opacity-55'>
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

/** 四瓣小图标（对齐 Heo 分类/标签标识） */
export function TagCloverIcon({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg
      className={className}
      viewBox='0 0 16 16'
      fill='currentColor'
      aria-hidden='true'>
      <rect x='1.2' y='1.2' width='5.6' height='5.6' rx='1.8' />
      <rect x='9.2' y='1.2' width='5.6' height='5.6' rx='1.8' />
      <rect x='1.2' y='9.2' width='5.6' height='5.6' rx='1.8' />
      <rect x='9.2' y='9.2' width='5.6' height='5.6' rx='1.8' />
    </svg>
  )
}

export default TagGroups
