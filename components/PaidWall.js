import { siteConfig } from '@/lib/config'
import { useEffect, useRef, useState } from 'react'

const GUEST_KEY = 'blog_pay_guest_token'

function randomToken() {
  const bytes = new Uint8Array(16)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256)
  }
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

export function getGuestToken() {
  if (typeof window === 'undefined') return ''
  try {
    let token = localStorage.getItem(GUEST_KEY) || ''
    if (!/^[a-f0-9]{32}$/i.test(token)) {
      token = randomToken()
      localStorage.setItem(GUEST_KEY, token)
    }
    document.cookie = `${GUEST_KEY}=${token};path=/;max-age=${365 * 86400};SameSite=Lax`
    return token.toLowerCase()
  } catch {
    return randomToken()
  }
}

async function apiPost(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json?.ok === false) {
    throw new Error(json?.message || json?.info || `请求失败(${res.status})`)
  }
  // 兼容 NotionNext 包装与直传
  return json?.data ?? json
}

/**
 * 游客付费解锁墙
 */
export default function PaidWall({
  contentKey,
  price,
  label,
  postSlug,
  pageId
}) {
  const enabledEnv = siteConfig('BLOG_PAY_ENABLED', true)
  const [remoteCfg, setRemoteCfg] = useState(null)
  const [unlocked, setUnlocked] = useState(false)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [paying, setPaying] = useState(false)
  const [qrUrl, setQrUrl] = useState('')
  const [orderId, setOrderId] = useState(0)
  const [error, setError] = useState('')
  const pollRef = useRef(null)

  const enabled =
    remoteCfg && typeof remoteCfg.enabled !== 'undefined'
      ? Number(remoteCfg.enabled) === 1
      : !!enabledEnv

  const displayPrice =
    Number.isFinite(Number(price)) && Number(price) >= 0.01
      ? Number(price)
      : Number(remoteCfg?.default_price) > 0
        ? Number(remoteCfg.default_price)
        : Number(siteConfig('BLOG_PAY_DEFAULT_PRICE', 3)) || 3

  const guestTip =
    (remoteCfg?.guest_tip && String(remoteCfg.guest_tip)) ||
    '游客购买 · 凭证保存在本机，清除缓存后需客服凭订单补发'

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await apiPost('/api/blog-pay/config', {})
        if (!cancelled && data) setRemoteCfg(data)
      } catch {
        // 后台不可达时回退 blog.config / env
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!enabled || !contentKey || !postSlug) return
    const guestToken = getGuestToken()
    let cancelled = false
    ;(async () => {
      try {
        const data = await apiPost('/api/blog-pay/status', {
          guest_token: guestToken,
          post_slug: postSlug,
          content_key: contentKey
        })
        if (cancelled) return
        if (data?.unlocked) {
          await loadContent(guestToken)
        }
      } catch {
        // ignore
      }
    })()
    return () => {
      cancelled = true
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [enabled, contentKey, postSlug, pageId])

  async function loadContent(guestToken) {
    setLoading(true)
    setError('')
    try {
      const data = await apiPost('/api/blog-pay/content', {
        guest_token: guestToken || getGuestToken(),
        post_slug: postSlug,
        content_key: contentKey,
        page_id: pageId
      })
      setContent(String(data?.text || ''))
      setUnlocked(true)
      setPaying(false)
      setQrUrl('')
    } catch (e) {
      setError(e.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }

  async function startPay() {
    setPaying(true)
    setError('')
    setLoading(true)
    try {
      const guestToken = getGuestToken()
      const data = await apiPost('/api/blog-pay/create', {
        guest_token: guestToken,
        post_slug: postSlug,
        content_key: contentKey,
        price: displayPrice,
        title: label || '付费资源',
        page_id: pageId
      })
      if (data?.unlocked) {
        await loadContent(guestToken)
        return
      }
      const payUrl = data?.pay?.payData?.payUrl || data?.pay?.payData?.qrCode || ''
      if (!payUrl) throw new Error('未获取到支付二维码')
      setQrUrl(payUrl)
      setOrderId(Number(data?.order_id || 0))
      if (pollRef.current) clearInterval(pollRef.current)
      pollRef.current = setInterval(async () => {
        try {
          const st = await apiPost('/api/blog-pay/status', {
            guest_token: guestToken,
            order_id: data?.order_id,
            order_sn: data?.order_sn,
            post_slug: postSlug,
            content_key: contentKey
          })
          if (st?.unlocked) {
            clearInterval(pollRef.current)
            pollRef.current = null
            await loadContent(guestToken)
          }
        } catch {
          // keep polling
        }
      }, 2500)
    } catch (e) {
      setError(e.message || '下单失败')
      setPaying(false)
    } finally {
      setLoading(false)
    }
  }

  if (!enabled) {
    return (
      <div className='heo-paid-wall heo-paid-wall--off'>
        付费内容未启用
      </div>
    )
  }

  if (unlocked) {
    return (
      <div className='heo-paid-wall heo-paid-wall--unlocked'>
        <div className='heo-paid-wall__badge'>已解锁</div>
        <div className='heo-paid-wall__title'>{label || '付费资源'}</div>
        <pre className='heo-paid-wall__content'>{content || (loading ? '加载中…' : '')}</pre>
      </div>
    )
  }

  return (
    <div className='heo-paid-wall'>
      <div className='heo-paid-wall__ribbon'>付费资源</div>
      <div className='heo-paid-wall__body'>
        <div className='heo-paid-wall__icon' aria-hidden>
          !
        </div>
        <div className='heo-paid-wall__title'>{label || '付费资源'}</div>
        <div className='heo-paid-wall__desc'>此处内容已隐藏，请付费后查看</div>
        <div className='heo-paid-wall__price'>
          <span className='heo-paid-wall__amount'>{displayPrice}</span>
          <span className='heo-paid-wall__unit'>元</span>
        </div>
        {!paying ? (
          <button
            type='button'
            className='heo-paid-wall__btn'
            disabled={loading}
            onClick={startPay}>
            {loading ? '处理中…' : '支付宝扫码解锁'}
          </button>
        ) : (
          <div className='heo-paid-wall__qrbox'>
            {qrUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrUrl} alt='支付宝付款码' className='heo-paid-wall__qr' />
            ) : (
              <div>正在生成二维码…</div>
            )}
            <div className='heo-paid-wall__tip'>
              请使用支付宝扫码，支付成功后自动解锁
              {orderId ? `（订单 ${orderId}）` : ''}
            </div>
          </div>
        )}
        {error ? <div className='heo-paid-wall__error'>{error}</div> : null}
        <div className='heo-paid-wall__guest'>{guestTip}</div>
      </div>
    </div>
  )
}
