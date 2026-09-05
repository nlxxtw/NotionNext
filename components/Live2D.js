/* eslint-disable no-undef */
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isMobile, loadExternalResource } from '@/lib/utils'
import { useEffect } from 'react'

/**
 * 网页动画（宠物挂件）
 * 点击切换主题需同时满足：THEME_SWITCH 与 WIDGET_PET_SWITCH_THEME
 */
export default function Live2D() {
  const { theme, switchTheme } = useGlobal()
  const showPet = parseBool(siteConfig('WIDGET_PET'), true)
  const petLink = siteConfig('WIDGET_PET_LINK')
  // 全局关主题切换时，宠物也不再切主题（避免只关 THEME_SWITCH 仍被宠物切换）
  const themeSwitchEnabled = parseBool(siteConfig('THEME_SWITCH'), false)
  const petSwitchTheme =
    themeSwitchEnabled &&
    parseBool(siteConfig('WIDGET_PET_SWITCH_THEME'), false)

  useEffect(() => {
    if (showPet && !isMobile()) {
      Promise.all([
        loadExternalResource(
          'https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d.min.js',
          'js'
        )
      ]).then(() => {
        if (typeof window?.loadlive2d !== 'undefined') {
          try {
            loadlive2d('live2d', petLink)
          } catch (error) {
            console.error('读取PET模型', error)
          }
        }
      })
    }
  }, [theme, showPet, petLink])

  function handleClick() {
    if (petSwitchTheme) {
      switchTheme()
    }
  }

  if (!showPet) {
    return <></>
  }

  return (
    <canvas
      id='live2d'
      width='280'
      height='250'
      onClick={handleClick}
      className={petSwitchTheme ? 'cursor-grab' : 'cursor-default'}
      onMouseDown={e => {
        if (petSwitchTheme) e.target.classList.add('cursor-grabbing')
      }}
      onMouseUp={e => e.target.classList.remove('cursor-grabbing')}
    />
  )
}

function parseBool(value, fallback = false) {
  if (typeof value === 'boolean') return value
  if (value == null || value === '') return fallback
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase()
    if (['true', '1', 'yes', 'on'].includes(v)) return true
    if (['false', '0', 'no', 'off'].includes(v)) return false
    try {
      return Boolean(JSON.parse(value))
    } catch {
      return fallback
    }
  }
  return Boolean(value)
}
