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
 * 页头：三栏网格，菜单真正居中（避免 flex+absolute 中间塌陷）
 */
const Header = props => {
  const [fixedNav, setFixedNav] = useState(false)
  const [textWhite, setTextWhite] = useState(false)
  const [navBgWhite, setBgWhite] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hasPostBg, setHasPostBg] = useState(false)

  const router = useRouter()
  const slideOverRef = useRef()
  const postBgRef = useRef(null)

  const updateBadge = siteConfig('HEO_NAV_UPDATE_BADGE', null, CONFIG)
  const updateBadgeUrl =
    siteConfig('HEO_NAV_UPDATE_BADGE_URL', '/', CONFIG) || '/'

  const toggleMenuOpen = () => {
    slideOverRef?.current?.toggleSlideOvers()
  }

  const scrollTrigger = useMemo(
    () =>
      throttle(() => {
        const scrollS = window.scrollY
        if (scrollS <= 1) {
          setFixedNav(false)
          setBgWhite(false)
          setTextWhite(false)
          if (postBgRef.current) {
            setFixedNav(true)
            setTextWhite(true)
          }
        } else {
          setFixedNav(true)
          setTextWhite(false)
          setBgWhite(true)
        }
      }, 100),
    []
  )

  useEffect(() => {
    postBgRef.current = document.querySelector('#post-bg')
    setHasPostBg(!!postBgRef.current)
    scrollTrigger()
  }, [router.asPath, scrollTrigger])

  useEffect(() => {
    window.addEventListener('scroll', scrollTrigger, { passive: true })
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
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
          setActiveIndex(currentScrollY > prevScrollY ? 1 : 0)
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
      {fixedNav && !hasPostBg && <div className='h-16' />}

      <nav
        id='nav'
        className={`z-20 top-0 h-16 w-full transition-all duration-300
            ${fixedNav ? 'fixed' : 'relative bg-transparent'}
            ${textWhite ? 'text-white' : 'text-black dark:text-white'}
            ${
              navBgWhite
                ? 'bg-[var(--heo-color-card)]/90 shadow-sm backdrop-blur-md dark:bg-[var(--heo-color-bg-dark)]/90'
                : 'bg-transparent'
            }`}>
        <div className='mx-auto grid h-full max-w-[86rem] grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 md:px-6'>
          {/* 左：Logo + 徽章 */}
          <div className='flex min-w-0 items-center justify-start gap-2'>
            <Logo {...props} />
            {updateBadge && (
              <SmartLink
                href={updateBadgeUrl}
                className='hidden items-center gap-1 rounded-full bg-[var(--heo-color-primary)] px-2.5 py-1 text-xs font-bold text-[var(--heo-color-primary-text)] sm:inline-flex dark:bg-[var(--heo-color-accent)]'>
                <i className='fas fa-arrow-up text-[10px]' />
                {updateBadge}
              </SmartLink>
            )}
          </div>

          {/* 中：菜单真正居中 */}
          <div
            id='nav-bar-swipe'
            className='relative hidden h-full items-center justify-center lg:flex'>
            <div
              className={`transition-all duration-500 ${
                activeIndex === 0
                  ? 'opacity-100'
                  : 'pointer-events-none absolute opacity-0'
              }`}>
              <div className='heo-soft-chip rounded-full bg-[var(--heo-color-card)] px-2 py-1 dark:bg-[var(--heo-color-card-dark)]'>
                <MenuListTop {...props} />
              </div>
            </div>
            <div
              className={`transition-all duration-500 ${
                activeIndex === 1
                  ? 'opacity-100'
                  : 'pointer-events-none absolute opacity-0'
              }`}>
              <h1 className='text-center text-sm font-bold text-gray-500 dark:text-gray-400'>
                {siteConfig('AUTHOR') || siteConfig('TITLE')}
                {siteConfig('BIO') && <> | </>}
                {siteConfig('BIO')}
              </h1>
            </div>
          </div>

          {/* 右：工具 */}
          <div className='flex items-center justify-end gap-2'>
            <div className='heo-soft-chip flex items-center gap-0.5 rounded-2xl bg-[var(--heo-color-card-muted)]/90 px-1.5 py-1 dark:bg-[var(--heo-color-card-dark)]'>
              <RandomPostButton {...props} />
              <SearchButton {...props} />
              <ReadingProgress />
              <button
                type='button'
                aria-label='打开菜单'
                onClick={toggleMenuOpen}
                className='flex h-8 w-8 items-center justify-center rounded-xl text-gray-700 transition hover:bg-black/5 dark:text-white dark:hover:bg-white/10 lg:hidden'>
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

export default Header
