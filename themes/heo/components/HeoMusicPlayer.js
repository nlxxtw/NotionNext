import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * Heo 风格左下角玻璃胶囊音乐条
 * 数据源沿用全局 MUSIC_PLAYER_* 配置
 */
export default function HeoMusicPlayer() {
  const enabled = parseBool(siteConfig('MUSIC_PLAYER'))
  const visible = parseBool(siteConfig('MUSIC_PLAYER_VISIBLE', true))
  const autoPlay = parseBool(siteConfig('MUSIC_PLAYER_AUTO_PLAY', false))
  const order = siteConfig('MUSIC_PLAYER_ORDER', 'list')
  const playlist = useMemo(() => {
    const list = siteConfig('MUSIC_PLAYER_AUDIO_LIST') || []
    return Array.isArray(list) ? list.filter(item => item?.url) : []
  }, [])

  const audioRef = useRef(null)
  const playingRef = useRef(false)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)

  const track = playlist[index]

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
    setIndex(prevIndex =>
      playlist.length ? (prevIndex - 1 + playlist.length) % playlist.length : 0
    )
  }

  const next = () => {
    setIndex(prevIndex => {
      if (!playlist.length) return 0
      if (order === 'random') {
        return Math.floor(Math.random() * playlist.length)
      }
      return (prevIndex + 1) % playlist.length
    })
  }

  return (
    <div
      id='heo-nav-music'
      className='heo-nav-music fixed bottom-5 left-5 z-[90] hidden max-w-[min(420px,calc(100vw-2.5rem))] md:flex'>
      <div className='heo-nav-music-inner flex h-12 items-center gap-3 rounded-full px-3 pr-4 text-white shadow-lg'>
        <div className='relative h-9 w-9 shrink-0'>
          <div className='absolute -inset-1 rounded-full bg-white/25 blur-[2px]' />
          <LazyImage
            src={track.cover || siteConfig('HOME_BANNER_IMAGE')}
            alt={track.name || 'cover'}
            className='relative h-9 w-9 rounded-full object-cover ring-1 ring-white/40'
          />
        </div>

        <div className='min-w-0 flex-1'>
          <div className='truncate text-[13px] font-medium leading-tight'>
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
            className='flex h-7 w-7 items-center justify-center transition hover:scale-110 active:scale-95'>
            <i className='fas fa-step-backward text-xs' />
          </button>
          <button
            type='button'
            aria-label={playing ? '暂停' : '播放'}
            onClick={playPause}
            className='flex h-7 w-7 items-center justify-center transition hover:scale-110 active:scale-95'>
            <i className={`fas ${playing ? 'fa-pause' : 'fa-play'} text-sm`} />
          </button>
          <button
            type='button'
            aria-label='下一首'
            onClick={next}
            className='flex h-7 w-7 items-center justify-center transition hover:scale-110 active:scale-95'>
            <i className='fas fa-step-forward text-xs' />
          </button>
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
