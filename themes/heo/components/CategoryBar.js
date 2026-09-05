import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { ChevronDoubleLeft, ChevronDoubleRight } from '@/components/HeroIcons'
import CONFIG from '../config'

/**
 * 分类条：纯文字胶囊，无前置图标（对齐 blog.zhheo.com）
 */
export default function CategoryBar(props) {
  const { categoryOptions, tagOptions } = props
  const { locale } = useGlobal()
  const [scrollRight, setScrollRight] = useState(false)
  const categoryBarItemsRef = useRef(null)

  const showHome = siteConfig('HEO_CATEGORY_BAR_SHOW_HOME', true, CONFIG)
  const homeLabel = siteConfig(
    'HEO_CATEGORY_BAR_HOME_LABEL',
    props.homeLabel || '精选',
    CONFIG
  )
  const pinned = normalizePinned(
    siteConfig('HEO_CATEGORY_BAR_PINNED', [], CONFIG)
  )
  const notionTagShortcuts = resolveNotionTagShortcuts(
    siteConfig('HEO_CATEGORY_BAR_TAGS', [], CONFIG),
    tagOptions
  )

  const handleToggleScroll = () => {
    if (!categoryBarItemsRef.current) return
    const { scrollWidth, clientWidth } = categoryBarItemsRef.current
    categoryBarItemsRef.current.scrollLeft = scrollRight
      ? 0
      : scrollWidth - clientWidth
    setScrollRight(!scrollRight)
  }

  return (
    <div
      id='category-bar'
      className='home-category-bar mb-0 flex w-full flex-nowrap items-center justify-between gap-2'>
      <div
        id='category-bar-items'
        ref={categoryBarItemsRef}
        className='scroll-hidden scroll-smooth flex max-w-full flex-nowrap items-center gap-2 overflow-x-auto pr-1'>
        {showHome && <MenuItem href='/' name={homeLabel} featured />}
        {pinned.map((item, index) => (
          <MenuItem
            key={`pin-${index}`}
            href={item.href}
            name={item.name}
          />
        ))}
        {notionTagShortcuts.map((item, index) => (
          <MenuItem
            key={`tag-${index}`}
            href={item.href}
            name={item.name}
          />
        ))}
        {categoryOptions?.map((c, index) => (
          <MenuItem
            key={`cat-${index}`}
            href={`/category/${c.name}`}
            name={c.name}
          />
        ))}
      </div>

      <div className='flex shrink-0 items-center gap-1.5'>
        <button
          type='button'
          aria-label='滚动分类'
          className='flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-black/5 hover:text-[var(--heo-color-primary)] dark:hover:bg-white/10 dark:hover:text-[var(--heo-color-accent)]'
          onClick={handleToggleScroll}>
          {scrollRight ? (
            <ChevronDoubleLeft className='h-4 w-4' />
          ) : (
            <ChevronDoubleRight className='h-4 w-4' />
          )}
        </button>
        <SmartLink
          href='/categories'
          className='inline-flex h-8 items-center rounded-full bg-[var(--heo-color-card-muted)] px-3.5 text-sm font-bold text-gray-700 transition hover:bg-[var(--heo-color-primary)] hover:text-white dark:bg-white/10 dark:text-gray-100 dark:hover:bg-[var(--heo-color-accent)] dark:hover:text-black'>
          {locale.COMMON.MORE || '更多'}
        </SmartLink>
      </div>
    </div>
  )
}

const MenuItem = ({ href, name, featured = false }) => {
  const router = useRouter()
  const { category, tag } = router.query
  const path = router.asPath?.split('?')[0] || ''
  const selected = featured
    ? router.pathname === '/'
    : category === name ||
      tag === name ||
      decodeURIComponent(path) === href ||
      decodeURIComponent(path) === `${href}/`

  return (
    <SmartLink
      href={href}
      className={`inline-flex h-8 shrink-0 items-center whitespace-nowrap rounded-full px-3.5 text-sm font-bold leading-none transition ${
        selected
          ? 'bg-[var(--heo-color-primary)] text-white shadow-[0_8px_12px_-3px_rgba(66,90,239,0.28)] dark:bg-[var(--heo-color-accent)] dark:text-black'
          : 'bg-transparent text-gray-600 hover:bg-black/[0.04] hover:text-[var(--heo-color-primary)] dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-[var(--heo-color-accent)]'
      }`}>
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
      return { name, href }
    })
    .filter(Boolean)
}

function resolveNotionTagShortcuts(configTags, tagOptions) {
  if (!configTags) return []
  let list = configTags
  if (typeof list === 'string') {
    try {
      list = JSON.parse(list)
    } catch {
      list = list.split(',').map(s => s.trim()).filter(Boolean)
    }
  }
  if (!Array.isArray(list) || !list.length) return []

  const notionTags = Array.isArray(tagOptions) ? tagOptions : []
  const byName = new Map(
    notionTags.map(t => [String(t.name || '').trim().toLowerCase(), t])
  )

  return list
    .map(item => {
      const name =
        typeof item === 'string'
          ? item.trim()
          : String(item?.name || item?.title || '').trim()
      if (!name) return null
      const found = byName.get(name.toLowerCase())
      if (!found) return null
      return {
        name: found.name,
        href: `/tag/${encodeURIComponent(found.name)}`
      }
    })
    .filter(Boolean)
}
