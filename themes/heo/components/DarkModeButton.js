import { useGlobal } from '@/lib/global'
import { Moon, Sun } from '@/components/HeroIcons'
import { useImperativeHandle } from 'react'

/**
 * 深色模式按钮（无蓝色描边）
 */
const DarkModeButton = props => {
  const { cRef, className } = props
  const { isDarkMode, toggleDarkMode } = useGlobal()

  useImperativeHandle(cRef, () => {
    return {
      handleChangeDarkMode: () => {
        handleChangeDarkMode()
      }
    }
  })

  const handleChangeDarkMode = () => {
    toggleDarkMode()
  }

  return (
    <button
      type='button'
      id='darkModeButton'
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDarkMode}
      onClick={handleChangeDarkMode}
      className={`${className || ''} relative flex h-8 w-16 shrink-0 cursor-pointer items-center overflow-hidden rounded-full border border-black/[0.06] bg-gray-200/90 p-2 shadow-none outline-none transition-colors duration-300 focus:outline-none focus-visible:outline-none dark:border-white/10 dark:bg-gray-700/90`}>
      <span
        aria-hidden='true'
        className={`absolute flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 motion-reduce:transition-none ${
          isDarkMode ? 'translate-x-6' : 'translate-x-0'
        }`}>
        {isDarkMode ? <Moon /> : <Sun />}
      </span>
    </button>
  )
}

export default DarkModeButton
