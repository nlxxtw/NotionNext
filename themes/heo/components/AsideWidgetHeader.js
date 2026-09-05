import SmartLink from '@/components/SmartLink'

/**
 * 侧栏卡片统一标题行
 */
export default function AsideWidgetHeader({
  icon,
  title,
  moreHref,
  moreLabel = '更多'
}) {
  return (
    <div className='mb-3 flex items-center gap-2 px-0.5'>
      {icon ? (
        <span className='inline-flex h-5 w-5 items-center justify-center text-gray-800 dark:text-gray-100'>
          {typeof icon === 'string' ? (
            <i className={`${icon} text-[14px]`} aria-hidden />
          ) : (
            icon
          )}
        </span>
      ) : null}
      <span className='text-[16px] font-extrabold tracking-tight text-gray-900 dark:text-white'>
        {title}
      </span>
      {moreHref ? (
        <SmartLink
          href={moreHref}
          className='ml-auto inline-flex items-center gap-1 rounded-full px-1.5 py-1 text-[13px] font-semibold text-gray-400 transition hover:bg-black/[0.04] hover:text-[var(--heo-color-primary)] dark:hover:bg-white/5 dark:hover:text-[var(--heo-color-accent)]'>
          {moreLabel}
          <i className='fas fa-arrow-up-right-from-square text-[10px] opacity-80' />
        </SmartLink>
      ) : null}
    </div>
  )
}
