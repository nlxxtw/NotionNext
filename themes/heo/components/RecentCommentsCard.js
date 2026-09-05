import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'
import CONFIG from '../config'
import {
  commentPostPath,
  commentPostTitle,
  stripCommentHtml
} from '../lib/twikooRecent'
import AsideWidgetHeader from './AsideWidgetHeader'

/**
 * 侧栏「最新评论」（Waline）
 * 注意：@waline/client 仅在客户端动态加载，避免 SSR/webpack 打包失败
 */
export default function RecentCommentsCard(props) {
  const enabled = siteConfig('HEO_WIDGET_RECENT_COMMENTS', true, CONFIG)
  const serverURL = siteConfig('COMMENT_WALINE_SERVER_URL')
  const count = Math.max(
    1,
    Number(siteConfig('HEO_RECENT_COMMENTS_COUNT', 5, CONFIG)) || 5
  )
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const pages = [
    ...(Array.isArray(props?.allNavPages) ? props.allNavPages : []),
    ...(Array.isArray(props?.latestPosts) ? props.latestPosts : []),
    ...(Array.isArray(props?.posts) ? props.posts : [])
  ]

  useEffect(() => {
    if (!enabled) return
    if (!serverURL) {
      setLoading(false)
      setList([])
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const { RecentComments } = await import('@waline/client')
        const { comments } = await RecentComments({
          serverURL,
          count: Math.max(count, 5)
        })
        if (cancelled) return
        const mapped = (comments || [])
          .map(item => {
            const nick = item.nick || item.mail || '访客'
            const text = stripCommentHtml(item.comment || item.content || '')
            if (!text) return null
            const path = commentPostPath(item.url || item.link || item.href)
            const id = item.objectId || item.objectID || item.id || ''
            return {
              id: id || `${nick}-${path}-${text.slice(0, 12)}`,
              nick,
              avatar: item.avatar || item.avatarUrl || '',
              text,
              title: commentPostTitle(
                {
                  ...item,
                  title: item.meta?.title || item.title
                },
                pages
              ),
              href: id
                ? {
                    pathname: path,
                    hash: id,
                    query: { target: 'comment' }
                  }
                : path
            }
          })
          .filter(Boolean)
          .slice(0, count)
        setList(mapped)
      } catch {
        if (!cancelled) setList([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, serverURL, count])

  if (!enabled) return null
  if (!serverURL) return null
  if (!loading && !list.length) return null

  return (
    <div className='heo-aside-card wow fadeInUp rounded-2xl bg-[var(--heo-color-card)] px-4 py-4 dark:bg-[var(--heo-color-card-dark)]'>
      <AsideWidgetHeader title='最新评论' />

      {loading ? (
        <div className='space-y-3 px-0.5 py-1'>
          {[0, 1, 2].map(i => (
            <div key={i} className='flex animate-pulse gap-3'>
              <div className='h-9 w-9 shrink-0 rounded-full bg-gray-100 dark:bg-white/10' />
              <div className='min-w-0 flex-1 space-y-2 pt-1'>
                <div className='h-3 w-4/5 rounded bg-gray-100 dark:bg-white/10' />
                <div className='h-3 w-3/5 rounded bg-gray-100 dark:bg-white/10' />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className='divide-y divide-dotted divide-black/[0.08] dark:divide-white/15'>
          {list.map(item => (
            <li key={item.id}>
              <SmartLink
                href={item.href}
                className='group flex items-start gap-3 py-3 first:pt-1 last:pb-0'>
                <Avatar nick={item.nick} src={item.avatar} />
                <div className='min-w-0 flex-1'>
                  <div className='truncate text-[13px] leading-snug'>
                    <span className='font-bold text-gray-900 dark:text-gray-100'>
                      {item.nick}
                    </span>
                    <span className='text-gray-400'> 在 </span>
                    <span className='text-gray-400 transition group-hover:text-[var(--heo-color-primary)] dark:group-hover:text-[var(--heo-color-accent)]'>
                      {item.title}
                    </span>
                  </div>
                  <div className='mt-1 line-clamp-2 text-[13px] leading-snug text-gray-500 dark:text-gray-400'>
                    {item.text}
                  </div>
                </div>
              </SmartLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Avatar({ nick, src }) {
  if (src) {
    return (
      <LazyImage
        src={src}
        alt={nick}
        className='mt-0.5 h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-black/[0.04] dark:ring-white/10'
      />
    )
  }
  return (
    <span
      className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef0f4] text-gray-400 dark:bg-white/10 dark:text-gray-500'
      title={nick}
      aria-hidden>
      <i className='fas fa-user text-[13px]' />
    </span>
  )
}
