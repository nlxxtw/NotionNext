import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import { uuidToId } from 'notion-utils'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * 文章目录（对齐 Heo：默认白雾模糊，悬停整卡立刻清晰）
 */
const Catalog = ({ toc }) => {
  const { locale } = useGlobal()
  const tRef = useRef(null)
  const tocIdsRef = useRef([])
  const [activeSection, setActiveSection] = useState(null)

  const actionSectionScrollSpy = useCallback(
    throttle(() => {
      const sections = document.getElementsByClassName('notion-h')
      let prevBBox = null
      let currentSectionId = null
      for (let i = 0; i < sections.length; ++i) {
        const section = sections[i]
        if (!section || !(section instanceof Element)) continue
        if (!currentSectionId) {
          currentSectionId = section.getAttribute('data-id')
        }
        const bbox = section.getBoundingClientRect()
        const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0
        const offset = Math.max(150, prevHeight / 4)
        if (bbox.top - offset < 0) {
          currentSectionId = section.getAttribute('data-id')
          prevBBox = bbox
          continue
        }
        break
      }
      setActiveSection(currentSectionId)
      const index = tocIdsRef.current.indexOf(currentSectionId)
      if (index >= 0) {
        tRef?.current?.scrollTo({ top: 28 * index, behavior: 'smooth' })
      }
    }, 200),
    []
  )

  useEffect(() => {
    window.addEventListener('scroll', actionSectionScrollSpy, { passive: true })
    actionSectionScrollSpy()
    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy)
      actionSectionScrollSpy.cancel?.()
    }
  }, [actionSectionScrollSpy])

  if (!toc || toc.length < 1) {
    return null
  }

  tocIdsRef.current = []

  return (
    <div id='card-toc' className='heo-card-toc'>
      <div className='heo-toc-header mb-2 flex items-center gap-2 px-1 text-[14px] font-extrabold text-gray-800 dark:text-gray-100'>
        <i className='fas fa-stream text-[13px] opacity-70' aria-hidden />
        <span>{locale.COMMON.TABLE_OF_CONTENTS}</span>
      </div>
      <div
        className='heo-toc-content overflow-y-auto overscroll-none scroll-hidden max-h-48 lg:max-h-[min(24rem,calc(100dvh-20rem))]'
        ref={tRef}>
        <nav className='heo-toc-nav flex flex-col gap-0.5'>
          {toc.map(tocItem => {
            const id = uuidToId(tocItem.id)
            tocIdsRef.current.push(id)
            const active = activeSection === id
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`heo-toc-link catalog-item flex min-h-[40px] items-center rounded-xl px-2 py-2 text-[13px] leading-6 transition duration-200 ${
                  active
                    ? 'heo-toc-link--active bg-[var(--heo-color-primary)]/10 font-bold text-[var(--heo-color-primary)] dark:bg-[var(--heo-color-accent)]/15 dark:text-[var(--heo-color-accent)]'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                <span
                  style={{
                    display: 'inline-block',
                    marginLeft: (tocItem.indentLevel || 0) * 12,
                    width: '100%'
                  }}
                  className='heo-toc-link-text truncate'>
                  {tocItem.text}
                </span>
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export default Catalog
