import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { useCallback, useEffect, useMemo, useState } from 'react'
import CONFIG from '../config'

/**
 * 首页英雄区（对齐 blog.zhheo.com 截图）
 * 左：推荐文章封面轮播
 * 右：个人资料卡 + 订阅入口
 */
const Hero = props => {
  const reverse = siteConfig('HEO_HERO_REVERSE', false, CONFIG)

  return (
    <div id='hero-wrapper' className='relative mb-4 w-full select-none'>
      {/* 柔和氛围光斑 */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-x-0 -top-20 h-[380px] overflow-hidden'>
        <div className='absolute left-[6%] top-6 h-52 w-52 rounded-full bg-[#a5b4fc]/45 blur-3xl dark:bg-[#f2b94b]/12' />
        <div className='absolute right-[12%] top-0 h-60 w-60 rounded-full bg-[#c4b5fd]/40 blur-3xl dark:bg-[#425aef]/18' />
        <div className='absolute left-[42%] top-24 h-44 w-64 rounded-full bg-[#fde68a]/35 blur-3xl dark:bg-[#fde68a]/8' />
      </div>

      <div
        id='home_center'
        className={`relative z-[1] flex w-full flex-col gap-3 lg:h-[320px] lg:flex-row ${
          reverse ? 'lg:flex-row-reverse' : ''
        }`}>
        <HomeCenterCarousel {...props} />
        <HeroAside {...props} />
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
      <div className='home-center-left flex h-[220px] flex-1 items-center justify-center overflow-hidden rounded-[22px] bg-[var(--heo-color-card)] shadow-[var(--heo-shadow-border)] dark:bg-[var(--heo-color-card-dark)] lg:h-full'>
        <span className='text-sm text-gray-400'>暂无推荐内容</span>
      </div>
    )
  }

  const current = slides[index]
  const hasCover = Boolean(current?.cover)

  return (
    <div className='home-center-left group relative h-[240px] flex-1 overflow-hidden rounded-[22px] bg-[var(--heo-color-card)] shadow-[var(--heo-shadow-border)] dark:bg-[var(--heo-color-card-dark)] lg:h-full'>
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
            <div className='absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[rgba(45,55,150,0.88)] via-[rgba(66,90,239,0.35)] to-transparent' />
          </div>
        )
      })}

      {/* 底部文案与控件 */}
      <div className='absolute inset-x-0 bottom-0 z-[2] flex items-end justify-between gap-3 p-5 sm:p-7'>
        <div className='min-w-0 flex-1'>
          <SmartLink
            href={current.href}
            className='line-clamp-2 text-lg font-bold leading-snug text-white drop-shadow-sm sm:text-[26px] sm:leading-[1.35]'>
            {current.title}
          </SmartLink>
          <div className='mt-2.5 flex flex-wrap items-center gap-3'>
            <span className='inline-flex items-center gap-1 text-xs text-white/90'>
              <i className='fas fa-star text-[10px]' />
              {tagText}
            </span>
            {slides.length > 1 && (
              <div className='flex items-center gap-1.5'>
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type='button'
                    aria-label={`切换到第 ${i + 1} 张`}
                    onClick={() => setIndex(i)}
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
          <div className='flex shrink-0 items-center gap-2 pb-0.5'>
            <CarouselArrow direction='prev' onClick={() => go(-1)} />
            <CarouselArrow direction='next' onClick={() => go(1)} />
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
 * 右侧资料卡 + 订阅卡（对齐截图布局）
 */
function HeroAside(props) {
  const { siteInfo } = props
  const greetings = normalizeList(
    siteConfig('HEO_INFOCARD_GREETINGS', null, CONFIG)
  )
  const [greeting, setGreeting] = useState(greetings[0] || '你好！')

  const author = siteConfig('AUTHOR') || siteInfo?.title || ''
  const bio = siteConfig('BIO') || siteInfo?.description || ''
  const avatar = siteInfo?.icon

  const socialUrl1 = siteConfig('HEO_INFO_CARD_URL1', null, CONFIG)
  const socialIcon1 = siteConfig('HEO_INFO_CARD_ICON1', 'fas fa-user', CONFIG)
  const socialUrl2 = siteConfig('HEO_INFO_CARD_URL2', null, CONFIG)
  const socialIcon2 = siteConfig('HEO_INFO_CARD_ICON2', 'fab fa-github', CONFIG)

  const subscribeEnable = siteConfig('HEO_HERO_SUBSCRIBE_ENABLE', true, CONFIG)
  const subscribeTitle = siteConfig(
    'HEO_HERO_SUBSCRIBE_TITLE',
    '公众号订阅',
    CONFIG
  )
  const subscribeUrl =
    siteConfig('HEO_HERO_SUBSCRIBE_URL', null, CONFIG) ||
    siteConfig('HEO_SOCIAL_CARD_URL', null, CONFIG) ||
    '/'
  const subscribeIcon = siteConfig(
    'HEO_HERO_SUBSCRIBE_ICON',
    'fab fa-weixin',
    CONFIG
  )
  const subscribeColor = siteConfig(
    'HEO_HERO_SUBSCRIBE_COLOR',
    'linear-gradient(135deg, #3ddc5a 0%, #22c43e 55%, #1db954 100%)',
    CONFIG
  )
  const subscribeStyle = String(subscribeColor).includes('gradient')
    ? { backgroundImage: subscribeColor }
    : { backgroundColor: subscribeColor }

  const nextGreeting = () => {
    if (greetings.length <= 1) return
    let next = greetings[Math.floor(Math.random() * greetings.length)]
    // 避免连续抽到同一句
    if (next === greeting && greetings.length > 1) {
      next = greetings[(greetings.indexOf(greeting) + 1) % greetings.length]
    }
    setGreeting(next)
  }

  return (
    <div className='flex w-full shrink-0 flex-col gap-3 lg:w-[272px] xl:w-[292px]'>
      {/* 个人资料卡：问候胶囊置顶居中 */}
      <div className='relative flex min-h-[220px] flex-1 flex-col overflow-hidden rounded-[22px] bg-[var(--heo-color-primary)] px-4 pb-4 pt-3 text-[var(--heo-color-primary-text)] shadow-[var(--heo-shadow-border,0_8px_16px_-4px_#2c2d300c)] dark:bg-[var(--heo-color-accent)] lg:min-h-0'>
        <div className='flex justify-center'>
          <button
            type='button'
            onClick={nextGreeting}
            className='max-w-[92%] truncate rounded-full bg-black/20 px-3.5 py-1 text-[13px] font-medium text-white backdrop-blur-[2px] transition hover:bg-black/30'>
            {greeting}
          </button>
        </div>

        <div className='relative mx-auto flex flex-1 items-center justify-center py-3'>
          <LazyImage
            src={avatar}
            alt={author}
            className='h-[88px] w-[88px] rounded-full border-[3px] border-white object-cover shadow-lg'
          />
          <span
            aria-hidden
            className='absolute bottom-3 right-[calc(50%-52px)] flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-white text-sm shadow'>
            {siteConfig('HEO_INFO_CARD_EMOJI', '😆', CONFIG)}
          </span>
        </div>

        <div className='flex items-end justify-between gap-2'>
          <div className='min-w-0 flex-1'>
            <div className='truncate text-[22px] font-extrabold leading-none'>
              {author}
            </div>
            {bio && (
              <div className='mt-1.5 line-clamp-2 text-xs leading-snug opacity-85'>
                {bio}
              </div>
            )}
          </div>
          <div className='mb-0.5 flex shrink-0 items-center gap-2'>
            {socialUrl1 && <SocialIcon href={socialUrl1} icon={socialIcon1} />}
            {socialUrl2 && <SocialIcon href={socialUrl2} icon={socialIcon2} />}
          </div>
        </div>
      </div>

      {/* 绿色订阅条 */}
      {subscribeEnable && (
        <SmartLink
          href={subscribeUrl}
          className='group flex h-[54px] items-center justify-between rounded-[18px] px-4 text-white shadow-[var(--heo-shadow-border,0_8px_16px_-4px_#2c2d300c)] transition hover:brightness-105 active:scale-[0.98]'
          style={subscribeStyle}>
          <span className='flex items-center gap-2.5 text-[15px] font-bold'>
            <i className={`${subscribeIcon} text-lg`} />
            {subscribeTitle}
          </span>
          <span className='flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-white transition group-hover:translate-x-0.5'>
            <i className='fas fa-arrow-right text-sm' />
          </span>
        </SmartLink>
      )}
    </div>
  )
}

function SocialIcon({ href, icon }) {
  return (
    <SmartLink
      href={href}
      className='flex h-8 w-8 items-center justify-center rounded-full border border-white/35 text-sm transition hover:scale-110 hover:bg-white hover:text-[var(--heo-color-primary)] dark:hover:text-black'>
      <i className={icon} />
    </SmartLink>
  )
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
    href: post?.href || `${siteConfig('SUB_PATH', '')}/${post?.slug}`,
    cover: post?.pageCoverThumbnail || post?.pageCover || siteInfo?.pageCover
  }))
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean)
  }
  if (typeof value !== 'string') return []
  const trimmed = value.trim()
  if (!trimmed) return []
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      return normalizeList(JSON.parse(trimmed.replace(/'/g, '"')))
    } catch {
      return trimmed
        .slice(1, -1)
        .split(',')
        .map(item => item.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    }
  }
  return [trimmed]
}

function parseBool(value) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true'
  return Boolean(value)
}

export default Hero
