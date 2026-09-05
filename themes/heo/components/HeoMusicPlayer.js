import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useEffect, useMemo, useRef, useState } from 'react'
import CONFIG from '../config'

const METING_APIS = [
  'https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r',
  'https://meting.qjqq.cn/?server=:server&type=:type&id=:id&r=:r',
  'https://api.obfs.dev/api/meting?server=:server&type=:type&id=:id'
]

/**
 * Heo 左下角音乐条 + 播放列表（网易云歌单）
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
  const playlistId = String(
    siteConfig(
      'HEO_MUSIC_PLAYER_METING_ID',
      siteConfig('MUSIC_PLAYER_METING_ID', '779869321', CONFIG),
      CONFIG
    ) || '779869321'
  )
  const server = siteConfig(
    'HEO_MUSIC_PLAYER_METING_SERVER',
    siteConfig('MUSIC_PLAYER_METING_SERVER', 'netease'),
    CONFIG
  )
  const metingApi =
    siteConfig('MUSIC_PLAYER_METING_API', '', CONFIG) ||
    siteConfig('HEO_MUSIC_PLAYER_METING_API', '', CONFIG)
  const fallbackList = useMemo(() => {
    const heoList = siteConfig('HEO_MUSIC_PLAYER_AUDIO_LIST', [], CONFIG)
    const globalList = siteConfig('MUSIC_PLAYER_AUDIO_LIST') || []
    const list =
      Array.isArray(heoList) && heoList.length ? heoList : globalList
    return normalizeTracks(Array.isArray(list) ? list : [])
  }, [])

  const audioRef = useRef(null)
  const playingRef = useRef(false)
  const [playlist, setPlaylist] = useState(fallbackList)
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [hover, setHover] = useState(false)
  const [listOpen, setListOpen] = useState(false)
  const [lrcText, setLrcText] = useState('')
  const track = playlist[index]
  const expanded = playing || hover || listOpen

  useEffect(() => {
    if (!enabled) return undefined
    let cancelled = false

    async function loadPlaylist() {
      setLoading(true)
      const remote = await fetchMetingPlaylist({
        server,
        id: playlistId,
        apiTemplate: metingApi
      })
      if (cancelled) return
      if (remote.length) {
        setPlaylist(remote)
        setIndex(0)
      } else if (fallbackList.length) {
        setPlaylist(fallbackList)
      }
      setLoading(false)
    }

    loadPlaylist()
    return () => {
      cancelled = true
    }
  }, [enabled, server, playlistId, metingApi, fallbackList])

  useEffect(() => {
    if (!enabled || !playlist.length || typeof Audio === 'undefined') {
      return undefined
    }
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.crossOrigin = 'anonymous'
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
    const onError = () => {
      // 单曲失效时自动下一首，避免整条挂死
      setTimeout(() => {
        setIndex(prev => (prev + 1) % Math.max(playlist.length, 1))
      }, 400)
    }

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
    return () => {
      audio.pause()
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audioRef.current = null
    }
  }, [enabled, playlist.length, order])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !track?.url) {
      setLrcText('♪ 暂无')
      return
    }
    const shouldContinue = playingRef.current
    audio.src = track.url
    audio.load()
    setLrcText(track.lrc ? '♪ 歌词已载入' : '♪ 暂无')
    if (shouldContinue || autoPlay) {
      audio.play().catch(() => {
        playingRef.current = false
        setPlaying(false)
      })
    }
  }, [index, track?.url, autoPlay, track?.lrc])

  if (!enabled || !visible) return null
  if (!loading && (!playlist.length || !track)) return null

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

  const pick = i => {
    setIndex(i)
    setListOpen(true)
    const audio = audioRef.current
    // 等 src 切换后由 effect 播放；这里标记需要播放
    playingRef.current = true
    if (audio && playlist[i]?.url === track?.url) {
      audio.play().catch(() => {})
    }
  }

  return (
    <div
      id='heo-nav-music'
      className={`heo-nav-music fixed bottom-5 left-5 z-[90] ${
        expanded
          ? 'max-w-[min(420px,calc(100vw-2.5rem))]'
          : 'max-w-[3.25rem]'
      }`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        if (!listOpen) setHover(false)
      }}>
      {listOpen && (
        <div className='heo-music-playlist mb-2 max-h-[280px] w-[min(360px,calc(100vw-2.5rem))] overflow-hidden rounded-2xl text-white shadow-xl'>
          <div className='flex items-center justify-between px-3.5 py-2.5 text-[13px] font-semibold'>
            <span>
              播放列表 ({loading ? '…' : playlist.length})
            </span>
            <button
              type='button'
              aria-label='关闭列表'
              className='opacity-80 hover:opacity-100'
              onClick={() => setListOpen(false)}>
              ×
            </button>
          </div>
          <div className='max-h-[230px] overflow-y-auto px-1.5 pb-2'>
            {playlist.map((item, i) => (
              <button
                key={`${item.name}-${i}`}
                type='button'
                onClick={() => pick(i)}
                className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-[13px] transition hover:bg-white/10 ${
                  i === index ? 'bg-white/15' : ''
                }`}>
                <span className='w-5 shrink-0 text-center text-[11px] opacity-70'>
                  {i + 1}
                </span>
                <span className='min-w-0 flex-1 truncate font-medium'>
                  {item.name}
                </span>
                <span className='max-w-[38%] shrink-0 truncate text-[11px] opacity-70'>
                  {item.artist}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className={`heo-nav-music-inner flex h-12 items-center overflow-hidden text-white shadow-lg transition-all duration-300 ${
          expanded
            ? 'gap-2.5 rounded-full px-3 pr-3.5'
            : 'w-12 justify-center rounded-full px-0'
        }`}>
        <button
          type='button'
          aria-label={playing ? '暂停' : '展开并播放'}
          onClick={playPause}
          className='relative h-9 w-9 shrink-0'>
          <div className='absolute -inset-1 rounded-full bg-white/25 blur-[2px]' />
          <LazyImage
            src={
              track?.cover ||
              siteConfig('HOME_BANNER_IMAGE') ||
              '/bg_image.jpg'
            }
            alt={track?.name || 'cover'}
            className={`relative h-9 w-9 rounded-full object-cover ring-1 ring-white/40 ${
              playing ? 'animate-[spin_12s_linear_infinite]' : ''
            }`}
          />
        </button>

        <div
          className={`flex min-w-0 flex-1 items-center gap-2.5 transition-all duration-300 ${
            expanded
              ? 'max-w-[360px] opacity-100'
              : 'max-w-0 overflow-hidden opacity-0'
          }`}>
          <div className='min-w-0 flex-1'>
            <div className='truncate text-[13px] font-medium leading-tight'>
              {loading ? '加载歌单…' : track?.name || '未知曲目'}
            </div>
            <div className='truncate text-[11px] opacity-80'>
              {lrcText || '♪ 暂无'}
            </div>
          </div>
          <div className='flex shrink-0 items-center gap-2.5 text-white/95'>
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
            <button
              type='button'
              aria-label='播放列表'
              onClick={() => setListOpen(v => !v)}
              className={`flex h-7 w-7 items-center justify-center transition hover:scale-110 ${
                listOpen ? 'text-yellow-200' : ''
              }`}>
              <i className='fas fa-bars text-xs' />
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

function normalizeTracks(list) {
  return (list || [])
    .map(item => ({
      name: item?.name || item?.title || '未知曲目',
      artist: item?.artist || item?.author || '',
      url: item?.url,
      cover: item?.cover || item?.pic || '',
      lrc: item?.lrc || ''
    }))
    .filter(item => item.url && !String(item.url).includes('/outchain/player'))
}

async function fetchMetingPlaylist({ server, id, apiTemplate }) {
  const templates = apiTemplate
    ? [apiTemplate, ...METING_APIS]
    : METING_APIS
  const rand = Date.now()

  for (const tpl of templates) {
    const url = String(tpl)
      .replace(':server', encodeURIComponent(server || 'netease'))
      .replace(':type', 'playlist')
      .replace(':id', encodeURIComponent(id))
      .replace(':r', String(rand))
    try {
      const res = await fetch(url)
      if (!res.ok) continue
      const data = await res.json()
      const tracks = normalizeTracks(Array.isArray(data) ? data : [])
      if (tracks.length) return tracks
    } catch {
      // try next api
    }
  }
  return []
}
