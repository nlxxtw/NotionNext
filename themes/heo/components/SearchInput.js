import { useRouter } from 'next/router'
import { useImperativeHandle, useRef, useState } from 'react'
import { useGlobal } from '@/lib/global'

/**
 * 搜索输入框
 * variant: default | pill（Heo 搜索页胶囊样式）
 */
const SearchInput = props => {
  const { currentSearch, cRef, className, variant = 'default' } = props
  const [onLoading, setLoadingState] = useState(false)
  const router = useRouter()
  const searchInputRef = useRef()
  const { locale } = useGlobal()
  const lockRef = useRef(false)

  useImperativeHandle(cRef, () => {
    return {
      focus: () => {
        searchInputRef?.current?.focus()
      }
    }
  })

  const handleSearch = () => {
    const key = searchInputRef.current.value
    if (key && key !== '') {
      setLoadingState(true)
      router.push({ pathname: '/search/' + key }).then(() => {
        setLoadingState(false)
      })
    } else {
      router.push({ pathname: '/search' }).then(() => {})
    }
  }

  const handleKeyUp = e => {
    if (e.keyCode === 13) {
      handleSearch()
    } else if (e.keyCode === 27) {
      cleanSearch()
    }
  }

  const cleanSearch = () => {
    searchInputRef.current.value = ''
    setShowClean(false)
  }

  const [showClean, setShowClean] = useState(Boolean(currentSearch))
  const updateSearchKey = val => {
    if (lockRef.current) return
    searchInputRef.current.value = val
    setShowClean(Boolean(val))
  }

  function lockSearchInput() {
    lockRef.current = true
  }

  function unLockSearchInput() {
    lockRef.current = false
  }

  const isPill = variant === 'pill'
  const placeholder =
    isPill ? '输入关键词搜索' : locale.SEARCH.ARTICLES

  if (isPill) {
    return (
      <div
        className={`heo-search-pill relative flex w-full items-center ${className || ''}`}>
        <input
          ref={searchInputRef}
          type='search'
          enterKeyHint='search'
          className='w-full rounded-full border-0 bg-[var(--heo-color-card-muted)] py-3.5 pl-5 pr-14 text-[15px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:shadow-[0_10px_30px_-12px_rgba(122,93,250,0.35)] focus:ring-2 focus:ring-[var(--heo-color-primary)]/25 dark:bg-white/[0.08] dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:bg-white/[0.12] dark:focus:ring-[var(--heo-color-accent)]/30'
          onKeyUp={handleKeyUp}
          onCompositionStart={lockSearchInput}
          onCompositionUpdate={lockSearchInput}
          onCompositionEnd={unLockSearchInput}
          placeholder={placeholder}
          onChange={e => updateSearchKey(e.target.value)}
          defaultValue={currentSearch || ''}
        />
        <div className='absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1'>
          {showClean && (
            <button
              type='button'
              aria-label='清空'
              onClick={cleanSearch}
              className='flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-black/5 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white'>
              <i className='fas fa-times text-sm' />
            </button>
          )}
          <button
            type='button'
            aria-label='搜索'
            onClick={handleSearch}
            className='flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-[var(--heo-color-primary)] hover:text-white active:scale-95 dark:text-gray-300 dark:hover:bg-[var(--heo-color-primary)]'>
            <i
              className={`fas text-sm ${
                onLoading ? 'fa-spinner animate-spin' : 'fa-search'
              }`}
            />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={'flex w-full rounded-lg ' + (className || '')}>
      <input
        ref={searchInputRef}
        type='text'
        className='w-full rounded-lg bg-white pl-5 text-sm font-light leading-10 text-black outline-none transition focus:shadow-lg dark:bg-gray-500 dark:text-gray-300'
        onKeyUp={handleKeyUp}
        onCompositionStart={lockSearchInput}
        onCompositionUpdate={lockSearchInput}
        onCompositionEnd={unLockSearchInput}
        placeholder={placeholder}
        onChange={e => updateSearchKey(e.target.value)}
        defaultValue={currentSearch || ''}
      />

      <div
        className='-ml-8 float-right cursor-pointer items-center justify-center py-2'
        onClick={handleSearch}>
        <i
          className={`transform cursor-pointer text-gray-500 duration-200 hover:text-black dark:text-gray-200 fas ${
            onLoading ? 'fa-spinner animate-spin' : 'fa-search'
          }`}
        />
      </div>

      {showClean && (
        <div className='-ml-12 float-right cursor-pointer items-center justify-center py-2'>
          <i
            className='fas fa-times cursor-pointer text-gray-400 duration-200 hover:text-black dark:text-gray-300'
            onClick={cleanSearch}
          />
        </div>
      )}
    </div>
  )
}

export default SearchInput
