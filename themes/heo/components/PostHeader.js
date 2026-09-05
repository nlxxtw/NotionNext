import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import WordCount from '@/components/WordCount'
import { siteConfig } from '@/lib/config'
import { formatDateFmt } from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'
import { useEffect, useState } from 'react'
import WavesArea from './WavesArea'

/**
 * 文章页头：等封面色就绪再铺色，避免默认主色闪一下；
 * 右侧预览卡加深阴影与边框，降低「发白过亮」感
 */
export default function PostHeader({ post, siteInfo, lock }) {
  if (!post) return null

  const headerImage = post?.pageCoverThumbnail || post?.pageCover || ''
  const coverSrc = headerImage || ''
  const ANALYTICS_BUSUANZI_ENABLE = siteConfig('ANALYTICS_BUSUANZI_ENABLE')

  const [showAside, setShowAside] = useState(Boolean(coverSrc))
  // 未取到封面色前不铺默认紫，避免跳色
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

  // 监听封面取色结果（PostCoverTheme 写入 --heo-cover-main）
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
          // 取色失败才用主色兜底，仍做一次淡入
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

  return (
    <div
      id='post-bg'
      className='heo-post-bg relative z-10 -mb-5 h-[28rem] w-full overflow-hidden md:mb-0 md:h-[30rem] md:flex-shrink-0'
      style={{
        backgroundColor: bgReady ? bgColor : '#1e1f26',
        opacity: bgReady ? 1 : 0.92,
        transition: 'background-color 280ms ease, opacity 280ms ease'
      }}>
      {/* 轻暗角，压住过亮封面色 */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0'
        style={{
          background:
            'radial-gradient(ellipse 75% 55% at 82% 38%, rgba(255,255,255,0.14), transparent 58%), linear-gradient(180deg, rgba(0,0,0,0.08) 0%, transparent 42%, rgba(0,0,0,0.18) 100%)'
        }}
      />

      <div className='relative z-[1] flex h-full w-full items-center justify-center py-10'>
        <div
          id='post-info'
          className={`absolute top-44 z-10 flex w-full max-w-[86rem] flex-col space-y-4 px-5 md:top-48 lg:-mt-8 ${
            showAside ? 'lg:pr-[340px]' : ''
          }`}>
          <div className='flex items-center justify-center gap-3 md:justify-start'>
            {post.category && (
              <SmartLink
                href={`/category/${post.category}`}
                className='rounded-full border border-white/15 bg-black/20 px-3 py-1 text-sm font-bold text-white shadow-[0_6px_16px_-8px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:bg-white hover:text-gray-900'>
                {post.category}
              </SmartLink>
            )}
            {post.tagItems?.length > 0 && (
              <div className='hidden flex-nowrap items-center gap-2 overflow-x-auto md:flex'>
                {post.tagItems.map((tag, index) => (
                  <SmartLink
                    key={index}
                    href={`/tag/${encodeURIComponent(tag.name)}`}
                    className='whitespace-nowrap text-sm font-medium text-white/85 transition hover:text-white'>
                    {tag.name}
                  </SmartLink>
                ))}
              </div>
            )}
          </div>

          <h1 className='flex max-w-4xl justify-center text-center text-[1.75rem] font-extrabold leading-snug text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)] md:justify-start md:text-left md:text-4xl lg:text-[2.75rem] lg:leading-[1.25]'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post.pageIcon} />
            )}
            {post.title}
          </h1>

          <section className='mt-2 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-sm font-medium text-white/92 md:justify-start'>
            {!lock && (
              <span className='inline-flex items-center rounded-full border border-white/12 bg-black/18 px-2.5 py-1 shadow-[0_4px_14px_-8px_rgba(0,0,0,0.4)] backdrop-blur-md'>
                <WordCount
                  wordCount={post.wordCount}
                  readTime={post.readTime}
                />
              </span>
            )}
            {post?.type !== 'Page' && (
              <SmartLink
                href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
                className='inline-flex items-center rounded-full border border-white/12 bg-black/18 px-2.5 py-1 shadow-[0_4px_14px_-8px_rgba(0,0,0,0.4)] backdrop-blur-md transition hover:bg-white/20'>
                <i className='fa-regular fa-calendar mr-1.5 text-[12px]' />
                {post?.publishDay}
              </SmartLink>
            )}
            {post.lastEditedDay && (
              <span className='inline-flex items-center rounded-full border border-white/12 bg-black/18 px-2.5 py-1 shadow-[0_4px_14px_-8px_rgba(0,0,0,0.4)] backdrop-blur-md'>
                <i className='fa-regular fa-calendar-check mr-1.5 text-[12px]' />
                {post.lastEditedDay}
              </span>
            )}
            {ANALYTICS_BUSUANZI_ENABLE && (
              <span className='busuanzi_container_page_pv inline-flex items-center rounded-full border border-white/12 bg-black/18 px-2.5 py-1 shadow-[0_4px_14px_-8px_rgba(0,0,0,0.4)] backdrop-blur-md'>
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
            className='heo-post-cover-aside group absolute right-6 top-1/2 z-[11] hidden w-[280px] -translate-y-1/2 overflow-hidden rounded-[18px] md:block md:w-[300px] xl:right-[max(calc((100vw-86rem)/2+1.25rem),1.5rem)]'
            style={{
              aspectRatio: '16 / 9',
              boxShadow:
                '0 4px 6px rgba(0,0,0,0.12), 0 22px 48px -16px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.14)',
              transition: 'transform 200ms ease, box-shadow 200ms ease'
            }}
            title={post.title}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.03)'
              e.currentTarget.style.boxShadow =
                '0 8px 12px rgba(0,0,0,0.16), 0 28px 56px -14px rgba(0,0,0,0.62), 0 0 0 1px rgba(255,255,255,0.2)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
              e.currentTarget.style.boxShadow =
                '0 4px 6px rgba(0,0,0,0.12), 0 22px 48px -16px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.14)'
            }}>
            <LazyImage
              id='post-cover'
              src={coverSrc}
              alt={post.title || 'cover'}
              className='h-full w-full object-cover transition duration-200 group-hover:scale-105'
            />
            {/* 压亮：底部轻暗 + 内描边，避免预览过曝 */}
            <span
              aria-hidden
              className='pointer-events-none absolute inset-0 rounded-[18px]'
              style={{
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.22)',
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0.04) 0%, transparent 40%, rgba(0,0,0,0.22) 100%)'
              }}
            />
          </a>
        )}

        <WavesArea />
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
