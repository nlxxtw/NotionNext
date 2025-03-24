import { siteConfig } from '@/lib/config'

/**
 * 驱动版权
 * @returns
 */
export default function PoweredBy(props) {
  return (
    <div className={`inline text-sm font-serif ${props.className || ''}`}>
      <span className='mr-1'>Powered by</span>
      <a
        href='https://im.19492035.xyz/file/1742651920554.jpg'
        className='underline justify-start'>
        zdDown {siteConfig('VERSION')}
      </a>
      .
    </div>
  )
}
