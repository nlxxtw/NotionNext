import { ArrowSmallUp } from '@/components/HeroIcons'
import { useEffect, useState } from 'react'

/**
 * 回顶按钮（显示阅读进度，点击平滑回到顶部）
 */
export default function ReadingProgress() {
  const [scrollPercentage, setScrollPercentage] = useState(0)

  function handleScroll() {
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = document.documentElement.clientHeight
    const scrollY = window.scrollY || window.pageYOffset
    const denom = scrollHeight - clientHeight - 20
    if (denom <= 0) {
      setScrollPercentage(0)
      return
    }
    const percent = Math.min(100, Math.max(0, Math.floor((scrollY / denom) * 100)))
    setScrollPercentage(percent)
  }

  useEffect(() => {
    let requestId

    function updateScrollPercentage() {
      handleScroll()
      requestId = null
    }

    function handleAnimationFrame() {
      if (requestId) {
        return
      }
      requestId = requestAnimationFrame(updateScrollPercentage)
    }

    window.addEventListener('scroll', handleAnimationFrame, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleAnimationFrame)
      if (requestId) {
        cancelAnimationFrame(requestId)
      }
    }
  }, [])

  const visible = scrollPercentage > 0

  return (
    <button
      type='button'
      title={`返回顶部 · 阅读进度 ${scrollPercentage}%`}
      aria-label='返回顶部'
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`${
        visible ? 'h-9 w-9' : 'pointer-events-none h-0 w-0 opacity-0'
      } group flex cursor-pointer items-center justify-center rounded-full transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10`}>
      {/* 默认显示向上箭头；悬停时显示进度数字 */}
      <div className='flex h-5 w-5 items-center justify-center rounded-full bg-black text-white'>
        <ArrowSmallUp
          className={'h-4 w-4 fill-white group-hover:hidden'}
        />
        <span className='hidden items-center justify-center text-[10px] group-hover:flex'>
          {scrollPercentage}
        </span>
      </div>
    </button>
  )
}
