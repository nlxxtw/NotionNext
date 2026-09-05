import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import WordCount from '@/components/WordCount'
import { siteConfig } from '@/lib/config'
import { formatDateFmt } from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'
import { useEffect, useState } from 'react'

/**
 * 文章页头：紧凑高度；标题上移；右侧始终显示封面预览（有图时）
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

  const [bgColor, setBgColor] = useState('')
  const [bgReady, setBgReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    let tries = 0

    const readCoverMain = () => {
      const root = document.getElementById('theme-heo')
      if (!root) return ''
      return getComputedStyle(root).getPropertyValue('--heo-cover-main').trim()
    }

    const apply = () => {
      if (cancelled) return
      const color = readCoverMain()
      if (color) {
        setBgColor(color)
        setBgReady(true)
        return true
      }
      return false
    }

    if (apply()) return undefined

    const timer = setInterval(() => {
      tries += 1
      if (apply() || tries > 40) {
        clearInterval(timer)
        if (!cancelled && !readCoverMain()) {
          setBgColor(
            getComputedStyle(document.documentElement)
              .getPropertyValue('--heo-color-primary')
              .trim() || '#7a5dfa'
          )
          setBgReady(true)
        }
      }
    }, 50)

    const onReady = () => apply()
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
    post.lastEditedDay &&
    post.lastEditedDay !== post.publishDay

  return (
    <div
      id='post-bg'
      className='heo-post-bg relative z-10 mb-0 w-full overflow-hidden md:flex-shrink-0'
      style={{
        backgroundColor: bgReady ? bgColor : '#1e1f26',
        opacity: bgReady ? 1 : 0.92,
        transition: 'background-color 280ms ease, opacity 280ms ease'
      }}>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0'
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 82% 40%, rgba(255,255,255,0.1), transparent 62%), linear-gradient(180deg, rgba(0,0,0,0.06) 0%, transparent 50%, rgba(0,0,0,0.12) 100%)'
        }}
      />

      <div className='relative z-[1] mx-auto flex h-full w-full max-w-[86rem] items-end justify-between gap-6 px-5 pb-7 pt-[4.75rem] md:pb-8 md:pt-20'>
        <div
          id='post-info'
          className={`relative z-10 flex min-w-0 flex-1 flex-col gap-2.5 ${
            showAside ? 'lg:pr-4' : ''
          }`}>
          <div className='flex items-center justify-center gap-2.5 md:justify-start'>
            {post.category && (
              <SmartLink
                href={`/category/${post.category}`}
                className='rounded-full border-0 bg-white/18 px-2.5 py-0.5 text-[13px] font-bold text-white backdrop-blur-[6px] transition hover:bg-white/28'>
                {post.category}
              </SmartLink>
            )}
            {post.tagItems?.length > 0 && (
              <div className='hidden flex-nowrap items-center gap-2 overflow-x-auto md:flex'>
                {post.tagItems.map((tag, index) => (
                  <SmartLink
                    key={index}
                    href={`/tag/${encodeURIComponent(tag.name)}`}
                    className='whitespace-nowrap text-[13px] font-medium text-white/90 transition hover:text-white'>
                    {tag.name}
                  </SmartLink>
                ))}
              </div>
            )}
          </div>

          <h1 className='max-w-3xl text-center text-[1.45rem] font-extrabold leading-[1.3] tracking-normal text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.3)] md:text-left md:text-[1.85rem] md:leading-[1.28] lg:text-[2.15rem] lg:leading-[1.26]'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon
                icon={post.pageIcon}
                className='mr-1.5 inline-block align-middle'
              />
            )}
            <span className='align-middle'>{post.title}</span>
          </h1>

          <section className='heo-post-meta flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 md:justify-start'>
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
            className='heo-post-cover-aside group relative z-[11] mb-0.5 hidden w-[220px] shrink-0 overflow-hidden rounded-[14px] md:block md:w-[240px] lg:w-[260px]'
            style={{
              aspectRatio: '16 / 9',
              boxShadow: '0 8px 20px -12px rgba(0,0,0,0.35)',
              transition: 'transform 200ms ease, box-shadow 200ms ease'
            }}
            title={post.title}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.02)'
              e.currentTarget.style.boxShadow =
                '0 10px 24px -12px rgba(0,0,0,0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow =
                '0 8px 20px -12px rgba(0,0,0,0.35)'
            }}>
            <LazyImage
              id='post-cover'
              src={coverSrc}
              alt={post.title || 'cover'}
              className='h-full w-full object-cover transition duration-200 group-hover:scale-105'
            />
            <span
              aria-hidden
              className='pointer-events-none absolute inset-0 rounded-[14px]'
              style={{
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0.04) 0%, transparent 40%, rgba(0,0,0,0.18) 100%)'
              }}
            />
          </a>
        )}
      </div>
    </div>
  )
}
