import { useGlobal } from '@/lib/global'
import { Moon, Sun } from '@/components/HeroIcons'
import { useImperativeHandle } from 'react'

/**
 * 夜间模式开关：无绿/蓝线框，柔和轨道 + 白滑块
 */
const DarkModeButton = props => {
  const { cRef, className } = props
  const { isDarkMode, toggleDarkMode } = useGlobal()

  useImperativeHandle(cRef, () => ({
    handleChangeDarkMode: () => toggleDarkMode()
  }))

  return (
    <button
      type='button'
      id='darkModeButton'
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDarkMode}
      onClick={() => toggleDarkMode()}
      className={`${className || ''} heo-dark-toggle relative flex h-8 w-[3.25rem] shrink-0 cursor-pointer items-center rounded-full border-0 p-1 outline-none ring-0 transition-colors duration-300 focus:outline-none focus-visible:outline-none`}>
      <span
        aria-hidden='true'
        className={`heo-dark-toggle-knob absolute flex h-[1.35rem] w-[1.35rem] items-center justify-center rounded-full bg-white transition-transform duration-300 motion-reduce:transition-none ${
          isDarkMode ? 'translate-x-[1.5rem]' : 'translate-x-0'
        }`}>
        {isDarkMode ? <Moon /> : <Sun />}
      </span>
    </button>
  )
}

export default DarkModeButton
