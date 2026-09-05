import BLOG from '@/blog.config'
import { resolveIndexNowKey, isIndexNowEnabled } from '@/lib/seo/indexnow'

/**
 * IndexNow 密钥文件：https://你的域名/indexnow-key.txt
 */
export const getServerSideProps = async ({ res }) => {
  const enabled = isIndexNowEnabled()
  const key = resolveIndexNowKey()

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader(
    'Cache-Control',
    'public, max-age=86400, stale-while-revalidate=3600'
  )

  if (!enabled || !key) {
    res.statusCode = 404
    res.write('IndexNow disabled')
    res.end()
    return { props: {} }
  }

  res.statusCode = 200
  res.write(key)
  res.end()
  return { props: {} }
}

export default function IndexNowKeyPage() {
  return null
}

void BLOG
