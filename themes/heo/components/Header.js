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
 * 页头：下滑毛玻璃遮罩；徽章无彩色
 */
const Header = props => {
  const [fixedNav, setFixedNav] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [textWhite, setTextWhite] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hasPostBg, setHasPostBg] = useState(false)

  const router = useRouter()
  const slideOverRef = useRef()
  const postBgRef = useRef(null)

  // 留空则不显示；支持数字徽章（如 "3"）或短文案
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
        const scrollS = window.scrollY
        const onPostHero = Boolean(postBgRef.current) && scrollS <= 1
        if (scrollS <= 1) {
          setScrolled(false)
          setFixedNav(onPostHero)
          setTextWhite(onPostHero)
        } else {
          setScrolled(true)
          setFixedNav(true)
          setTextWhite(false)
        }
      }, 80),
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
      {fixedNav && !hasPostBg && <div className='h-16' aria-hidden />}

      <nav
        id='nav'
        className={`heo-nav z-30 top-0 h-16 w-full transition-[background,box-shadow,backdrop-filter] duration-300
            ${fixedNav ? 'fixed left-0 right-0' : 'relative'}
            ${textWhite ? 'text-white heo-nav--on-post' : 'text-black dark:text-white'}
            ${scrolled ? 'heo-nav--scrolled' : 'heo-nav--top'}`}>
        <div className='mx-auto grid h-full max-w-[86rem] grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 md:px-6'>
          {/* 左：Logo + 单色徽章 */}
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

          {/* 中：菜单 */}
          <div
            id='nav-bar-swipe'
            className='relative hidden h-full items-center justify-center lg:flex'>
            <div
              className={`transition-all duration-500 ${
                activeIndex === 0
                  ? 'opacity-100'
                  : 'pointer-events-none absolute opacity-0'
              }`}>
              <div className='heo-nav-chip rounded-full px-2 py-1'>
                <MenuListTop {...props} />
              </div>
            </div>
            <div
              className={`transition-all duration-500 ${
                activeIndex === 1
                  ? 'opacity-100'
                  : 'pointer-events-none absolute opacity-0'
              }`}>
              <div className='heo-nav-chip rounded-full px-4 py-1.5'>
                <h1 className='text-center text-sm font-bold text-gray-600 dark:text-gray-300'>
                  {siteConfig('AUTHOR') || siteConfig('TITLE')}
                  {siteConfig('BIO') && <> · </>}
                  {siteConfig('BIO')}
                </h1>
              </div>
            </div>
          </div>

          {/* 右：工具 */}
          <div className='flex items-center justify-end gap-2'>
            <div className='heo-nav-chip flex items-center gap-0.5 rounded-full px-1.5 py-1'>
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
