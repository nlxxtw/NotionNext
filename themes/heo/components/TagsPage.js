import SmartLink from '@/components/SmartLink'
import { useMemo } from 'react'

/**
 * 标签汇总页（对齐 blog.zhheo.com/tags）
 * 标题 + 统计胶囊 + 双列卡片（左标签名/数量，右最新文章）
 */
export default function TagsPage(props) {
  const { tagOptions, categoryOptions, allNavPages, posts } = props

  const sourcePosts = useMemo(() => {
    const list = Array.isArray(allNavPages)
      ? allNavPages
      : Array.isArray(posts)
        ? posts
        : []
    return list
      .filter(p => p?.type === 'Post' || !p?.type)
      .filter(p => !p?.status || p.status === 'Published')
  }, [allNavPages, posts])

  const postsByTag = useMemo(() => {
    const map = new Map()
    sourcePosts.forEach(post => {
      const tags = Array.isArray(post?.tags) ? post.tags : []
      tags.forEach(name => {
        if (!name) return
        if (!map.has(name)) map.set(name, [])
        map.get(name).push(post)
      })
    })
    map.forEach((list, key) => {
      const uniq = []
      const seen = new Set()
      list
        .sort(
          (a, b) =>
            new Date(b?.publishDate || b?.lastEditedDate || 0) -
            new Date(a?.publishDate || a?.lastEditedDate || 0)
        )
        .forEach(p => {
          const id = p?.id || p?.slug
          if (!id || seen.has(id)) return
          seen.add(id)
          uniq.push(p)
        })
      map.set(key, uniq)
    })
    return map
  }, [sourcePosts])

  const tags = useMemo(() => {
    const list = Array.isArray(tagOptions) ? [...tagOptions] : []
    const mapped = list
      .map(t => ({
        name: t?.name || '',
        count: Number(t?.count) || postsByTag.get(t?.name)?.length || 0
      }))
      .filter(t => t.name)
    // 兜底：Notion 未给 tagOptions 时从文章反推
    if (!mapped.length) {
      ;[...postsByTag.entries()].forEach(([name, list]) => {
        mapped.push({ name, count: list.length })
      })
    }
    return mapped.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh'))
  }, [tagOptions, postsByTag])

  const categories = Array.isArray(categoryOptions) ? categoryOptions : []
  const postCount =
    sourcePosts.length || tags.reduce((s, t) => s + (t.count || 0), 0)

  return (
    <div id='tags-page' className='tags-page w-full pb-12'>
      <h1 className='mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-4xl'>
        查看不同领域的{tags.length}个标签。
      </h1>

      <div className='heo-card mb-6 inline-flex w-fit max-w-full flex-wrap items-center gap-1 rounded-full bg-[var(--heo-color-card)] p-1.5 dark:bg-[var(--heo-color-card-dark)]'>
        <StatPill href='/tag' icon='fas fa-tags' value={tags.length} />
        <StatPill href='/archives' icon='fas fa-file-alt' value={postCount} />
        <StatPill href='/categories' icon='fas fa-folder' value={categories.length} />
      </div>

      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        {tags.map(tag => {
          const recent = (postsByTag.get(tag.name) || []).slice(0, 3)
          return (
            <div
              key={tag.name}
              className='heo-card group flex flex-col gap-3 rounded-xl bg-[var(--heo-color-card)] p-3.5 transition hover:shadow-[var(--heo-shadow-main)] dark:bg-[var(--heo-color-card-dark)] sm:flex-row sm:gap-3 sm:p-4'>
              <SmartLink
                href={`/tag/${encodeURIComponent(tag.name)}`}
                className='flex w-full shrink-0 flex-row items-center gap-2 rounded-xl bg-[var(--heo-color-card-muted)] px-4 py-3 transition hover:bg-[var(--heo-color-primary)]/10 hover:text-[var(--heo-color-primary)] dark:bg-white/5 dark:hover:bg-[var(--heo-color-accent)]/15 dark:hover:text-[var(--heo-color-accent)] sm:w-[108px] sm:flex-col sm:justify-center sm:gap-1.5 sm:py-4'>
                <i className='fas fa-tag text-sm text-[var(--heo-color-primary)] dark:text-[var(--heo-color-accent)]' />
                <span className='truncate text-base font-bold'>{tag.name}</span>
                <span className='text-xs font-semibold text-[var(--heo-color-primary)] opacity-80 dark:text-[var(--heo-color-accent)]'>
                  {tag.count ?? recent.length}
                </span>
              </SmartLink>

              <div className='flex min-w-0 flex-1 flex-col justify-center gap-0.5'>
                {recent.length === 0 ? (
                  <div className='px-2 py-2 text-sm text-gray-400'>暂无文章</div>
                ) : (
                  recent.map(post => (
                    <SmartLink
                      key={post.id || post.slug}
                      href={post.href || `/${post.slug}`}
                      className='heo-tag-post-link flex min-w-0 items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-gray-700 transition hover:bg-[var(--heo-color-primary)]/10 hover:text-[var(--heo-color-primary)] dark:text-gray-200 dark:hover:bg-[var(--heo-color-accent)]/15 dark:hover:text-[var(--heo-color-accent)]'>
                      <span className='heo-tag-bullet h-2 w-2 shrink-0 rounded-[3px] bg-[var(--heo-color-primary)] dark:bg-[var(--heo-color-accent)]' />
                      <span className='truncate'>{post.title}</span>
                    </SmartLink>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {tags.length === 0 && (
        <div className='heo-card rounded-xl bg-[var(--heo-color-card)] px-4 py-10 text-center text-sm text-gray-400 dark:bg-[var(--heo-color-card-dark)]'>
          暂无标签，请在 Notion 文章属性中添加 Tags
        </div>
      )}
    </div>
  )
}

function StatPill({ href, icon, value }) {
  return (
    <SmartLink
      href={href}
      className='inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-gray-800 transition hover:bg-[var(--heo-color-primary)]/10 dark:text-gray-100 dark:hover:bg-white/10'>
      <i
        className={`${icon} text-sm text-[var(--heo-color-primary)] dark:text-[var(--heo-color-accent)]`}
      />
      <b className='text-sm font-extrabold'>{value}</b>
    </SmartLink>
  )
}
