import { siteConfig } from '@/lib/config'
import { isBrowser } from '@/lib/utils'
import throttle from 'lodash.throttle'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import DarkModeButton from './DarkModeButton'
import Logo from './Logo'
import { MenuListTop } from './MenuListTop'
import RandomPostButton from './RandomPostButton'
import ReadingProgress from './ReadingProgress'
import SearchButton from './SearchButton'
import SlideOver from './SlideOver'
import CONFIG from '../config'
import SmartLink from '@/components/SmartLink'

/**
 * 顶栏：始终透明，无实心白/黑条、无毛玻璃胶囊
 * 仅保留图标与文字；兼容 Safari safe-area
 */
const Header = props => {
  const [textWhite, setTextWhite] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const router = useRouter()
  const slideOverRef = useRef()
  const postBgRef = useRef(null)

  const updateBadge = siteConfig('HEO_NAV_UPDATE_BADGE', '', CONFIG)
  const updateBadgeUrl =
    siteConfig('HEO_NAV_UPDATE_BADGE_URL', '/', CONFIG) || '/'
  const showUpdateBadge = Boolean(String(updateBadge || '').trim())

  const toggleMenuOpen = () => {
    slideOverRef?.current?.toggleSlideOvers()
  }

  const scrollTrigger = useMemo(
    () =>
      throttle(() => {
        const scrollS = window.scrollY || document.documentElement.scrollTop || 0
        const onPostHero = Boolean(postBgRef.current) && scrollS <= 1
        setTextWhite(onPostHero)
      }, 80),
    []
  )

  useEffect(() => {
    postBgRef.current = document.querySelector('#post-bg')
    scrollTrigger()
  }, [router.asPath, scrollTrigger])

  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger, { passive: true })
    window.addEventListener('resize', scrollTrigger, { passive: true })
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
      window.removeEventListener('resize', scrollTrigger)
      scrollTrigger.cancel?.()
    }
  }, [scrollTrigger])

  useEffect(() => {
    let prevScrollY = 0
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          setActiveIndex(currentScrollY > prevScrollY + 4 ? 1 : 0)
          prevScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }
    if (isBrowser) {
      window.addEventListener('scroll', handleScroll, { passive: true })
    }
    return () => {
      if (isBrowser) window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <div className='heo-nav-spacer h-16 shrink-0' aria-hidden />

      <nav
        id='nav'
        className={`heo-nav heo-nav--fixed heo-nav--plain fixed left-0 right-0 top-0 z-[60] w-full
            ${textWhite ? 'text-white heo-nav--on-post' : 'text-black dark:text-white'}`}>
        <div className='heo-nav-inner mx-auto grid h-16 max-w-[86rem] grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:px-6'>
          <div className='flex min-w-0 items-center justify-start gap-2'>
            <Logo {...props} />
            {showUpdateBadge && (
              <SmartLink
                href={updateBadgeUrl}
                className='heo-nav-badge hidden items-center justify-center sm:inline-flex'
                title={String(updateBadge)}>
                {isNumericBadge(updateBadge) ? (
                  <span className='heo-nav-badge-count'>{updateBadge}</span>
                ) : (
                  <span className='heo-nav-badge-pill'>
                    <i className='fas fa-arrow-up text-[9px] opacity-70' />
                    {updateBadge}
                  </span>
                )}
              </SmartLink>
            )}
          </div>

          <div
            id='nav-bar-swipe'
            className='relative hidden h-full items-center justify-center lg:flex'>
            <div
              className={`transition-all duration-500 ${
                activeIndex === 0
                  ? 'opacity-100'
                  : 'pointer-events-none absolute opacity-0'
              }`}>
              <div className='px-1 py-1'>
                <MenuListTop {...props} />
              </div>
            </div>
            <div
              className={`transition-all duration-500 ${
                activeIndex === 1
                  ? 'opacity-100'
                  : 'pointer-events-none absolute opacity-0'
              }`}>
              <div className='px-2 py-1'>
                <h1 className='text-center text-sm font-bold text-gray-700 dark:text-gray-200'>
                  {siteConfig('AUTHOR') || siteConfig('TITLE')}
                  {siteConfig('BIO') && <> · </>}
                  {siteConfig('BIO')}
                </h1>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-end gap-1'>
            <div className='flex items-center gap-0.5 px-0.5 py-1'>
              <RandomPostButton {...props} />
              <SearchButton {...props} />
              <ReadingProgress />
              <button
                type='button'
                aria-label='打开菜单'
                onClick={toggleMenuOpen}
                className='flex h-8 w-8 items-center justify-center rounded-full text-gray-700 transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10 lg:hidden'>
                <i className='fas fa-th' />
              </button>
            </div>
            {!JSON.parse(siteConfig('THEME_SWITCH')) && (
              <div className='hidden md:block'>
                <DarkModeButton {...props} />
              </div>
            )}
          </div>

          <SlideOver cRef={slideOverRef} {...props} />
        </div>
      </nav>
    </>
  )
}

function isNumericBadge(value) {
  return /^\d+$/.test(String(value || '').trim())
}

export default Header
