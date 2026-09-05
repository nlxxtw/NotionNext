import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { ChevronDoubleLeft, ChevronDoubleRight } from '@/components/HeroIcons'
import CONFIG from '../config'

/**
 * 分类条：数据全部来自 Notion
 * - 分类：categoryOptions
 * - 可选标签快捷入口：HEO_CATEGORY_BAR_TAGS（仅当 Notion 里确实有该标签时才显示）
 * - 不写死「热门 / 必看」
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
        className='scroll-hidden scroll-smooth flex max-w-full flex-nowrap items-center gap-2 overflow-x-auto'>
        {showHome && (
          <MenuItem href='/' name={homeLabel} icon='fas fa-star' featured />
        )}
        {pinned.map((item, index) => (
          <MenuItem
            key={`pin-${index}`}
            href={item.href}
            name={item.name}
            icon={item.icon}
          />
        ))}
        {notionTagShortcuts.map((item, index) => (
          <MenuItem
            key={`tag-${index}`}
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

      <div className='flex shrink-0 items-center gap-1.5'>
        <button
          type='button'
          aria-label='滚动分类'
          className='heo-chip flex h-[36px] w-[36px] items-center justify-center rounded-full bg-white text-gray-500 transition hover:text-[var(--heo-color-primary)] dark:bg-[var(--heo-color-card-dark)] dark:hover:text-[var(--heo-color-accent)]'
          onClick={handleToggleScroll}>
          {scrollRight ? (
            <ChevronDoubleLeft className='h-4 w-4' />
          ) : (
            <ChevronDoubleRight className='h-4 w-4' />
          )}
        </button>
        <SmartLink
          href='/category'
          className='heo-chip inline-flex h-[36px] items-center rounded-full bg-white px-4 text-sm font-bold text-gray-800 transition hover:text-[var(--heo-color-primary)] dark:bg-[var(--heo-color-card-dark)] dark:text-white dark:hover:text-[var(--heo-color-accent)]'>
          {locale.COMMON.CATEGORY || '博客分类'}
        </SmartLink>
      </div>
    </div>
  )
}

const MenuItem = ({ href, name, icon, featured = false }) => {
  const router = useRouter()
  const { category, tag } = router.query
  const path = router.asPath?.split('?')[0] || ''
  const selected = featured
    ? router.pathname === '/'
    : category === name ||
      tag === name ||
      path === href ||
      path === `${href}/`

  return (
    <SmartLink
      href={href}
      className={`inline-flex h-[36px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-bold leading-none transition ${
        selected
          ? 'bg-[var(--heo-color-primary)] text-white shadow-[0_8px_12px_-3px_rgba(66,90,239,0.28)] dark:bg-[var(--heo-color-accent)] dark:text-black'
          : 'heo-chip bg-white text-gray-800 hover:text-[var(--heo-color-primary)] dark:bg-[var(--heo-color-card-dark)] dark:text-gray-100 dark:hover:text-[var(--heo-color-accent)]'
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
      return { name, href, icon: item.icon || 'fas fa-hashtag' }
    })
    .filter(Boolean)
}

/**
 * 仅展示 Notion 中真实存在的标签快捷入口
 * HEO_CATEGORY_BAR_TAGS 例：['热门','必看'] 或 [{name:'热门',icon:'fas fa-fire'}]
 */
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
      const icon =
        (typeof item === 'object' && item?.icon) ||
        found.icon ||
        defaultTagIcon(name)
      return {
        name: found.name,
        href: `/tag/${encodeURIComponent(found.name)}`,
        icon
      }
    })
    .filter(Boolean)
}

function defaultTagIcon(name) {
  if (/热门|hot|fire/i.test(name)) return 'fas fa-fire'
  if (/必看|must|bolt|flash/i.test(name)) return 'fas fa-bolt'
  if (/推荐|精选|star/i.test(name)) return 'fas fa-star'
  return 'fas fa-hashtag'
}
