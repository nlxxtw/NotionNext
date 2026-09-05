import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
import { useMemo, useState } from 'react'
import CONFIG from '../config'

/**
 * Heo 风格资料卡：默认头像，悬停切换介绍文案
 * 夜间模式保持紫色主色，不用刺眼黄
 */
export default function AuthorCard({
  siteInfo,
  className = '',
  minHeightClass = 'min-h-[200px]'
}) {
  const greetings = useMemo(
    () =>
      normalizeList(siteConfig('HEO_INFOCARD_GREETINGS', null, CONFIG)),
    []
  )
  const [greeting, setGreeting] = useState(greetings[0] || '你好！')

  const author = siteConfig('AUTHOR') || siteInfo?.title || ''
  const bio = String(siteConfig('BIO') || siteInfo?.description || '').trim()
  const avatar = siteInfo?.icon
  const emojiRaw = String(
    siteConfig('HEO_INFO_CARD_EMOJI', '🐶', CONFIG) || '🐶'
  ).trim()
  const emoji = !emojiRaw || emojiRaw === '😆' ? '🐶' : emojiRaw
  const emojiIsImage = /^https?:\/\//i.test(emoji)

  const introBlocks = useMemo(() => {
    // 悬停中间大段：HEO_INFO_CARD_INTRO；没配则用 BIO
    const raw = siteConfig('HEO_INFO_CARD_INTRO', null, CONFIG)
    const trimmed = String(raw || '').trim()
    if (trimmed) return parseIntro(trimmed)
    if (bio) return parseIntro(bio)
    return []
  }, [bio])

  const socialUrl1 = siteConfig('HEO_INFO_CARD_URL1', null, CONFIG)
  const socialIcon1 = siteConfig('HEO_INFO_CARD_ICON1', 'fas fa-user', CONFIG)
  const socialUrl2 = siteConfig('HEO_INFO_CARD_URL2', null, CONFIG)
  const socialIcon2 = siteConfig('HEO_INFO_CARD_ICON2', 'fab fa-github', CONFIG)

  const nextGreeting = e => {
    e?.stopPropagation?.()
    if (greetings.length <= 1) return
    let next = greetings[Math.floor(Math.random() * greetings.length)]
    if (next === greeting && greetings.length > 1) {
      next = greetings[(greetings.indexOf(greeting) + 1) % greetings.length]
    }
    setGreeting(next)
  }

  return (
    <div
      className={`heo-author-card group relative flex w-full ${minHeightClass} flex-col overflow-hidden rounded-[18px] px-3.5 pb-3.5 pt-2.5 text-white shadow-[var(--heo-shadow-border,0_8px_16px_-4px_#2c2d300c)] ${className}`}>
      {/* 问候胶囊 */}
      <div className='relative z-[2] flex justify-center'>
        <button
          type='button'
          onClick={nextGreeting}
          className='max-w-[92%] truncate rounded-full bg-black/25 px-3 py-0.5 text-[12px] font-medium text-white backdrop-blur-[2px] transition hover:bg-black/35'>
          {greeting}
        </button>
      </div>

      {/* 默认：头像 */}
      <div className='heo-author-avatar relative z-[1] mx-auto flex flex-1 items-center justify-center py-2 transition duration-300 group-hover:pointer-events-none group-hover:scale-0 group-hover:opacity-0'>
        <LazyImage
          src={avatar}
          alt={author}
          className='h-[76px] w-[76px] rounded-full border-[3px] border-white object-cover shadow-lg'
        />
        <span
          aria-hidden
          className='absolute bottom-2 right-[calc(50%-46px)] flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white text-sm leading-none shadow transition duration-300 group-hover:scale-0 group-hover:opacity-0'>
          {emojiIsImage ? (
            <LazyImage
              src={emoji}
              alt=''
              className='h-full w-full object-cover'
            />
          ) : (
            emoji
          )}
        </span>
      </div>

      {/* 悬停：介绍 */}
      <div className='heo-author-intro pointer-events-none absolute inset-x-3.5 top-[2.6rem] bottom-[3.6rem] z-[1] flex flex-col justify-center gap-1.5 opacity-0 transition duration-300 group-hover:opacity-100'>
        {introBlocks.length > 0 ? (
          introBlocks.map((block, i) => (
            <p
              key={i}
              className='text-[12.5px] leading-[1.4] text-white/95'
              style={{ textAlign: 'justify' }}>
              {block.map((part, j) =>
                part.bold ? (
                  <b key={j} className='font-extrabold text-white'>
                    {part.text}
                  </b>
                ) : (
                  <span key={j}>{part.text}</span>
                )
              )}
            </p>
          ))
        ) : (
          <p className='text-[12.5px] leading-[1.4] text-white/95'>
            {bio || '分享设计与科技生活'}
          </p>
        )}
      </div>

      {/* 底部姓名 + 社交 */}
      <div className='relative z-[2] mt-auto flex items-end justify-between gap-2'>
        <div className='min-w-0 flex-1'>
          <div className='truncate text-[20px] font-extrabold leading-none'>
            {author}
          </div>
          {bio && (
            <div className='mt-1 line-clamp-2 text-[11px] leading-snug opacity-85'>
              {bio}
            </div>
          )}
        </div>
        <div className='mb-0.5 flex shrink-0 items-center gap-1.5'>
          {socialUrl1 && <SocialIcon href={socialUrl1} icon={socialIcon1} />}
          {socialUrl2 && <SocialIcon href={socialUrl2} icon={socialIcon2} />}
        </div>
      </div>
    </div>
  )
}

function SocialIcon({ href, icon }) {
  return (
    <SmartLink
      href={href}
      className='flex h-7 w-7 items-center justify-center rounded-full border border-white/35 bg-white/15 text-xs transition hover:scale-110 hover:bg-white hover:text-[var(--heo-color-primary)]'>
      <i className={icon} />
    </SmartLink>
  )
}

function normalizeList(value) {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean)
  }
  if (typeof value !== 'string') return []
  const trimmed = value.trim()
  if (!trimmed) return []
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed.replace(/'/g, '"'))
      return normalizeList(parsed)
    } catch {
      return trimmed
        .slice(1, -1)
        .split(',')
        .map(item => item.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    }
  }
  return [trimmed]
}

function parseIntro(raw) {
  if (!raw) return []
  let text = String(raw).trim()
  if (!text) return []
  if (text.startsWith('[') && text.endsWith(']')) {
    try {
      const arr = JSON.parse(text.replace(/'/g, '"'))
      if (Array.isArray(arr)) text = arr.join('\n')
    } catch {
      /* keep */
    }
  }
  text = text.replace(/<b>/gi, '**').replace(/<\/b>/gi, '**')
  return text
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const parts = []
      const re = /\*\*(.+?)\*\*/g
      let last = 0
      let m
      while ((m = re.exec(line))) {
        if (m.index > last) {
          parts.push({ text: line.slice(last, m.index), bold: false })
        }
        parts.push({ text: m[1], bold: true })
        last = m.index + m[0].length
      }
      if (last < line.length) {
        parts.push({ text: line.slice(last), bold: false })
      }
      return parts.length ? parts : [{ text: line, bold: false }]
    })
}
