import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useEffect, useMemo, useRef, useState } from 'react'
import CONFIG from '../config'

/**
 * Heo 左下角玻璃胶囊音乐条
 * 未播放时折叠为封面圆点；悬停或播放时展开
 */
export default function HeoMusicPlayer() {
  const heoEnable = parseBool(
    siteConfig('HEO_MUSIC_PLAYER_ENABLE', true, CONFIG)
  )
  const globalEnable = parseBool(siteConfig('MUSIC_PLAYER'))
  const enabled = heoEnable || globalEnable
  const visible = parseBool(siteConfig('MUSIC_PLAYER_VISIBLE', true))
  const autoPlay = parseBool(
    siteConfig(
      'HEO_MUSIC_PLAYER_AUTOPLAY',
      siteConfig('MUSIC_PLAYER_AUTO_PLAY', false),
      CONFIG
    )
  )
  const order = siteConfig('MUSIC_PLAYER_ORDER', 'list')

  const playlist = useMemo(() => {
    const heoList = siteConfig('HEO_MUSIC_PLAYER_AUDIO_LIST', [], CONFIG)
    const globalList = siteConfig('MUSIC_PLAYER_AUDIO_LIST') || []
    const list =
      Array.isArray(heoList) && heoList.length ? heoList : globalList
    return (Array.isArray(list) ? list : []).filter(item => item?.url)
  }, [])

  const audioRef = useRef(null)
  const playingRef = useRef(false)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [hover, setHover] = useState(false)
  const track = playlist[index]
  const expanded = playing || hover

  useEffect(() => {
    if (!enabled || !playlist.length || typeof Audio === 'undefined') {
      return undefined
    }
    const audio = new Audio()
    audio.preload = 'metadata'
    audioRef.current = audio

    const onPlay = () => {
      playingRef.current = true
      setPlaying(true)
    }
    const onPause = () => {
      playingRef.current = false
      setPlaying(false)
    }
    const onEnded = () => {
      setIndex(prev => {
        if (order === 'random') {
          return Math.floor(Math.random() * playlist.length)
        }
        return (prev + 1) % playlist.length
      })
    }

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.pause()
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audioRef.current = null
    }
  }, [enabled, playlist.length, order])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track?.url) return
    const shouldContinue = playingRef.current
    audio.src = track.url
    audio.load()
    if (shouldContinue || autoPlay) {
      audio.play().catch(() => {
        playingRef.current = false
        setPlaying(false)
      })
    }
  }, [index, track?.url, autoPlay])

  if (!enabled || !visible || !playlist.length || !track) return null

  const playPause = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().catch(() => setPlaying(false))
    } else {
      audio.pause()
    }
  }

  const prev = () => {
    setIndex(i =>
      playlist.length ? (i - 1 + playlist.length) % playlist.length : 0
    )
  }

  const next = () => {
    setIndex(i => {
      if (!playlist.length) return 0
      if (order === 'random') return Math.floor(Math.random() * playlist.length)
      return (i + 1) % playlist.length
    })
  }

  return (
    <div
      id='heo-nav-music'
      className={`heo-nav-music fixed bottom-5 left-5 z-[90] transition-all duration-300 ${
        expanded
          ? 'max-w-[min(420px,calc(100vw-2.5rem))]'
          : 'max-w-[3.25rem]'
      }`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <div
        className={`heo-nav-music-inner flex h-12 items-center overflow-hidden text-white shadow-lg transition-all duration-300 ${
          expanded
            ? 'gap-3 rounded-full px-3 pr-4'
            : 'w-12 justify-center rounded-full px-0'
        }`}>
        <button
          type='button'
          aria-label={playing ? '暂停' : '展开并播放'}
          onClick={playPause}
          className='relative h-9 w-9 shrink-0'>
          <div className='absolute -inset-1 rounded-full bg-white/25 blur-[2px]' />
          <LazyImage
            src={track.cover || siteConfig('HOME_BANNER_IMAGE')}
            alt={track.name || 'cover'}
            className={`relative h-9 w-9 rounded-full object-cover ring-1 ring-white/40 ${
              playing ? 'animate-[spin_12s_linear_infinite]' : ''
            }`}
          />
        </button>

        <div
          className={`flex min-w-0 flex-1 items-center gap-3 transition-all duration-300 ${
            expanded
              ? 'max-w-[360px] opacity-100'
              : 'max-w-0 overflow-hidden opacity-0'
          }`}>
          <div className='min-w-0 flex-1'>
            <div className='truncate text-[13px] font-medium leading-tight whitespace-nowrap'>
              {track.name || '未知曲目'}
              {track.artist ? (
                <span className='font-normal opacity-90'>
                  {' '}
                  演唱：{track.artist}
                </span>
              ) : null}
            </div>
          </div>
          <div className='flex shrink-0 items-center gap-3 text-white/95'>
            <button
              type='button'
              aria-label='上一首'
              onClick={prev}
              className='flex h-7 w-7 items-center justify-center transition hover:scale-110'>
              <i className='fas fa-step-backward text-xs' />
            </button>
            <button
              type='button'
              aria-label={playing ? '暂停' : '播放'}
              onClick={playPause}
              className='flex h-7 w-7 items-center justify-center transition hover:scale-110'>
              <i
                className={`fas ${playing ? 'fa-pause' : 'fa-play'} text-sm`}
              />
            </button>
            <button
              type='button'
              aria-label='下一首'
              onClick={next}
              className='flex h-7 w-7 items-center justify-center transition hover:scale-110'>
              <i className='fas fa-step-forward text-xs' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function parseBool(value) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true'
  return Boolean(value)
}
