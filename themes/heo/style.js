/* eslint-disable react/no-unknown-property */
import CONFIG from './config'
import { themeConsoleStyle } from '@/lib/themeConsoleStyle'
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  const primary = CONFIG.HEO_COLOR_PRIMARY || '#7a5dfa'
  const primaryHover = CONFIG.HEO_COLOR_PRIMARY_HOVER || primary
  const primaryText = CONFIG.HEO_COLOR_PRIMARY_TEXT || '#ffffff'
  const accent = CONFIG.HEO_COLOR_ACCENT || '#ffc848'
  const bg = CONFIG.HEO_COLOR_BG || '#f7f9fe'
  const bgDark = CONFIG.HEO_COLOR_BG_DARK || '#18171d'
  const card = CONFIG.HEO_COLOR_CARD || '#ffffff'
  const cardDark = CONFIG.HEO_COLOR_CARD_DARK || '#1e1e1e'
  const cardMuted = CONFIG.HEO_COLOR_CARD_MUTED || '#f1f3f8'
  const border = CONFIG.HEO_COLOR_BORDER || primary
  const borderDark = CONFIG.HEO_COLOR_BORDER_DARK || accent

  return (
    <style jsx global>{`
      #theme-heo {
        --heo-color-primary: ${primary};
        --heo-color-primary-hover: ${primaryHover};
        --heo-color-primary-text: ${primaryText};
        --heo-color-accent: ${accent};
        --heo-color-bg: ${bg};
        --heo-color-bg-dark: ${bgDark};
        --heo-color-card: ${card};
        --heo-color-card-dark: ${cardDark};
        --heo-color-card-muted: ${cardMuted};
        --heo-color-border: ${border};
        --heo-color-border-dark: ${borderDark};
        --heo-color-text-light: #000000;
        --heo-color-text-secondary-light: #4b5563;
        --heo-color-text-dark: #f3f4f6;
        --heo-color-text-secondary-dark: #d1d5db;
        --heo-color-text: var(--heo-color-text-light);
        --heo-color-text-secondary: var(--heo-color-text-secondary-light);
        background-color: var(--heo-color-bg);
        color: var(--heo-color-text);
      }

      .dark #theme-heo {
        --heo-color-text: var(--heo-color-text-dark);
        --heo-color-text-secondary: var(--heo-color-text-secondary-dark);
        /* 夜间模式不用刺眼黄，改柔和紫（与主色同系） */
        --heo-color-accent: #a794ff;
        --heo-color-border-dark: rgba(255, 255, 255, 0.12);
        background-color: var(--heo-color-bg-dark);
      }

      /* 资料卡：永远跟主色/封面色，禁止夜间变成黄色 */
      #theme-heo .heo-author-card {
        background: var(
          --heo-cover-main,
          var(--heo-color-primary)
        ) !important;
        color: #fff !important;
      }
      .dark #theme-heo:not(.heo-cover-theme) .heo-author-card {
        background: var(--heo-color-primary) !important;
      }
      #theme-heo .heo-author-card a:hover {
        color: var(--heo-color-primary) !important;
      }

      html:not(.dark) #theme-heo .bg-white {
        background-color: var(--heo-color-card);
      }

      .dark #theme-heo .dark\:bg-\[\#18171d\] {
        background-color: var(--heo-color-bg-dark);
      }

      .dark #theme-heo .dark\:bg-\[\#1e1e1e\] {
        background-color: var(--heo-color-card-dark);
      }

      #theme-heo .bg-\[\#4f65f0\],
      #theme-heo .bg-\[\#425AEF\],
      #theme-heo .bg-\[\#425aef\] {
        background-color: var(--heo-color-primary);
      }

      #theme-heo .bg-\[\#f1f3f8\] {
        background-color: var(--heo-color-card-muted);
      }

      #theme-heo .bg-indigo-600,
      #theme-heo .hover\:bg-indigo-600:hover {
        background-color: var(--heo-color-primary-hover);
      }

      .dark #theme-heo .dark\:bg-yellow-600,
      .dark #theme-heo .dark\:hover\:bg-yellow-600:hover {
        background-color: var(--heo-color-accent);
      }

      #theme-heo .text-white {
        color: var(--heo-color-primary-text);
      }

      html:not(.dark) #theme-heo .text-black {
        color: var(--heo-color-text);
      }

      html:not(.dark) #theme-heo .text-gray-600 {
        color: var(--heo-color-text-secondary);
      }

      #theme-heo .hover\:text-indigo-600:hover,
      #theme-heo .group:hover .group-hover\:text-indigo-600 {
        color: var(--heo-color-primary-hover);
      }

      #theme-heo .hover\:border-indigo-600:hover {
        border-color: var(--heo-color-border);
      }

      .dark #theme-heo .dark\:hover\:border-yellow-600:hover {
        border-color: var(--heo-color-border-dark);
      }

      .dark #theme-heo #notion-article .notion-external-block,
      #theme-heo.dark #notion-article .notion-external-block {
        background: var(--heo-color-card-dark) !important;
        border-color: var(--heo-color-border-dark) !important;
      }

      .dark #theme-heo #notion-article .notion-external-title,
      #theme-heo.dark #notion-article .notion-external-title {
        color: var(--heo-color-text-dark) !important;
      }

      .dark #theme-heo #notion-article .notion-external-subtitle,
      .dark #theme-heo #notion-article .notion-external-block-desc,
      #theme-heo.dark #notion-article .notion-external-subtitle,
      #theme-heo.dark #notion-article .notion-external-block-desc {
        color: var(--heo-color-text-secondary-dark) !important;
      }

      body {
        background-color: ${bg};
      }

      #theme-heo {
        --heo-card-border: rgba(0, 0, 0, 0.06);
        --heo-shadow-border: 0 8px 16px -4px rgba(44, 45, 48, 0.08);
        --heo-shadow-main: 0 8px 12px -3px ${primary}33;
      }

      .dark #theme-heo {
        --heo-card-border: rgba(255, 255, 255, 0.1);
      }

      /* 分类条半透明白胶囊 */
      #theme-heo .heo-cat-chip {
        background: rgba(255, 255, 255, 0.72);
        border: 1px solid rgba(255, 255, 255, 0.55);
        box-shadow: 0 4px 14px -6px rgba(44, 45, 48, 0.12);
        backdrop-filter: blur(12px) saturate(160%);
        -webkit-backdrop-filter: blur(12px) saturate(160%);
      }

      .dark #theme-heo .heo-cat-chip {
        background: rgba(40, 42, 50, 0.72);
        border-color: rgba(255, 255, 255, 0.08);
        box-shadow: none;
      }

      /* 顶栏胶囊：默认半透明白，无彩色 */
      #theme-heo .heo-nav-chip {
        background: rgba(255, 255, 255, 0.78);
        border: 1px solid rgba(255, 255, 255, 0.55);
        box-shadow: 0 6px 18px -10px rgba(40, 50, 80, 0.28);
        backdrop-filter: blur(14px) saturate(160%);
        -webkit-backdrop-filter: blur(14px) saturate(160%);
      }

      .dark #theme-heo .heo-nav-chip {
        background: rgba(36, 38, 46, 0.78);
        border-color: rgba(255, 255, 255, 0.08);
        box-shadow: none;
      }

      /* 下滑时整条顶栏毛玻璃遮罩 */
      #theme-heo .heo-nav--scrolled {
        background: rgba(247, 249, 254, 0.62) !important;
        border-bottom: 1px solid rgba(0, 0, 0, 0.04);
        box-shadow: 0 8px 30px -18px rgba(40, 50, 80, 0.35);
        backdrop-filter: blur(18px) saturate(180%);
        -webkit-backdrop-filter: blur(18px) saturate(180%);
      }

      .dark #theme-heo .heo-nav--scrolled {
        background: rgba(24, 23, 29, 0.72) !important;
        border-bottom-color: rgba(255, 255, 255, 0.06);
        box-shadow: none;
      }

      #theme-heo .heo-nav--top {
        background: transparent !important;
        box-shadow: none;
      }

      /* 无彩色更新徽章 */
      #theme-heo .heo-nav-badge-count {
        display: inline-flex;
        min-width: 1.5rem;
        height: 1.5rem;
        padding: 0 0.4rem;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        background: #2b2f36;
        color: #fff;
        font-size: 11px;
        font-weight: 800;
        line-height: 1;
      }

      .dark #theme-heo .heo-nav-badge-count {
        background: #e8eaed;
        color: #1a1b1e;
      }

      #theme-heo .heo-nav-badge-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        border-radius: 999px;
        padding: 0.3rem 0.65rem;
        background: rgba(255, 255, 255, 0.86);
        border: 1px solid rgba(0, 0, 0, 0.06);
        color: #2b2f36;
        font-size: 11px;
        font-weight: 800;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }

      .dark #theme-heo .heo-nav-badge-pill {
        background: rgba(40, 42, 50, 0.86);
        border-color: rgba(255, 255, 255, 0.08);
        color: #e8eaed;
      }

      /* 柔和卡片：浅灰边，去掉蓝色描边 */
      #theme-heo .heo-soft-chip,
      #theme-heo .heo-chip,
      #theme-heo .heo-card {
        box-shadow: var(--heo-shadow-border);
        border: 1px solid rgba(0, 0, 0, 0.05);
      }

      .dark #theme-heo .heo-soft-chip,
      .dark #theme-heo .heo-chip,
      .dark #theme-heo .heo-card {
        border-color: rgba(255, 255, 255, 0.08);
        box-shadow: none;
      }

      #theme-heo .heo-aside-card {
        box-shadow: var(--heo-shadow-border);
        border: 1px solid rgba(0, 0, 0, 0.04);
      }

      .dark #theme-heo .heo-aside-card {
        border-color: rgba(255, 255, 255, 0.08);
        box-shadow: none;
      }

      /* 覆盖主题里过重的蓝色边框工具类 */
      #theme-heo .border-\[var\(--heo-card-border\,\#e3e8f7\)\],
      #theme-heo .border-\[var\(--heo-card-border\)\],
      #theme-heo .border-indigo-500,
      #theme-heo .border-\[var\(--heo-color-border\)\],
      #theme-heo .ring-\[var\(--heo-color-primary\)\] {
        border-color: rgba(0, 0, 0, 0.06) !important;
        --tw-ring-color: transparent !important;
      }

      .dark #theme-heo .border-\[var\(--heo-card-border\,\#e3e8f7\)\],
      .dark #theme-heo .border-\[var\(--heo-card-border\)\],
      .dark #theme-heo .border-indigo-500,
      .dark #theme-heo .border-\[var\(--heo-color-border\)\],
      .dark #theme-heo .dark\:border-gray-600,
      .dark #theme-heo .dark\:border-gray-700 {
        border-color: rgba(255, 255, 255, 0.1) !important;
      }

      #theme-heo #darkModeButton,
      #theme-heo #darkModeButton:focus,
      #theme-heo #darkModeButton:focus-visible,
      #theme-heo #darkModeButton:hover,
      #theme-heo .heo-dark-toggle {
        outline: none !important;
        border: 0 !important;
        box-shadow: none !important;
        background: #e9ebf2 !important;
      }

      .dark #theme-heo #darkModeButton,
      .dark #theme-heo .heo-dark-toggle {
        background: #2a2c34 !important;
      }

      #theme-heo .heo-dark-toggle-knob {
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.16);
        color: #374151;
      }

      /* Heo 玻璃胶囊音乐条 */
      #theme-heo .heo-nav-music-inner {
        background: linear-gradient(
          120deg,
          rgba(45, 78, 110, 0.82),
          rgba(36, 64, 96, 0.78)
        );
        border: 1px solid rgba(255, 255, 255, 0.22);
        border-top-color: rgba(255, 255, 255, 0.55);
        backdrop-filter: blur(18px) saturate(160%);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
        box-shadow:
          0 10px 30px rgba(20, 40, 70, 0.28),
          inset 0 1px 0 rgba(255, 255, 255, 0.35);
      }

      .dark #theme-heo .heo-nav-music-inner {
        background: linear-gradient(
          120deg,
          rgba(40, 48, 62, 0.88),
          rgba(28, 34, 46, 0.85)
        );
      }

      #theme-heo .heo-music-playlist {
        background: rgba(32, 36, 44, 0.92);
        border: 1px solid rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(18px) saturate(160%);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
      }

      #theme-heo .heo-qr-hover .heo-qr-popover {
        filter: drop-shadow(0 12px 24px rgba(30, 40, 70, 0.18));
      }

      /* 公众号订阅条：对齐 blog.zhheo.com #card-wechat */
      #theme-heo .heo-wechat-card {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        height: 60px;
        padding: 0 20px;
        border-radius: 12px;
        border: none;
        overflow: hidden;
        color: #fff;
        text-decoration: none;
        box-shadow: var(--heo-shadow-border, 0 8px 16px -4px rgba(44, 45, 48, 0.08));
        transition: filter 0.2s ease, transform 0.2s ease;
      }

      #theme-heo .heo-wechat-card:hover {
        filter: brightness(1.03);
      }

      #theme-heo .heo-wechat-card:active {
        transform: scale(0.98);
      }

      #theme-heo .heo-wechat-card-left {
        display: flex;
        align-items: center;
        gap: 10px;
        position: relative;
        z-index: 2;
        min-width: 0;
      }

      #theme-heo .heo-wechat-card-icon {
        display: block;
        height: 26px;
        width: auto;
        color: #fff;
        flex-shrink: 0;
      }

      #theme-heo .heo-wechat-card-text {
        font-size: 18px;
        font-weight: 700;
        color: #fff;
        line-height: 1;
        white-space: nowrap;
      }

      #theme-heo .heo-wechat-card-arrow {
        width: 40px;
        height: 40px;
        min-width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.22);
        color: #fff;
        font-size: 1rem;
        transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
        position: relative;
        z-index: 2;
      }

      #theme-heo .heo-wechat-card:hover .heo-wechat-card-arrow {
        background: #fff;
        color: #56ab2f;
        transform: scale(1.1);
      }

      /* 标签云：无描边、无 #，浅底胶囊 */
      #theme-heo .heo-tag-chip {
        border: 0 !important;
        box-shadow: none !important;
        outline: none !important;
      }

      #theme-heo .heo-tag-chip:hover {
        background: var(--heo-color-primary) !important;
        color: #fff !important;
        transform: translateY(-1px);
      }

      .dark #theme-heo .heo-tag-chip:hover {
        background: var(--heo-color-accent) !important;
        color: #111 !important;
      }

      #theme-heo .heo-tag-chip--active:hover {
        filter: brightness(1.05);
      }

      #theme-heo .heo-tag-chip:hover sup {
        opacity: 0.9 !important;
        color: inherit;
      }

      /* 使用 Heo 音乐条时隐藏默认 APlayer 固定底栏，避免双播放器 */
      body:has(#theme-heo) .aplayer.aplayer-fixed,
      body:has(#heo-nav-music) .aplayer.aplayer-fixed {
        display: none !important;
      }

      #theme-heo .hover\:border-\[var\(--heo-color-border\)\]:hover,
      #theme-heo .hover\:border-indigo-600:hover {
        border-color: rgba(0, 0, 0, 0.12) !important;
      }

      .dark #theme-heo .dark\:hover\:border-\[var\(--heo-color-border-dark\)\]:hover,
      .dark #theme-heo .dark\:hover\:border-yellow-600:hover {
        border-color: rgba(255, 255, 255, 0.18) !important;
      }

      // 公告栏中的字体固定白色
      #theme-heo #announcement-content .notion {
        color: white;
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(60, 60, 67, 0.4);
        border-radius: 8px;
        cursor: pointer;
      }

      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      #more {
        white-space: nowrap;
      }

      .today-card-cover {
        -webkit-mask-image: linear-gradient(to top, transparent 5%, black 70%);
        mask-image: linear-gradient(to top, transparent 5%, black 70%);
      }

      .recent-top-post-group::-webkit-scrollbar {
        display: none;
      }

      .scroll-hidden::-webkit-scrollbar {
        display: none;
      }

      * {
        box-sizing: border-box;
      }

      // 标签滚动动画
      .tags-group-wrapper {
        animation: rowup 60s linear infinite;
      }

      @keyframes rowup {
        0% {
          transform: translateX(0%);
        }
        100% {
          transform: translateX(-50%);
        }
      }

      ${themeConsoleStyle('heo', CONFIG)}
  `}</style>
  )
}

export { Style }

