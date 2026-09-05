import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import WordCount from '@/components/WordCount'
import { siteConfig } from '@/lib/config'
import { formatDateFmt } from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'
import { useEffect, useState } from 'react'

/**
 * 文章页头：封面色贯通；无波浪；右侧预览卡在内容区中部；元信息高对比白字
 */
export default function PostHeader({ post, siteInfo, lock }) {
  if (!post) return null

  const headerImage = post?.pageCoverThumbnail || post?.pageCover || ''
  const coverSrc = headerImage || ''
  const ANALYTICS_BUSUANZI_ENABLE = siteConfig('ANALYTICS_BUSUANZI_ENABLE')

  const [showAside, setShowAside] = useState(Boolean(coverSrc))
  const [bgColor, setBgColor] = useState('')
  const [bgReady, setBgReady] = useState(false)

  useEffect(() => {
    if (!coverSrc) {
      setShowAside(false)
      return
    }
    setShowAside(true)
    let cancelled = false
    isCoverTooLight(coverSrc).then(tooLight => {
      if (!cancelled && tooLight) setShowAside(false)
    })
    return () => {
      cancelled = true
    }
  }, [coverSrc])

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
    'heo-post-meta-pill inline-flex items-center rounded-full border-0 bg-white/18 px-3 py-1.5 text-[13px] font-semibold text-white backdrop-blur-[6px]'

  return (
    <div
      id='post-bg'
      className='heo-post-bg relative z-10 -mb-5 h-[28rem] w-full overflow-hidden md:mb-0 md:h-[30rem] md:flex-shrink-0'
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
            'radial-gradient(ellipse 75% 55% at 82% 38%, rgba(255,255,255,0.12), transparent 58%), linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)'
        }}
      />

      <div className='relative z-[1] flex h-full w-full items-center justify-center py-10'>
        <div
          id='post-info'
          className={`absolute top-40 z-10 flex w-full max-w-[86rem] flex-col space-y-4 px-5 md:top-44 lg:-mt-6 ${
            showAside ? 'lg:pr-[340px]' : ''
          }`}>
          <div className='flex items-center justify-center gap-3 md:justify-start'>
            {post.category && (
              <SmartLink
                href={`/category/${post.category}`}
                className='rounded-full border-0 bg-white/18 px-3 py-1 text-sm font-bold text-white backdrop-blur-[6px] transition hover:bg-white/28'>
                {post.category}
              </SmartLink>
            )}
            {post.tagItems?.length > 0 && (
              <div className='hidden flex-nowrap items-center gap-2 overflow-x-auto md:flex'>
                {post.tagItems.map((tag, index) => (
                  <SmartLink
                    key={index}
                    href={`/tag/${encodeURIComponent(tag.name)}`}
                    className='whitespace-nowrap text-sm font-medium text-white/90 transition hover:text-white'>
                    {tag.name}
                  </SmartLink>
                ))}
              </div>
            )}
          </div>

          <h1 className='max-w-4xl text-center text-[1.85rem] font-extrabold leading-[1.35] tracking-normal text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.35)] md:text-left md:text-4xl md:leading-[1.3] lg:text-[2.75rem] lg:leading-[1.28]'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon
                icon={post.pageIcon}
                className='mr-2 inline-block align-middle'
              />
            )}
            <span className='align-middle'>{post.title}</span>
          </h1>

          <section className='heo-post-meta mt-2 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 md:justify-start'>
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
                <i className='fa-regular fa-calendar mr-1.5 text-[12px]' />
                {post?.publishDay}
              </SmartLink>
            )}
            {post.lastEditedDay && (
              <span className={metaPill}>
                <i className='fa-regular fa-calendar-check mr-1.5 text-[12px]' />
                {post.lastEditedDay}
              </span>
            )}
            {ANALYTICS_BUSUANZI_ENABLE && (
              <span className={`busuanzi_container_page_pv ${metaPill}`}>
                <i className='fa-solid fa-fire-flame-curved mr-1.5 text-[12px]' />
                <span className='busuanzi_value_page_pv' />
              </span>
            )}
          </section>
        </div>

        {showAside && coverSrc && (
          <a
            href={coverSrc}
            target='_blank'
            rel='noopener noreferrer'
            className='heo-post-cover-aside group absolute right-5 z-[11] hidden w-[280px] overflow-hidden rounded-[18px] md:block md:w-[300px] xl:right-[max(calc((100vw-86rem)/2+1.25rem),1.25rem)]'
            style={{
              aspectRatio: '16 / 9',
              boxShadow: '0 12px 28px -14px rgba(0,0,0,0.45)',
              transition: 'transform 200ms ease, box-shadow 200ms ease'
            }}
            title={post.title}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.03)'
              e.currentTarget.style.boxShadow =
                '0 16px 32px -12px rgba(0,0,0,0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
              e.currentTarget.style.boxShadow =
                '0 12px 28px -14px rgba(0,0,0,0.45)'
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
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0.04) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)'
              }}
            />
          </a>
        )}
      </div>
    </div>
  )
}

function isCoverTooLight(url) {
  return new Promise(resolve => {
    if (!url || typeof window === 'undefined') {
      resolve(false)
      return
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    const timer = setTimeout(() => resolve(false), 4000)
    img.onload = () => {
      clearTimeout(timer)
      try {
        const size = 32
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        if (!ctx) {
          resolve(false)
          return
        }
        ctx.drawImage(img, 0, 0, size, size)
        const { data } = ctx.getImageData(0, 0, size, size)
        let sum = 0
        let n = 0
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 128) continue
          sum += (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000
          n++
        }
        const avg = n ? sum / n : 0
        resolve(avg > 230)
      } catch {
        resolve(false)
      }
    }
    img.onerror = () => {
      clearTimeout(timer)
      resolve(true)
    }
    img.src = url
  })
}
