/**
 * 文章分享海报生成（对齐 anheyu-app-frontend poster-generator）
 * 无额外依赖：二维码用公开 API 拉图绘制
 */

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Image load failed: ${url}`))
    img.src = url
  })
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const chars = String(text || '').split('')
  let line = ''
  let currentY = y
  let lineCount = 1

  for (let i = 0; i < chars.length; i++) {
    const testLine = line + chars[i]
    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      ctx.fillText(line, x, currentY)
      line = chars[i]
      lineCount++
      if (maxLines && lineCount >= maxLines) {
        let last = line
        while (
          ctx.measureText(`${last}...`).width > maxWidth &&
          last.length > 0
        ) {
          last = last.slice(0, -1)
        }
        ctx.fillText(`${last}...`, x, currentY + lineHeight)
        return currentY + lineHeight
      }
      currentY += lineHeight
    } else {
      line = testLine
    }
  }
  if (line) ctx.fillText(line, x, currentY)
  return currentY
}

function truncateText(ctx, text, maxWidth) {
  const s = String(text || '').trim()
  if (!s) return ''
  if (ctx.measureText(s).width <= maxWidth) return s
  let end = s.length
  while (end > 0 && ctx.measureText(`${s.slice(0, end)}...`).width > maxWidth) {
    end--
  }
  return end > 0 ? `${s.slice(0, end)}...` : ''
}

function drawCircleAvatar(ctx, cx, cy, radius, image) {
  const iw = image.naturalWidth || image.width
  const ih = image.naturalHeight || image.height
  if (iw <= 0 || ih <= 0) return
  const side = Math.min(iw, ih)
  const sx = (iw - side) / 2
  const sy = (ih - side) / 2
  const d = radius * 2
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(image, sx, sy, side, side, cx - radius, cy - radius, d, d)
  ctx.restore()
}

/**
 * @param {{
 *  title: string
 *  description?: string
 *  author: string
 *  authorAvatar?: string
 *  siteName?: string
 *  siteSubtitle?: string
 *  articleUrl: string
 *  coverImage?: string
 * }} config
 */
export async function generatePoster(config) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('无法创建 Canvas')

  const width = 750
  const height = 1000
  canvas.width = width
  canvas.height = height

  const bgColor = '#ffffff'
  const primaryColor = '#3b82f6'
  const textColor = '#1f2937'
  const secondaryTextColor = '#6b7280'

  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, width, height)

  let coverY = 0
  const coverHeight = 420

  const drawFallbackCover = () => {
    const g = ctx.createLinearGradient(0, 0, width, coverHeight)
    g.addColorStop(0, primaryColor)
    g.addColorStop(1, '#60a5fa')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, width, coverHeight)
    coverY = coverHeight
  }

  const coverSrc = String(config.coverImage || '').trim()
  if (coverSrc) {
    try {
      const coverImg = await loadImage(coverSrc)
      const imgAspect = coverImg.width / coverImg.height
      const targetAspect = width / coverHeight
      let sx = 0
      let sy = 0
      let sw = coverImg.width
      let sh = coverImg.height
      if (imgAspect > targetAspect) {
        sw = coverImg.height * targetAspect
        sx = (coverImg.width - sw) / 2
      } else {
        sh = coverImg.width / targetAspect
        sy = (coverImg.height - sh) / 2
      }
      ctx.drawImage(coverImg, sx, sy, sw, sh, 0, 0, width, coverHeight)
      coverY = coverHeight
    } catch {
      drawFallbackCover()
    }
  } else {
    drawFallbackCover()
  }

  ctx.fillStyle = bgColor
  ctx.fillRect(0, coverY, width, height - coverY)

  const padding = 40
  ctx.fillStyle = textColor
  ctx.font = "bold 48px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  let titleY = wrapText(
    ctx,
    config.title,
    padding,
    coverY + 40,
    width - padding * 2,
    58
  )

  const lineY = height - 200
  if (config.description) {
    let descY = titleY + 50
    ctx.fillStyle = secondaryTextColor
    ctx.font = "26px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    const maxLines = Math.max(1, Math.floor((lineY - descY - 50) / 38))
    wrapText(
      ctx,
      config.description,
      padding,
      descY,
      width - padding * 2,
      38,
      maxLines
    )
  }

  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding, lineY)
  ctx.lineTo(width - padding, lineY)
  ctx.stroke()

  const qrCodeSize = 120
  const avatarSize = 50
  const textSpacing = 14
  const sectionSpacing = 40
  const maxSectionW = width - padding * 2

  const siteNameText = config.siteName || config.author
  const subtitleText = String(config.siteSubtitle || '').trim()
  ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  const nameW = ctx.measureText(siteNameText).width
  ctx.font = "18px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  const subW = subtitleText ? ctx.measureText(subtitleText).width : 0
  const leftTextMax = Math.max(
    0,
    maxSectionW - avatarSize - textSpacing - sectionSpacing - qrCodeSize
  )
  const leftTextW = Math.min(Math.max(nameW, subW), leftTextMax)
  const sectionW =
    avatarSize + textSpacing + leftTextW + sectionSpacing + qrCodeSize
  const startX = Math.max(padding, (width - sectionW) / 2)
  const qrY = lineY + 20
  const avatarX = startX
  const avatarY = qrY + (qrCodeSize - avatarSize) / 2 + 13
  const qrX = startX + avatarSize + textSpacing + leftTextW + sectionSpacing

  if (config.authorAvatar) {
    try {
      const avatarImg = await loadImage(config.authorAvatar)
      drawCircleAvatar(
        ctx,
        avatarX + avatarSize / 2,
        avatarY + avatarSize / 2,
        avatarSize / 2,
        avatarImg
      )
    } catch {
      ctx.fillStyle = primaryColor
      ctx.beginPath()
      ctx.arc(
        avatarX + avatarSize / 2,
        avatarY + avatarSize / 2,
        avatarSize / 2,
        0,
        Math.PI * 2
      )
      ctx.fill()
    }
  }

  const textX = avatarX + avatarSize + textSpacing
  const centerY = qrY + (qrCodeSize - avatarSize) / 2 + avatarSize / 2
  ctx.fillStyle = textColor
  ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.textAlign = 'left'
  ctx.fillText(truncateText(ctx, siteNameText, leftTextW), textX, centerY - 6)
  if (subtitleText) {
    ctx.fillStyle = secondaryTextColor
    ctx.font = "18px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    ctx.fillText(truncateText(ctx, subtitleText, leftTextW), textX, centerY + 28)
  }

  try {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrCodeSize * 2}x${qrCodeSize * 2}&margin=8&data=${encodeURIComponent(config.articleUrl)}`
    const qrImg = await loadImage(qrUrl)
    ctx.drawImage(qrImg, qrX, qrY, qrCodeSize, qrCodeSize)
  } catch (e) {
    console.error('二维码生成失败', e)
  }

  ctx.fillStyle = secondaryTextColor
  ctx.font = "18px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  ctx.textAlign = 'center'
  ctx.fillText('扫码查看文章', qrX + qrCodeSize / 2, qrY + qrCodeSize + 12)

  return canvas.toDataURL('image/png', 1.0)
}

export function downloadPoster(dataUrl, filename = 'poster.png') {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
