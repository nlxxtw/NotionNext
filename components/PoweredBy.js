
/**
import { siteConfig } from '@/lib/config'

export default function PoweredBy(props) {
  return (

    <div className={`inline text-sm font-serif ${props.className || ''}`}>
      <span className='mr-1'> <a target="_blank" href="https://www.gov.cn/" rel="nofollow"><img style="max-width: 20px; overflow: hidden;" src="https://im.19492035.xyz/file/1742961859726.png" alt="">  本站受中华人民共和国法律保护</a></span>
      <br>
  <a
        href='https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.zh-hans'
        className='underline justify-start'>
        采用创作共用版权 {siteConfig('CC BY-NC-SA 4.0 CN')}
      </a>
      许可协议<br>
    </div>


  )
}
 */
import { siteConfig } from '@/lib/config'

/**
 * 驱动版权
 * @returns
 */
export default function PoweredBy(props) {
  return (
    <div className={`footer-muted em09 ${props.className || ''}`}>
      <div className="footer-muted em09">
        <div style={{ textAlign: 'center' }}>
          <a target="_blank" href="https://www.gov.cn/" rel="nofollow">
            <img 
              style={{ maxWidth: '20px', overflow: 'hidden' }} 
              src="https://im.19492035.xyz/file/1742961859726.png" 
              alt=""
            />
            本站受中华人民共和国法律保护
          </a>
          <br />
          采用创作共用版权{' '}
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.zh-hans">
            CC BY-NC-SA 4.0 CN
          </a>{' '}
          许可协议
          <br />
        
        </div>
      </div>
    </div>



  )
}
