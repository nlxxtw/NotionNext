import { ChevronDoubleLeft, ChevronDoubleRight } from '@/components/HeroIcons'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import CONFIG from '../config'

/**
 * 博客列表上方分类条（胶囊样式，对齐 blog.zhheo.com）
 */
export default function CategoryBar(props) {
  const { categoryOptions } = props
  const { locale } = useGlobal()
  const [scrollRight, setScrollRight] = useState(false)
  const categoryBarItemsRef = useRef(null)

  const pinned = normalizePinned(
    siteConfig('HEO_CATEGORY_BAR_PINNED', null, CONFIG)
  )

  const handleToggleScroll = () => {
    if (categoryBarItemsRef.current) {
      const { scrollWidth, clientWidth } = categoryBarItemsRef.current
      if (scrollRight) {
        categoryBarItemsRef.current.scrollLeft = 0
      } else {
        categoryBarItemsRef.current.scrollLeft = scrollWidth - clientWidth
      }
      setScrollRight(!scrollRight)
    }
  }

  return (
    <div
      id='category-bar'
      className='wow fadeInUp home-category-bar mb-0 flex w-full flex-nowrap items-center justify-between gap-2'>
      <div
        id='category-bar-items'
        ref={categoryBarItemsRef}
        className='scroll-smooth scroll-hidden flex max-w-full flex-nowrap items-center justify-start gap-2.5 overflow-x-auto rounded-lg'>
        <MenuItem
          href='/'
          name={props.homeLabel || '精选'}
          icon='fas fa-star'
          featured
        />
        {pinned.map((item, index) => (
          <MenuItem
            key={`pin-${index}`}
            href={item.href}
            name={item.name}
            icon={item.icon}
          />
        ))}
        {categoryOptions?.map((c, index) => (
          <MenuItem
            key={`cat-${index}`}
            href={`/category/${c.name}`}
            name={c.name}
            icon={c.icon || 'fas fa-folder'}
          />
        ))}
      </div>

      <div
        id='category-bar-next'
        className='category-bar-more-group flex shrink-0 items-center gap-1.5'>
        <button
          type='button'
          id='right'
          aria-label='滚动分类'
          className='flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full border border-[var(--heo-card-border,#e3e8f7)] bg-[var(--heo-color-card)] text-gray-600 transition hover:bg-[var(--heo-color-card-muted)] hover:text-[var(--heo-color-primary)] dark:border-gray-700 dark:bg-[var(--heo-color-card-dark)] dark:text-gray-300 dark:hover:text-[var(--heo-color-accent)]'
          onClick={handleToggleScroll}>
          {scrollRight ? (
            <ChevronDoubleLeft className={'h-4 w-4'} />
          ) : (
            <ChevronDoubleRight className={'h-4 w-4'} />
          )}
        </button>
        <SmartLink
          href='/category'
          className='inline-flex h-[38px] items-center justify-center whitespace-nowrap rounded-full border border-[var(--heo-card-border,#e3e8f7)] bg-[var(--heo-color-card)] px-[18px] text-sm font-bold text-gray-900 transition hover:bg-[var(--heo-color-card-muted)] hover:text-[var(--heo-color-primary)] dark:border-gray-700 dark:bg-[var(--heo-color-card-dark)] dark:text-white dark:hover:text-[var(--heo-color-accent)]'>
          {locale.MENU.CATEGORY || '更多'}
        </SmartLink>
      </div>
    </div>
  )
}

const MenuItem = ({ href, name, icon, featured = false }) => {
  const router = useRouter()
  const { category } = router.query
  const path = router.asPath?.split('?')[0] || ''
  const selected = featured
    ? router.pathname === '/'
    : category === name || path === href || path === `${href}/`

  return (
    <SmartLink
      href={href}
      className={`inline-flex h-[38px] shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-[18px] text-sm font-bold leading-none transition ${
        selected
          ? 'border-[var(--heo-color-primary)] bg-[var(--heo-color-primary)] text-[var(--heo-color-primary-text)] shadow-[0_8px_12px_-3px_rgba(66,90,239,0.25)] dark:border-[var(--heo-color-accent)] dark:bg-[var(--heo-color-accent)]'
          : 'border-[var(--heo-card-border,#e3e8f7)] bg-[var(--heo-color-card)] text-gray-800 hover:bg-[var(--heo-color-card-muted)] hover:text-[var(--heo-color-primary)] dark:border-gray-700 dark:bg-[var(--heo-color-card-dark)] dark:text-gray-100 dark:hover:text-[var(--heo-color-accent)]'
      }`}>
      {icon && <i className={`${icon} text-xs opacity-90`} />}
      <span>{name}</span>
    </SmartLink>
  )
}

function normalizePinned(value) {
  if (!value) return []
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value)
    } catch {
      return []
    }
  }
  if (!Array.isArray(value)) return []
  return value
    .map(item => {
      if (!item || typeof item !== 'object') return null
      const name = String(item.name || item.title || '').trim()
      const href = String(item.href || item.url || '').trim()
      if (!name || !href) return null
      return {
        name,
        href,
        icon: item.icon || 'fas fa-hashtag'
      }
    })
    .filter(Boolean)
}
