import SmartLink from '@/components/SmartLink'
import { useMemo } from 'react'

/**
 * 分类汇总页（对齐 blog.zhheo.com/categories）
 * 标题 + 统计胶囊 + 每分类卡片（左名称/数量，右最新文章）
 */
export default function CategoriesPage(props) {
  const { categoryOptions, tagOptions, allNavPages, posts } = props
  const categories = Array.isArray(categoryOptions) ? categoryOptions : []
  const tags = Array.isArray(tagOptions) ? tagOptions : []
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

  const postCount = sourcePosts.length || categories.reduce((s, c) => s + (c.count || 0), 0)

  const postsByCategory = useMemo(() => {
    const map = new Map()
    sourcePosts.forEach(post => {
      const name = post?.category
      if (!name) return
      if (!map.has(name)) map.set(name, [])
      map.get(name).push(post)
    })
    map.forEach((list, key) => {
      list.sort(
        (a, b) =>
          new Date(b?.publishDate || b?.lastEditedDate || 0) -
          new Date(a?.publishDate || a?.lastEditedDate || 0)
      )
      map.set(key, list)
    })
    return map
  }, [sourcePosts])

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => (b.count || 0) - (a.count || 0))
  }, [categories])

  return (
    <div id='categories-page' className='categories-page w-full pb-12'>
      <h1 className='mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-4xl'>
        查看不同领域的{sortedCategories.length}个分类。
      </h1>

      <div className='heo-card mb-6 inline-flex w-fit max-w-full flex-wrap items-center gap-1 rounded-full bg-[var(--heo-color-card)] p-1.5 dark:bg-[var(--heo-color-card-dark)]'>
        <StatPill href='/categories' icon='fas fa-folder' value={sortedCategories.length} />
        <StatPill href='/archives' icon='fas fa-file-alt' value={postCount} />
        <StatPill href='/tag' icon='fas fa-tags' value={tags.length} />
      </div>

      <div className='flex flex-col gap-3'>
        {sortedCategories.map(cat => {
          const recent = (postsByCategory.get(cat.name) || []).slice(0, 10)
          return (
            <div
              key={cat.name}
              className='heo-card group flex flex-col gap-3 rounded-xl bg-[var(--heo-color-card)] p-4 transition hover:shadow-[var(--heo-shadow-main)] dark:bg-[var(--heo-color-card-dark)] md:flex-row md:gap-4 md:p-4'>
              <SmartLink
                href={`/category/${encodeURIComponent(cat.name)}`}
                className='flex w-full shrink-0 flex-row items-center gap-2 rounded-xl bg-[var(--heo-color-card-muted)] px-4 py-3 transition hover:bg-[var(--heo-color-primary)]/10 hover:text-[var(--heo-color-primary)] dark:bg-white/5 dark:hover:bg-[var(--heo-color-accent)]/15 dark:hover:text-[var(--heo-color-accent)] md:w-[140px] md:flex-col md:justify-center md:gap-1 md:py-5'>
                <span className='truncate text-base font-bold'>{cat.name}</span>
                <span className='text-xs font-semibold text-[var(--heo-color-primary)] opacity-80 dark:text-[var(--heo-color-accent)]'>
                  {cat.count ?? recent.length}
                </span>
              </SmartLink>

              <div className='grid min-w-0 flex-1 grid-cols-1 gap-0.5 sm:grid-cols-2 sm:gap-x-3'>
                {recent.length === 0 ? (
                  <div className='px-2 py-2 text-sm text-gray-400'>暂无文章</div>
                ) : (
                  recent.map(post => (
                    <SmartLink
                      key={post.id || post.slug}
                      href={post.href || `/${post.slug}`}
                      className='flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-700 transition hover:bg-[var(--heo-color-primary)]/10 hover:text-[var(--heo-color-primary)] dark:text-gray-200 dark:hover:bg-[var(--heo-color-accent)]/15 dark:hover:text-[var(--heo-color-accent)]'>
                      <span className='h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300 dark:bg-gray-500' />
                      <span className='truncate'>{post.title}</span>
                    </SmartLink>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatPill({ href, icon, value }) {
  return (
    <SmartLink
      href={href}
      className='inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-gray-800 transition hover:bg-[var(--heo-color-primary)]/10 dark:text-gray-100 dark:hover:bg-white/10'>
      <i className={`${icon} text-sm text-[var(--heo-color-primary)] dark:text-[var(--heo-color-accent)]`} />
      <b className='text-sm font-extrabold'>{value}</b>
    </SmartLink>
  )
}
