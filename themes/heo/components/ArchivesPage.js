import SmartLink from '@/components/SmartLink'
import { useMemo, useState } from 'react'
import CategoryBar from './CategoryBar'
import BlogPostArchive from './BlogPostArchive'

/**
 * 归档页（对齐 blog.zhheo.com/archives）
 * 标题 + 分类条 + 年份筛选 + 按月列表
 */
export default function ArchivesPage(props) {
  const { archivePosts = {}, siteInfo } = props
  const months = Object.keys(archivePosts || {})
  const years = useMemo(() => {
    const set = new Set()
    months.forEach(m => {
      const y = String(m).slice(0, 4)
      if (/^\d{4}$/.test(y)) set.add(y)
    })
    return Array.from(set).sort((a, b) => Number(b) - Number(a))
  }, [months])

  const [year, setYear] = useState('all')

  const filteredMonths = useMemo(() => {
    if (year === 'all') return months
    return months.filter(m => String(m).startsWith(String(year)))
  }, [months, year])

  const total = filteredMonths.reduce(
    (sum, key) => sum + (archivePosts[key]?.length || 0),
    0
  )

  return (
    <div id='archives-page' className='archives-page w-full pb-10'>
      <h1 className='mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-4xl'>
        全部文章
      </h1>

      <div className='mb-5'>
        <CategoryBar {...props} />
      </div>

      <div className='mb-4 flex flex-wrap items-center gap-2'>
        <button
          type='button'
          onClick={() => setYear('all')}
          className={`heo-chip inline-flex h-9 items-center rounded-full px-4 text-sm font-bold transition ${
            year === 'all'
              ? 'bg-[var(--heo-color-primary)] text-white dark:bg-[var(--heo-color-accent)] dark:text-black'
              : 'bg-white text-gray-700 hover:text-[var(--heo-color-primary)] dark:bg-[var(--heo-color-card-dark)] dark:text-gray-200'
          }`}>
          全部
        </button>
        {years.map(y => (
          <button
            key={y}
            type='button'
            onClick={() => setYear(y)}
            className={`heo-chip inline-flex h-9 items-center rounded-full px-4 text-sm font-bold transition ${
              year === y
                ? 'bg-[var(--heo-color-primary)] text-white dark:bg-[var(--heo-color-accent)] dark:text-black'
                : 'bg-white text-gray-700 hover:text-[var(--heo-color-primary)] dark:bg-[var(--heo-color-card-dark)] dark:text-gray-200'
            }`}>
            {y}
          </button>
        ))}
        <span className='ml-1 text-xs text-gray-400'>{total} 篇</span>
      </div>

      <div className='heo-card rounded-2xl bg-[var(--heo-color-card)] p-4 dark:bg-[var(--heo-color-card-dark)] md:p-6'>
        {filteredMonths.length === 0 ? (
          <div className='py-16 text-center text-sm text-gray-400'>暂无文章</div>
        ) : (
          filteredMonths.map(archiveTitle => (
            <section key={archiveTitle} className='mb-8 last:mb-0'>
              <div className='mb-3 flex items-end justify-between border-b border-black/5 pb-2 dark:border-white/10'>
                <h2
                  id={archiveTitle}
                  className='text-lg font-extrabold text-gray-800 dark:text-gray-100'>
                  {archiveTitle}
                </h2>
                <SmartLink
                  href={`#${archiveTitle}`}
                  className='text-xs text-gray-400 hover:text-[var(--heo-color-primary)]'>
                  {archivePosts[archiveTitle]?.length || 0} 篇
                </SmartLink>
              </div>
              <BlogPostArchive
                posts={archivePosts[archiveTitle]}
                archiveTitle={archiveTitle}
                siteInfo={siteInfo}
                hideTitle
              />
            </section>
          ))
        )}
      </div>
    </div>
  )
}
