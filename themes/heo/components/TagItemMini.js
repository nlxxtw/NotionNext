import { HashTag } from '@/components/HeroIcons'
import SmartLink from '@/components/SmartLink'

const TagItemMini = ({ tag, selected = false }) => {
  return (
    <SmartLink
      key={tag}
      href={selected ? '/' : `/tag/${encodeURIComponent(tag.name)}`}
      passHref
      className={
        'inline-block cursor-pointer whitespace-nowrap rounded-full px-2 py-0.5 text-xs duration-200 hover:bg-[var(--heo-color-primary)] hover:text-[var(--heo-color-primary-text)] dark:text-white dark:hover:bg-[var(--heo-color-accent)]'
      }>
      <div className='flex items-center font-light'>
        <HashTag className='mr-0.5 h-2.5 w-2.5 stroke-2' />
        {tag.name + (tag.count ? `(${tag.count})` : '')}
      </div>
    </SmartLink>
  )
}

export default TagItemMini
