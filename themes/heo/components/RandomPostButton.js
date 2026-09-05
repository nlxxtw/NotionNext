import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'

/**
 * 随机跳转到一个文章（安知鱼骰子图标）
 */
export default function RandomPostButton(props) {
  const { latestPosts } = props
  const router = useRouter()
  const { locale } = useGlobal()

  function handleClick() {
    if (!latestPosts?.length) return
    const randomIndex = Math.floor(Math.random() * latestPosts.length)
    const randomPost = latestPosts[randomIndex]
    router.push(`${siteConfig('SUB_PATH', '')}/${randomPost?.slug}`)
  }

  return (
    <button
      type='button'
      title={locale.MENU.WALK_AROUND}
      aria-label={locale.MENU.WALK_AROUND}
      className='heo-nav-icon-btn flex h-9 w-9 cursor-pointer items-center justify-center rounded-full duration-200 transition-all hover:bg-black/10 dark:hover:bg-white/10'
      onClick={handleClick}>
      <i className='fa-solid fa-dice text-[15px]' aria-hidden />
    </button>
  )
}
