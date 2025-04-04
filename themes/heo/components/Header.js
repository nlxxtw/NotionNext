import { siteConfig } from '@/lib/config'
import { isBrowser } from '@/lib/utils'
import throttle from 'lodash.throttle'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import DarkModeButton from './DarkModeButton'
import Logo from './Logo'
import { MenuListTop } from './MenuListTop'
import RandomPostButton from './RandomPostButton'
import ReadingProgress from './ReadingProgress'
import SearchButton from './SearchButton'
import SlideOver from './SlideOver'

const Header = props => {
  const [weatherInfo, setWeatherInfo] = useState('')
  const [fixedNav, setFixedNav] = useState(false)
  const [textWhite, setTextWhite] = useState(false)
  const [navBgWhite, setBgWhite] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  // 获取天气数据
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          'https://www.zddown.icu/wp-content/themes/zibll/inc/weather-api.php?type=json'
        )
        const data = await response.json()
        
        if (data.code === 200) {
          const { province, city, ip, weather } = data.data
          const temp = parseInt(data.data.weather.temp)
          const dayOfWeek = new Date().toLocaleString('zh-CN', { weekday: 'long' })
          const currentDate = new Date().toLocaleDateString()

          let comfortMessage = ''
          if (temp < 20) {
            comfortMessage = '现在的温度有点凉，建议穿暖和点'
          } else if (temp >= 20 && temp <= 25) {
            comfortMessage = '现在的温度比较舒适~可以适当运动'
          } else {
            comfortMessage = '现在的温度有点热，小心中暑哈'
          }

          const weatherText = `你好，来自${province}${city}【IP:${ip}】的朋友，今天是${currentDate} ${dayOfWeek}，天气${weather}，当前温度${temp}°C，${comfortMessage}`
          setWeatherInfo(weatherText)
        } else {
          setWeatherInfo("你不会是国外友人吧？（You're not going to be a foreign friend, are you?）")
        }
      } catch (error) {
        console.error('获取天气信息时发生错误：', error)
        setWeatherInfo("获取天气信息时发生错误")
      }
    }

    fetchWeatherData()
  }, [])

  // 其他原有代码保持不动...
  const router = useRouter()
  const slideOverRef = useRef()

  // ... 其他原有状态和方法

  return (
    <>
      <style jsx>{`
        /* 原有动画样式保持不动 */
      `}</style>

      {/* 新增天气提示栏 */}
      <div className="container fluid-widget bg-gray-50 dark:bg-gray-800 py-2">
        <div className="zib-widget widget_block">
          <div className="text-center md:text-center max-md:text-left px-4">
            <span className="text-red-500 dark:text-red-400 text-sm">
              <i className="fa fa-bullhorn mr-2" />
              <span>{weatherInfo}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 原有导航栏结构保持不动 */}
      {fixedNav && !document?.querySelector('#post-bg') && (
        <div className='h-16'></div>
      )}

      <nav
        id='nav'
        className={`z-20 h-16 top-0 w-full duration-300 transition-all
            ${fixedNav ? 'fixed' : 'relative bg-transparent'} 
            ${textWhite ? 'text-white ' : 'text-black dark:text-white'}  
            ${navBgWhite ? 'bg-white dark:bg-[#18171d] shadow' : 'bg-transparent'}`}>
        {/* 原有导航内容保持不动 */}
      </nav>
    </>
  )
}

export default Header
