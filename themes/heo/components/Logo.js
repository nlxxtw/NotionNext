import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useEffect, useMemo, useRef, useState } from 'react'
import CONFIG from '../config'
import { TagCloverIcon } from './TagGroups'

/**
 * 左上角 Logo：加大热区；悬停图标/站名弹出项目菜单
 * 悬停「回主页」按钮本身不弹窗（仅跳转）
 */
const Logo = props => {
  const { siteInfo, customMenu } = props
  const enable = parseBool(siteConfig('HEO_LOGO_MEGA_ENABLE', true, CONFIG))
  const [open, setOpen] = useState(false)
  const [pillHover, setPillHover] = useState(false)
  const wrapRef = useRef(null)
  const closeTimer = useRef(null)

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
  const logoTitle =
    siteConfig('HEO_LOGO_TITLE', '', CONFIG) ||
    siteConfig('TITLE') ||
    siteInfo?.title ||
    'HEO'
  const useSiteIcon = parseBool(
    siteConfig('HEO_LOGO_USE_SITE_ICON', false, CONFIG)
  )
  const logoIcon = useSiteIcon ? siteInfo?.icon : ''

  const clearClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const openMenu = () => {
    if (!enable) return
    clearClose()
    setOpen(true)
  }

  const scheduleClose = () => {
    clearClose()
    closeTimer.current = window.setTimeout(() => setOpen(false), 180)
  }

  useEffect(() => {
    return () => clearClose()
  }, [])

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

  const iconNode = logoIcon ? (
    <LazyImage
      src={logoIcon}
      width={24}
      height={24}
      alt=''
      className='h-6 w-6 rounded-md object-cover'
    />
  ) : (
    <TagCloverIcon className='h-[22px] w-[22px]' />
  )

  // 与分类 tab 接近的紧凑比例（对齐 Heo，避免胶囊过大）
  const menuBtn = (
    <button
      type='button'
      aria-expanded={open}
      aria-haspopup='true'
      aria-label='打开菜单'
      onClick={e => {
        e.stopPropagation()
        setOpen(v => !v)
      }}
      onMouseEnter={openMenu}
      className='heo-logo-menu-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-800 transition hover:bg-black/[0.06] dark:text-gray-100 dark:hover:bg-white/10'>
      {iconNode}
    </button>
  )

  const titleOrHome = (
    <div className='relative flex h-9 min-w-[4.5rem] items-center'>
      <span
        onMouseEnter={openMenu}
        className={`max-w-[10rem] cursor-default truncate px-1.5 text-[17px] font-extrabold leading-none tracking-tight text-gray-900 transition duration-150 dark:text-gray-100 ${
          pillHover
            ? 'pointer-events-none absolute opacity-0'
            : 'relative opacity-100'
        }`}>
        {logoTitle}
      </span>
      <SmartLink
        href='/'
        aria-label={homeTip}
        title={homeTip}
        onMouseEnter={() => {
          setPillHover(true)
          scheduleClose()
        }}
        className={`heo-logo-home-btn relative flex h-9 shrink-0 items-center justify-center rounded-full bg-[var(--heo-color-primary)] px-3.5 text-white shadow-[0_8px_18px_-10px_rgba(66,90,239,0.9)] transition duration-150 hover:brightness-105 dark:bg-[var(--heo-color-accent)] dark:text-gray-900 dark:shadow-none ${
          pillHover
            ? 'relative opacity-100'
            : 'pointer-events-none absolute opacity-0'
        }`}>
        <i className='fas fa-home text-[14px]' aria-hidden />
      </SmartLink>
    </div>
  )

  const pill = (
    <div
      className='heo-logo-trigger heo-nav-chip heo-nav-home-pill inline-flex min-h-[40px] items-center gap-1.5 rounded-full py-1 pl-1 pr-3'
      onMouseEnter={() => setPillHover(true)}
      onMouseLeave={() => {
        setPillHover(false)
        scheduleClose()
      }}>
      {enable ? (
        menuBtn
      ) : (
        <SmartLink
          href='/'
          className='flex h-9 w-9 items-center justify-center rounded-full text-gray-800 transition hover:bg-black/[0.06] dark:text-gray-100 dark:hover:bg-white/10'
          aria-label='首页'>
          {iconNode}
        </SmartLink>
      )}
      {titleOrHome}
    </div>
  )

  if (!enable) {
    return <div className='relative inline-flex'>{pill}</div>
  }

  return (
    <div
      ref={wrapRef}
      className='relative inline-flex'
      onMouseLeave={scheduleClose}>
      {pill}

      {/* pt-2 桥接缝隙，鼠标移入下拉不断开 */}
      <div
        className={`absolute left-0 top-full z-[80] w-[min(300px,calc(100vw-1.5rem))] origin-top-left pt-2 transition duration-200 ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-1 opacity-0'
        }`}
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}>
        <div className='rounded-2xl bg-[var(--heo-color-card)] p-2.5 shadow-[0_14px_36px_-16px_rgba(40,50,90,0.42)] ring-1 ring-black/5 dark:bg-[var(--heo-color-card-dark)] dark:ring-white/10'>
          <div className='max-h-[min(60vh,28rem)] space-y-2.5 overflow-y-auto pr-0.5'>
            {groups.map(group => (
              <section key={group.id || group.title}>
                <div className='mb-1 px-1.5 text-[11px] font-bold tracking-wide text-gray-400'>
                  {group.title}
                </div>
                <div className='grid grid-cols-2 gap-1'>
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
              <div className='px-2 py-4 text-center text-[12px] leading-relaxed text-gray-400'>
                暂无项目菜单。
                <br />
                在 Notion 创建带标签「
                {siteConfig('HEO_LOGO_MEGA_TAG', 'LogoMega', CONFIG)}
                」的 Menu / SubMenu 即可。
              </div>
            )}
          </div>

          {footerText && (
            <SmartLink
              href={footerUrl || '/'}
              onClick={() => setOpen(false)}
              className='mt-2.5 flex items-center justify-center gap-1.5 rounded-full border border-black/[0.06] bg-transparent px-2.5 py-2 text-[12px] font-bold text-gray-800 transition hover:bg-[#2c2f36] hover:text-white dark:border-white/10 dark:text-gray-100 dark:hover:bg-[#3a3d46]'>
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
      className='heo-mega-item group flex items-center gap-2 rounded-xl px-2 py-1.5 text-gray-800 transition duration-150 hover:bg-[var(--heo-color-primary)] hover:text-white dark:text-gray-100 dark:hover:bg-[var(--heo-color-accent)] dark:hover:text-gray-900'>
      <MegaIcon icon={icon} title={title} />
      <span className='truncate text-[13px] font-semibold'>{title}</span>
    </SmartLink>
  )
}

function MegaIcon({ icon, title }) {
  if (!icon) {
    return (
      <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef0f4] text-gray-700 transition group-hover:bg-white/20 group-hover:text-white dark:bg-white/10 dark:text-gray-200 dark:group-hover:bg-black/15 dark:group-hover:text-gray-900'>
        <i className='fas fa-link text-[10px]' />
      </span>
    )
  }
  if (/^https?:\/\//i.test(icon) || icon.startsWith('/')) {
    return (
      <LazyImage
        src={icon}
        alt={title}
        className='h-7 w-7 shrink-0 rounded-full object-cover'
      />
    )
  }
  if (icon.includes('fa-') || icon.startsWith('fa')) {
    return (
      <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef0f4] text-gray-700 transition group-hover:bg-white/20 group-hover:text-white dark:bg-white/10 dark:text-gray-200 dark:group-hover:bg-black/15 dark:group-hover:text-gray-900'>
        <i className={`${icon} text-[11px]`} />
      </span>
    )
  }
  return (
    <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef0f4] text-[14px] leading-none transition group-hover:bg-white/20 dark:bg-white/10'>
      {icon}
    </span>
  )
}

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
