import SmartLink from '@/components/SmartLink'
import { TagCloverIcon } from './TagGroups'

const TagItemMini = ({ tag, selected = false }) => {
  return (
    <SmartLink
      key={tag}
      href={selected ? '/' : `/tag/${encodeURIComponent(tag.name)}`}
      className='heo-tag-chip inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#f2f3f8] px-2.5 py-1 text-xs font-bold text-gray-700 transition hover:bg-[var(--heo-color-primary)] hover:text-white dark:bg-white/[0.07] dark:text-gray-100 dark:hover:bg-[var(--heo-color-accent)] dark:hover:text-black'>
      <TagCloverIcon className='h-3 w-3 opacity-70' />
      <span>{tag.name}</span>
      {tag.count ? (
        <sup className='text-[10px] font-semibold opacity-55'>{tag.count}</sup>
      ) : null}
    </SmartLink>
  )
}

export default TagItemMini
