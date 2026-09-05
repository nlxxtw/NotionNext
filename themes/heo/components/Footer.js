import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import CopyRightDate from '@/components/CopyRightDate'
import LazyImage from '@/components/LazyImage'
import PoweredBy from '@/components/PoweredBy'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

/**
 * 页脚（恢复用户原先 NotionNext-main / heo 定制版）
 */
const Footer = () => {
  const BEI_AN = siteConfig('BEI_AN')
  const BEI_AN_LINK = siteConfig('BEI_AN_LINK')
  const BIO = siteConfig('BIO')
  const reserveMusicPlayerSpace =
    siteConfig('HEO_MUSIC_PLAYER_ENABLE', true, CONFIG) ||
    (siteConfig('MUSIC_PLAYER') && siteConfig('MUSIC_PLAYER_VISIBLE'))

  const noticeTitle = siteConfig(
    'HEO_FOOTER_NOTICE_TITLE',
    '访问须知',
    CONFIG
  )
  const noticeText = siteConfig(
    'HEO_FOOTER_NOTICE_TEXT',
    '本站为非经营性个人博客，资源全部来自互联网收集，仅供用于学习和交流，请勿用于商业用途，本站自愿捐赠、打赏，仅为维持服务器的开支与维护所用。如有侵权不妥之处，请联系博主删除！',
    CONFIG
  )

  const qrList = normalizeQrList(
    siteConfig('HEO_FOOTER_QR_LIST', DEFAULT_QR_LIST, CONFIG)
  )

  return (
    <footer className='relative w-full flex-shrink-0 bg-white text-sm leading-6 text-gray-600 dark:bg-[#1a191d] dark:text-gray-100'>
      {/* 颜色过渡区 */}
      <div className='h-32 bg-gradient-to-b from-[#f7f9fe] to-white dark:bg-[#1a191d] dark:from-inherit dark:to-inherit' />

      {/* 主要内容：访问须知 + 二维码 */}
      <div className='mx-auto bg-white px-4 py-8 dark:border-t dark:border-[#3D3D3F] dark:bg-[#1a191d]'>
        <div className='mx-auto flex max-w-6xl flex-col justify-between gap-8 lg:flex-row'>
          <div className='lg:w-1/2 lg:pr-8'>
            <div className='mb-4 text-base font-bold dark:text-white'>
              {noticeTitle}
            </div>
            <div className='text-gray-600 dark:text-gray-300'>{noticeText}</div>
          </div>

          {qrList.length > 0 && (
            <div className='flex justify-start lg:w-1/2 lg:justify-end'>
              <div className='flex flex-wrap gap-6 md:flex-nowrap'>
                {qrList.map(item => (
                  <div
                    key={item.title}
                    className='flex-shrink-0 text-center'>
                    <div className='mb-2 w-28 md:w-32'>
                      <LazyImage
                        src={item.img}
                        alt={item.title}
                        className='h-auto w-full rounded-lg shadow-sm transition duration-300 hover:scale-105'
                      />
                    </div>
                    <p className='text-xs text-gray-600 dark:text-gray-300 md:text-sm'>
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部备案 / PoweredBy / 版权 */}
      <div
        id='footer-bottom'
        className={`flex w-full min-h-20 flex-col items-center justify-between border-t bg-[#f1f3f7] p-3 px-6 dark:border-t-[#3D3D3F] dark:bg-[#21232A] lg:flex-row ${
          reserveMusicPlayerSpace ? 'pb-20' : ''
        }`}>
        <div id='footer-bottom-left' className='text-center lg:text-start'>
          <PoweredBy />
          <div className='flex flex-wrap justify-center gap-x-1 lg:justify-start'>
            <CopyRightDate />
            <a
              href={'/about'}
              className='font-semibold underline dark:text-gray-300'>
              {siteConfig('AUTHOR')}
            </a>
            {BIO && <span className='mx-1'> | {BIO}</span>}
          </div>
        </div>

        <div id='footer-bottom-right' className='mt-2 lg:mt-0'>
          {BEI_AN && (
            <>
              <i className='fas fa-shield-alt' />{' '}
              <a href={BEI_AN_LINK || 'https://beian.miit.gov.cn/'} className='mr-2'>
                {siteConfig('BEI_AN')}
              </a>
            </>
          )}
          <BeiAnGongAn />
        </div>
      </div>
    </footer>
  )
}

const DEFAULT_QR_LIST = [
  {
    title: '局长请喝咖啡',
    img: 'https://img.19492035.xyz/file/1742989667091.png'
  },
  {
    title: '资源下载',
    img: 'https://img.19492035.xyz/file/1742824264213.jpg'
  },
  {
    title: '官方微信',
    img: 'https://img.19492035.xyz/file/1743351194450.jpg'
  }
]

function normalizeQrList(value) {
  if (!value) return []
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value)
    } catch {
      return DEFAULT_QR_LIST
    }
  }
  if (!Array.isArray(value)) return []
  return value
    .map(item => {
      if (!item || typeof item !== 'object') return null
      const title = String(item.title || item.name || '').trim()
      const img = String(item.img || item.url || item.src || '').trim()
      if (!title || !img) return null
      return { title, img }
    })
    .filter(Boolean)
}

export default Footer
