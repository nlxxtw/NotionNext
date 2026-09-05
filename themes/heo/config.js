const CONFIG = {
  HEO_HOME_POST_TWO_COLS: true, // 首页博客两列显示，若为false则只显示一列
  HEO_LOADING_COVER: true, // 页面加载的遮罩动画

  HEO_HOME_BANNER_ENABLE: true,

  HEO_INFO_CARD_AVATAR_BLUR: true, // 文章详情页个人资料卡头像样式。true：显示为模糊装饰头像；false：与首页头像保持一致

  // 主色对齐 blog.zhheo.com（白天蓝紫 / 夜晚金黄）
  HEO_COLOR_PRIMARY: '#425AEF',
  HEO_COLOR_PRIMARY_HOVER: '#425AEF',
  HEO_COLOR_PRIMARY_TEXT: '#ffffff',
  HEO_COLOR_ACCENT: '#ffc848',
  HEO_COLOR_BG: '#f7f9fe',
  HEO_COLOR_BG_DARK: '#18171d',
  HEO_COLOR_CARD: '#ffffff',
  HEO_COLOR_CARD_DARK: '#1e1e1e',
  HEO_COLOR_CARD_MUTED: '#f1f3f8',
  HEO_COLOR_BORDER: '#425AEF',
  HEO_COLOR_BORDER_DARK: '#ffc848',
  HEO_COLOR_TEXT: '#111827',
  HEO_COLOR_TEXT_SECONDARY: '#4b5563',

  HEO_SITE_CREATE_TIME: '2021-09-21', // 建站日期，用于计算网站运行的第几天

  // 顶栏「新更新」徽章；留空 '' 则不显示
  HEO_NAV_UPDATE_BADGE: '新更新',
  HEO_NAV_UPDATE_BADGE_URL: '/',

  // Logo 项目大菜单（截图：博客/应用/服务/表情）
  // Notion 写法：创建 type=Menu 的分组页，并打上标签 LogoMega；
  // 其下按顺序创建 type=SubMenu 的子项，页面图标即菜单图标（可传图）
  HEO_LOGO_MEGA_ENABLE: true,
  HEO_LOGO_MEGA_FILTER: 'tag', // tag | category | all
  HEO_LOGO_MEGA_TAG: 'LogoMega', // 与 Notion 标签/分类名一致
  HEO_LOGO_MEGA_FOOTER_TEXT: '更多我的项目',
  HEO_LOGO_MEGA_FOOTER_URL: '/about',
  HEO_LOGO_MEGA_FOOTER_ICON: '', // 留空用站点头像
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
  // 可改成你的歌单；也可用全局 MUSIC_PLAYER_AUDIO_LIST 覆盖空列表
  HEO_MUSIC_PLAYER_AUDIO_LIST: [
    {
      name: '风を共に舞う気持ち',
      artist: 'Falcom Sound Team jdk',
      url: 'https://music.163.com/song/media/outer/url?id=731419.mp3',
      cover:
        'https://p2.music.126.net/kn6ugISTonvqJh3LHLaPtQ==/599233837187278.jpg'
    },
    {
      name: '王都グランセル',
      artist: 'Falcom Sound Team jdk',
      url: 'https://music.163.com/song/media/outer/url?id=731355.mp3',
      cover:
        'https://p1.music.126.net/kn6ugISTonvqJh3LHLaPtQ==/599233837187278.jpg'
    }
  ],

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
  HEO_HERO_SUBSCRIBE_COLOR: '#57bd6a',

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
  HEO_HERO_RECOMMEND_COVER_ENABLE: false,

  // 右侧个人资料卡牌欢迎语，点击可自动切换
  HEO_INFOCARD_GREETINGS: [
    '出门走走，休息一下吧',
    '你好！我是',
    '分享设计与科技生活',
    '专修交互与设计',
    '脚踏实地行动派',
    '数码科技爱好者'
  ],

  // 个人资料底部按钮
  HEO_INFO_CARD_URL1: '/about',
  HEO_INFO_CARD_ICON1: 'fas fa-user',
  HEO_INFO_CARD_URL2: 'https://github.com/tangly1024',
  HEO_INFO_CARD_ICON2: 'fab fa-github',
  HEO_INFO_CARD_ICON_ORCID: 'fab fa-orcid',
  HEO_INFO_CARD_URL3: 'https://www.tangly1024.com',
  HEO_INFO_CARD_TEXT3: '了解更多',

  // 用户技能图标
  HEO_GROUP_ICONS: [
    {
      title_1: 'AfterEffect',
      img_1: '/images/heo/20239df3f66615b532ce571eac6d14ff21cf072602.webp',
      color_1: '#989bf8',
      title_2: 'Sketch',
      img_2: '/images/heo/2023e0ded7b724a39f12d59c3dc8fbdc7cbe074202.webp',
      color_2: '#ffffff'
    },
    {
      title_1: 'Docker',
      img_1: '/images/heo/20231108a540b2862d26f8850172e4ea58ed075102.webp',
      color_1: '#57b6e6',
      title_2: 'Photoshop',
      img_2: '/images/heo/2023e4058a91608ea41751c4f102b131f267075902.webp',
      color_2: '#4082c3'
    },
    {
      title_1: 'FinalCutPro',
      img_1: '/images/heo/20233e777652412247dd57fd9b48cf997c01070702.webp',
      color_1: '#ffffff',
      title_2: 'Python',
      img_2: '/images/heo/20235c0731cd4c0c95fc136a8db961fdf963071502.webp',
      color_2: '#ffffff'
    },
    {
      title_1: 'Swift',
      img_1: '/images/heo/202328bbee0b314297917b327df4a704db5c072402.webp',
      color_1: '#eb6840',
      title_2: 'Principle',
      img_2: '/images/heo/2023f76570d2770c8e84801f7e107cd911b5073202.webp',
      color_2: '#8f55ba'
    },
    {
      title_1: 'illustrator',
      img_1: '/images/heo/20237359d71b45ab77829cee5972e36f8c30073902.webp',
      color_1: '#f29e39',
      title_2: 'CSS3',
      img_2: '/images/heo/20237c548846044a20dad68a13c0f0e1502f074602.webp',
      color_2: '#2c51db'
    },
    {
      title_1: 'JS',
      img_1: '/images/heo/2023786e7fc488f453d5fb2be760c96185c0075502.webp',
      color_1: '#f7cb4f',
      title_2: 'HTML',
      img_2: '/images/heo/202372b4d760fd8a497d442140c295655426070302.webp',
      color_2: '#e9572b'
    },
    {
      title_1: 'Git',
      img_1: '/images/heo/2023ffa5707c4e25b6beb3e6a3d286ede4c6071102.webp',
      color_1: '#df5b40',
      title_2: 'Rhino',
      img_2: '/images/heo/20231ca53fa0b09a3ff1df89acd7515e9516173302.webp',
      color_2: '#1f1f1f'
    }
  ],

  HEO_SOCIAL_CARD: true, // 是否显示右侧，点击加入社群按钮
  HEO_SOCIAL_CARD_TITLE_1: '公众号订阅',
  HEO_SOCIAL_CARD_TITLE_2: '加入我们的社群讨论分享',
  HEO_SOCIAL_CARD_TITLE_3: '点击加入社群',
  HEO_SOCIAL_CARD_URL: '/rss',

  // 侧栏「今日热门」：优先取带此标签的 Notion 文章，否则回退最新文章
  HEO_WIDGET_HOT_POSTS: true,
  HEO_HOT_POSTS_TAG: '热门',
  HEO_HOT_POSTS_COUNT: 5,
  HEO_HOT_POSTS_MORE_URL: '/tag/热门',
  HEO_SIDE_TAG_LIMIT: 24,
  HEO_STATS_MORE_URL: '/stats',
  HEO_ANALYTICS_SHOW_HEADER: true,

  // 底部统计面板文案
  HEO_POST_COUNT_TITLE: '文章数',
  HEO_SITE_TIME_TITLE: '建站天数',
  HEO_SITE_VISIT_TITLE: '访问量',
  HEO_SITE_VISITOR_TITLE: '访客数',

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

  HEO_INFO_CARD_EMOJI: '😆', // 资料卡头像角标

  HEO_WIDGET_LATEST_POSTS: false, // 最新文章卡（默认关，避免与今日热门重复）
  HEO_HOME_SHOW_INFO_CARD: false, // 首页是否强制显示资料卡；有 Notion 公告页时仍会显示
  HEO_WIDGET_ANALYTICS: true, // 显示统计卡
  HEO_WIDGET_TO_TOP: true,
  HEO_WIDGET_TO_COMMENT: true, // 跳到评论区
  HEO_WIDGET_DARK_MODE: true, // 夜间模式
  HEO_WIDGET_TOC: true // 移动端悬浮目录
}
export default CONFIG
