import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import WordCount from '@/components/WordCount'
import { siteConfig } from '@/lib/config'
import { formatDateFmt } from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'
import { useEffect, useState } from 'react'
import WavesArea from './WavesArea'

/**
 * 文章页头（对齐 Heo）：主色底 + 右侧清晰封面预览卡
 * 封面过白/缺失时自动隐藏预览卡，避免发白糊块
 */
export default function PostHeader({ post, siteInfo, lock }) {
  if (!post) return null

  const headerImage = post?.pageCoverThumbnail || post?.pageCover || ''
  const coverSrc = headerImage || ''
  const ANALYTICS_BUSUANZI_ENABLE = siteConfig('ANALYTICS_BUSUANZI_ENABLE')
  const fallbackAccent = 'var(--heo-color-primary)'

  const [showAside, setShowAside] = useState(Boolean(coverSrc))

  useEffect(() => {
    if (!coverSrc) {
      setShowAside(false)
      return
    }
    // 先立刻显示，避免等亮度检测拖慢首屏；过白再隐藏
    setShowAside(true)
    let cancelled = false
    isCoverTooLight(coverSrc).then(tooLight => {
      if (!cancelled && tooLight) setShowAside(false)
    })
    return () => {
      cancelled = true
    }
  }, [coverSrc])

  return (
    <div
      id='post-bg'
      className='heo-post-bg relative z-10 -mb-5 h-[28rem] w-full overflow-hidden md:mb-0 md:h-[30rem] md:flex-shrink-0'
      style={{
        '--heo-post-bg-accent': `var(--heo-cover-main, ${fallbackAccent})`,
        backgroundColor: 'var(--heo-post-bg-accent)'
      }}>
      {/* 柔和氛围，不再用旋转模糊大图（易发白） */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-40'
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 85% 40%, rgba(255,255,255,0.18), transparent 55%)'
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
                className='rounded-lg bg-white/15 px-3 py-1 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-[var(--heo-color-primary)]'>
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

          <h1 className='flex max-w-4xl justify-center text-center text-[1.75rem] font-extrabold leading-snug text-white drop-shadow-sm md:justify-start md:text-left md:text-4xl lg:text-[2.75rem] lg:leading-[1.25]'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post.pageIcon} />
            )}
            {post.title}
          </h1>

          <section className='mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-light text-white/90 md:justify-start'>
            {!lock && (
              <WordCount
                wordCount={post.wordCount}
                readTime={post.readTime}
              />
            )}
            {post?.type !== 'Page' && (
              <SmartLink
                href={`/archive#${formatDateFmt(post?.publishDate, 'yyyy-MM')}`}
                className='hover:underline'>
                <i className='fa-regular fa-calendar mr-1' />
                {post?.publishDay}
              </SmartLink>
            )}
            {post.lastEditedDay && (
              <span>
                <i className='fa-regular fa-calendar-check mr-1' />
                {post.lastEditedDay}
              </span>
            )}
            {ANALYTICS_BUSUANZI_ENABLE && (
              <span className='busuanzi_container_page_pv'>
                <i className='fa-solid fa-fire-flame-curved mr-1' />
                <span className='busuanzi_value_page_pv' />
              </span>
            )}
          </section>
        </div>

        {/* 右侧清晰封面预览（对齐 Heo post-cover-aside） */}
        {showAside && coverSrc && (
          <a
            href={coverSrc}
            target='_blank'
            rel='noopener noreferrer'
            className='heo-post-cover-aside group absolute right-6 top-1/2 z-[11] hidden w-[280px] -translate-y-1/2 overflow-hidden rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] transition duration-200 hover:scale-[1.03] hover:shadow-[0_18px_48px_-12px_rgba(0,0,0,0.5)] xl:right-[max(calc((100vw-86rem)/2+1.25rem),1.5rem)] md:block md:w-[300px]'
            style={{ aspectRatio: '16 / 9' }}
            title={post.title}>
            <LazyImage
              id='post-cover'
              src={coverSrc}
              alt={post.title || 'cover'}
              className='h-full w-full object-cover transition duration-200 group-hover:scale-105'
            />
          </a>
        )}

        <WavesArea />
      </div>
    </div>
  )
}

/** 封面整体过亮则视为「发白」，隐藏预览卡 */
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
        // 接近白底（> 230）则隐藏
        resolve(avg > 230)
      } catch {
        // CORS 失败时仍显示预览卡
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
