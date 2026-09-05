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
 * 页头：胶囊导航（对齐 blog.zhheo.com 截图）
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
          if (currentScrollY > prevScrollY) {
            setActiveIndex(1)
          } else {
            setActiveIndex(0)
          }
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
      if (isBrowser) {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  return (
    <>
      <style jsx>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0.5;
            transform: translateY(-30%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0.5;
            transform: translateY(30%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-down {
          animation: fade-in-down 0.3s ease-in-out;
        }

        .fade-in-up {
          animation: fade-in-up 0.3s ease-in-out;
        }
      `}</style>

      {fixedNav && !hasPostBg && <div className='h-16'></div>}

      <nav
        id='nav'
        className={`z-20 h-16 top-0 w-full duration-300 transition-all
            ${fixedNav ? 'fixed' : 'relative bg-transparent'} 
            ${textWhite ? 'text-white ' : 'text-black dark:text-white'}  
            ${navBgWhite ? 'bg-[var(--heo-color-card)]/90 dark:bg-[var(--heo-color-bg-dark)]/90 shadow-sm backdrop-blur-md' : 'bg-transparent'}`}>
        <div className='mx-auto flex h-full max-w-[86rem] items-center justify-between gap-3 px-5 md:px-6'>
          {/* 左侧 Logo + 更新徽章 */}
          <div className='flex min-w-0 shrink-0 items-center gap-2'>
            <Logo {...props} />
            {updateBadge && (
              <SmartLink
                href={updateBadgeUrl}
                className='hidden items-center gap-1 rounded-full bg-[var(--heo-color-primary)] px-2.5 py-1 text-xs font-bold text-[var(--heo-color-primary-text)] shadow-sm transition hover:brightness-110 sm:inline-flex dark:bg-[var(--heo-color-accent)]'>
                <i className='fas fa-arrow-up text-[10px]' />
                {updateBadge}
              </SmartLink>
            )}
          </div>

          {/* 中间胶囊菜单 */}
          <div
            id='nav-bar-swipe'
            className='relative hidden h-full min-w-0 flex-grow items-center justify-center lg:flex'>
            <div
              className={`absolute transition-all duration-700 ${
                activeIndex === 0
                  ? 'mt-0 opacity-100'
                  : 'invisible -mt-20 opacity-0'
              }`}>
              <div className='rounded-full border border-[var(--heo-card-border,#e3e8f7)] bg-[var(--heo-color-card)] px-2 py-1 shadow-[var(--heo-shadow-border,0_8px_16px_-4px_#2c2d300c)] dark:border-gray-700 dark:bg-[var(--heo-color-card-dark)]'>
                <MenuListTop {...props} />
              </div>
            </div>
            <div
              className={`absolute transition-all duration-700 ${
                activeIndex === 1
                  ? 'mb-0 opacity-100'
                  : 'invisible -mb-20 opacity-0'
              }`}>
              <h1 className='text-center text-sm font-bold text-gray-500 dark:text-gray-400'>
                {siteConfig('AUTHOR') || siteConfig('TITLE')}
                {siteConfig('BIO') && <> | </>}
                {siteConfig('BIO')}
              </h1>
            </div>
          </div>

          {/* 右侧工具胶囊 */}
          <div className='flex w-auto shrink-0 items-center justify-end gap-2'>
            <div className='flex items-center gap-0.5 rounded-2xl border border-[var(--heo-card-border,#e3e8f7)] bg-[var(--heo-color-card-muted)]/80 px-1.5 py-1 dark:border-gray-700 dark:bg-[var(--heo-color-card-dark)]'>
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
