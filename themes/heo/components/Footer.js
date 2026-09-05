import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import CopyRightDate from '@/components/CopyRightDate'
import LazyImage from '@/components/LazyImage'
import PoweredBy from '@/components/PoweredBy'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'

/**
 * 页脚美化：访问须知 + 悬停弹出二维码 + 底栏快捷入口
 */
const Footer = () => {
  const { siteInfo } = useGlobal()
  const BEI_AN = siteConfig('BEI_AN')
  const BEI_AN_LINK = siteConfig('BEI_AN_LINK')
  const BIO = siteConfig('BIO')
  const AUTHOR = siteConfig('AUTHOR')
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
  const quickLinks = normalizeQuickLinks(
    siteConfig('HEO_FOOTER_QUICK_LINKS', DEFAULT_QUICK_LINKS, CONFIG),
    qrList
  )

  return (
    <footer className='heo-footer relative w-full flex-shrink-0 bg-white text-sm leading-6 text-gray-600 dark:bg-[#1a191d] dark:text-gray-100'>
      <div className='h-20 bg-gradient-to-b from-[#f7f9fe] to-white dark:from-[#18171d] dark:to-[#1a191d]' />

      {qrList.length > 0 && (
        <div className='border-t border-black/[0.04] bg-white px-4 py-8 dark:border-white/10 dark:bg-[#1a191d]'>
          <div className='mx-auto flex max-w-6xl flex-wrap justify-center gap-3 lg:justify-end'>
            {qrList.map((item, index) => (
              <QrHoverChip key={`${item.title}-${index}`} item={item} />
            ))}
          </div>
        </div>
      )}

      <div
        id='footer-bottom'
        className={`w-full border-t border-black/[0.04] bg-[#f3f5f9] dark:border-white/10 dark:bg-[#21232A] ${
          reserveMusicPlayerSpace ? 'pb-20' : ''
        }`}>
        <div className='mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between'>
          <div id='footer-bottom-left' className='min-w-0 text-center lg:text-left'>
            <div className='text-[12px] text-gray-500 dark:text-gray-400'>
              <PoweredBy />
            </div>
            <div className='mt-1 flex flex-wrap items-center justify-center gap-x-1 text-[13px] lg:justify-start'>
              <CopyRightDate />
              <SmartLink
                href='/about'
                className='font-extrabold text-gray-800 underline-offset-2 hover:underline dark:text-gray-100'>
                {AUTHOR}
              </SmartLink>
              {BIO ? (
                <span className='text-gray-500 dark:text-gray-400'>
                  {' '}
                  | {BIO}
                </span>
              ) : null}
            </div>
            <div className='mt-1 flex flex-nowrap items-center justify-center gap-x-3 overflow-x-auto whitespace-nowrap text-[12px] text-gray-500 scrollbar-none lg:justify-start'>
              <span className='inline-flex shrink-0 items-center gap-1.5 font-bold text-gray-700 dark:text-gray-200'>
                <i className='fas fa-info-circle text-[11px] text-[var(--heo-color-primary)]' />
                {noticeTitle}
              </span>
              {noticeText ? (
                <span className='shrink-0 text-gray-500 dark:text-gray-400'>
                  {noticeText}
                </span>
              ) : null}
              {BEI_AN && (
                <a
                  href={BEI_AN_LINK || 'https://beian.miit.gov.cn/'}
                  className='shrink-0 hover:text-[var(--heo-color-primary)]'>
                  <i className='fas fa-shield-alt mr-1' />
                  {BEI_AN}
                </a>
              )}
              <BeiAnGongAn />
              <span className='inline-flex shrink-0 items-center gap-1.5'>
                <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' />
                所有业务正常
              </span>
            </div>
          </div>

          <div
            id='footer-bottom-right'
            className='flex flex-wrap items-center justify-center gap-1 lg:justify-end'>
            {quickLinks.map((link, index) =>
              link.qr ? (
                <QrHoverText key={`${link.title}-${index}`} item={link} />
              ) : (
                <SmartLink
                  key={`${link.title}-${index}`}
                  href={link.href || '#'}
                  className='rounded-full px-3 py-1.5 text-[13px] font-medium text-gray-600 transition hover:bg-white hover:text-[var(--heo-color-primary)] dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-[var(--heo-color-accent)]'>
                  {link.title}
                </SmartLink>
              )
            )}
            {siteInfo?.icon ? (
              <LazyImage
                src={siteInfo.icon}
                alt={AUTHOR || 'avatar'}
                className='ml-2 h-8 w-8 rounded-full object-cover ring-2 ring-white dark:ring-gray-700'
              />
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  )
}

function QrHoverChip({ item }) {
  return (
    <div className='heo-qr-hover group relative'>
      <button
        type='button'
        className='inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-[#f7f8fc] px-3.5 py-2 text-[13px] font-bold text-gray-700 shadow-[0_6px_16px_-10px_rgba(40,50,80,0.35)] transition group-hover:-translate-y-0.5 group-hover:border-[var(--heo-color-primary)]/30 group-hover:text-[var(--heo-color-primary)] dark:border-white/10 dark:bg-[#26262c] dark:text-gray-100'>
        <i className={`${item.icon || 'fas fa-qrcode'} text-[12px] opacity-80`} />
        {item.title}
      </button>
      <div className='heo-qr-popover pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-30 w-[148px] -translate-x-1/2 scale-95 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100'>
        <div className='rounded-2xl border border-black/[0.06] bg-white p-2.5 shadow-[0_18px_40px_-18px_rgba(30,40,70,0.45)] dark:border-white/10 dark:bg-[#2a2a30]'>
          <LazyImage
            src={item.img}
            alt={item.title}
            className='h-auto w-full rounded-xl'
          />
          <div
            className={`mt-2 rounded-full px-2 py-1 text-center text-[11px] font-bold ${
              item.accent
                ? 'bg-amber-300/90 text-amber-950'
                : 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-200'
            }`}>
            {item.title}
          </div>
        </div>
        <div className='mx-auto -mt-1 h-3 w-3 rotate-45 border-b border-r border-black/[0.06] bg-white dark:border-white/10 dark:bg-[#2a2a30]' />
      </div>
    </div>
  )
}

function QrHoverText({ item }) {
  return (
    <div className='heo-qr-hover group relative'>
      <button
        type='button'
        className='rounded-full px-3 py-1.5 text-[13px] font-medium text-gray-600 transition hover:bg-white hover:text-[var(--heo-color-primary)] dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-[var(--heo-color-accent)]'>
        {item.title}
      </button>
      <div className='heo-qr-popover pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 z-30 w-[148px] -translate-x-1/2 scale-95 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100'>
        <div className='rounded-2xl border border-black/[0.06] bg-white p-2.5 shadow-[0_18px_40px_-18px_rgba(30,40,70,0.45)] dark:border-white/10 dark:bg-[#2a2a30]'>
          <LazyImage
            src={item.qr}
            alt={item.title}
            className='h-auto w-full rounded-xl'
          />
          <div className='mt-2 text-center text-[11px] font-bold text-gray-600 dark:text-gray-200'>
            {item.title}
          </div>
        </div>
        <div className='mx-auto -mt-1 h-3 w-3 rotate-45 border-b border-r border-black/[0.06] bg-white dark:border-white/10 dark:bg-[#2a2a30]' />
      </div>
    </div>
  )
}

const DEFAULT_QR_LIST = [
  {
    title: '局长请喝咖啡',
    img: 'https://img.19492035.xyz/file/1742989667091.png',
    icon: 'fas fa-mug-hot',
    accent: true
  },
  {
    title: '主题',
    img: 'https://img.19492035.xyz/file/1742824264213.jpg',
    icon: 'fas fa-palette'
  },
  {
    title: '官方微信',
    img: 'https://img.19492035.xyz/file/1743351194450.jpg',
    icon: 'fab fa-weixin'
  }
]

const DEFAULT_QUICK_LINKS = [
  { title: '留言', href: '/about' },
  { title: '订阅', href: '/rss', qrFrom: '官方微信' },
  { title: '打赏', href: '#', qrFrom: '局长请喝咖啡' },
  { title: '资源', href: '#', qrFrom: '主题' }
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
    .map((item, index) => {
      if (!item || typeof item !== 'object') return null
      const title = String(item.title || item.name || '').trim()
      const img = String(item.img || item.url || item.src || '').trim()
      if (!title || !img) return null
      return {
        title,
        img,
        icon: item.icon || DEFAULT_QR_LIST[index]?.icon || 'fas fa-qrcode',
        accent: Boolean(item.accent) || index === 0
      }
    })
    .filter(Boolean)
}

function normalizeQuickLinks(value, qrList) {
  let list = value
  if (typeof list === 'string') {
    try {
      list = JSON.parse(list)
    } catch {
      list = DEFAULT_QUICK_LINKS
    }
  }
  if (!Array.isArray(list) || !list.length) list = DEFAULT_QUICK_LINKS

  const qrMap = new Map(qrList.map(q => [q.title, q.img]))

  return list
    .map(item => {
      if (!item || typeof item !== 'object') return null
      const title = String(item.title || item.name || '').trim()
      if (!title) return null
      const qrFrom = String(item.qrFrom || '').trim()
      const qr =
        String(item.qr || item.img || '').trim() ||
        (qrFrom ? qrMap.get(qrFrom) : '') ||
        ''
      return {
        title,
        href: String(item.href || item.url || '#').trim() || '#',
        qr
      }
    })
    .filter(Boolean)
}

export default Footer
