import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useMemo } from 'react'
import CONFIG from '../config'

/**
 * /stats 统计页（Notion 文章数据 + Busuanzi）
 * 说明：原站历史 PV/UV 折线图依赖张洪私有统计 API，NotionNext 无此后端，
 * 这里用可落地的文章/分类/标签/月份分布复刻页面骨架与视觉。
 */
export default function StatsPage(props) {
  const { allNavPages, categoryOptions, tagOptions, postCount } = props

  const posts = useMemo(() => {
    const list = Array.isArray(allNavPages) ? allNavPages : []
    return list.filter(
      p => (p?.type === 'Post' || !p?.type) && p?.status !== 'Draft'
    )
  }, [allNavPages])

  const monthBars = useMemo(() => buildMonthBars(posts, 12), [posts])
  const categories = useMemo(() => {
    const list = Array.isArray(categoryOptions) ? [...categoryOptions] : []
    return list.sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 10)
  }, [categoryOptions])
  const tags = useMemo(() => {
    const list = Array.isArray(tagOptions) ? [...tagOptions] : []
    return list.sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 12)
  }, [tagOptions])

  const createTime = siteConfig('HEO_SITE_CREATE_TIME', null, CONFIG)
  const days = Math.max(
    1,
    Math.ceil(
      (Date.now() - new Date(createTime).getTime()) / (1000 * 60 * 60 * 24)
    )
  )
  const totalPosts = postCount ?? posts.length

  return (
    <div id='stats-page' className='stats-page px-5 pb-10 md:px-0'>
      <div className='mb-6'>
        <h1 className='text-3xl font-extrabold text-gray-900 dark:text-white'>
          网站统计
        </h1>
        <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
          基于 Notion 文章数据与站点计数，持续更新中
        </p>
      </div>

      {/* 概览 */}
      <div className='stats-overview mb-6 grid grid-cols-2 gap-3 md:grid-cols-4'>
        <StatOverview
          icon='fas fa-file-lines'
          label='文章数'
          value={totalPosts}
        />
        <StatOverview icon='fas fa-calendar-days' label='运行天数' value={days} />
        <StatOverview
          icon='fas fa-eye'
          label='访问量'
          valueClass='busuanzi_value_site_pv'
          busuanzi
        />
        <StatOverview
          icon='fas fa-users'
          label='访客数'
          valueClass='busuanzi_value_site_uv'
          busuanzi
        />
      </div>

      {/* 近12月发文 */}
      <section className='heo-card mb-6 rounded-2xl bg-[var(--heo-color-card)] p-5 dark:bg-[var(--heo-color-card-dark)]'>
        <h2 className='mb-4 text-lg font-bold text-gray-900 dark:text-white'>
          近 12 个月发文
        </h2>
        <div className='flex h-52 items-end gap-2'>
          {monthBars.map(item => (
            <div
              key={item.key}
              className='flex h-full flex-1 flex-col items-center justify-end gap-1.5'>
              <span className='text-[11px] font-bold text-gray-700 dark:text-gray-200'>
                {item.count || ''}
              </span>
              <div
                className='w-[55%] min-h-[4px] rounded-t-md bg-[var(--heo-color-primary)] dark:bg-[var(--heo-color-accent)]'
                style={{ height: `${item.percent}%` }}
                title={`${item.label}: ${item.count}`}
              />
              <span className='text-[10px] text-gray-400'>{item.short}</span>
            </div>
          ))}
        </div>
      </section>

      <div className='grid gap-4 lg:grid-cols-2'>
        {/* 分类 */}
        <section className='heo-card rounded-2xl bg-[var(--heo-color-card)] p-5 dark:bg-[var(--heo-color-card-dark)]'>
          <h2 className='mb-4 text-lg font-bold text-gray-900 dark:text-white'>
            分类分布
          </h2>
          <div className='space-y-2'>
            {categories.map(cat => (
              <HBar
                key={cat.name}
                href={`/category/${cat.name}`}
                label={cat.name}
                count={cat.count || 0}
                max={categories[0]?.count || 1}
              />
            ))}
            {!categories.length && (
              <div className='text-sm text-gray-400'>暂无分类数据</div>
            )}
          </div>
        </section>

        {/* 标签 */}
        <section className='heo-card rounded-2xl bg-[var(--heo-color-card)] p-5 dark:bg-[var(--heo-color-card-dark)]'>
          <div className='mb-4 flex items-center justify-between'>
            <h2 className='text-lg font-bold text-gray-900 dark:text-white'>
              热门标签
            </h2>
            <SmartLink
              href='/tag'
              className='text-sm text-gray-400 hover:text-[var(--heo-color-primary)]'>
              全部 →
            </SmartLink>
          </div>
          <div className='flex flex-wrap gap-2'>
            {tags.map(tag => (
              <SmartLink
                key={tag.name}
                href={`/tag/${encodeURIComponent(tag.name)}`}
                className='heo-chip inline-flex items-center rounded-full bg-[var(--heo-color-card-muted)] px-3 py-1.5 text-sm text-gray-700 transition hover:bg-[var(--heo-color-primary)] hover:text-white dark:bg-white/5 dark:text-gray-200 dark:hover:bg-[var(--heo-color-accent)]'>
                # {tag.name}
                <span className='ml-1.5 opacity-55'>{tag.count}</span>
              </SmartLink>
            ))}
            {!tags.length && (
              <div className='text-sm text-gray-400'>暂无标签数据</div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

function StatOverview({ icon, label, value, valueClass, busuanzi }) {
  return (
    <div className='heo-card rounded-2xl bg-[var(--heo-color-card)] p-4 dark:bg-[var(--heo-color-card-dark)]'>
      <div className='flex items-center gap-1.5 text-[13px] text-gray-500 dark:text-gray-400'>
        <i
          className={`${icon} text-[var(--heo-color-primary)] dark:text-[var(--heo-color-accent)]`}
        />
        {label}
      </div>
      {busuanzi ? (
        <div
          className={`mt-3 hidden text-[28px] font-bold leading-none text-gray-900 dark:text-white ${
            valueClass?.includes('pv')
              ? 'busuanzi_container_site_pv'
              : 'busuanzi_container_site_uv'
          }`}>
          <span className={valueClass || ''}>-</span>
        </div>
      ) : (
        <div className='mt-3 text-[28px] font-bold leading-none text-gray-900 dark:text-white'>
          {value}
        </div>
      )}
    </div>
  )
}

function HBar({ href, label, count, max }) {
  const percent = Math.max(4, Math.round((count / Math.max(max, 1)) * 100))
  return (
    <SmartLink
      href={href}
      className='flex items-center gap-3 rounded-full px-1.5 py-1.5 transition hover:bg-[rgba(66,90,239,0.08)] dark:hover:bg-white/5'>
      <span className='w-16 shrink-0 truncate text-[13px] text-gray-500'>
        {label}
      </span>
      <span className='relative h-5 min-w-0 flex-1 overflow-hidden rounded-full bg-[repeating-linear-gradient(to_right,var(--heo-card-border)_0_1px,transparent_1px_12px)] dark:bg-white/5'>
        <span
          className='absolute inset-y-0 left-0 rounded-full bg-[var(--heo-color-primary)] dark:bg-[var(--heo-color-accent)]'
          style={{ width: `${percent}%` }}
        />
      </span>
      <span className='w-8 shrink-0 text-right text-[12px] font-bold text-gray-700 dark:text-gray-200'>
        {count}
      </span>
    </SmartLink>
  )
}

function buildMonthBars(posts, months = 12) {
  const map = {}
  const now = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    map[key] = {
      key,
      label: key,
      short: `${d.getMonth() + 1}月`,
      count: 0
    }
  }

  posts.forEach(post => {
    const raw = post?.publishDate || post?.date?.start_date || post?.createdTime
    if (!raw) return
    const d = new Date(raw)
    if (Number.isNaN(d.getTime())) return
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (map[key]) map[key].count += 1
  })

  const list = Object.values(map)
  const max = Math.max(...list.map(i => i.count), 1)
  return list.map(item => ({
    ...item,
    percent: Math.max(item.count ? 8 : 2, Math.round((item.count / max) * 100))
  }))
}
