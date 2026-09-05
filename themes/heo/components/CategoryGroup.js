import SmartLink from '@/components/SmartLink'

/**
 * 分类组（无前置图标）
 */
const CategoryGroup = ({ currentCategory, categories }) => {
  if (!categories) return <></>

  return (
    <div id='category-list' className='mx-4 flex flex-wrap dark:border-gray-700'>
      {categories.map(category => {
        const selected = currentCategory === category.name
        return (
          <SmartLink
            key={category.name}
            href={`/category/${category.name}`}
            passHref
            className={`${
              selected
                ? 'hover:text-[var(--heo-color-primary-text)] dark:hover:text-[var(--heo-color-accent)] text-[var(--heo-color-primary)] bg-[var(--heo-color-primary)] dark:text-[var(--heo-color-accent)] '
                : 'dark:text-gray-400 text-gray-500 hover:text-[var(--heo-color-primary)] dark:hover:text-[var(--heo-color-accent)]'
            } flex flex-nowrap items-center rounded-lg px-3 py-1.5 text-sm font-bold transition-all duration-200 hover:bg-[var(--heo-color-primary)] hover:text-[var(--heo-color-primary-text)] dark:hover:bg-[var(--heo-color-accent)]`}>
            <span>
              {category.name}
              <span className='ml-1 opacity-70'>({category.count})</span>
            </span>
          </SmartLink>
        )
      })}
    </div>
  )
}

export default CategoryGroup
