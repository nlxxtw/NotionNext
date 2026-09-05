import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import { excludeMegaMenus } from './Logo'
import { MenuItemDrop } from './MenuItemDrop'

export const MenuListTop = props => {
  const { customNav, customMenu } = props
  const { locale } = useGlobal()

  let links = [
    {
      id: 1,
      icon: 'fa-solid fa-house',
      name: locale.NAV.INDEX,
      href: '/',
      show: siteConfig('HEO_MENU_INDEX', null, CONFIG)
    },
    {
      id: 2,
      icon: 'fas fa-search',
      name: locale.NAV.SEARCH,
      href: '/search',
      show: siteConfig('HEO_MENU_SEARCH', null, CONFIG)
    },
    {
      id: 3,
      icon: 'fas fa-archive',
      name: locale.NAV.ARCHIVE,
      href: '/archive',
      show: siteConfig('HEO_MENU_ARCHIVE', null, CONFIG)
    }
  ]

  if (customNav) {
    links = links.concat(customNav)
  }

  // 开启自定义菜单后用 Notion Menu；并排除 Logo 大菜单分组
  if (siteConfig('CUSTOM_MENU')) {
    const navMenus = excludeMegaMenus(customMenu, CONFIG)
    if (Array.isArray(navMenus) && navMenus.length) {
      links = navMenus
    }
  }

  if (!links || links.length === 0) {
    return null
  }

  return (
    <nav
      id='nav-mobile'
      className='flex w-full justify-center font-light leading-8'>
      {links?.map(
        (link, index) =>
          link &&
          link.show !== false && <MenuItemDrop key={index} link={link} />
      )}
    </nav>
  )
}
