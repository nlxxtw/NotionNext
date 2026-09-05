import { siteConfig } from '@/lib/config'
import { isBrowser } from '@/lib/utils'
import throttle from 'lodash.throttle'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import Logo from './Logo'
import { MenuListTop } from './MenuListTop'
import RandomPostButton from './RandomPostButton'
import ReadingProgress from './ReadingProgress'
import SearchButton from './SearchButton'
import SlideOver from './SlideOver'
import CONFIG from '../config'
import SmartLink from '@/components/SmartLink'

/**
 * 顶栏：首页毛玻璃胶囊；文章页中间显示文章标题（对齐 Heo）
 */
const Header = props => {
  const [textWhite, setTextWhite] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const router = useRouter()
  const slideOverRef = useRef()
  const postBgRef = useRef(null)
  const post = props?.post
  const postTitle = String(post?.title || '').trim()
  const isPostPage = Boolean(postTitle)

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
        const postBg = postBgRef.current
        // 封面区内保持白字透明导航（对齐 Heo）；滚出封面后再恢复毛玻璃
        let onPostHero = false
        if (postBg) {
          const coverH = postBg.offsetHeight || 0
          onPostHero = scrollS < Math.max(coverH - 96, 48)
        }
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
          const currentScrollY = window.scrollY || 0
          // 文章页：稍滚就切到标题；首页：过英雄区再切简介
          const keepMenuUntil = isPostPage ? 80 : 220
          if (currentScrollY < keepMenuUntil) {
            setActiveIndex(0)
          } else if (currentScrollY > prevScrollY + 6) {
            setActiveIndex(1)
          } else if (currentScrollY < prevScrollY - 6) {
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
      handleScroll()
    }
    return () => {
      if (isBrowser) window.removeEventListener('scroll', handleScroll)
    }
  }, [isPostPage])

  const centerSecondaryText = isPostPage
    ? postTitle
    : [siteConfig('AUTHOR') || siteConfig('TITLE'), siteConfig('BIO')]
        .filter(Boolean)
        .join(' · ')

  return (
    <>
      <div className='heo-nav-spacer h-14 shrink-0' aria-hidden />

      <nav
        id='nav'
        className={`heo-nav heo-nav--fixed heo-nav--plain fixed left-0 right-0 top-0 z-[60] w-full
            ${textWhite ? 'text-white heo-nav--on-post' : 'text-black dark:text-white'}`}>
        <div className='heo-nav-inner mx-auto grid h-14 max-w-[86rem] grid-cols-[1fr_auto_1fr] items-center gap-3 px-5'>
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
            className='relative hidden h-full max-w-full items-center justify-center overflow-visible lg:flex'>
            <div
              className={`transition-all duration-500 ${
                activeIndex === 0
                  ? 'relative z-[70] opacity-100'
                  : 'pointer-events-none absolute inset-y-0 z-0 flex items-center opacity-0'
              }`}>
              <div
                className={`${
                  textWhite
                    ? 'px-1 py-1'
                    : 'heo-nav-chip overflow-visible rounded-full px-2.5 py-1.5'
                }`}>
                <MenuListTop {...props} />
              </div>
            </div>
            <div
              className={`transition-all duration-500 ${
                activeIndex === 1
                  ? 'relative opacity-100'
                  : 'pointer-events-none absolute inset-y-0 flex items-center opacity-0'
              }`}>
              <div
                className={`max-w-[min(36rem,52vw)] truncate ${
                  textWhite
                    ? 'rounded-full bg-white/95 px-4 py-1.5 shadow-[0_8px_24px_-12px_rgba(20,30,60,0.35)]'
                    : 'heo-nav-chip rounded-full px-4 py-1.5'
                }`}
                title={centerSecondaryText}>
                <h1
                  className={`truncate text-center text-sm font-bold ${
                    textWhite
                      ? 'text-gray-800'
                      : 'text-gray-700 dark:text-gray-200'
                  }`}>
                  {centerSecondaryText}
                </h1>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-end gap-1'>
            <div
              className={`flex items-center gap-0.5 ${
                textWhite
                  ? 'px-0.5 py-1'
                  : 'heo-nav-chip rounded-full px-1.5 py-1'
              }`}>
              <RandomPostButton {...props} />
              <SearchButton {...props} />
              <ReadingProgress />
              <button
                type='button'
                aria-label='打开菜单'
                onClick={toggleMenuOpen}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition lg:hidden ${
                  textWhite
                    ? 'text-white hover:bg-white/15'
                    : 'text-gray-700 hover:bg-black/5 dark:text-white dark:hover:bg-white/10'
                }`}>
                <i className='fas fa-th' />
              </button>
            </div>
            {!textWhite && (
              <SmartLink
                href='/archives'
                title='全部文章'
                aria-label='全部文章'
                className='heo-nav-chip hidden h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-gray-700 transition hover:text-[var(--heo-color-primary)] dark:text-white dark:hover:text-[var(--heo-color-accent)] md:inline-flex'>
                <i className='fas fa-archive text-[12px] opacity-80' aria-hidden />
                全部文章
              </SmartLink>
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
