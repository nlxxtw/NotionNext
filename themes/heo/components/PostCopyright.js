import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CONFIG from '../config'
import NotByAI from '@/components/NotByAI'

/**
 * 版权声明（恢复 NotionNext 原版：作者 / 链接 / 声明文案）
 */
export default function PostCopyright() {
  const router = useRouter()
  const [path, setPath] = useState(siteConfig('LINK') + router.asPath)
  useEffect(() => {
    setPath(window.location.href)
  }, [router.asPath])

  const { locale } = useGlobal()

  if (!siteConfig('HEO_ARTICLE_COPYRIGHT', true, CONFIG)) {
    return <></>
  }

  const notice =
    siteConfig('HEO_ARTICLE_COPYRIGHT_NOTICE', '', CONFIG) ||
    locale.COMMON.COPYRIGHT_NOTICE

  return (
    <section className='mx-1 mt-6 dark:text-gray-300'>
      <ul className='overflow-x-auto whitespace-nowrap border-l-2 border-black/10 bg-gray-100 p-5 text-sm leading-8 dark:border-white/15 dark:bg-gray-900'>
        <li>
          <strong className='mr-2'>{locale.COMMON.AUTHOR}:</strong>
          <SmartLink href={'/about'} className='hover:underline'>
            {siteConfig('AUTHOR')}
          </SmartLink>
        </li>
        <li>
          <strong className='mr-2'>{locale.COMMON.URL}:</strong>
          <a
            className='whitespace-normal break-words hover:underline'
            href={path}>
            {path}
          </a>
        </li>
        <li>
          <strong className='mr-2'>{locale.COMMON.COPYRIGHT}:</strong>
          {notice}
        </li>
        {siteConfig('HEO_ARTICLE_NOT_BY_AI', false, CONFIG) && (
          <li>
            <NotByAI />
          </li>
        )}
      </ul>
    </section>
  )
}
