import { useState } from 'react'
import { siteConfig } from '@/lib/config'

/** 评论系统 tab 中文名 */
const DEFAULT_TAB_LABELS = {
  Artalk: 'Artalk',
  Waline: 'Waline',
  Twikoo: '哔哔',
  Valine: 'Valine',
  Giscus: 'Giscus',
  Cusdis: 'Cusdis',
  Utterance: 'Utterance',
  GitTalk: 'Gitalk',
  WebMention: 'WebMention',
  Notion: 'Notion'
}

/**
 * Tabs切换标签
 * @param {string} className
 * @param {React.ReactNode} heading 左侧标题（如「评论」），与 tab 同一行
 * @param {Record<string,string>} labels 覆盖 tab 文案
 * @param {React.ReactNode} children
 */
const Tabs = ({ className, children, heading, labels }) => {
  const [currentTab, setCurrentTab] = useState(0)

  const validChildren = (Array.isArray(children) ? children : [children]).filter(
    Boolean
  )

  if (validChildren.length === 0) {
    return <></>
  }

  const hideTabs =
    validChildren.length === 1 && siteConfig('COMMENT_HIDE_SINGLE_TAB')
  const labelOf = key => labels?.[key] || DEFAULT_TAB_LABELS[key] || key

  return (
    <div className={`mb-5 duration-200 ${className || ''}`}>
      {(heading || !hideTabs) && (
        <div className='heo-comment-tabs-bar mb-4 flex flex-wrap items-center gap-x-4 gap-y-2'>
          {heading}
          {!hideTabs && (
            <ul className='heo-comment-tabs flex flex-wrap items-center gap-1 overflow-auto rounded-full bg-[var(--heo-color-card-muted,#f3f4f8)] p-1 dark:bg-white/5'>
              {validChildren.map((item, index) => {
                const active = currentTab === index
                return (
                  <li key={item.key || index}>
                    <button
                      type='button'
                      className={`heo-comment-tab rounded-full px-3.5 py-1.5 text-[13px] transition ${
                        active
                          ? 'bg-white font-bold text-[var(--heo-color-primary,#425aef)] shadow-sm dark:bg-[#2a2b31] dark:text-[var(--heo-color-accent,#f2b94b)]'
                          : 'cursor-pointer font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                      onClick={() => setCurrentTab(index)}>
                      {labelOf(item.key)}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {/* 标签切换的时候不销毁 DOM 元素，使用 CSS 样式进行隐藏 */}
      <div>
        {validChildren.map((item, index) => (
          <section
            key={item.key || index}
            className={`${
              currentTab === index
                ? 'static h-auto opacity-100'
                : 'pointer-events-none absolute h-0 overflow-hidden opacity-0'
            }`}>
            {item}
          </section>
        ))}
      </div>
    </div>
  )
}

export default Tabs
