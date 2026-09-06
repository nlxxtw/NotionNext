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
      <div
        onClick={handleSearch}
        title={locale.NAV.SEARCH}
        className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[15px] transition-all duration-200 hover:bg-black/10 dark:hover:bg-white/10'>
        <i title={locale.NAV.SEARCH} className='fa-solid fa-magnifying-glass' />
      </div>
      <AlgoliaSearchModal cRef={searchModal} {...props} />
    </>
  )
}
