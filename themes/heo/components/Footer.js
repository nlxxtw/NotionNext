import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import CopyRightDate from '@/components/CopyRightDate'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
  const linkGroups = normalizeLinkGroups(
    siteConfig('HEO_FOOTER_LINK_GROUPS', [], CONFIG)
  )

  return (
    <footer className='heo-footer relative w-full flex-shrink-0 overflow-visible bg-white text-sm leading-6 text-gray-600 dark:bg-[#1a191d] dark:text-gray-100'>
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
        className={`w-full overflow-visible border-t border-black/[0.04] bg-[#f3f5f9] dark:border-white/10 dark:bg-[#21232A] ${
          reserveMusicPlayerSpace ? 'pb-20' : ''
        }`}>
        <div className='mx-auto flex max-w-6xl flex-col gap-4 overflow-visible px-4 py-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12'>
          <div className='min-w-0 w-full max-w-xl flex-1 lg:max-w-[52%]'>
            {(noticeTitle || noticeText) && (
              <div className='mb-4 text-left text-[12px] leading-6 text-gray-500 dark:text-gray-400'>
                <div className='mb-1 inline-flex items-center gap-1.5 text-[13px] font-bold text-gray-700 dark:text-gray-200'>
                  <i className='fas fa-info-circle text-[11px] text-[var(--heo-color-primary)]' />
                  {noticeTitle}
                </div>
                {noticeText ? <p className='break-words'>{noticeText}</p> : null}
              </div>
            )}

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
              <span className='inline-flex items-center gap-1.5 whitespace-nowrap'>
                <span
                  className='h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.18)]'
                  aria-hidden
                />
                所有业务正常
              </span>
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

          {/* 恢复沉底：与左侧版权行对齐；链接与总浏览左缘对齐 */}
          <div className='flex w-full shrink-0 flex-col overflow-visible lg:w-auto lg:min-w-[340px] lg:max-w-lg'>
            <div className='flex items-center justify-between gap-4 overflow-visible'>
              <div className='min-w-0 flex-1 space-y-2 overflow-visible'>
                <div className='heo-footer-quick-links relative z-20 flex flex-wrap items-center gap-x-3.5 gap-y-1 overflow-visible'>
                  {quickLinks.map((link, index) =>
                    link.qr ? (
                      <QrHoverText key={`${link.title}-${index}`} item={link} />
                    ) : isStaticFileHref(link.href) ? (
                      <a
                        key={`${link.title}-${index}`}
                        href={link.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        onClick={e => {
                          // 部分部署下 SPA 拦截会让 .xml 点不动，强制新开
                          e.preventDefault()
                          window.open(link.href, '_blank', 'noopener,noreferrer')
                        }}
                        className='whitespace-nowrap text-[13px] font-medium text-gray-600 transition hover:text-[var(--heo-color-primary)] dark:text-gray-300 dark:hover:text-[var(--heo-color-accent)]'>
                        {link.title}
                      </a>
                    ) : (
                      <SmartLink
                        key={`${link.title}-${index}`}
                        href={link.href || '/'}
                        className='whitespace-nowrap text-[13px] font-medium text-gray-600 transition hover:text-[var(--heo-color-primary)] dark:text-gray-300 dark:hover:text-[var(--heo-color-accent)]'>
                        {link.title}
                      </SmartLink>
                    )
                  )}
                </div>
                <FooterStats compact />
              </div>

              {siteInfo?.icon ? (
                <LazyImage
                  src={siteInfo.icon}
                  alt={AUTHOR || 'avatar'}
                  className='heo-footer-logo h-11 w-11 shrink-0 rounded-full object-cover sm:h-12 sm:w-12'
                />
              ) : null}
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
          <img
            src={item.img}
            alt={item.title}
            className='h-auto w-full rounded-xl'
            loading='lazy'
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

/** 悬停小浮层（订阅 / 资源） */
function QrHoverText({ item }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const isTip = item.title === '打赏' || item.modal

  useEffect(() => {
    if (!open) return undefined
    const onDoc = e => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    const onKey = e => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // 打赏：居中大弹窗，更好看
  if (isTip) {
    return (
      <>
        <button
          type='button'
          aria-expanded={open}
          aria-haspopup='dialog'
          onClick={() => setOpen(true)}
          className='whitespace-nowrap text-left text-[13px] font-medium text-gray-600 transition hover:text-[var(--heo-color-primary)] dark:text-gray-300 dark:hover:text-[var(--heo-color-accent)]'>
          {item.title}
        </button>
        {open ? (
          <TipQrModal
            title={item.modalTitle || '局长请喝咖啡'}
            subtitle={item.subtitle || '感谢支持，扫码随意打赏'}
            qr={item.qr}
            onClose={() => setOpen(false)}
          />
        ) : null}
      </>
    )
  }

  return (
    <div
      ref={rootRef}
      className='heo-qr-hover relative inline-flex'
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}>
      <button
        type='button'
        aria-expanded={open}
        aria-haspopup='dialog'
        onClick={() => setOpen(v => !v)}
        className='whitespace-nowrap text-left text-[13px] font-medium text-gray-600 transition hover:text-[var(--heo-color-primary)] dark:text-gray-300 dark:hover:text-[var(--heo-color-accent)]'>
        {item.title}
      </button>
      <div
        role='dialog'
        aria-label={`${item.title}二维码`}
        className={`heo-qr-popover absolute bottom-[calc(100%+12px)] left-1/2 z-[80] w-[152px] -translate-x-1/2 transition duration-200 ${
          open
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0'
        }`}>
        <div className='rounded-2xl border border-black/[0.06] bg-white p-2.5 shadow-[0_18px_40px_-18px_rgba(30,40,70,0.45)] dark:border-white/10 dark:bg-[#2a2a30]'>
          <img
            src={item.qr}
            alt={item.title}
            className='h-auto w-full rounded-xl'
            loading='eager'
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

/** 打赏居中弹窗 */
function TipQrModal({ title, subtitle, qr, onClose }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = e => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  if (!mounted || typeof document === 'undefined') return null

  return createPortal(
    <div
      className='heo-tip-qr-modal fixed inset-0 z-[200] flex items-center justify-center p-5'
      role='dialog'
      aria-modal='true'
      aria-label={title}>
      <button
        type='button'
        aria-label='关闭'
        className='absolute inset-0 bg-black/45 backdrop-blur-[2px] transition'
        onClick={onClose}
      />
      <div className='heo-tip-qr-card relative z-[1] w-[min(320px,calc(100vw-2.5rem))] origin-center overflow-hidden rounded-[22px] border border-white/20 bg-white shadow-[0_28px_64px_-20px_rgba(20,24,50,0.55)] dark:border-white/10 dark:bg-[#22242c]'>
        <div className='relative bg-gradient-to-br from-[#7a5dfa] via-[#6d5ce7] to-[#425aef] px-5 pb-8 pt-5 text-white'>
          <button
            type='button'
            aria-label='关闭'
            onClick={onClose}
            className='absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25'>
            <i className='fas fa-times text-sm' />
          </button>
          <div className='flex items-center gap-2 text-[13px] font-semibold text-white/90'>
            <span className='flex h-7 w-7 items-center justify-center rounded-full bg-amber-300/95 text-amber-950'>
              <i className='fas fa-mug-hot text-[12px]' />
            </span>
            请喝杯咖啡
          </div>
          <h3 className='mt-3 text-[20px] font-extrabold leading-snug tracking-tight'>
            {title}
          </h3>
          <p className='mt-1.5 text-[13px] leading-relaxed text-white/85'>
            {subtitle}
          </p>
        </div>

        <div className='relative -mt-5 px-5 pb-5'>
          <div className='rounded-[18px] border border-black/[0.05] bg-white p-3 shadow-[0_14px_30px_-16px_rgba(40,50,90,0.45)] dark:border-white/10 dark:bg-[#2a2c34]'>
            <img
              src={qr}
              alt={title}
              className='mx-auto h-auto w-full max-w-[220px] rounded-xl'
              loading='eager'
            />
          </div>
          <p className='mt-3 text-center text-[12px] text-gray-500 dark:text-gray-400'>
            微信扫码即可
          </p>
        </div>
      </div>
    </div>,
    document.body
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
  { title: '地图', href: '/sitemap.xml' }
]

function isStaticFileHref(href) {
  const value = String(href || '').trim()
  if (!value || value.startsWith('http') || value.startsWith('#')) return false
  return /\.(xml|txt|json|pdf|zip|rar|7z|gz|mp3|mp4|webp|png|jpe?g|gif|svg)(?:$|\?)/i.test(
    value
  )
}

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
      let title = String(item.title || item.name || '').trim()
      if (!title) return null
      if (title === '站点地图' || title === 'sitemap') title = '地图'
      const qrFrom = String(item.qrFrom || '').trim()
      const qr =
        String(item.qr || item.img || '').trim() ||
        resolveQr(qrFrom, catalog) ||
        qrMapFallback.get(qrFrom) ||
        (qrFrom === '主题' ? qrMapFallback.get('资源') : '') ||
        ''
      let href = String(item.href || item.url || '#').trim() || '#'
      if (title === '地图') {
        href = '/sitemap.xml'
      }
      return { title, href, qr }
    })
    .filter(Boolean)

  const tipQr =
    resolveQr('局长请喝咖啡', catalog) || qrMapFallback.get('局长请喝咖啡') || ''
  const resourceQr =
    resolveQr('资源', catalog) || qrMapFallback.get('资源') || ''
  const wechatQr =
    resolveQr('官方微信', catalog) || qrMapFallback.get('官方微信') || ''
  const themeHref = 'https://github.com/notionnext-org/NotionNext'

  result = result.map(link => {
    if (link.title === '打赏') {
      return {
        ...link,
        qr: link.qr || tipQr,
        modal: true,
        modalTitle: '局长请喝咖啡',
        subtitle: '感谢支持，扫码随意打赏'
      }
    }
    if (link.title === '资源') {
      return { ...link, qr: link.qr || resourceQr, href: '#' }
    }
    if (link.title === '订阅' && !link.qr && wechatQr) {
      return { ...link, qr: wechatQr }
    }
    if (link.title === '主题' && (!link.href || link.href === '#')) {
      return { ...link, href: themeHref, qr: '' }
    }
    if (link.title === '地图') {
      return {
        ...link,
        qr: '',
        href: '/sitemap.xml'
      }
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

  if (!result.some(l => l.title === '地图')) {
    result.push({ title: '地图', href: '/sitemap.xml', qr: '' })
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
