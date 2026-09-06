import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import WordCount from '@/components/WordCount'
import { siteConfig } from '@/lib/config'
import { formatDateFmt } from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'
import { useEffect, useState } from 'react'
import {
  getCachedCoverColor,
  resolveInstantCoverColor
} from '../lib/coverColor'

/**
 * 文章页头：对齐 Heo —— 内容上移、底边留白、右侧大封面
 */
export default function PostHeader({ post, siteInfo, lock }) {
  if (!post) return null

  const coverSrc =
    post?.pageCoverThumbnail ||
    post?.pageCover ||
    siteInfo?.pageCover ||
    ''
  const ANALYTICS_BUSUANZI_ENABLE = siteConfig('ANALYTICS_BUSUANZI_ENABLE')
  const showAside = Boolean(coverSrc)

  // 首屏尽量直接用缓存/手动色，避免默认紫中间态
  const [bgColor, setBgColor] = useState(() => {
    if (typeof window === 'undefined') return ''
    return resolveInstantCoverColor(post) || getCachedCoverColor(coverSrc) || ''
  })
  const [bgReady, setBgReady] = useState(() => {
    if (typeof window === 'undefined') return false
    return Boolean(
      resolveInstantCoverColor(post) || getCachedCoverColor(coverSrc)
    )
  })

  useEffect(() => {
    let cancelled = false
    let tries = 0

    const readCoverMain = () => {
      const root = document.getElementById('theme-heo')
      if (!root) return ''
      return getComputedStyle(root).getPropertyValue('--heo-cover-main').trim()
    }

    const apply = color => {
      if (cancelled || !color) return false
      setBgColor(color)
      setBgReady(true)
      return true
    }

    const instant =
      resolveInstantCoverColor(post) || getCachedCoverColor(coverSrc)
    if (instant) apply(instant)

    const fromCss = readCoverMain()
    if (fromCss) apply(fromCss)

    const timer = setInterval(() => {
      tries += 1
      const color = readCoverMain()
      if (color) {
        apply(color)
        clearInterval(timer)
        return
      }
      // 超时也不回落到内置紫，保持中性深底直到取色完成
      if (tries > 60) clearInterval(timer)
    }, 40)

    const onReady = e => {
      const color = e?.detail?.color || readCoverMain()
      apply(color)
    }
    window.addEventListener('heo-cover-theme-ready', onReady)

    return () => {
      cancelled = true
      clearInterval(timer)
      window.removeEventListener('heo-cover-theme-ready', onReady)
    }
  }, [post?.id, coverSrc])

  const metaPill =
    'heo-post-meta-pill inline-flex items-center rounded-full border-0 bg-white/18 px-2.5 py-1 text-[12px] font-semibold text-white backdrop-blur-[6px]'

  const showEdited =
    post.lastEditedDay && post.lastEditedDay !== post.publishDay

  return (
    <div
      id='post-bg'
      className='heo-post-bg relative z-10 mb-0 w-full overflow-hidden md:flex-shrink-0'
      style={{
        // 无色时用中性深底，不用内置主题紫
        backgroundColor: bgReady && bgColor ? bgColor : '#1a1b21',
        transition: bgReady
          ? 'background-color 180ms ease'
          : 'background-color 0ms'
      }}>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0'
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 82% 40%, rgba(255,255,255,0.1), transparent 62%), linear-gradient(180deg, rgba(0,0,0,0.06) 0%, transparent 50%, rgba(0,0,0,0.12) 100%)'
        }}
      />

      <div className='relative z-[1] mx-auto flex h-full w-full max-w-[86rem] items-end justify-between gap-8 px-5 pb-10 pt-16 md:pb-12 md:pt-[4.25rem] lg:pb-14'>
        <div
          id='post-info'
          className={`relative z-10 flex min-w-0 flex-1 flex-col gap-3 md:gap-3.5 ${
            showAside ? 'lg:pr-2' : ''
          }`}>
          <div className='flex flex-wrap items-center justify-center gap-2 md:justify-start'>
            {post.category && (
              <SmartLink
                href={`/category/${post.category}`}
                className='rounded-full border-0 bg-white px-2.5 py-0.5 text-[12px] font-bold text-gray-800 transition hover:bg-white/90'>
                {post.category}
              </SmartLink>
            )}
            {post.tagItems?.length > 0 &&
              post.tagItems.map((tag, index) => (
                <SmartLink
                  key={index}
                  href={`/tag/${encodeURIComponent(tag.name)}`}
                  className='rounded-full border-0 bg-white/90 px-2.5 py-0.5 text-[12px] font-bold text-gray-800 transition hover:bg-white'>
                  {tag.name}
                </SmartLink>
              ))}
          </div>

          <h1 className='max-w-3xl text-center text-[1.5rem] font-extrabold leading-[1.28] tracking-normal text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.28)] md:text-left md:text-[1.95rem] md:leading-[1.26] lg:text-[2.25rem] lg:leading-[1.24]'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon
                icon={post.pageIcon}
                className='mr-1.5 inline-block align-middle'
              />
            )}
            <span className='align-middle'>{post.title}</span>
          </h1>

          <section className='heo-post-meta flex flex-wrap items-center justify-center gap-x-2 gap-y-2 md:justify-start'>
            {!lock && (
              <span className={metaPill}>
                <WordCount
                  wordCount={post.wordCount}
                  readTime={post.readTime}
                />
              </span>
            )}
            {post?.type !== 'Page' && (
              <SmartLink
                href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
                className={`${metaPill} transition hover:bg-white/28`}>
                <i className='fa-regular fa-calendar mr-1.5 text-[11px]' />
                {post?.publishDay}
              </SmartLink>
            )}
            {showEdited && (
              <span className={metaPill}>
                <i className='fa-regular fa-calendar-check mr-1.5 text-[11px]' />
                {post.lastEditedDay}
              </span>
            )}
            {ANALYTICS_BUSUANZI_ENABLE && (
              <span className={`busuanzi_container_page_pv ${metaPill}`}>
                <i className='fa-solid fa-fire-flame-curved mr-1.5 text-[11px]' />
                <span className='busuanzi_value_page_pv' />
              </span>
            )}
          </section>
        </div>

        {showAside && (
          <a
            href={coverSrc}
            target='_blank'
            rel='noopener noreferrer'
            className='heo-post-cover-aside group relative z-[11] hidden w-[260px] shrink-0 overflow-hidden rounded-[18px] md:block md:w-[280px] lg:w-[300px]'
            style={{
              aspectRatio: '16 / 10',
              boxShadow: '0 12px 28px -14px rgba(0,0,0,0.4)',
              transition: 'transform 200ms ease, box-shadow 200ms ease'
            }}
            title={post.title}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.02)'
              e.currentTarget.style.boxShadow =
                '0 14px 32px -14px rgba(0,0,0,0.45)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow =
                '0 12px 28px -14px rgba(0,0,0,0.4)'
            }}>
            <LazyImage
              id='post-cover'
              src={coverSrc}
              alt={post.title || 'cover'}
              className='h-full w-full object-cover transition duration-200 group-hover:scale-105'
            />
            <span
              aria-hidden
              className='pointer-events-none absolute inset-0 rounded-[18px]'
              style={{
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0.04) 0%, transparent 40%, rgba(0,0,0,0.16) 100%)'
              }}
            />
          </a>
        )}
      </div>
    </div>
  )
}
