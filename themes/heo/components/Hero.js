import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { useCallback, useEffect, useMemo, useState } from 'react'
import CONFIG from '../config'
import AuthorCard from './AuthorCard'
import WechatSubscribeCard from './WechatSubscribeCard'

/**
 * 首页英雄区（对齐 blog.zhheo.com #home_center）
 * 轮播 320px 高、占满主栏；与右侧资料卡同高顶对齐
 * 下方 mb-3 与侧栏 gap-3 一致，形成十字白缝
 * 资料卡：xl+ 在 SideRight；更窄屏放在轮播下方
 */
const Hero = props => {
  return (
    <div id='hero-wrapper' className='relative mb-3 w-full select-none'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-x-0 top-0 z-0 h-[320px] overflow-hidden'>
        <div className='absolute left-[6%] top-6 h-52 w-52 rounded-full bg-[#a5b4fc]/45 blur-3xl dark:bg-[#f2b94b]/12' />
        <div className='absolute right-[12%] top-0 h-60 w-60 rounded-full bg-[#c4b5fd]/40 blur-3xl dark:bg-[#425aef]/18' />
        <div className='absolute left-[42%] top-24 h-44 w-64 rounded-full bg-[#fde68a]/35 blur-3xl dark:bg-[#fde68a]/8' />
      </div>

      <div id='home_center' className='relative z-0 flex w-full flex-col gap-3'>
        {/* Heo .home-center-content：与侧栏资料卡同高 320px */}
        <div className='heo-hero-row heo-home-banner h-[220px] w-full lg:h-[320px]'>
          <HomeCenterCarousel {...props} />
        </div>
        {/* 窄屏：资料卡下移到轮播下方，不抢横向空间 */}
        <HeroAuthorMobile {...props} />
        <HeroSubscribeMobile />
      </div>
    </div>
  )
}

/**
 * 左侧推荐轮播
 */
function HomeCenterCarousel(props) {
  const { latestPosts, allNavPages, siteInfo } = props
  const slides = useMemo(
    () => getHeroSlides({ latestPosts, allNavPages, siteInfo }),
    [latestPosts, allNavPages, siteInfo]
  )
  const [index, setIndex] = useState(0)
  const tagText = siteConfig('HEO_HERO_BANNER_TAG', '全站推荐', CONFIG)
  const autoplay = siteConfig('HEO_HERO_BANNER_AUTOPLAY', true, CONFIG)
  const intervalMs = Number(
    siteConfig('HEO_HERO_BANNER_INTERVAL', 5000, CONFIG)
  )

  const go = useCallback(
    delta => {
      if (!slides.length) return
      setIndex(prev => (prev + delta + slides.length) % slides.length)
    },
    [slides.length]
  )

  useEffect(() => {
    setIndex(0)
  }, [slides.length])

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return undefined
    const timer = setInterval(() => go(1), Math.max(intervalMs, 2500))
    return () => clearInterval(timer)
  }, [autoplay, go, intervalMs, slides.length])

  if (!slides.length) {
    return (
      <div className='home-center-left flex h-full min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-[22px] bg-[var(--heo-color-card)] shadow-[var(--heo-shadow-border)] dark:bg-[var(--heo-color-card-dark)]'>
        <span className='text-sm text-gray-400'>暂无推荐内容</span>
      </div>
    )
  }

  const current = slides[index]
  const hasCover = Boolean(current?.cover)

  return (
    <div className='home-center-left group relative h-full min-h-0 w-full overflow-hidden rounded-[22px] bg-[var(--heo-color-card)] shadow-[var(--heo-shadow-border)] dark:bg-[var(--heo-color-card-dark)]'>
      {/* 无封面时用技能图标底纹 */}
      {!hasCover && <TagsGroupBar />}

      {slides.map((slide, i) => {
        const active = i === index
        return (
          <div
            key={slide.id || slide.slug || i}
            className={`absolute inset-0 transition-opacity duration-500 ${
              active ? 'z-[1] opacity-100' : 'pointer-events-none z-0 opacity-0'
            }`}>
            {slide.cover ? (
              <LazyImage
                priority={i === 0}
                src={slide.cover}
                alt={slide.title}
                className='absolute inset-0 h-full w-full object-cover'
              />
            ) : (
              <div className='absolute inset-0 bg-gradient-to-br from-[#5b6ef5] via-[#6d5ce7] to-[#425aef] dark:from-[#3a3428] dark:via-[#2a261f] dark:to-[#1e1b16]' />
            )}
            {/* 底部渐变遮罩，保证白字可读 */}
            <div className='pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[rgba(45,55,150,0.88)] via-[rgba(66,90,239,0.35)] to-transparent' />
          </div>
        )
      })}

      {/* 整卡可点进文章；底部控件单独拦截，不触发跳转 */}
      <SmartLink
        href={current.href}
        aria-label={current.title}
        className='absolute inset-0 z-[2] block cursor-pointer'>
        <span className='sr-only'>{current.title}</span>
      </SmartLink>

      <div className='pointer-events-none absolute inset-x-0 bottom-0 z-[3] flex items-end justify-between gap-3 p-5 sm:p-7'>
        <div className='min-w-0 flex-1'>
          <div className='line-clamp-2 text-lg font-bold leading-snug text-white drop-shadow-sm sm:text-[26px] sm:leading-[1.35]'>
            {current.title}
          </div>
          <div className='mt-2.5 flex flex-wrap items-center gap-3'>
            <span className='inline-flex items-center gap-1 text-xs text-white/90'>
              <i className='fas fa-star text-[10px]' />
              {tagText}
            </span>
            {slides.length > 1 && (
              <div className='pointer-events-auto flex items-center gap-1.5'>
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type='button'
                    aria-label={`切换到第 ${i + 1} 张`}
                    onClick={e => {
                      e.preventDefault()
                      e.stopPropagation()
                      setIndex(i)
                    }}
                    className={`h-2 rounded-full transition-all ${
                      i === index
                        ? 'w-6 bg-white'
                        : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {slides.length > 1 && (
          <div className='pointer-events-auto flex shrink-0 items-center gap-2 pb-0.5'>
            <CarouselArrow
              direction='prev'
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                go(-1)
              }}
            />
            <CarouselArrow
              direction='next'
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                go(1)
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function CarouselArrow({ direction, onClick }) {
  return (
    <button
      type='button'
      aria-label={direction === 'prev' ? '上一张' : '下一张'}
      onClick={onClick}
      className='flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:scale-110 hover:bg-white hover:text-[var(--heo-color-primary)] active:scale-90'>
      <i
        className={`fas ${
          direction === 'prev' ? 'fa-chevron-left' : 'fa-chevron-right'
        } text-sm`}
      />
    </button>
  )
}

/**
 * 窄屏资料卡：放在轮播下方（下移），绝不与轮播横排挤压
 * xl+ 由 SideRight 展示
 */
function HeroAuthorMobile(props) {
  const { siteInfo } = props
  return (
    <div className='heo-hero-aside w-full xl:hidden'>
      <AuthorCard
        siteInfo={siteInfo}
        className='h-[200px] w-full'
        minHeightClass='h-full min-h-0'
      />
    </div>
  )
}

/** 小屏订阅条；大屏由 SideRight 顶对齐文章列表 */
function HeroSubscribeMobile() {
  const subscribeEnable = parseBool(
    siteConfig('HEO_HERO_SUBSCRIBE_ENABLE', true, CONFIG)
  )
  if (!subscribeEnable) return null
  return (
    <div className='w-full xl:hidden'>
      <WechatSubscribeCard className='w-full' />
    </div>
  )
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

/**
 * 斜向滚动图标底纹（无封面时使用）
 */
function TagsGroupBar() {
  const enabled = siteConfig('HEO_GROUP_ICONS_ENABLE', false, CONFIG)
  if (!enabled) return null
  let groupIcons = siteConfig('HEO_GROUP_ICONS', [], CONFIG)
  if (!groupIcons?.length) return null
  groupIcons = groupIcons.concat(groupIcons)

  return (
    <div className='tags-group-all pointer-events-none absolute inset-0 z-0 flex -rotate-[28deg] overflow-hidden opacity-40'>
      <div className='tags-group-wrapper absolute top-10 flex flex-nowrap'>
        {groupIcons.map((g, index) => (
          <div key={index} className='tags-group-icon-pair ml-5 select-none'>
            <div
              style={{ background: g.color_1 }}
              className='flex h-20 w-20 items-center justify-center rounded-3xl shadow-md'>
              <LazyImage
                priority={index < 3}
                src={g.img_1}
                title={g.title_1}
                className='w-2/3'
              />
            </div>
            <div
              style={{ background: g.color_2 }}
              className='mt-4 flex h-20 w-20 items-center justify-center rounded-3xl shadow-md'>
              <LazyImage
                priority={index < 3}
                src={g.img_2}
                title={g.title_2}
                className='w-2/3'
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function getHeroSlides({ latestPosts, allNavPages, siteInfo }) {
  const max = Number(siteConfig('HEO_HERO_BANNER_MAX', 6, CONFIG)) || 6
  const tag = siteConfig('HEO_HERO_RECOMMEND_POST_TAG', null, CONFIG)
  const sortByUpdate = parseBool(
    siteConfig('HEO_HERO_RECOMMEND_POST_SORT_BY_UPDATE_TIME', false, CONFIG)
  )

  let source = []
  if (tag) {
    const pages = Array.isArray(allNavPages) ? [...allNavPages] : []
    if (sortByUpdate) {
      pages.sort(
        (a, b) =>
          new Date(b?.lastEditedDate || 0) - new Date(a?.lastEditedDate || 0)
      )
    }
    source = pages.filter(post => post?.tags?.includes(tag))
  }

  if (!source.length) {
    source = Array.isArray(latestPosts) ? latestPosts : []
  }

  return source.slice(0, max).map(post => ({
    id: post?.id,
    slug: post?.slug,
    title: post?.title || '未命名',
    href: post?.href || `/${post?.slug || ''}`,
    cover: post?.pageCoverThumbnail || post?.pageCover || siteInfo?.pageCover
  }))
}

export default Hero
