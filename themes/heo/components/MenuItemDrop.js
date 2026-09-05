import SmartLink from '@/components/SmartLink'

/**
 * 顶栏菜单项：悬停展开横向胶囊子菜单（对齐安知鱼 menus_item_child）
 */
export const MenuItemDrop = ({ link }) => {
  const hasSubMenu = link?.subMenus?.length > 0

  if (!link || link.show === false) {
    return null
  }

  const label = link.name || link.title || ''
  const TriggerTag = hasSubMenu ? 'div' : SmartLink
  const triggerProps = hasSubMenu
    ? { role: 'button', tabIndex: 0 }
    : { href: link.href || '#', target: link.target }

  return (
    <div className='heo-menus-item relative mx-0.5 flex flex-col items-center'>
      <TriggerTag
        {...triggerProps}
        className='heo-menus-item-link relative z-[1] flex cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium tracking-wide no-underline transition-all duration-200'>
        {link?.icon && <i className={`${link.icon} text-[12px] opacity-80`} />}
        <span>{label}</span>
      </TriggerTag>

      {hasSubMenu && (
        <ul className='heo-menus-item-child absolute left-1/2 top-full z-[80] m-0 flex list-none flex-row flex-nowrap items-center gap-0.5 p-0'>
          {link.subMenus.map((sLink, index) => {
            const childLabel = sLink.name || sLink.title || ''
            return (
              <li key={sLink.id || index} className='heo-menus-child-li list-none'>
                <SmartLink
                  href={sLink.href || '#'}
                  target={sLink.target || link.target}
                  className='heo-menus-child-link flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-medium text-gray-700 no-underline transition-all duration-200 dark:text-gray-100'>
                  {sLink.icon && (
                    <i className={`${sLink.icon} text-[12px] opacity-75`} />
                  )}
                  <span>{childLabel}</span>
                </SmartLink>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
