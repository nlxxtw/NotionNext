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
        /* 页面底色保持平铺；彩色氛围交给 .heo-atmosphere（模糊光斑），不要顶区实心色带 */
        background-color: ${bg};
        background-image: none;
        color: var(--heo-color-text);
        --heo-maskbg: rgba(255, 255, 255, 0.38);
        --heo-maskbg-border: rgba(255, 255, 255, 0.58);
        --heo-glass-blur: blur(22px) saturate(185%);
        --heo-shadow-glass: 0 8px 28px -14px rgba(40, 50, 90, 0.22);
      }

      .dark #theme-heo {
        --heo-color-text: var(--heo-color-text-dark);
        --heo-color-text-secondary: var(--heo-color-text-secondary-dark);
        --heo-color-accent: #a794ff;
        --heo-color-border-dark: rgba(255, 255, 255, 0.12);
        background-color: var(--heo-color-bg-dark);
        background-image: none;
        --heo-maskbg: rgba(40, 42, 52, 0.42);
        --heo-maskbg-border: rgba(255, 255, 255, 0.1);
        --heo-shadow-glass: none;
      }

      /* 顶区柔焦色雾：fixed 光斑 + blur，导航/分类胶囊共用同一层「空气」 */
      #theme-heo .heo-atmosphere {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: min(46vh, 460px);
        z-index: 0;
        pointer-events: none;
        overflow: hidden;
      }
      #theme-heo .heo-atmosphere::before {
        content: '';
        position: absolute;
        inset: -35% -15% -20%;
        background:
          radial-gradient(ellipse 42% 48% at 12% 28%, rgba(186, 156, 255, 0.72), transparent 70%),
          radial-gradient(ellipse 38% 44% at 88% 18%, rgba(167, 139, 250, 0.55), transparent 68%),
          radial-gradient(ellipse 36% 40% at 48% 8%, rgba(253, 224, 171, 0.42), transparent 65%),
          radial-gradient(ellipse 50% 36% at 62% 55%, rgba(196, 181, 253, 0.28), transparent 70%);
        filter: blur(52px);
        transform: translateZ(0);
      }
      .dark #theme-heo .heo-atmosphere::before {
        background:
          radial-gradient(ellipse 42% 48% at 12% 28%, rgba(122, 93, 250, 0.38), transparent 70%),
          radial-gradient(ellipse 38% 44% at 88% 18%, rgba(167, 148, 255, 0.22), transparent 68%),
          radial-gradient(ellipse 40% 36% at 50% 40%, rgba(90, 70, 160, 0.18), transparent 70%);
        filter: blur(56px);
      }
      /* 内容压在色雾之上；不要给全体子节点设 z-index，以免压住 fixed 导航 */
      #theme-heo > header,
      #theme-heo > main,
      #theme-heo > footer,
      #theme-heo .heo-footer {
        position: relative;
        z-index: 1;
      }
      #theme-heo #nav.heo-nav--fixed {
        z-index: 60;
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

      /* 文章目录：默认白雾（模糊+半透明），悬停整卡立刻清晰 —— 对齐 blog.zhheo.com */
      #theme-heo .heo-card-toc .heo-toc-link:not(.heo-toc-link--active) .heo-toc-link-text {
        opacity: 0.6;
        filter: blur(1px);
        transition: opacity 0.25s ease, filter 0.25s ease, color 0.25s ease;
        width: 100%;
      }
      #theme-heo .heo-aside-toc:hover .heo-toc-link:not(.heo-toc-link--active) .heo-toc-link-text,
      #theme-heo #card-toc:hover .heo-toc-link:not(.heo-toc-link--active) .heo-toc-link-text {
        opacity: 1;
        filter: blur(0);
      }
      #theme-heo .heo-card-toc .heo-toc-link:not(.heo-toc-link--active):hover {
        background: color-mix(in srgb, var(--heo-color-primary) 8%, transparent);
      }
      #theme-heo .heo-card-toc .heo-toc-link:not(.heo-toc-link--active):hover .heo-toc-link-text {
        color: var(--heo-color-primary);
      }
      .dark #theme-heo .heo-card-toc .heo-toc-link:not(.heo-toc-link--active):hover {
        background: color-mix(in srgb, var(--heo-color-accent) 12%, transparent);
      }
      .dark #theme-heo .heo-card-toc .heo-toc-link:not(.heo-toc-link--active):hover .heo-toc-link-text {
        color: var(--heo-color-accent);
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
        background-image: none;
      }
      .dark body {
        background-color: ${bgDark};
        background-image: none;
      }

      #theme-heo {
        --heo-card-border: rgba(0, 0, 0, 0.06);
        --heo-shadow-border: 0 8px 16px -4px rgba(44, 45, 48, 0.08);
        --heo-shadow-main: 0 8px 12px -3px ${primary}33;
      }

      .dark #theme-heo {
        --heo-card-border: rgba(255, 255, 255, 0.1);
      }

      /* 顶栏胶囊 + 分类胶囊：同一套半透明毛玻璃（对齐参考站「全透明浮动」） */
      #theme-heo .heo-nav-chip,
      #theme-heo .heo-cat-chip {
        background: var(--heo-maskbg) !important;
        border: 1px solid var(--heo-maskbg-border);
        box-shadow: var(--heo-shadow-glass);
        backdrop-filter: var(--heo-glass-blur);
        -webkit-backdrop-filter: var(--heo-glass-blur);
      }

      .dark #theme-heo .heo-nav-chip,
      .dark #theme-heo .heo-cat-chip {
        background: var(--heo-maskbg) !important;
        border-color: var(--heo-maskbg-border);
        box-shadow: none;
      }

      /* 顶栏区域本身绝不铺实心白 / 不整条毛玻璃（只让胶囊透） */
      #theme-heo header,
      #theme-heo .heo-nav-spacer,
      #theme-heo #nav,
      #theme-heo .heo-nav--plain,
      #theme-heo .heo-nav--top,
      #theme-heo .heo-nav--scrolled,
      #theme-heo .heo-nav-inner,
      #theme-heo #category-bar,
      #theme-heo .home-category-bar {
        background: transparent !important;
        background-color: transparent !important;
        box-shadow: none !important;
        border: 0 !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      /* 左上角回主页胶囊：文章头图上用白底深色图标（见下方更具体规则） */
      #theme-heo .heo-logo-home-btn {
        color: #fff !important;
      }

      .dark #theme-heo .heo-logo-home-btn {
        color: #111827 !important;
      }

      #theme-heo #nav.text-white .heo-logo-home-btn {
        background: var(--heo-color-primary) !important;
        color: #fff !important;
        box-shadow: 0 6px 14px -8px rgba(0, 0, 0, 0.45);
      }

      #theme-heo .heo-aside-card {
        border-radius: 1rem;
      }

      /* 欢迎挂件：轻 3D 浮动，去掉方框感 */
      #theme-heo .heo-mascot-3d {
        perspective: 420px;
        filter: drop-shadow(0 14px 18px rgba(40, 50, 90, 0.28));
      }
      #theme-heo .heo-mascot-img {
        transform: rotateY(-8deg) rotateX(6deg);
        transform-style: preserve-3d;
        animation: heo-mascot-float 3.6s ease-in-out infinite;
        background: transparent !important;
        border: 0 !important;
        box-shadow: none !important;
        display: block;
      }
      @keyframes heo-mascot-float {
        0%, 100% { transform: rotateY(-8deg) rotateX(6deg) translateY(0); }
        50% { transform: rotateY(-4deg) rotateX(8deg) translateY(-6px); }
      }
      #theme-heo .heo-mascot-tip {
        writing-mode: horizontal-tb !important;
      }

      /* 文章页主体：去掉细线框 */
      #theme-heo .article {
        box-shadow: none !important;
        border: 0 !important;
        outline: none !important;
      }

      /* 避免父层 overflow 裁切 fixed 导航（Safari） */
      #theme-heo,
      #theme-heo #wrapper-outer {
        overflow: visible;
      }

      /* 文章封面顶栏：对齐 Heo —— 无毛玻璃胶囊，纯白字浮在封面色上 */
      #theme-heo #nav.text-white .heo-nav-chip {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }

      #theme-heo #nav.text-white .heo-nav-chip a,
      #theme-heo #nav.text-white .heo-nav-chip button,
      #theme-heo #nav.text-white .heo-nav-chip h1,
      #theme-heo #nav.text-white .heo-nav-chip span,
      #theme-heo #nav.text-white .heo-nav-chip i,
      #theme-heo #nav.text-white .heo-nav-chip .text-gray-900,
      #theme-heo #nav.text-white .heo-nav-chip .text-gray-700,
      #theme-heo #nav.text-white .heo-nav-chip .text-gray-600 {
        color: #fff !important;
      }

      #theme-heo #nav.text-white .heo-nav-home-pill,
      #theme-heo #nav.text-white .heo-logo-trigger {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      #theme-heo #nav.text-white .heo-nav-badge-pill {
        background: rgba(0, 0, 0, 0.28) !important;
        border-color: rgba(255, 255, 255, 0.2) !important;
        color: #fff !important;
      }

      /* 封面预览卡：落在导航下方，禁止顶到顶栏造成「叠层」 */
      #theme-heo .heo-post-cover-aside {
        top: auto !important;
        bottom: 4.75rem;
        transform: none !important;
      }
      #theme-heo .heo-post-cover-aside:hover {
        transform: scale(1.03) !important;
      }

      /* 顶栏：始终 fixed + Safari 安全区 */
      #theme-heo .heo-nav--fixed {
        top: 0;
        padding-top: env(safe-area-inset-top, 0px);
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
      }

      #theme-heo .heo-nav-spacer {
        height: calc(4.25rem + env(safe-area-inset-top, 0px));
      }

      /* 顶栏整条始终透明：封面色顶到视口最上，消灭白条分层 */
      #theme-heo .heo-nav--top,
      #theme-heo .heo-nav--scrolled,
      #theme-heo .heo-nav--plain {
        background: transparent !important;
        border-bottom: 0 !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      .dark #theme-heo .heo-nav--top,
      .dark #theme-heo .heo-nav--scrolled,
      .dark #theme-heo .heo-nav--plain {
        background: transparent !important;
        border-bottom: 0 !important;
        box-shadow: none !important;
      }

      /* 文章封面上移盖住导航占位，颜色铺满顶部 */
      #theme-heo #post-bg.heo-post-bg {
        margin-top: calc(-1 * (4.25rem + env(safe-area-inset-top, 0px)));
        padding-top: calc(4.25rem + env(safe-area-inset-top, 0px));
        min-height: calc(28rem + 4.25rem + env(safe-area-inset-top, 0px));
        height: auto;
      }
      @media (min-width: 768px) {
        #theme-heo #post-bg.heo-post-bg {
          min-height: calc(30rem + 4.25rem + env(safe-area-inset-top, 0px));
        }
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
        background: rgba(255, 255, 255, 0.55);
        border: 1px solid rgba(255, 255, 255, 0.4);
        color: #2b2f36;
        font-size: 11px;
        font-weight: 800;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }

      .dark #theme-heo .heo-nav-badge-pill {
        background: rgba(40, 42, 50, 0.5);
        border-color: rgba(255, 255, 255, 0.1);
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

      /* 标签云：瞬时悬停，深色胶囊（对齐 Heo，无延迟上浮） */
      #theme-heo .heo-tag-chip {
        border: 0 !important;
        box-shadow: none !important;
        outline: none !important;
        transition: background-color 75ms linear, color 75ms linear !important;
        transform: none !important;
      }

      #theme-heo .heo-tag-chip:hover {
        background: #2c2f36 !important;
        color: #fff !important;
        transform: none !important;
      }

      .dark #theme-heo .heo-tag-chip:hover {
        background: #3a3d46 !important;
        color: #fff !important;
      }

      #theme-heo .heo-tag-chip--active:hover {
        filter: none;
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

      /* 文章代码块：炭灰底 + 高对比语法色（对齐 Mac 风格） */
      #theme-heo #article-wrapper .code-toolbar,
      #theme-heo #notion-article .code-toolbar {
        background: #2c2e34 !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 14px !important;
        box-shadow: 0 8px 28px rgba(15, 23, 42, 0.12) !important;
      }

      #theme-heo #article-wrapper pre.notion-code,
      #theme-heo #notion-article pre.notion-code {
        background: #2c2e34 !important;
        color: rgba(235, 235, 245, 0.92) !important;
        border-color: rgba(255, 255, 255, 0.08) !important;
        text-shadow: none !important;
      }

      #theme-heo #article-wrapper .code-toolbar > pre.notion-code,
      #theme-heo #notion-article .code-toolbar > pre.notion-code {
        background: transparent !important;
        border: none !important;
      }

      #theme-heo #article-wrapper .code-toolbar code,
      #theme-heo #notion-article .code-toolbar code,
      #theme-heo #article-wrapper pre.notion-code code,
      #theme-heo #notion-article pre.notion-code code {
        color: rgba(235, 235, 245, 0.92) !important;
        text-shadow: none !important;
      }

      #theme-heo #article-wrapper .token.keyword,
      #theme-heo #notion-article .token.keyword,
      #theme-heo #article-wrapper .token.atrule,
      #theme-heo #notion-article .token.atrule {
        color: #ff7ab2 !important;
      }

      #theme-heo #article-wrapper .token.string,
      #theme-heo #notion-article .token.string,
      #theme-heo #article-wrapper .token.attr-name,
      #theme-heo #notion-article .token.attr-name {
        color: #a5d6ff !important;
      }

      #theme-heo #article-wrapper .token.function,
      #theme-heo #notion-article .token.function,
      #theme-heo #article-wrapper .token.class-name,
      #theme-heo #notion-article .token.class-name,
      #theme-heo #article-wrapper .token.operator,
      #theme-heo #notion-article .token.operator {
        color: #ffd479 !important;
      }

      #theme-heo #article-wrapper .token.tag,
      #theme-heo #notion-article .token.tag,
      #theme-heo #article-wrapper .token.number,
      #theme-heo #notion-article .token.number,
      #theme-heo #article-wrapper .token.boolean,
      #theme-heo #notion-article .token.boolean {
        color: #7ee787 !important;
      }

      #theme-heo #article-wrapper .token.comment,
      #theme-heo #notion-article .token.comment {
        color: rgba(235, 235, 245, 0.48) !important;
      }

      /* Logo：文章头图上用白字，无白胶囊底 */
      #theme-heo #nav.text-white .heo-logo-trigger .heo-logo-menu-btn,
      #theme-heo #nav.text-white .heo-logo-trigger span:not(.heo-logo-home-btn),
      #theme-heo #nav.text-white .heo-logo-trigger svg {
        color: #fff !important;
        fill: currentColor;
      }
      #theme-heo #nav.text-white .heo-logo-trigger a:not(.heo-logo-home-btn),
      #theme-heo #nav.text-white .heo-logo-trigger button {
        color: #fff !important;
      }

      /* 右侧栏与首页 Hero 资料卡同宽，左缘对齐 */
      #theme-heo #sideRight.heo-side-right {
        align-self: stretch;
        width: 300px;
      }
      #theme-heo .heo-hero-aside {
        width: 100%;
      }
      @media (min-width: 1024px) {
        #theme-heo .heo-hero-aside {
          width: 300px;
        }
      }
      @media (min-width: 1280px) {
        #theme-heo #sideRight.heo-side-right,
        #theme-heo .heo-hero-aside {
          width: 320px;
        }
      }
      #theme-heo #sideRight .heo-side-sticky {
        position: sticky;
        top: 5rem;
        max-height: calc(100vh - 5.5rem);
        overflow-x: hidden;
        overflow-y: auto;
        overscroll-behavior: contain;
        padding-bottom: 0.5rem;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE/Edge legacy */
      }
      #theme-heo #sideRight .heo-side-sticky::-webkit-scrollbar {
        width: 0;
        height: 0;
        display: none;
      }
      #theme-heo #sideRight .heo-side-sticky::-webkit-scrollbar-thumb {
        background: transparent;
      }

      ${themeConsoleStyle('heo', CONFIG)}
  `}</style>
  )
}

export { Style }

