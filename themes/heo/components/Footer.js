import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import CopyRightDate from '@/components/CopyRightDate'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'
import CONFIG from '../config'
import FooterStats from './FooterStats'

/**
 * 页脚：访问须知 + 底栏（业务状态与快捷链接同行，右下角小统计）
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

  const qrCatalog = normalizeQrList(
    siteConfig('HEO_FOOTER_QR_LIST', DEFAULT_QR_LIST, CONFIG)
  )
  const showQrChips = siteConfig('HEO_FOOTER_SHOW_QR_CHIPS', false, CONFIG)
  const quickLinks = normalizeQuickLinks(
    siteConfig('HEO_FOOTER_QUICK_LINKS', DEFAULT_QUICK_LINKS, CONFIG),
    qrCatalog
  )
  // 默认空：去掉「服务」板块；Notion 有配置才显示
  const linkGroups = normalizeLinkGroups(
    siteConfig('HEO_FOOTER_LINK_GROUPS', [], CONFIG)
  )

  return (
    <footer className='heo-footer relative w-full flex-shrink-0 bg-white text-sm leading-6 text-gray-600 dark:bg-[#1a191d] dark:text-gray-100'>
      <div className='h-16 bg-gradient-to-b from-[#f7f9fe] to-white dark:from-[#18171d] dark:to-[#1a191d]' />

      {showQrChips && qrCatalog.length > 0 && (
        <div className='border-t border-black/[0.04] bg-white px-4 py-7 dark:border-white/10 dark:bg-[#1a191d]'>
          <div className='mx-auto flex max-w-6xl flex-wrap justify-center gap-3'>
            {qrCatalog.map((item, index) => (
              <QrHoverChip key={`${item.title}-${index}`} item={item} />
            ))}
          </div>
        </div>
      )}

      {linkGroups.length > 0 && (
        <div className='border-t border-black/[0.04] bg-white px-4 py-8 dark:border-white/10 dark:bg-[#1a191d]'>
          <div className='mx-auto grid max-w-6xl grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {linkGroups.map(group => (
              <div key={group.title}>
                <div className='mb-2.5 text-[14px] font-extrabold text-gray-800 dark:text-gray-100'>
                  {group.title}
                </div>
                <ul className='space-y-1.5'>
                  {(group.links || []).map(link => (
                    <li key={`${group.title}-${link.title}`}>
                      <SmartLink
                        href={link.href || '#'}
                        className='text-[13px] text-gray-500 transition hover:text-[var(--heo-color-primary)] dark:text-gray-400 dark:hover:text-[var(--heo-color-accent)]'>
                        {link.title}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        id='footer-bottom'
        className={`w-full border-t border-black/[0.04] bg-[#f3f5f9] dark:border-white/10 dark:bg-[#21232A] ${
          reserveMusicPlayerSpace ? 'pb-20' : ''
        }`}>
        <div className='mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5'>
          {(noticeTitle || noticeText) && (
            <div className='max-w-4xl text-left text-[12px] leading-6 text-gray-500 dark:text-gray-400'>
              <div className='mb-1 inline-flex items-center gap-1.5 text-[13px] font-bold text-gray-700 dark:text-gray-200'>
                <i className='fas fa-info-circle text-[11px] text-[var(--heo-color-primary)]' />
                {noticeTitle}
              </div>
              {noticeText ? (
                <p className='whitespace-pre-wrap break-words'>{noticeText}</p>
              ) : null}
            </div>
          )}

          {/* 无中间横线；左：版权/业务；右：快捷链接一行 + 大 logo + 统计左右两栏 */}
          <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10'>
            <div className='min-w-0 flex-1'>
              <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] leading-5 text-gray-500 dark:text-gray-400'>
                <CopyRightDate />
                <SmartLink
                  href='/about'
                  className='font-extrabold text-gray-800 underline-offset-2 transition hover:text-[var(--heo-color-primary)] hover:underline dark:text-gray-100 dark:hover:text-[var(--heo-color-accent)]'>
                  {AUTHOR}
                </SmartLink>
                {BIO ? (
                  <span className='inline-flex items-center gap-1.5'>
                    <span className='text-gray-300 dark:text-gray-600'>|</span>
                    <span>{BIO}</span>
                  </span>
                ) : null}
              </div>
              <div className='mt-1.5 inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] text-gray-500 dark:text-gray-400'>
                <span
                  className='h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]'
                  aria-hidden
                />
                所有业务正常
              </div>
              <div className='mt-1.5 flex flex-wrap items-center gap-x-3 text-[12px] text-gray-400 dark:text-gray-500'>
                {BEI_AN && (
                  <a
                    href={BEI_AN_LINK || 'https://beian.miit.gov.cn/'}
                    className='hover:text-[var(--heo-color-primary)]'>
                    <i className='fas fa-shield-alt mr-1' />
                    {BEI_AN}
                  </a>
                )}
                <BeiAnGongAn />
              </div>
            </div>

            <div className='flex w-full flex-col gap-3 lg:w-auto lg:min-w-[320px] lg:max-w-md lg:items-stretch'>
              {/* 快捷链接同一行；左半 / 右半 各占一半对齐 */}
              <div className='flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5'>
                <div className='flex flex-wrap items-center gap-x-4 gap-y-1'>
                  {quickLinks.slice(0, Math.ceil(quickLinks.length / 2)).map(
                    (link, index) =>
                      link.qr ? (
                        <QrHoverText key={`${link.title}-${index}`} item={link} />
                      ) : (
                        <SmartLink
                          key={`${link.title}-${index}`}
                          href={link.href || '#'}
                          className='whitespace-nowrap text-[13px] font-medium text-gray-600 transition hover:text-[var(--heo-color-primary)] dark:text-gray-300 dark:hover:text-[var(--heo-color-accent)]'>
                          {link.title}
                        </SmartLink>
                      )
                  )}
                </div>
                <div className='flex flex-wrap items-center justify-end gap-x-4 gap-y-1'>
                  {quickLinks.slice(Math.ceil(quickLinks.length / 2)).map(
                    (link, index) =>
                      link.qr ? (
                        <QrHoverText
                          key={`${link.title}-r-${index}`}
                          item={link}
                        />
                      ) : (
                        <SmartLink
                          key={`${link.title}-r-${index}`}
                          href={link.href || '#'}
                          className='whitespace-nowrap text-[13px] font-medium text-gray-600 transition hover:text-[var(--heo-color-primary)] dark:text-gray-300 dark:hover:text-[var(--heo-color-accent)]'>
                          {link.title}
                        </SmartLink>
                      )
                  )}
                </div>
              </div>

              {siteInfo?.icon ? (
                <div className='flex justify-end'>
                  <LazyImage
                    src={siteInfo.icon}
                    alt={AUTHOR || 'avatar'}
                    className='h-12 w-12 rounded-full object-cover shadow-[0_8px_18px_-10px_rgba(40,50,80,0.45)] ring-2 ring-white dark:ring-gray-700 sm:h-14 sm:w-14'
                  />
                </div>
              ) : null}

              <FooterStats compact />
            </div>
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
        className='inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-[#f7f8fc] px-3.5 py-2 text-[13px] font-bold text-gray-700 shadow-[0_6px_16px_-10px_rgba(40,50,80,0.35)] transition group-hover:-translate-y-0.5 group-hover:text-[var(--heo-color-primary)] dark:border-white/10 dark:bg-[#26262c] dark:text-gray-100'>
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
        className='truncate text-left text-[13px] font-medium text-gray-600 transition hover:text-[var(--heo-color-primary)] dark:text-gray-300 dark:hover:text-[var(--heo-color-accent)]'>
        {item.title}
      </button>
      <div className='heo-qr-popover pointer-events-none absolute bottom-[calc(100%+10px)] left-0 z-30 w-[148px] scale-95 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100'>
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
        <div className='ml-4 -mt-1 h-3 w-3 rotate-45 border-b border-r border-black/[0.06] bg-white dark:border-white/10 dark:bg-[#2a2a30]' />
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
    title: '资源',
    img: 'https://img.19492035.xyz/file/1742824264213.jpg',
    icon: 'fas fa-cloud-download-alt'
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
  {
    title: '主题',
    href: 'https://github.com/notionnext-org/NotionNext'
  },
  { title: '资源', href: '#', qrFrom: '资源' },
  { title: '站点地图', href: '/sitemap.xml' }
]

function normalizeQrList(value) {
  if (!value) return DEFAULT_QR_LIST
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value)
    } catch {
      return DEFAULT_QR_LIST
    }
  }
  if (!Array.isArray(value) || !value.length) return DEFAULT_QR_LIST
  const list = value
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
  return list.length ? list : DEFAULT_QR_LIST
}

function resolveQr(qrFrom, qrList) {
  if (!qrFrom) return ''
  const hit = qrList.find(q => q.title === qrFrom)
  if (hit?.img) return hit.img
  if (qrFrom === '主题') {
    const legacy = qrList.find(q => q.title === '资源' || q.title === '主题')
    return legacy?.img || ''
  }
  return ''
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

  const catalog = qrList?.length ? qrList : DEFAULT_QR_LIST
  const qrMapFallback = new Map(DEFAULT_QR_LIST.map(q => [q.title, q.img]))

  let result = list
    .map(item => {
      if (!item || typeof item !== 'object') return null
      const title = String(item.title || item.name || '').trim()
      if (!title) return null
      const qrFrom = String(item.qrFrom || '').trim()
      const qr =
        String(item.qr || item.img || '').trim() ||
        resolveQr(qrFrom, catalog) ||
        qrMapFallback.get(qrFrom) ||
        (qrFrom === '主题' ? qrMapFallback.get('资源') : '') ||
        ''
      return {
        title,
        href: String(item.href || item.url || '#').trim() || '#',
        qr
      }
    })
    .filter(Boolean)

  const tipQr =
    resolveQr('局长请喝咖啡', catalog) || qrMapFallback.get('局长请喝咖啡') || ''
  const resourceQr =
    resolveQr('资源', catalog) || qrMapFallback.get('资源') || ''
  const themeHref = 'https://github.com/notionnext-org/NotionNext'

  result = result.map(link => {
    if (link.title === '打赏' && !link.qr && tipQr) {
      return { ...link, qr: tipQr }
    }
    if (link.title === '资源' && !link.qr && resourceQr) {
      return { ...link, qr: resourceQr }
    }
    if (link.title === '主题' && (!link.href || link.href === '#')) {
      return { ...link, href: themeHref, qr: '' }
    }
    return link
  })

  if (!result.some(l => l.title === '主题')) {
    const tipIdx = result.findIndex(l => l.title === '打赏')
    const theme = { title: '主题', href: themeHref, qr: '' }
    if (tipIdx >= 0) result.splice(tipIdx + 1, 0, theme)
    else result.push(theme)
  }

  if (!result.some(l => l.title === '资源') && resourceQr) {
    const themeIdx = result.findIndex(l => l.title === '主题')
    const tipIdx = result.findIndex(l => l.title === '打赏')
    const insertAt =
      themeIdx >= 0 ? themeIdx + 1 : tipIdx >= 0 ? tipIdx + 1 : result.length
    result.splice(insertAt, 0, { title: '资源', href: '#', qr: resourceQr })
  }

  return result
}

function normalizeLinkGroups(value) {
  if (value == null || value === '') return []
  let list = value
  if (typeof list === 'string') {
    try {
      list = JSON.parse(list)
    } catch {
      return []
    }
  }
  if (!Array.isArray(list)) return []
  return list
    .map(group => {
      if (!group || typeof group !== 'object') return null
      const title = String(group.title || '').trim()
      if (!title) return null
      const links = Array.isArray(group.links)
        ? group.links
            .map(l => {
              if (!l || typeof l !== 'object') return null
              const t = String(l.title || l.name || '').trim()
              const href = String(l.href || l.url || '').trim()
              if (!t || !href) return null
              return { title: t, href }
            })
            .filter(Boolean)
        : []
      if (!links.length) return null
      return { title, links }
    })
    .filter(Boolean)
}

export default Footer
