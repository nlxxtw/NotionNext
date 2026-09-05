import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import CONFIG from '../config'
import { downloadPoster, generatePoster } from '../lib/posterGenerator'

/**
 * 文章版权卡（对齐 anheyu-app-frontend PostCopyright）
 * 打赏 / 订阅 / 分享海报
 */
export default function PostCopyright(props) {
  const { post, siteInfo, tagOptions } = props
  const router = useRouter()
  const { locale } = useGlobal()
  const [pageUrl, setPageUrl] = useState('')
  const [tipOpen, setTipOpen] = useState(false)
  const [posterOpen, setPosterOpen] = useState(false)
  const [posterDataUrl, setPosterDataUrl] = useState('')
  const [generating, setGenerating] = useState(false)

  const enabled = siteConfig('HEO_ARTICLE_COPYRIGHT', true, CONFIG)

  const author = siteConfig('AUTHOR') || siteInfo?.title || ''
  const bio =
    siteConfig('BIO') ||
    siteConfig('DESCRIPTION') ||
    siteInfo?.description ||
    '生活明朗，万物可爱'
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
        return { name: t.name, count: hit?.count ?? t.count ?? '' }
      })
  }, [post, tagOptions])

  useEffect(() => {
    setPageUrl(typeof window !== 'undefined' ? window.location.href : '')
  }, [router.asPath])

  if (!enabled) return null

  const articleUrl = pageUrl || (typeof window !== 'undefined' ? window.location.href : '')

  const handleShare = async () => {
    if (generating) return
    try {
      setGenerating(true)
      const dataUrl = await generatePoster({
        title: post?.title || '',
        description:
          post?.summary ||
          post?.description ||
          (Array.isArray(post?.summaries) ? post.summaries[0] : '') ||
          '',
        author,
        authorAvatar: avatar,
        siteName: siteConfig('TITLE') || author,
        siteSubtitle: bio,
        articleUrl,
        coverImage:
          post?.pageCoverThumbnail ||
          post?.pageCover ||
          siteInfo?.pageCover ||
          ''
      })
      setPosterDataUrl(dataUrl)
      setPosterOpen(true)
    } catch (e) {
      console.error(e)
      window.alert('生成海报失败，请稍后重试')
    } finally {
      setGenerating(false)
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl)
      window.alert('链接已复制到剪贴板')
    } catch {
      window.alert('复制失败，请手动复制')
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
            disabled={generating}
            onClick={handleShare}>
            <i className='fas fa-share-nodes' aria-hidden />
            {generating ? '生成中...' : '分享'}
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

      {posterOpen
        ? createPortal(
            <PosterModal
              posterDataUrl={posterDataUrl}
              articleUrl={articleUrl}
              title={post?.title || ''}
              onCopy={copyLink}
              onDownload={() =>
                downloadPoster(
                  posterDataUrl,
                  `${post?.title || '文章'}_分享海报.png`
                )
              }
              onClose={() => setPosterOpen(false)}
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

function PosterModal({
  posterDataUrl,
  articleUrl,
  title,
  onCopy,
  onDownload,
  onClose
}) {
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

  const shareWeibo = () => {
    window.open(
      `https://service.weibo.com/share/share.php?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(title)}`,
      '_blank',
      'width=600,height=400'
    )
  }
  const shareQQ = () => {
    window.open(
      `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(title)}`,
      '_blank',
      'width=600,height=400'
    )
  }
  const shareQzone = () => {
    window.open(
      `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(title)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  return (
    <div
      className='heo-poster-overlay'
      role='dialog'
      aria-modal='true'
      aria-label='分享海报'
      onClick={onClose}>
      <div
        className='heo-poster-dialog'
        onClick={e => e.stopPropagation()}>
        <div className='heo-poster-dialog__head'>
          <h3>分享海报</h3>
          <button
            type='button'
            className='heo-poster-dialog__close'
            aria-label='关闭'
            onClick={onClose}>
            <i className='fas fa-times' />
          </button>
        </div>

        <div className='heo-poster-dialog__body'>
          <div className='heo-poster-preview'>
            {posterDataUrl ? (
              <img src={posterDataUrl} alt='分享海报预览' />
            ) : (
              <div className='heo-poster-loading'>正在生成海报...</div>
            )}
          </div>

          <div className='heo-poster-actions'>
            <div className='heo-poster-section'>
              <div className='heo-poster-label'>点击复制链接:</div>
              <input
                className='heo-poster-url'
                readOnly
                value={articleUrl}
                onClick={onCopy}
              />
            </div>

            <div className='heo-poster-section'>
              <div className='heo-poster-label'>分享到:</div>
              <button
                type='button'
                className='heo-share-btn heo-share-btn--weibo'
                onClick={shareWeibo}>
                <i className='fab fa-weibo' />
                微博
              </button>
              <button
                type='button'
                className='heo-share-btn heo-share-btn--qq'
                onClick={shareQQ}>
                <i className='fab fa-qq' />
                QQ好友
              </button>
              <button
                type='button'
                className='heo-share-btn heo-share-btn--qzone'
                onClick={shareQzone}>
                <i className='fas fa-star' />
                QQ空间
              </button>
            </div>

            <div className='heo-poster-section'>
              <div className='heo-poster-label'>下载海报:</div>
              <button
                type='button'
                className='heo-poster-download'
                disabled={!posterDataUrl}
                onClick={onDownload}>
                点击下载
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
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
