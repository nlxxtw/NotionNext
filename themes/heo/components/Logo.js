import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useEffect, useMemo, useRef, useState } from 'react'
import CONFIG from '../config'

/**
 * Logo + 项目大菜单（对齐 blog.zhheo.com）
 * 数据优先来自 Notion Menu/SubMenu（带指定标签），否则回退 config 示例
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

  const logoTitle = siteConfig('TITLE') || 'HEO'
  const logoIcon = siteInfo?.icon

  const trigger = (
    <button
      type='button'
      aria-expanded={open}
      aria-haspopup='true'
      onClick={() => (enable ? setOpen(v => !v) : null)}
      className='heo-nav-chip group flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-3 font-extrabold text-gray-900 transition dark:text-gray-100'>
      <span className='flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'>
        {logoIcon ? (
          <LazyImage
            src={logoIcon}
            width={32}
            height={32}
            alt={logoTitle}
            className='h-full w-full object-cover'
          />
        ) : (
          <i className='fas fa-th text-[11px]' />
        )}
      </span>
      <span className='max-w-[8rem] truncate text-[15px] leading-none'>
        {logoTitle}
      </span>
    </button>
  )

  // 未启用大菜单：保持可点回首页
  if (!enable) {
    return (
      <SmartLink href='/' className='inline-flex'>
        {trigger}
      </SmartLink>
    )
  }

  return (
    <div
      ref={wrapRef}
      className='relative'
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}>
      {trigger}

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
              className='mt-3 flex items-center justify-center gap-2 rounded-full border-0 bg-[#f2f3f8] px-3 py-2 text-[13px] font-bold text-gray-800 transition hover:bg-[var(--heo-color-primary)] hover:text-white dark:bg-white/[0.08] dark:text-gray-100 dark:hover:bg-[var(--heo-color-primary)]'>
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
      className='group flex items-center gap-2 rounded-lg px-1.5 py-1.5 transition hover:bg-[var(--heo-color-card-muted)] dark:hover:bg-white/5'>
      <MegaIcon icon={icon} title={title} />
      <span className='truncate text-[13px] font-medium text-gray-800 group-hover:text-[var(--heo-color-primary)] dark:text-gray-100 dark:group-hover:text-[var(--heo-color-accent)]'>
        {title}
      </span>
    </SmartLink>
  )
}

function MegaIcon({ icon, title }) {
  if (!icon) {
    return (
      <span className='flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[var(--heo-color-primary)]/15 text-[var(--heo-color-primary)] dark:bg-[var(--heo-color-accent)]/20 dark:text-[var(--heo-color-accent)]'>
        <i className='fas fa-link text-[10px]' />
      </span>
    )
  }
  // Notion 图片图标 / 外链图
  if (/^https?:\/\//i.test(icon) || icon.startsWith('/')) {
    return (
      <LazyImage
        src={icon}
        alt={title}
        className='h-[26px] w-[26px] shrink-0 rounded-full object-cover'
      />
    )
  }
  // FontAwesome
  if (icon.includes('fa-') || icon.startsWith('fa')) {
    return (
      <span className='flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[var(--heo-color-card-muted)] text-gray-700 dark:bg-white/10 dark:text-gray-200'>
        <i className={`${icon} text-[11px]`} />
      </span>
    )
  }
  // Emoji
  return (
    <span className='flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[var(--heo-color-card-muted)] text-[15px] leading-none dark:bg-white/10'>
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
  const matched = menus.filter(menu => matchMegaMenu(menu, filterMode, filterValue))

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

  // default: tag
  const tags = menu.tags
  if (Array.isArray(tags)) {
    return tags.some(t => (typeof t === 'string' ? t : t?.name) === filterValue)
  }
  if (typeof tags === 'string') {
    return tags.split(/[,，]/).map(s => s.trim()).includes(filterValue)
  }
  return false
}

export default Logo
