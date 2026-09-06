import { ChevronDoubleRight } from '@/components/HeroIcons'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useState } from 'react'

/**
 * 数字翻页插件
 * @param page 当前页码
 * @param showNext 是否有下一页
 * @returns {JSX.Element}
 * @constructor
 */
const PaginationNumber = ({ page, totalPage }) => {
  const router = useRouter()
  const { locale } = useGlobal()
  const currentPage = +page
  const showNext = page < totalPage
  const showPrev = currentPage !== 1
  const pagePrefix = router.asPath
    .split('?')[0]
    .replace(/\/page\/[1-9]\d*/, '')
    .replace(/\/$/, '')
    .replace('.html', '')
  const pages = generatePages(pagePrefix, page, currentPage, totalPage)

  const [value, setValue] = useState('')

  const handleInputChange = event => {
    const newValue = event.target.value.replace(/[^0-9]/g, '')
    setValue(newValue)
  }

  /**
   * 调到指定页
   */
  const jumpToPage = () => {
    if (value) {
      router.push(
        value === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${value}`
      )
    }
  }

  return (
    <>
      {/* pc端分页：居中对齐主栏文章区 */}
      <div className='mt-10 hidden items-center justify-center space-x-2 overflow-x-auto pt-3 font-medium text-black duration-500 dark:text-gray-300 lg:flex'>
        {/* 上一页 */}
        <SmartLink
          href={{
            pathname:
              currentPage === 2
                ? `${pagePrefix}/`
                : `${pagePrefix}/page/${currentPage - 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          rel='prev'
          className={`${currentPage === 1 ? 'invisible' : 'block'}`}>
          <div className='group relative flex h-10 w-24 cursor-pointer items-center justify-center rounded-lg border bg-[var(--heo-color-card)] px-2 py-2 transition-all duration-200 hover:border-[var(--heo-color-border)] dark:border-gray-600 dark:bg-[var(--heo-color-card-dark)] dark:hover:border-[var(--heo-color-border-dark)]'>
            <i className='fas fa-angle-left mr-2 transform transition-all duration-200 group-hover:-translate-x-4' />
            <div className='absolute ml-2 translate-x-4 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100'>
              {locale.PAGINATION.PREV}
            </div>
          </div>
        </SmartLink>

        {/* 分页 */}
        <div className='flex items-center space-x-2'>
          {pages}

          {/* 跳转页码 */}
          <div className='group flex h-10 items-center justify-center rounded-lg border bg-[var(--heo-color-card)] transition-all duration-200 hover:border-[var(--heo-color-border)] hover:bg-gray-100 dark:border-gray-600 dark:bg-[var(--heo-color-card-dark)] dark:hover:bg-[var(--heo-color-accent)]'>
            <input
              value={value}
              className='h-full w-0 rounded-lg border-none bg-gray-100 outline-none transition-all duration-200 group-hover:w-20 group-hover:px-3'
              onInput={handleInputChange}></input>
            <div
              onClick={jumpToPage}
              className='cursor-pointer bg-[var(--heo-color-card)] px-4 py-2 transition-all hover:bg-[var(--heo-color-primary)] hover:text-[var(--heo-color-primary-text)] group-hover:mx-1 group-hover:rounded group-hover:px-2 dark:bg-[var(--heo-color-card-dark)] dark:hover:bg-[var(--heo-color-accent)]'>
              <ChevronDoubleRight className={'h-4 w-4'} />
            </div>
          </div>
        </div>

        {/* 下一页 */}
        <SmartLink
          href={{
            pathname: `${pagePrefix}/page/${currentPage + 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          rel='next'
          className={`${+showNext ? 'block' : 'invisible'} `}>
          <div className='group relative flex h-10 w-24 cursor-pointer items-center justify-center rounded-lg border bg-[var(--heo-color-card)] px-2 py-2 transition-all duration-200 hover:border-[var(--heo-color-border)] dark:border-gray-600 dark:bg-[var(--heo-color-card-dark)] dark:hover:border-[var(--heo-color-border-dark)]'>
            <i className='fas fa-angle-right mr-2 transform transition-all duration-200 group-hover:translate-x-6' />
            <div className='absolute -translate-x-10 ml-2 opacity-0 transition-all duration-200 group-hover:-translate-x-2 group-hover:opacity-100'>
              {locale.PAGINATION.NEXT}
            </div>
          </div>
        </SmartLink>
      </div>

      {/* 移动端分页 */}

      <div className='lg:hidden w-full flex flex-row'>
        {/* 上一页 */}
        <SmartLink
          href={{
            pathname:
              currentPage === 2
                ? `${pagePrefix}/`
                : `${pagePrefix}/page/${currentPage - 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          rel='prev'
          className={`${showPrev ? 'block' : 'hidden'} dark:text-white relative w-full flex-1 h-14 flex items-center transition-all duration-200 justify-center py-2 px-2 bg-[var(--heo-color-card)] dark:bg-[var(--heo-color-card-dark)] border rounded-xl cursor-pointer`}>
          {locale.PAGINATION.PREV}
        </SmartLink>

        {showPrev && showNext && <div className='w-12'></div>}

        {/* 下一页 */}
        <SmartLink
          href={{
            pathname: `${pagePrefix}/page/${currentPage + 1}`,
            query: router.query.s ? { s: router.query.s } : {}
          }}
          rel='next'
          className={`${+showNext ? 'block' : 'hidden'} dark:text-white relative w-full flex-1 h-14 flex items-center transition-all duration-200 justify-center py-2 px-2 bg-[var(--heo-color-card)] dark:bg-[var(--heo-color-card-dark)] border rounded-xl cursor-pointer`}>
          {locale.PAGINATION.NEXT}
        </SmartLink>
      </div>
    </>
  )
}

/**
 * 页码按钮
 * @param {*} page
 * @param {*} currentPage
 * @param {*} pagePrefix
 * @returns
 */
function getPageElement(page, currentPage, pagePrefix) {
  const selected = page + '' === currentPage + ''
  if (!page) {
    return <></>
  }
  return (
    <SmartLink
      href={page === 1 ? `${pagePrefix}/` : `${pagePrefix}/page/${page}`}
      key={page}
      passHref
      className={
        (selected
          ? 'bg-[var(--heo-color-primary)] dark:bg-[var(--heo-color-accent)] text-[var(--heo-color-primary-text)] '
          : 'dark:bg-[var(--heo-color-card-dark)] bg-[var(--heo-color-card)]') +
        ' hover:border-[var(--heo-color-border)] dark:hover:bg-[var(--heo-color-accent)] dark:border-gray-600 px-4 border py-2 rounded-lg drop-shadow-sm duration-200 transition-colors'
      }>
      {page}
    </SmartLink>
  )
}

/**
 * 获取所有页码
 * @param {*} pagePrefix
 * @param {*} page
 * @param {*} currentPage
 * @param {*} totalPage
 * @returns
 */
function generatePages(pagePrefix, page, currentPage, totalPage) {
  const pages = []
  const groupCount = 7 // 最多显示页签数
  if (totalPage <= groupCount) {
    for (let i = 1; i <= totalPage; i++) {
      pages.push(getPageElement(i, page, pagePrefix))
    }
  } else {
    pages.push(getPageElement(1, page, pagePrefix))
    const dynamicGroupCount = groupCount - 2
    let startPage = currentPage - 2
    if (startPage <= 1) {
      startPage = 2
    }
    if (startPage + dynamicGroupCount > totalPage) {
      startPage = totalPage - dynamicGroupCount
    }
    if (startPage > 2) {
      pages.push(
        <div key={-1} className='-mt-2 mx-1'>
          ...{' '}
        </div>
      )
    }

    for (let i = 0; i < dynamicGroupCount; i++) {
      if (startPage + i < totalPage) {
        pages.push(getPageElement(startPage + i, page, pagePrefix))
      }
    }

    if (startPage + dynamicGroupCount < totalPage) {
      pages.push(<div key={-2}>... </div>)
    }

    pages.push(getPageElement(totalPage, page, pagePrefix))
  }
  return pages
}
export default PaginationNumber
