import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { getGlobalData, getPostBlocks } from '@/lib/db/getSiteData'
import { generateRobotsTxt } from '@/lib/robots.txt'
import { generateRss } from '@/lib/rss'
import { generateSitemapXml } from '@/lib/sitemap.xml'
import { DynamicLayout } from '@/themes/theme'
import { generateRedirectJson } from '@/lib/redirect'
import { useEffect, useState } from 'react'

export default function Home() {
  const [weather, setWeather] = useState('天气信息加载中...')

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://www.zddown.icu/wp-content/themes/zibll/inc/weather-api.php?type=json')
        const data = await res.json()
        
        if (data.code === 200) {
          const { province, city, ip } = data.data
          const temp = parseInt(data.data.weather.temp)
          const weatherText = `你好，来自${province}${city}【IP:${ip}】的朋友，今天温度 ${temp}℃，${getComfortMessage(temp)}`
          setWeather(weatherText)
        } else {
          setWeather('欢迎访问！天气服务暂时不可用')
        }
      } catch (error) {
        setWeather('天气信息获取失败')
      }
    }

    const getComfortMessage = (temp) => {
      if (temp < 20) return '注意保暖哦~'
      if (temp <= 25) return '舒适宜人，适合外出！'
      return '天气炎热，注意防晒！'
    }

    fetchWeather()
  }, [])

  return (
    <>
      {/* 前面添加的天气组件 */}
      <div className="weather-banner">
        {/* ... */}
        <span id="weatherInfo">{weather}</span>
      </div>
      {/* 原有页面内容 */}
    </>
  )
}
// 在 return() 的 JSX 结构中添加
<div className="weather-banner">
  <div className="container mx-auto px-4 py-2">
    <div className="text-center md:text-left flex items-center justify-center">
      <i className="fas fa-bullhorn mr-2 text-red-500"></i>
      <span id="weatherInfo" className="text-sm"></span>
    </div>
  </div>
</div>

{/* 添加样式 */}
<style jsx>{`
  .weather-banner {
    background: rgba(255, 250, 240, 0.9); /* 浅黄色背景 */
    border-bottom: 1px solid #eee;
  }
  @media (max-width: 768px) {
    .weather-banner { padding: 8px 0; }
  }
`}</style>




/**
 * 首页布局
 * @param {*} props
 * @returns
 */
const Index = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutIndex' {...props} />
}

/**
 * SSG 获取数据
 * @returns
 */
export async function getStaticProps(req) {
  const { locale } = req
  const from = 'index'
  const props = await getGlobalData({ from, locale })
  const POST_PREVIEW_LINES = siteConfig(
    'POST_PREVIEW_LINES',
    12,
    props?.NOTION_CONFIG
  )
  props.posts = props.allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )

  // 处理分页
  if (siteConfig('POST_LIST_STYLE') === 'scroll') {
    // 滚动列表默认给前端返回所有数据
  } else if (siteConfig('POST_LIST_STYLE') === 'page') {
    props.posts = props.posts?.slice(
      0,
      siteConfig('POSTS_PER_PAGE', 12, props?.NOTION_CONFIG)
    )
  }

  // 预览文章内容
  if (siteConfig('POST_LIST_PREVIEW', false, props?.NOTION_CONFIG)) {
    for (const i in props.posts) {
      const post = props.posts[i]
      if (post.password && post.password !== '') {
        continue
      }
      post.blockMap = await getPostBlocks(post.id, 'slug', POST_PREVIEW_LINES)
    }
  }

  // 生成robotTxt
  generateRobotsTxt(props)
  // 生成Feed订阅
  generateRss(props)
  // 生成
  generateSitemapXml(props)
  if (siteConfig('UUID_REDIRECT', false, props?.NOTION_CONFIG)) {
    // 生成重定向 JSON
    generateRedirectJson(props)
  }

  // 生成全文索引 - 仅在 yarn build 时执行 && process.env.npm_lifecycle_event === 'build'

  delete props.allPages

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default Index
