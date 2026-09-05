import busuanzi from '@/lib/plugins/busuanzi'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import { useEffect } from 'react'

let path = ''

/**
 * 不蒜子：首屏即拉取；路由切换再刷新
 */
export default function Busuanzi() {
  const { theme } = useGlobal()
  const router = useRouter()

  useEffect(() => {
    busuanzi.fetch()
  }, [])

  useEffect(() => {
    if (theme) busuanzi.fetch()
  }, [theme])

  useEffect(() => {
    const onComplete = url => {
      if (url !== path) {
        path = url
        busuanzi.fetch()
      }
    }
    router.events.on('routeChangeComplete', onComplete)
    return () => {
      router.events.off('routeChangeComplete', onComplete)
    }
  }, [router.events])

  return null
}
