import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'
import {
  commentPostPath,
  loadTwikooRecent
} from '../lib/twikooRecent'

/**
 * 文章卡底部评论头像堆叠（对齐 Heo）
 * 有 Twikoo 时取最近评论头像；否则用站点头像占位（无则留空）
 */
export default function CommentAvatarStack({
  postUrl,
  fallbackAvatar,
  max = 3
}) {
  const [avatars, setAvatars] = useState([])
  const envId = siteConfig('COMMENT_TWIKOO_ENV_ID')

  useEffect(() => {
    let cancelled = false
    const path = commentPostPath(postUrl)

    async function run() {
      if (!envId) {
        if (fallbackAvatar) setAvatars([{ url: fallbackAvatar, nick: '博主' }])
        return
      }
      try {
        const recent = await loadTwikooRecent(40)
        if (cancelled) return
        const matched = (recent || [])
          .filter(item => commentPostPath(item?.url || item?.href) === path)
          .map(item => ({
            url: item.avatar || item.avatarUrl,
            nick: item.nick || item.mail || '访客'
          }))
          .filter(item => item.url)

        if (matched.length) {
          setAvatars(uniqueByUrl(matched).slice(0, max))
        } else if (fallbackAvatar) {
          setAvatars([{ url: fallbackAvatar, nick: '博主' }])
        }
      } catch {
        if (!cancelled && fallbackAvatar) {
          setAvatars([{ url: fallbackAvatar, nick: '博主' }])
        }
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [postUrl, envId, fallbackAvatar, max])

  if (!avatars.length) {
    return <div className='h-6 min-w-[1px]' />
  }

  const extra = avatars.length > max ? avatars.length - max : 0
  const shown = avatars.slice(0, max)

  return (
    <div className='flex items-center pl-1'>
      {shown.map((item, index) => (
        <div
          key={`${item.url}-${index}`}
          className='relative -ml-1.5 first:ml-0'
          style={{ zIndex: index + 1 }}
          title={item.nick}>
          <LazyImage
            src={item.url}
            alt={item.nick || 'avatar'}
            className='h-6 w-6 rounded-full border-2 border-white object-cover dark:border-[var(--heo-color-card-dark)]'
          />
        </div>
      ))}
      {extra > 0 && (
        <div className='relative -ml-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-[10px] font-bold text-gray-500 dark:border-[var(--heo-color-card-dark)] dark:bg-gray-700 dark:text-gray-200'>
          +{extra}
        </div>
      )}
    </div>
  )
}

function uniqueByUrl(list) {
  const seen = new Set()
  return list.filter(item => {
    if (!item?.url || seen.has(item.url)) return false
    seen.add(item.url)
    return true
  })
}
