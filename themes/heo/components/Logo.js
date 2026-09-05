import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useEffect, useMemo, useRef, useState } from 'react'
import CONFIG from '../config'
import { TagCloverIcon } from './TagGroups'

/**
 * 左上角：白胶囊 = 四瓣菜单 + 蓝色「回主页」
 * 对齐 blog.zhheo.com（悬停提示：返回博客主页）
 */
const Logo = props => {
  const { siteInfo, customMenu } = props
  const enable = siteConfig('HEO_LOGO_MEGA_ENABLE', true, CONFIG)
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  const groups = useMemo(
    () => buildMegaGroups(customMenu, CONFIG),
    [customMenu]
  )

  const footerText = siteConfig(
    'HEO_LOGO_MEGA_FOOTER_TEXT',
    '更多我的项目',
    CONFIG
  )
  const footerUrl = siteConfig('HEO_LOGO_MEGA_FOOTER_URL', '/about', CONFIG)
  const footerIcon =
    siteConfig('HEO_LOGO_MEGA_FOOTER_ICON', '', CONFIG) || siteInfo?.icon

  const homeTip = siteConfig(
    'HEO_LOGO_HOME_TOOLTIP',
    '返回博客主页',
    CONFIG
  )
  const showTitle = parseBool(
    siteConfig('HEO_LOGO_SHOW_TITLE', false, CONFIG)
  )
  const logoTitle = siteConfig('TITLE') || 'HEO'
  const useSiteIcon = parseBool(
    siteConfig('HEO_LOGO_USE_SITE_ICON', false, CONFIG)
  )
  const logoIcon = useSiteIcon ? siteInfo?.icon : ''

  useEffect(() => {
    if (!open) return undefined
    const onDoc = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    const onKey = e => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const menuBtn = (
    <button
      type='button'
      aria-expanded={open}
      aria-haspopup='true'
      aria-label='打开菜单'
      onClick={() => (enable ? setOpen(v => !v) : null)}
      className='heo-logo-menu-btn flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-800 transition hover:bg-black/[0.05] dark:text-gray-100 dark:hover:bg-white/10'>
      {logoIcon ? (
        <LazyImage
          src={logoIcon}
          width={18}
          height={18}
          alt=''
          className='h-[18px] w-[18px] rounded-sm object-cover'
        />
      ) : (
        <TagCloverIcon className='h-[15px] w-[15px]' />
      )}
    </button>
  )

  const homeBtn = (
    <SmartLink
      href='/'
      aria-label={homeTip}
      className='heo-logo-home-btn group/home relative flex h-8 shrink-0 items-center justify-center rounded-full bg-[var(--heo-color-primary)] px-3 text-white shadow-[0_6px_14px_-8px_rgba(66,90,239,0.85)] transition hover:brightness-105 dark:bg-[var(--heo-color-accent)] dark:text-gray-900 dark:shadow-none'>
      <i className='fas fa-home text-[13px]' aria-hidden />
      <span className='heo-logo-home-tip pointer-events-none absolute left-1/2 top-[calc(100%+10px)] z-[90] -translate-x-1/2 whitespace-nowrap rounded-lg border border-black/[0.06] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-gray-700 opacity-0 shadow-[0_10px_24px_-12px_rgba(40,50,90,0.45)] transition duration-150 group-hover/home:opacity-100 dark:border-white/10 dark:bg-[#2a2b31] dark:text-gray-100'>
        {homeTip}
      </span>
    </SmartLink>
  )

  const pill = (
    <div className='heo-logo-trigger heo-nav-chip heo-nav-home-pill inline-flex items-center gap-0.5 rounded-full p-1'>
      {enable ? menuBtn : (
        <SmartLink
          href='/'
          className='flex h-8 w-8 items-center justify-center rounded-full text-gray-800 dark:text-gray-100'
          aria-label='首页'>
          <TagCloverIcon className='h-[15px] w-[15px]' />
        </SmartLink>
      )}
      {homeBtn}
      {showTitle ? (
        <span className='max-w-[7rem] truncate pr-2 text-[14px] font-extrabold leading-none tracking-tight text-gray-900 dark:text-gray-100'>
          {logoTitle}
        </span>
      ) : null}
    </div>
  )

  if (!enable) {
    return <div className='relative inline-flex'>{pill}</div>
  }

  return (
    <div
      ref={wrapRef}
      className='relative inline-flex'
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}>
      {pill}

      <div
        className={`absolute left-0 top-[calc(100%+8px)] z-[80] w-[min(420px,calc(100vw-1.5rem))] origin-top-left transition duration-200 ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1 opacity-0'
        }`}>
        <div className='rounded-[14px] bg-[var(--heo-color-card)] p-3 shadow-[0_16px_40px_-18px_rgba(40,50,90,0.4)] ring-1 ring-black/5 dark:bg-[var(--heo-color-card-dark)] dark:ring-white/10'>
          <div className='max-h-[70vh] space-y-3 overflow-y-auto pr-0.5'>
            {groups.map(group => (
              <section key={group.id || group.title}>
                <div className='mb-1.5 px-1 text-[11px] font-semibold tracking-wide text-gray-400'>
                  {group.title}
                </div>
                <div className='grid grid-cols-2 gap-x-1 gap-y-0.5'>
                  {(group.items || []).map((item, idx) => (
                    <MegaItem
                      key={item.id || item.href || idx}
                      item={item}
                      onNavigate={() => setOpen(false)}
                    />
                  ))}
                </div>
              </section>
            ))}
            {!groups.length && (
              <div className='px-2 py-5 text-center text-sm text-gray-400'>
                暂无项目菜单。请在 Notion 创建带标签「
                {siteConfig('HEO_LOGO_MEGA_TAG', 'LogoMega', CONFIG)}
                」的 Menu / SubMenu。
              </div>
            )}
          </div>

          {footerText && (
            <SmartLink
              href={footerUrl || '/'}
              onClick={() => setOpen(false)}
              className='mt-3 flex items-center justify-center gap-2 rounded-full border border-black/[0.06] bg-transparent px-3 py-2 text-[13px] font-bold text-gray-800 duration-75 hover:bg-[#2c2f36] hover:text-white dark:border-white/10 dark:text-gray-100 dark:hover:bg-[#3a3d46]'>
              {footerIcon && (
                <LazyImage
                  src={footerIcon}
                  alt=''
                  className='h-4 w-4 rounded-full object-cover'
                />
              )}
              {footerText}
            </SmartLink>
          )}
        </div>
      </div>
    </div>
  )
}

function MegaItem({ item, onNavigate }) {
  const title = item.title || item.name || '未命名'
  const href = item.href || '/'
  const icon = item.pageIcon || item.icon || ''

  return (
    <SmartLink
      href={href}
      target={item.target}
      onClick={onNavigate}
      className='heo-mega-item group flex items-center gap-2 rounded-full px-2 py-1.5 text-gray-800 duration-75 hover:bg-[#2c2f36] hover:text-white dark:text-gray-100 dark:hover:bg-[#3a3d46]'>
      <MegaIcon icon={icon} title={title} />
      <span className='truncate text-[13px] font-medium'>{title}</span>
    </SmartLink>
  )
}

function MegaIcon({ icon, title }) {
  if (!icon) {
    return (
      <span className='flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#eef0f4] text-gray-700 duration-75 group-hover:bg-white/15 group-hover:text-white dark:bg-white/10 dark:text-gray-200'>
        <i className='fas fa-link text-[10px]' />
      </span>
    )
  }
  if (/^https?:\/\//i.test(icon) || icon.startsWith('/')) {
    return (
      <LazyImage
        src={icon}
        alt={title}
        className='h-[26px] w-[26px] shrink-0 rounded-full object-cover'
      />
    )
  }
  if (icon.includes('fa-') || icon.startsWith('fa')) {
    return (
      <span className='flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#eef0f4] text-gray-700 duration-75 group-hover:bg-white/15 group-hover:text-white dark:bg-white/10 dark:text-gray-200'>
        <i className={`${icon} text-[11px]`} />
      </span>
    )
  }
  return (
    <span className='flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#eef0f4] text-[15px] leading-none duration-75 group-hover:bg-white/15 dark:bg-white/10'>
      {icon}
    </span>
  )
}

/**
 * 从 Notion customMenu 中筛出大菜单分组
 */
export function buildMegaGroups(customMenu, themeConfig = CONFIG) {
  const filterMode = siteConfig('HEO_LOGO_MEGA_FILTER', 'tag', themeConfig)
  const filterValue = siteConfig('HEO_LOGO_MEGA_TAG', 'LogoMega', themeConfig)
  const fallback = siteConfig('HEO_LOGO_MEGA_GROUPS', null, themeConfig)

  const menus = Array.isArray(customMenu) ? customMenu : []
  const matched = menus.filter(menu =>
    matchMegaMenu(menu, filterMode, filterValue)
  )

  if (matched.length) {
    return matched.map(menu => ({
      id: menu.id,
      title: menu.title || menu.name || '',
      items: (menu.subMenus || []).map(sub => ({
        id: sub.id,
        title: sub.title || sub.name,
        name: sub.name || sub.title,
        href: sub.href,
        target: sub.target,
        pageIcon: sub.pageIcon,
        icon: sub.icon
      }))
    }))
  }

  // 配置回退（便于先出样式，再在 Notion 里补数据）
  if (Array.isArray(fallback) && fallback.length) {
    return fallback.map((g, i) => ({
      id: g.id || `cfg-${i}`,
      title: g.title || g.name || '',
      items: (g.items || []).map((item, j) => ({
        id: item.id || `cfg-${i}-${j}`,
        title: item.title || item.name,
        href: item.href || item.url || '#',
        target: item.target,
        pageIcon: item.pageIcon || item.icon || item.img,
        icon: item.icon
      }))
    }))
  }

  return []
}

/**
 * 顶栏普通菜单应排除大菜单分组，避免重复
 */
export function excludeMegaMenus(customMenu, themeConfig = CONFIG) {
  const filterMode = siteConfig('HEO_LOGO_MEGA_FILTER', 'tag', themeConfig)
  const filterValue = siteConfig('HEO_LOGO_MEGA_TAG', 'LogoMega', themeConfig)
  if (!Array.isArray(customMenu)) return customMenu
  return customMenu.filter(
    menu => !matchMegaMenu(menu, filterMode, filterValue)
  )
}

function matchMegaMenu(menu, filterMode, filterValue) {
  if (!menu || !filterValue) return false
  if (filterMode === 'all') return true

  if (filterMode === 'category') {
    const cat = menu.category
    if (Array.isArray(cat)) return cat.includes(filterValue)
    return cat === filterValue
  }

  const tags = menu.tags
  if (Array.isArray(tags)) {
    return tags.some(t => (typeof t === 'string' ? t : t?.name) === filterValue)
  }
  if (typeof tags === 'string') {
    return tags.split(/[,，]/).map(s => s.trim()).includes(filterValue)
  }
  return false
}

function parseBool(value) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return value.toLowerCase() === 'true'
    }
  }
  return Boolean(value)
}

export default Logo
