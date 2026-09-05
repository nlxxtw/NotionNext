const CONFIG = {
  HEO_HOME_POST_TWO_COLS: true, // 首页博客两列显示，若为false则只显示一列
  HEO_LOADING_COVER: false, // 关全屏加载遮罩，文章切换秒开

  HEO_HOME_BANNER_ENABLE: true,

  HEO_INFO_CARD_AVATAR_BLUR: true, // 文章详情页个人资料卡头像样式。true：显示为模糊装饰头像；false：与首页头像保持一致

  // 主色：对齐现网资料卡紫色
  HEO_COLOR_PRIMARY: '#7a5dfa',
  HEO_COLOR_PRIMARY_HOVER: '#6a4ff0',
  HEO_COLOR_PRIMARY_TEXT: '#ffffff',
  HEO_COLOR_ACCENT: '#ffc848',
  HEO_COLOR_BG: '#f7f9fe',
  HEO_COLOR_BG_DARK: '#18171d',
  HEO_COLOR_CARD: '#ffffff',
  HEO_COLOR_CARD_DARK: '#1e1e1e',
  HEO_COLOR_CARD_MUTED: '#f1f3f8',
  HEO_COLOR_BORDER: '#e3e8f7',
  HEO_COLOR_BORDER_DARK: 'rgba(255,255,255,0.12)',
  HEO_COLOR_TEXT: '#111827',
  HEO_COLOR_TEXT_SECONDARY: '#4b5563',

  HEO_SITE_CREATE_TIME: '2021-09-21', // 建站日期，用于计算网站运行的第几天

  // 顶栏「新更新」徽章：留空不显示；填数字如 '3' 显示黑灰圆点；填文字显示无彩色胶囊
  HEO_NAV_UPDATE_BADGE: '',
  HEO_NAV_UPDATE_BADGE_URL: '/',

  // Logo 项目大菜单（截图：博客/应用/服务/表情）
  // Notion 写法：创建 type=Menu 的分组页，并打上标签 LogoMega；
  // 其下按顺序创建 type=SubMenu 的子项，页面图标即菜单图标（可传图）
  HEO_LOGO_MEGA_ENABLE: true, // 悬停加大后的 Logo 图标/站名弹出菜单；回主页按钮不弹
  HEO_LOGO_MEGA_FILTER: 'tag', // tag | category | all
  HEO_LOGO_MEGA_TAG: 'LogoMega', // 与 Notion 标签/分类名一致
  HEO_LOGO_MEGA_FOOTER_TEXT: '更多我的项目',
  HEO_LOGO_MEGA_FOOTER_URL: '/about',
  HEO_LOGO_MEGA_FOOTER_ICON: '', // 留空用站点头像
  // false：左上角用 Heo 四瓣图标（默认）；true：改回站点风车/自定义图标
  HEO_LOGO_USE_SITE_ICON: false,
  // 左上角显示的站名；留空则用 Notion Config 的 TITLE
  HEO_LOGO_TITLE: '',
  // 悬停时「回主页」按钮提示
  HEO_LOGO_HOME_TOOLTIP: '返回博客主页',
  // Notion 尚未配置时的本地回退示例（有 Notion 数据后自动忽略）
  HEO_LOGO_MEGA_GROUPS: [
    {
      title: '博客',
      items: [
        { title: '主页', href: '/', icon: 'fas fa-house' },
        { title: '博客', href: '/', icon: 'fas fa-book' },
        { title: '归档', href: '/archives', icon: 'fas fa-box-archive' }
      ]
    },
    {
      title: '服务',
      items: [
        { title: '关于', href: '/about', icon: 'fas fa-user' },
        { title: '标签', href: '/tag', icon: 'fas fa-tags' },
        { title: '统计', href: '/stats', icon: 'fas fa-chart-simple' }
      ]
    }
  ],

  // 首页顶部通知条；高相似度首页建议先留空 []，需要再自行加内容
  HEO_NOTICE_BAR: [],

  // 分类条：仅显示 Notion 分类，勿写死标签
  // 想要「热门 / 必看」：先在 Notion 文章上打同名标签，再填到 HEO_CATEGORY_BAR_TAGS
  HEO_CATEGORY_BAR_SHOW_HOME: true, // 是否显示「精选」回首页
  HEO_CATEGORY_BAR_HOME_LABEL: '精选',
  HEO_CATEGORY_BAR_PINNED: [], // 默认空；勿写死
  HEO_CATEGORY_BAR_TAGS: [], // 例：['热门','必看'] —— 仅当 Notion 存在该标签时显示

  // 左下角音乐条（不依赖全局 MUSIC_PLAYER，heo 主题默认开启）
  HEO_MUSIC_PLAYER_ENABLE: true,
  HEO_MUSIC_PLAYER_AUTOPLAY: false,
  // 网易云歌单（全部以列表展示；也可在 Notion Config 覆盖）
  HEO_MUSIC_PLAYER_METING_SERVER: 'netease',
  HEO_MUSIC_PLAYER_METING_ID: '779869321',
  // 备用本地列表（API 失败时用）；真实可播链接优先走 Meting
  HEO_MUSIC_PLAYER_AUDIO_LIST: [],

  // 订阅页 /rss
  HEO_RSS_WECHAT_TITLE: '公众号订阅',
  HEO_RSS_WECHAT_DESC: '推送精选文章 · 推送全文',
  HEO_RSS_WECHAT_URL: '', // 留空回退 HEO_HERO_SUBSCRIBE_URL / HEO_SOCIAL_CARD_URL
  HEO_RSS_WECHAT_QR: '', // 公众号二维码图片 URL（可选）
  HEO_RSS_WECHAT_NAME: '', // 留空用 AUTHOR
  HEO_RSS_FEED_TITLE: 'RSS',
  HEO_RSS_FEED_DESC: '推送全部文章 · 推送简介',
  HEO_RSS_FEED_URL: '/rss/feed.xml',
  HEO_RSS_EXTRA_TITLE: '关于本站',
  HEO_RSS_EXTRA_DESC: '了解站点 · 联系作者',
  HEO_RSS_EXTRA_URL: '/about',
  HEO_RSS_INTRO_TITLE: '本站主要分享',
  HEO_RSS_INTRO_DESC:
    '首先感谢你对本站的文章产生一些兴趣。如果你对以上内容感兴趣，欢迎通过下方的订阅方式关注本站。',
  HEO_RSS_INTRO_KEYWORDS: ['设计分享', '资源分享', '实用技巧'],

  // 英雄区左右侧组件颠倒位置
  HEO_HERO_REVERSE: false,
  // 博客主体区左右侧组件颠倒位置
  HEO_HERO_BODY_REVERSE: false,

  // 英雄区轮播（Notion 文章封面 + 标题）
  HEO_HERO_BANNER_TAG: '全站推荐', // 轮播底部角标文案
  HEO_HERO_BANNER_MAX: 6, // 最多轮播几篇
  HEO_HERO_BANNER_AUTOPLAY: true, // 自动轮播
  HEO_HERO_BANNER_INTERVAL: 5000, // 轮播间隔 ms

  // 英雄区右侧订阅/社群按钮（截图中的绿色条）
  HEO_HERO_SUBSCRIBE_ENABLE: true,
  HEO_HERO_SUBSCRIBE_TITLE: '公众号订阅',
  HEO_HERO_SUBSCRIBE_URL: '/rss', // 订阅落地页；也可填公众号外链
  HEO_HERO_SUBSCRIBE_ICON: 'fab fa-weixin',
  // 对齐 zhheo 微信绿渐变（勿改成灰绿）
  HEO_HERO_SUBSCRIBE_COLOR: 'linear-gradient(135deg, #a2d662 0%, #56ab2f 100%)',

  // 兼容旧配置（旧版 Banner 文案，新英雄区不再主用）
  HEO_HERO_TITLE_1: '分享编程',
  HEO_HERO_TITLE_2: '与思维认知',
  HEO_HERO_TITLE_3: 'TANGLY1024.COM',
  HEO_HERO_TITLE_4: '新版上线',
  HEO_HERO_TITLE_5: 'NotionNext4.0 轻松定制主题',
  HEO_HERO_TITLE_LINK: 'https://tangly1024.com',
  HEO_HERO_COVER_TITLE: '随便逛逛',
  HEO_HERO_CATEGORY_1: { title: '必看精选', url: '/tag/必看精选' },
  HEO_HERO_CATEGORY_2: { title: '热门文章', url: '/tag/热门文章' },
  HEO_HERO_CATEGORY_3: { title: '实用教程', url: '/tag/实用教程' },

  // 轮播数据源：文章需带此 Notion 标签；留空 '' 则用最新文章
  HEO_HERO_RECOMMEND_POST_TAG: '推荐',
  HEO_HERO_RECOMMEND_POST_SORT_BY_UPDATE_TIME: false,
  HEO_HERO_RECOMMEND_COVER_ENABLE: true,

  // 右侧个人资料卡牌欢迎语（Notion 配置中心可覆盖，JSON 数组）
  // 配置名：HEO_INFOCARD_GREETINGS
  HEO_INFOCARD_GREETINGS: [
    '出门走走，休息一下吧',
    '你好！我是',
    '分享设计与科技生活',
    '专修交互与设计',
    '脚踏实地行动派',
    '数码科技爱好者'
  ],
  // 资料卡悬停介绍（Notion：HEO_INFO_CARD_INTRO；改 BIO 只影响底部小字）
  // 想改悬停大段文字，请改 HEO_INFO_CARD_INTRO，支持 **加粗** 与换行
  HEO_INFO_CARD_INTRO:
    '这有关于**产品**、**设计**、**开发**相关的问题和看法，还有**文章翻译**和**分享**。\n相信你可以在这里找到对你有用的**知识**和**教程**。',

  // 文章页按封面取色（对齐 Heo）；图床若不支持 CORS 可填七牛 ?imageAve 等
  HEO_POST_COVER_COLOR: true,
  HEO_POST_COVER_COLOR_API: '', // 例：'?imageAve'（七牛）

  // 个人资料底部按钮
  HEO_INFO_CARD_URL1: '',
  HEO_INFO_CARD_ICON1: 'fas fa-user',
  HEO_INFO_CARD_URL2: '',
  HEO_INFO_CARD_ICON2: 'fab fa-github',
  HEO_INFO_CARD_ICON_ORCID: 'fab fa-orcid',
  HEO_INFO_CARD_URL3: '',
  HEO_INFO_CARD_TEXT3: '了解更多',

  // 用户技能图标底纹（前端框架等）默认关闭
  HEO_GROUP_ICONS_ENABLE: false,
  HEO_GROUP_ICONS: [],

  // 侧栏订阅：首页英雄区已有时自动隐藏，避免重复；非首页可显示
  HEO_SOCIAL_CARD: true,
  HEO_SOCIAL_CARD_TITLE_1: '公众号订阅',
  HEO_SOCIAL_CARD_TITLE_2: '加入我们的社群讨论分享',
  HEO_SOCIAL_CARD_TITLE_3: '点击加入社群',
  HEO_SOCIAL_CARD_URL: '/rss',

  // 侧栏「今日热门」：优先「热门」标签，不足用最新文章补齐
  HEO_WIDGET_HOT_POSTS: true,
  HEO_HOT_POSTS_TAG: '热门',
  HEO_HOT_POSTS_COUNT: 6,
  HEO_HOT_POSTS_MORE_URL: '/tag/热门',
  // 侧栏「最新评论」（Waline）
  HEO_WIDGET_RECENT_COMMENTS: true,
  HEO_RECENT_COMMENTS_COUNT: 5,

  // 右下角欢迎挂件（省市欢迎语 + 滑到底隐藏）
  HEO_MASCOT_ENABLE: true,
  // 欢迎挂件：默认内联透明 SVG；自定义图填透明 PNG/SVG 地址
  HEO_MASCOT_ENABLE: true,
  HEO_MASCOT_IMG: '', // 留空用矢量小狗；勿填带白底的 jpg/png
  HEO_MASCOT_SIZE: 96,
  HEO_MASCOT_SIZE: 88,
  HEO_MASCOT_TIP_MS: 5200,
  HEO_MASCOT_BOTTOM: '5.5rem',
  HEO_MASCOT_RIGHT: '1.25rem',
  // 搜索页封面栅格
  HEO_SEARCH_RANDOM_COUNT: 6,
  HEO_SEARCH_HOT_COUNT: 6,
  HEO_SEARCH_RANDOM_MORE_URL: '/',
  HEO_SIDE_TAG_LIMIT: 24,
  HEO_STATS_MORE_URL: '/stats',
  HEO_ANALYTICS_SHOW_HEADER: true,

  // 底部统计面板文案
  HEO_POST_COUNT_TITLE: '文章总数',
  HEO_SITE_TIME_TITLE: '建站天数',
  HEO_SITE_WORD_TITLE: '全站字数',
  HEO_SITE_COMMENT_TITLE: '评论总数',
  HEO_SITE_VISIT_TITLE: '访问量',
  HEO_SITE_VISITOR_TITLE: '访客数',
  // 可选：手动覆盖字数/评论；留空则自动估算字数，评论显示不统计(—)
  HEO_SITE_WORD_COUNT: '',
  HEO_SITE_COMMENT_COUNT: '',

  // *****  以下配置无效，只是预留开发 ****
  // 菜单配置
  HEO_MENU_INDEX: true, // 显示首页
  HEO_MENU_CATEGORY: true, // 显示分类
  HEO_MENU_TAG: true, // 显示标签
  HEO_MENU_ARCHIVE: true, // 显示归档
  HEO_MENU_SEARCH: true, // 显示搜索

  HEO_POST_LIST_COVER: true, // 列表显示文章封面
  HEO_POST_LIST_COVER_HOVER_ENLARGE: false, // 列表鼠标悬停放大

  HEO_POST_LIST_COVER_DEFAULT: true, // 封面为空时用站点背景做默认封面
  HEO_POST_LIST_SUMMARY: true, // 文章摘要
  HEO_POST_LIST_PREVIEW: false, // 读取文章预览
  HEO_POST_LIST_IMG_CROSSOVER: true, // 博客列表图片左右交错

  HEO_ARTICLE_ADJACENT: true, // 显示上一篇下一篇文章推荐
  HEO_ARTICLE_COPYRIGHT: true, // 文章版权声明
  // 留空则用语言包默认：「本文采用 CC BY-NC-SA 4.0 许可协议，转载请注明出处。」
  HEO_ARTICLE_COPYRIGHT_NOTICE: '',
  HEO_ARTICLE_NOT_BY_AI: false, // 显示非AI写作
  HEO_ARTICLE_RECOMMEND: true, // 文章关联推荐

  HEO_INFO_CARD_EMOJI: '🐶', // 资料卡头像角标（狗头）；也可填图片 URL

  // 页脚统计条：总浏览量 + 最近访客省市（不含在线人数）
  HEO_FOOTER_STATS_ENABLE: true,

  // 页脚（原先定制：访问须知 + 二维码）
  HEO_FOOTER_NOTICE_TITLE: '访问须知',
  HEO_FOOTER_NOTICE_TEXT:
    '本站为非经营性个人博客，资源全部来自互联网收集，仅供用于学习和交流，请勿用于商业用途，本站自愿捐赠、打赏，仅为维持服务器的开支与维护所用。如有侵权不妥之处，请联系博主删除！',
  // 中间三颗胶囊默认关闭；图仍给底栏「打赏/资源/订阅」悬停用
  HEO_FOOTER_SHOW_QR_CHIPS: false,
  HEO_FOOTER_QR_LIST: [
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
  ],
  // 底栏快捷入口；打赏 / 资源 / 订阅悬停出二维码；主题跳转 NotionNext
  HEO_FOOTER_QUICK_LINKS: [
    { title: '留言', href: '/about' },
    { title: '订阅', href: '/rss', qrFrom: '官方微信' },
    { title: '打赏', href: '#', qrFrom: '局长请喝咖啡' },
    {
      title: '主题',
      href: 'https://github.com/notionnext-org/NotionNext'
    },
    { title: '资源', href: '#', qrFrom: '资源' },
    { title: '地图', href: '/sitemap.xml' }
  ],
  // 页脚多列链接；默认空（去掉「服务」）；Notion 可再配
  HEO_FOOTER_LINK_GROUPS: [],

  HEO_WIDGET_LATEST_POSTS: false, // 最新文章卡（默认关，避免与今日热门重复）
  HEO_HOME_SHOW_INFO_CARD: false, // 首页是否强制显示资料卡；有 Notion 公告页时仍会显示
  HEO_WIDGET_ANALYTICS: true, // 显示统计卡
  HEO_WIDGET_TO_TOP: true,
  HEO_WIDGET_TO_COMMENT: true, // 跳到评论区
  HEO_WIDGET_DARK_MODE: true, // 夜间模式
  HEO_WIDGET_TOC: true // 移动端悬浮目录
}
export default CONFIG
