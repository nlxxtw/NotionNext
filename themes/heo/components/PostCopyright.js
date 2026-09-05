import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import CONFIG from '../config'

/**
 * 安知鱼风格文章版权卡：头像悬顶 + 打赏/订阅/分享 + CC 声明
 */
export default function PostCopyright(props) {
  const { post, siteInfo, tagOptions } = props
  const router = useRouter()
  const { locale } = useGlobal()
  const [pageUrl, setPageUrl] = useState('')
  const [tipOpen, setTipOpen] = useState(false)
  const [shareTip, setShareTip] = useState('')

  const enabled = siteConfig('HEO_ARTICLE_COPYRIGHT', true, CONFIG)

  const author = siteConfig('AUTHOR') || siteInfo?.title || ''
  const bio =
    siteConfig('BIO') ||
    siteConfig('DESCRIPTION') ||
    siteInfo?.description ||
    ''
  const avatar =
    siteInfo?.icon ||
    siteConfig('HEO_PROFILE_AVATAR', '', CONFIG) ||
    siteConfig('AVATAR', '', CONFIG) ||
    ''

  const tipQr = resolveTipQr()
  const subscribeUrl =
    siteConfig('HEO_HERO_SUBSCRIBE_URL', '/rss', CONFIG) || '/rss'
  const notice =
    siteConfig('HEO_ARTICLE_COPYRIGHT_NOTICE', '', CONFIG) ||
    locale.COMMON.COPYRIGHT_NOTICE ||
    '本文是原创文章，采用 CC BY-NC-SA 4.0 协议，完整转载请注明来自'

  const tags = useMemo(() => {
    const raw =
      post?.tagItems ||
      (Array.isArray(post?.tags)
        ? post.tags.map(t => (typeof t === 'string' ? { name: t } : t))
        : [])
    return (raw || [])
      .filter(t => t?.name)
      .map(t => {
        const hit = (tagOptions || []).find(
          o => o?.name === t.name || o?.name === t
        )
        return {
          name: t.name,
          count: hit?.count ?? t.count ?? ''
        }
      })
  }, [post, tagOptions])

  useEffect(() => {
    setPageUrl(typeof window !== 'undefined' ? window.location.href : '')
  }, [router.asPath])

  if (!enabled) return null

  const handleShare = async () => {
    const url = pageUrl || window.location.href
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const input = document.createElement('input')
        input.value = url
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
      }
      setShareTip('链接已复制')
      window.setTimeout(() => setShareTip(''), 1800)
    } catch {
      setShareTip('复制失败')
      window.setTimeout(() => setShareTip(''), 1800)
    }
  }

  return (
    <section className='heo-post-copyright-wrap mt-16'>
      <div className='heo-post-copyright'>
        {avatar ? (
          <SmartLink
            href='/about'
            className='heo-post-copyright__avatar'
            title={author}>
            <img src={avatar} alt={author} />
          </SmartLink>
        ) : null}

        <div className='heo-post-copyright__author'>
          <div className='heo-post-copyright__name'>{author}</div>
          {bio ? <div className='heo-post-copyright__bio'>{bio}</div> : null}
        </div>

        <div className='heo-post-copyright__tools'>
          {tipQr ? (
            <button
              type='button'
              className='heo-post-tool heo-post-tool--tip'
              onClick={() => setTipOpen(true)}>
              <i className='fas fa-hand-holding-heart' aria-hidden />
              打赏作者
            </button>
          ) : null}

          <SmartLink
            href={subscribeUrl}
            className='heo-post-tool heo-post-tool--sub'>
            <i className='fas fa-seedling' aria-hidden />
            订阅
          </SmartLink>

          <button
            type='button'
            className='heo-post-tool heo-post-tool--share'
            onClick={handleShare}>
            <i className='fas fa-share-nodes' aria-hidden />
            {shareTip || '分享'}
          </button>
        </div>

        <p className='heo-post-copyright__notice'>
          {notice}
          {author ? (
            <>
              {' '}
              <SmartLink href='/' className='heo-post-copyright__site'>
                {author}
              </SmartLink>
            </>
          ) : null}
        </p>
      </div>

      {tags.length > 0 && (
        <div className='heo-post-tags'>
          {tags.map(tag => (
            <SmartLink
              key={tag.name}
              href={`/tag/${encodeURIComponent(tag.name)}`}
              className='heo-post-tag'>
              <span className='heo-post-tag__hash'>#</span>
              {tag.name}
              {tag.count !== '' && tag.count != null ? (
                <span className='heo-post-tag__count'>{tag.count}</span>
              ) : null}
            </SmartLink>
          ))}
        </div>
      )}

      {tipOpen && tipQr
        ? createPortal(
            <TipModal
              qr={tipQr}
              title='打赏作者'
              subtitle='感谢支持，扫码随意打赏'
              onClose={() => setTipOpen(false)}
            />,
            document.body
          )
        : null}
    </section>
  )
}

function resolveTipQr() {
  const list = siteConfig('HEO_FOOTER_QR_LIST', [], CONFIG)
  if (!Array.isArray(list) || !list.length) return ''
  const tip =
    list.find(q => /咖啡|打赏|赞赏|tip|coffee/i.test(String(q.title || ''))) ||
    list[0]
  return String(tip?.img || tip?.qr || '').trim()
}

function TipModal({ title, subtitle, qr, onClose }) {
  useEffect(() => {
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

  return (
    <div
      className='heo-tip-qr-modal fixed inset-0 z-[200] flex items-center justify-center p-5'
      role='dialog'
      aria-modal='true'
      aria-label={title}>
      <button
        type='button'
        aria-label='关闭'
        className='absolute inset-0 bg-black/45 backdrop-blur-[2px]'
        onClick={onClose}
      />
      <div className='relative z-[1] w-[min(320px,calc(100vw-2.5rem))] overflow-hidden rounded-[22px] border border-white/20 bg-white shadow-[0_28px_64px_-20px_rgba(20,24,50,0.55)] dark:border-white/10 dark:bg-[#22242c]'>
        <div className='relative bg-gradient-to-br from-[#ff6b6b] via-[#ee5a52] to-[#e74c3c] px-5 pb-8 pt-5 text-white'>
          <button
            type='button'
            aria-label='关闭'
            onClick={onClose}
            className='absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 hover:bg-white/25'>
            <i className='fas fa-times text-sm' />
          </button>
          <div className='flex items-center gap-2 text-[13px] font-semibold text-white/90'>
            <i className='fas fa-hand-holding-heart' />
            {title}
          </div>
          <p className='mt-2 text-[13px] text-white/85'>{subtitle}</p>
        </div>
        <div className='relative -mt-5 px-5 pb-5'>
          <div className='rounded-[18px] border border-black/[0.05] bg-white p-3 shadow dark:border-white/10 dark:bg-[#2a2c34]'>
            <img
              src={qr}
              alt={title}
              className='mx-auto h-auto w-full max-w-[220px] rounded-xl'
            />
          </div>
          <p className='mt-3 text-center text-[12px] text-gray-500 dark:text-gray-400'>
            微信扫码即可
          </p>
        </div>
      </div>
    </div>
  )
}
