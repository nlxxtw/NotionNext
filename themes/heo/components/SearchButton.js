import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useRef } from 'react'

const AlgoliaSearchModal = dynamic(
  () => import('@/components/AlgoliaSearchModal'),
  { ssr: false }
)

/**
 * 搜索按钮
 */
export default function SearchButton(props) {
  const { locale } = useGlobal()
  const router = useRouter()
  const searchModal = useRef(null)

  function handleSearch() {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal.current.openSearch()
    } else {
      router.push('/search')
    }
  }

  return (
    <>
      <button
        type='button'
        onClick={handleSearch}
        title={locale.NAV.SEARCH}
        aria-label={locale.NAV.SEARCH}
        className='heo-nav-icon-btn flex h-9 w-9 cursor-pointer items-center justify-center rounded-full duration-200 transition-all hover:bg-black/10 dark:hover:bg-white/10'>
        <i className='fa-solid fa-magnifying-glass text-[14px]' aria-hidden />
      </button>
      <AlgoliaSearchModal cRef={searchModal} {...props} />
    </>
  )
}
