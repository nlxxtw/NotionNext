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
        /* 氛围只铺在 html/body，主题根透明贯通，避免 fixed 顶栏透视分层 */
        background-color: transparent;
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
        background-color: transparent;
        background-image: none;
        --heo-maskbg: rgba(40, 42, 52, 0.42);
        --heo-maskbg-border: rgba(255, 255, 255, 0.1);
        --heo-shadow-glass: none;
      }

      /* 旧色雾层停用：保留节点以免改 JSX，但不再单独绘制，避免顶栏分层线 */
      #theme-heo .heo-atmosphere {
        display: none !important;
      }
      /* 内容正常文档流；不要给 header/main 强行抬 z-index 挡背景 */
      #theme-heo > header,
      #theme-heo > main,
      #theme-heo > footer,
      #theme-heo .heo-footer {
        position: relative;
        z-index: auto;
        background: transparent !important;
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

      /* fixed 顶栏合成对着视口：html/body 必须与主题同色同雾，否则顶栏下是实色、下面是紫雾 → 分层线 */
      html,
      body {
        background-color: ${bg};
        background-image:
          radial-gradient(ellipse 50% 42% at 10% 0%, rgba(186, 156, 255, 0.34), transparent 72%),
          radial-gradient(ellipse 46% 38% at 92% 0%, rgba(167, 139, 250, 0.26), transparent 70%),
          radial-gradient(ellipse 42% 34% at 48% 0%, rgba(253, 224, 171, 0.18), transparent 68%),
          radial-gradient(ellipse 60% 40% at 55% 18%, rgba(196, 181, 253, 0.14), transparent 75%);
        background-repeat: no-repeat;
        background-size: 100% 560px;
        background-position: top center;
      }
      html.dark,
      html.dark body,
      .dark body {
        background-color: ${bgDark};
        background-image:
          radial-gradient(ellipse 52% 44% at 8% 0%, rgba(122, 93, 250, 0.28), transparent 72%),
          radial-gradient(ellipse 48% 40% at 94% 0%, rgba(167, 148, 255, 0.16), transparent 70%),
          radial-gradient(ellipse 56% 36% at 50% 12%, rgba(90, 70, 160, 0.14), transparent 74%);
        background-repeat: no-repeat;
        background-size: 100% 560px;
        background-position: top center;
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

      /* 顶栏悬停下拉：复刻安知鱼 menus_item_child（横向胶囊） */
      #theme-heo #nav-bar-swipe,
      #theme-heo .heo-nav-chip,
      #theme-heo .heo-menus-items {
        overflow: visible !important;
      }
      #theme-heo .heo-menus-item-link {
        color: inherit;
      }
      #theme-heo .heo-menus-item:hover > .heo-menus-item-link,
      #theme-heo .heo-menus-item:focus-within > .heo-menus-item-link {
        color: #fff !important;
        background: var(--heo-color-primary);
        box-shadow: var(--heo-shadow-main);
      }
      #theme-heo #nav.text-white .heo-menus-item:hover > .heo-menus-item-link,
      #theme-heo #nav.text-white .heo-menus-item:focus-within > .heo-menus-item-link {
        color: #fff !important;
        background: rgba(255, 255, 255, 0.22);
        box-shadow: none;
      }
      #theme-heo .heo-menus-item-child {
        left: 50%;
        top: calc(100% + 10px);
        width: max-content;
        max-width: min(92vw, 42rem);
        padding: 6px 4px;
        border-radius: 50px;
        border: 1px solid var(--heo-card-border, rgba(0, 0, 0, 0.06));
        background: var(--heo-color-card, #fff);
        box-shadow: 0 8px 24px -10px rgba(20, 30, 60, 0.28);
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transform: translateX(-50%) translateY(-8px) scale(0);
        transform-origin: top center;
        transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
      }
      .dark #theme-heo .heo-menus-item-child {
        background: var(--heo-color-card-dark, #1b1c20);
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow: 0 10px 28px -12px rgba(0, 0, 0, 0.55);
      }
      /* 主菜单与下拉之间的安全区，避免鼠标移过去时闪断 */
      #theme-heo .heo-menus-item-child::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: -14px;
        height: 16px;
      }
      #theme-heo .heo-menus-item:hover > .heo-menus-item-child,
      #theme-heo .heo-menus-item:focus-within > .heo-menus-item-child {
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: translateX(-50%) translateY(0) scale(1);
      }
      #theme-heo .heo-menus-child-link:hover {
        color: #fff !important;
        background: var(--heo-color-primary) !important;
        box-shadow: var(--heo-shadow-main);
      }
      #theme-heo .heo-menus-child-li:hover {
        background: transparent;
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

      /* 分类条压过 Hero 装饰层，避免 tab 被盖住/裁切 */
      #theme-heo #category-bar,
      #theme-heo .home-category-bar {
        position: relative;
        z-index: 5;
        isolation: isolate;
      }
      #theme-heo #category-bar-items {
        flex: 1 1 auto;
        min-width: 0;
      }
      #theme-heo #hero-wrapper {
        position: relative;
        z-index: 0;
        isolation: isolate;
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

      /* 减轻 fixed 顶栏底边合成接缝 */
      #theme-heo #nav.heo-nav--fixed {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        /* 向下多盖 1px，抹掉与下方内容的合成白线 */
        margin-bottom: -1px;
        padding-bottom: 1px;
        box-shadow: none !important;
        border: 0 !important;
        outline: none !important;
        background: transparent !important;
      }
      #theme-heo #nav.heo-nav--fixed::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -2px;
        height: 3px;
        pointer-events: none;
        background: transparent;
      }
      /* 首页/分类：导航占位与主区同色贯通，不要单独成层 */
      #theme-heo:not(:has(#post-bg)) > header,
      #theme-heo:not(:has(#post-bg)) .heo-nav-spacer {
        background: transparent !important;
        box-shadow: none !important;
        border: 0 !important;
      }
      #theme-heo:not(:has(#post-bg)) > main#wrapper-outer {
        padding-top: 0.25rem;
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

      /* 封面预览卡：跟标题同一行靠右，不再用百分比乱飘 */
      #theme-heo .heo-post-cover-aside {
        position: relative !important;
        top: auto !important;
        bottom: auto !important;
        right: auto !important;
        left: auto !important;
        transform: none !important;
        box-shadow:
          0 8px 20px -12px rgba(0, 0, 0, 0.32),
          0 0 0 1px rgba(255, 255, 255, 0.08) !important;
      }
      #theme-heo .heo-post-cover-aside:hover {
        transform: scale(1.02) !important;
      }

      /* 文章头图与正文/侧栏之间留白 */
      #theme-heo:has(#post-bg) > main#wrapper-outer {
        padding-top: 1rem;
      }
      #theme-heo #post-bg.heo-post-bg {
        box-shadow: none !important;
      }
      #theme-heo .heo-author-card {
        box-shadow: 0 6px 16px -10px rgba(0, 0, 0, 0.22) !important;
      }

      /* 文章头图元信息：柔和透明底，无白色细线框；强制白字 */
      #theme-heo #post-info .heo-post-meta-pill {
        border: 0 !important;
        box-shadow: none !important;
        background: rgba(255, 255, 255, 0.18) !important;
      }
      #theme-heo #post-info .heo-post-meta,
      #theme-heo #post-info .heo-post-meta-pill,
      #theme-heo #post-info .heo-post-meta-pill *,
      #theme-heo #post-info #wordCountWrapper,
      #theme-heo #post-info #wordCountWrapper * {
        color: #fff !important;
      }

      /* 页脚风车：无白圈阴影，靠右 */
      #theme-heo .heo-footer-logo {
        box-shadow: none !important;
        outline: none !important;
        border: 0 !important;
      }

      /* 顶栏：始终 fixed + Safari 安全区（不用 translateZ，避免整条顶栏单独成层产生色带） */
      #theme-heo .heo-nav--fixed {
        top: 0;
        padding-top: env(safe-area-inset-top, 0px);
      }

      #theme-heo .heo-nav-spacer {
        height: calc(3.5rem + env(safe-area-inset-top, 0px));
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

      /* 文章封面：略收高度、加大底边距，标题区整体上移（对齐 Heo） */
      #theme-heo #post-bg.heo-post-bg {
        margin-top: calc(-1 * (3.5rem + env(safe-area-inset-top, 0px)));
        padding-top: 0;
        height: calc(16.5rem + 3.5rem + env(safe-area-inset-top, 0px));
        min-height: calc(16.5rem + 3.5rem + env(safe-area-inset-top, 0px));
      }
      @media (min-width: 768px) {
        #theme-heo #post-bg.heo-post-bg {
          height: calc(17.75rem + 3.5rem + env(safe-area-inset-top, 0px));
          min-height: calc(17.75rem + 3.5rem + env(safe-area-inset-top, 0px));
        }
      }
      @media (min-width: 1024px) {
        #theme-heo #post-bg.heo-post-bg {
          height: calc(18.5rem + 3.5rem + env(safe-area-inset-top, 0px));
          min-height: calc(18.5rem + 3.5rem + env(safe-area-inset-top, 0px));
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
        height: 2.25rem !important;
      }

      .dark #theme-heo #darkModeButton,
      .dark #theme-heo .heo-dark-toggle {
        background: #2a2c34 !important;
      }

      #theme-heo .heo-dark-toggle-knob {
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.16);
        color: #374151;
      }

      /* 右侧工具胶囊与日夜开关同高对齐 */
      #theme-heo .heo-nav-inner .heo-nav-chip {
        min-height: 2.25rem;
        display: inline-flex;
        align-items: center;
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
      #theme-heo .heo-footer,
      #theme-heo #footer-bottom,
      #theme-heo .heo-footer-quick-links {
        overflow: visible !important;
      }

      @keyframes heo-tip-pop {
        from {
          opacity: 0;
          transform: translateY(10px) scale(0.96);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      .heo-tip-qr-card {
        animation: heo-tip-pop 220ms ease-out;
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

      /* 首页十字对齐：轮播与资料卡同高 320px（Heo .home-center-content / .card-content） */
      @media (min-width: 1024px) {
        #theme-heo .heo-home-banner,
        #theme-heo #home_center .heo-hero-row {
          height: 320px !important;
          min-height: 320px !important;
        }
      }
      @media (min-width: 1280px) {
        #theme-heo #sideRight .heo-info-card,
        #theme-heo #sideRight .heo-author-card.heo-info-card__body {
          height: 320px !important;
          min-height: 320px !important;
          max-height: 320px !important;
        }
        #theme-heo #sideRight .heo-side-sticky {
          gap: 0.75rem;
        }
        #theme-heo #hero-wrapper {
          margin-bottom: 0.75rem !important;
        }
      }

      /* 右侧栏宽度；资料卡已回到侧栏顶，Hero 旁资料卡仅 <xl 显示 */
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
        #theme-heo #sideRight.heo-side-right {
          width: 320px;
        }
      }
      /* 右侧栏：对齐 Heo —— 资料卡/公众号普通流；.heo-side-sticky 仅吸住下方热门等
         aside 必须 stretch 与主栏同高，sticky 才有吸住空间 */
      #theme-heo #sideRight .heo-side-sticky {
        position: sticky;
        top: 5rem;
        max-height: none;
        overflow: visible;
        overscroll-behavior: auto;
        padding-bottom: 0.5rem;
      }

      /* ========== 安知鱼风格：文章版权卡 / 标签 / 相关推荐 / 评论 ========== */
      #theme-heo .heo-post-copyright-wrap {
        margin-top: 4.5rem;
      }
      #theme-heo .heo-post-copyright {
        position: relative;
        margin: 2.5rem 0 1.25rem;
        padding: 2.25rem 1.25rem 1rem;
        border-radius: 12px;
        background: var(--heo-color-card-muted, #f7f7f9);
        border: 1px solid color-mix(in srgb, var(--heo-color-border, #e5e7eb) 35%, transparent);
      }
      .dark #theme-heo .heo-post-copyright {
        background: color-mix(in srgb, #2a2b31 92%, #000);
        border-color: rgba(255, 255, 255, 0.08);
      }
      #theme-heo .heo-post-copyright__avatar {
        position: absolute;
        left: 50%;
        top: -33px;
        width: 66px;
        height: 66px;
        margin-left: -33px;
        border-radius: 50%;
        overflow: hidden;
        border: 3px solid #fff;
        box-shadow: 0 8px 20px -10px rgba(40, 50, 90, 0.45);
        z-index: 2;
      }
      .dark #theme-heo .heo-post-copyright__avatar {
        border-color: #2a2b31;
      }
      #theme-heo .heo-post-copyright__avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      #theme-heo .heo-post-copyright__author {
        text-align: center;
      }
      #theme-heo .heo-post-copyright__name {
        font-size: 20px;
        font-weight: 700;
        line-height: 1.2;
        color: var(--heo-color-text, #111827);
      }
      #theme-heo .heo-post-copyright__bio {
        margin-top: 6px;
        font-size: 14px;
        color: #8b8b91;
      }
      #theme-heo .heo-post-copyright__tools {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.5rem;
        margin-top: 1rem;
      }
      #theme-heo .heo-post-tool {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.35rem;
        min-width: 110px;
        height: 40px;
        padding: 0 1rem;
        border-radius: 8px;
        border: 0;
        color: #fff !important;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
        text-decoration: none !important;
      }
      #theme-heo .heo-post-tool:hover {
        transform: translateY(-1px);
        filter: brightness(1.05);
      }
      #theme-heo .heo-post-tool--tip {
        background: #ff4d4f;
        box-shadow: 0 8px 16px -8px rgba(255, 77, 79, 0.75);
      }
      #theme-heo .heo-post-tool--sub {
        background: #57bd6a;
        box-shadow: 0 8px 16px -8px rgba(87, 189, 106, 0.75);
      }
      #theme-heo .heo-post-tool--share {
        background: #425aef;
        box-shadow: 0 8px 16px -8px rgba(66, 90, 239, 0.7);
      }
      #theme-heo .heo-post-copyright__notice {
        margin: 0.9rem 0 0;
        text-align: center;
        font-size: 12px;
        line-height: 1.6;
        color: #8b8b91;
      }
      #theme-heo .heo-post-copyright__site {
        color: var(--heo-color-primary, #425aef);
        text-decoration: underline;
        text-underline-offset: 2px;
      }

      #theme-heo .heo-post-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 0.25rem 0 1.5rem;
      }
      #theme-heo .heo-post-tag {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 4px 12px;
        border-radius: 8px;
        font-size: 0.85em;
        color: var(--heo-color-text, #333);
        background: var(--heo-color-card-muted, #f2f3f7);
        transition: 0.2s ease;
      }
      .dark #theme-heo .heo-post-tag {
        background: rgba(255, 255, 255, 0.06);
        color: #e5e7eb;
      }
      #theme-heo .heo-post-tag:hover {
        background: var(--heo-color-primary, #425aef);
        color: #fff;
      }
      #theme-heo .heo-post-tag__hash {
        opacity: 0.7;
      }
      #theme-heo .heo-post-tag__count {
        min-width: 1.25rem;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 0.7rem;
        line-height: 1;
        text-align: center;
        background: rgba(0, 0, 0, 0.06);
      }
      #theme-heo .heo-post-tag:hover .heo-post-tag__count {
        background: rgba(255, 255, 255, 0.25);
      }

      #theme-heo .heo-related-posts {
        margin-top: 2.25rem;
        user-select: none;
      }
      #theme-heo .heo-related-posts__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1.125rem;
      }
      #theme-heo .heo-related-posts__title {
        display: inline-flex;
        align-items: center;
        gap: 0.65rem;
        margin: 0;
        font-size: 1.35rem;
        font-weight: 800;
        line-height: 1.2;
        color: var(--heo-color-text, #111827);
      }
      #theme-heo .heo-related-posts__star {
        font-size: 1.15rem;
        color: var(--heo-color-text, #111827);
      }
      #theme-heo .heo-related-posts__random {
        border: 0;
        background: transparent;
        color: #8b8b91;
        font-size: 0.8rem;
        cursor: pointer;
        white-space: nowrap;
        transition: color 0.2s;
      }
      #theme-heo .heo-related-posts__random:hover {
        color: var(--heo-color-primary, #425aef);
      }
      #theme-heo .heo-related-posts__list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      #theme-heo .heo-related-card {
        display: flex;
        overflow: hidden;
        height: 220px;
        border-radius: 12px;
        border: 1px solid color-mix(in srgb, var(--heo-color-border, #e5e7eb) 40%, transparent);
        background: var(--heo-color-card-muted, #f2f3f7);
        text-decoration: none !important;
        transition: none;
      }
      .dark #theme-heo .heo-related-card {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.08);
      }
      #theme-heo .heo-related-card__cover {
        position: relative;
        width: 45%;
        min-width: 45%;
        overflow: hidden;
        background: #1f2937;
      }
      #theme-heo .heo-related-card__img,
      #theme-heo .heo-related-card__cover img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s ease;
      }
      #theme-heo .heo-related-card:hover .heo-related-card__img,
      #theme-heo .heo-related-card:hover .heo-related-card__cover img {
        transform: scale(1.05);
      }
      #theme-heo .heo-related-card__fallback {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #425aef, #7c3aed);
      }
      #theme-heo .heo-related-card__body {
        display: flex;
        align-items: center;
        width: 55%;
        padding: 1.5rem 1.75rem;
        background: var(--heo-color-card-muted, #f2f3f7);
        transition: background 0.3s ease;
      }
      .dark #theme-heo .heo-related-card__body {
        background: rgba(255, 255, 255, 0.04);
      }
      #theme-heo .heo-related-card__title {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin: 0;
        font-size: 1.125rem;
        font-weight: 800;
        line-height: 1.45;
        color: var(--heo-color-text, #1f2937);
        transition: color 0.3s ease;
      }
      .dark #theme-heo .heo-related-card__title {
        color: #f3f4f6;
      }
      #theme-heo .heo-related-card:hover .heo-related-card__body {
        background: var(--heo-color-primary, #425aef);
      }
      #theme-heo .heo-related-card:hover .heo-related-card__title {
        color: #fff;
      }
      @media (max-width: 768px) {
        #theme-heo .heo-related-card {
          flex-direction: column;
          height: auto;
        }
        #theme-heo .heo-related-card__cover {
          width: 100%;
          min-width: 100%;
          height: 132px;
        }
        #theme-heo .heo-related-card__body {
          width: 100%;
          padding: 0.875rem;
        }
        #theme-heo .heo-related-card:hover .heo-related-card__body {
          background: var(--heo-color-card-muted, #f2f3f7);
        }
        #theme-heo .heo-related-card:hover .heo-related-card__title {
          color: var(--heo-color-text, #1f2937);
        }
      }

      /* 分享海报弹窗（对齐 anheyu-app） */
      #theme-heo .heo-poster-overlay,
      .heo-poster-overlay {
        position: fixed;
        inset: 0;
        z-index: 220;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.5);
      }
      .heo-poster-dialog {
        width: min(720px, 96vw);
        max-height: 90vh;
        overflow: hidden;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.28);
      }
      .dark .heo-poster-dialog {
        background: #1e1f26;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }
      .heo-poster-dialog__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      }
      .dark .heo-poster-dialog__head {
        border-bottom-color: rgba(255, 255, 255, 0.08);
      }
      .heo-poster-dialog__head h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
      }
      .heo-poster-dialog__close {
        width: 32px;
        height: 32px;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: #8b8b91;
        cursor: pointer;
      }
      .heo-poster-dialog__close:hover {
        background: rgba(0, 0, 0, 0.05);
      }
      .heo-poster-dialog__body {
        display: flex;
        gap: 1.25rem;
        padding: 1rem 1.25rem 1.25rem;
        overflow: auto;
        max-height: calc(90vh - 64px);
      }
      .heo-poster-preview {
        flex: 0 0 300px;
        max-width: 300px;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid rgba(0, 0, 0, 0.08);
        background: #fff;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      }
      .heo-poster-preview img {
        display: block;
        width: 100%;
        height: auto;
      }
      .heo-poster-loading {
        padding: 3rem 1rem;
        text-align: center;
        color: #8b8b91;
        font-size: 14px;
      }
      .heo-poster-actions {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1.15rem;
        justify-content: center;
        min-width: 0;
      }
      .heo-poster-label {
        margin-bottom: 0.55rem;
        font-size: 14px;
        font-weight: 600;
      }
      .heo-poster-url {
        width: 100%;
        padding: 10px 12px;
        font-size: 13px;
        border-radius: 6px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        background: #f5f5f7;
        color: inherit;
        cursor: pointer;
      }
      .dark .heo-poster-url {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.1);
      }
      .heo-share-btn {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
        gap: 0.45rem;
        margin-bottom: 0.55rem;
        padding: 12px 16px;
        border: 0;
        border-radius: 6px;
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
      }
      .heo-share-btn--weibo { background: #e6162d; }
      .heo-share-btn--qq { background: #12b7f5; }
      .heo-share-btn--qzone { background: #fcee21; color: #333; }
      .heo-poster-download {
        width: 100%;
        padding: 12px 16px;
        border: 0;
        border-radius: 6px;
        background: #4a4a4a;
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
      }
      .heo-poster-download:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }
      @media (max-width: 768px) {
        .heo-poster-dialog__body {
          flex-direction: column;
        }
        .heo-poster-preview {
          flex: none;
          max-width: 100%;
          width: min(280px, 100%);
          margin: 0 auto;
        }
      }

      #theme-heo .heo-post-comment {
        margin-top: 1.5rem;
        padding-bottom: 1.5rem;
      }
      #theme-heo .heo-post-comment__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 0.85rem;
      }
      #theme-heo .heo-post-comment__title {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--heo-color-text, #111827);
      }

      /* Waline：对齐安知鱼评论框气质 */
      #theme-heo .heo-post-comment__body .wl-panel,
      #theme-heo .heo-post-comment__body .wl-editor {
        border-radius: 12px !important;
        background: var(--heo-color-card-muted, #f7f7f9) !important;
        border: 1px solid transparent !important;
        box-shadow: none !important;
      }
      .dark #theme-heo .heo-post-comment__body .wl-panel,
      .dark #theme-heo .heo-post-comment__body .wl-editor {
        background: rgba(255, 255, 255, 0.05) !important;
      }
      #theme-heo .heo-post-comment__body .wl-editor {
        min-height: 140px !important;
        padding: 0.85rem 1rem !important;
        font-size: 0.95rem !important;
      }
      #theme-heo .heo-post-comment__body .wl-editor:focus {
        border-color: color-mix(
          in srgb,
          var(--heo-color-primary, #425aef) 45%,
          transparent
        ) !important;
      }
      #theme-heo .heo-post-comment__body .wl-card,
      #theme-heo .heo-post-comment__body .wl-item {
        border-radius: 12px;
        border: none;
        border-top: 1px dashed rgba(0, 0, 0, 0.08);
        background: transparent;
        padding-top: 1rem;
        margin-top: 0;
      }
      .dark #theme-heo .heo-post-comment__body .wl-card,
      .dark #theme-heo .heo-post-comment__body .wl-item {
        border-top-color: rgba(255, 255, 255, 0.1);
      }
      #theme-heo .heo-post-comment__body .wl-btn.primary {
        border-radius: 8px !important;
        background: var(--heo-color-primary, #425aef) !important;
      }

      /* 游客付费解锁墙 */
      #theme-heo .heo-paid-wall {
        position: relative;
        margin: 1.25rem 0;
        padding: 1.25rem 1rem 1rem;
        border: 1px dashed #f3a6b8;
        border-radius: 12px;
        background: #fff5f7;
        text-align: center;
      }
      .dark #theme-heo .heo-paid-wall {
        background: rgba(243, 166, 184, 0.12);
        border-color: rgba(243, 166, 184, 0.45);
      }
      #theme-heo .heo-paid-wall__ribbon {
        position: absolute;
        top: 0;
        left: 0;
        padding: 0.2rem 0.65rem;
        border-radius: 12px 0 10px 0;
        background: #e11d48;
        color: #fff;
        font-size: 12px;
        font-weight: 600;
      }
      #theme-heo .heo-paid-wall__icon {
        width: 36px;
        height: 36px;
        margin: 0.5rem auto 0.75rem;
        border-radius: 999px;
        background: #fb7185;
        color: #fff;
        font-weight: 700;
        line-height: 36px;
      }
      #theme-heo .heo-paid-wall__title {
        font-size: 1.05rem;
        font-weight: 700;
        margin-bottom: 0.35rem;
      }
      #theme-heo .heo-paid-wall__desc {
        color: #666;
        font-size: 0.92rem;
        margin-bottom: 0.75rem;
      }
      .dark #theme-heo .heo-paid-wall__desc {
        color: #c4c4c4;
      }
      #theme-heo .heo-paid-wall__price {
        margin-bottom: 0.9rem;
      }
      #theme-heo .heo-paid-wall__amount {
        font-size: 2rem;
        font-weight: 800;
        color: #e11d48;
        margin-right: 0.25rem;
      }
      #theme-heo .heo-paid-wall__btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 160px;
        padding: 0.55rem 1.1rem;
        border: 0;
        border-radius: 999px;
        background: #425aef;
        color: #fff;
        font-weight: 600;
        cursor: pointer;
      }
      #theme-heo .heo-paid-wall__btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
      #theme-heo .heo-paid-wall__qrbox {
        margin-top: 0.5rem;
      }
      #theme-heo .heo-paid-wall__qr {
        width: 180px;
        height: 180px;
        margin: 0 auto;
        background: #fff;
        border-radius: 8px;
      }
      #theme-heo .heo-paid-wall__tip,
      #theme-heo .heo-paid-wall__guest {
        margin-top: 0.6rem;
        font-size: 12px;
        color: #888;
      }
      #theme-heo .heo-paid-wall__error {
        margin-top: 0.6rem;
        color: #e11d48;
        font-size: 13px;
      }
      #theme-heo .heo-paid-wall--unlocked {
        border-style: solid;
        border-color: rgba(66, 90, 239, 0.35);
        background: rgba(66, 90, 239, 0.06);
        text-align: left;
      }
      #theme-heo .heo-paid-wall__badge {
        display: inline-block;
        margin-bottom: 0.5rem;
        padding: 0.15rem 0.5rem;
        border-radius: 999px;
        background: #425aef;
        color: #fff;
        font-size: 12px;
      }
      #theme-heo .heo-paid-wall__content {
        white-space: pre-wrap;
        word-break: break-all;
        font-family: inherit;
        font-size: 0.95rem;
        line-height: 1.7;
        margin: 0.5rem 0 0;
      }

      /* Waline：隐藏底部 RSS / Powered by / 空评论提示 */
      #theme-heo .wl-footer,
      #theme-heo .wl-power,
      .wl-footer,
      .wl-power {
        display: none !important;
        height: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        visibility: hidden !important;
      }
      #theme-heo .wl-empty,
      .wl-empty {
        display: none !important;
      }

      ${themeConsoleStyle('heo', CONFIG)}
  `}</style>
  )
}

export { Style }

