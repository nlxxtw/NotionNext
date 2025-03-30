import FlipCard from '@/components/FlipCard'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import CONFIG from '../config'

export default function TouchMeCard() {
  if (!JSON.parse(siteConfig('HEO_SOCIAL_CARD', null, CONFIG))) {
    return <></>
  }
  return (
    <div className='relative h-28 text-white flex flex-col'>
      <FlipCard
        className='cursor-pointer lg:p-6 p-4 border rounded-xl bg-[#57bd6a] dark:bg-[#191919ee] dark:border-gray-600'
        frontContent={
          <div className='h-full'>
            <h2 className='font-[1000] text-3xl'>
              {siteConfig('HEO_SOCIAL_CARD_TITLE_1', null, CONFIG)}
            </h2>
            <h3 className='pt-2'>
              {siteConfig('HEO_SOCIAL_CARD_TITLE_2', null, CONFIG)}
            </h3>
            <div
              className='absolute left-0 top-0 w-full h-full'
              style={{
                background: 'url(https://im.19492035.xyz/file/1743266512838.png) center center no-repeat'
              }}></div>
          </div>
        }
        backContent={
          <Link href={siteConfig('HEO_SOCIAL_CARD_URL', null, CONFIG)}>
            <div className='font-[1000] text-xl h-full relative'>
              {/* 修改后的图片容器 */}
              <div 
                className='absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-3/4 bg-contain bg-no-repeat'
                style={{ 
                  backgroundImage: 'url(https://im.19492035.xyz/file/1742820981406.jpg)',
                  backgroundPosition: 'right center'
                }}>
              </div>
              
              {/* 文字内容 */}
              <div className='relative z-10 flex items-center justify-start h-full pl-4 pr-[40%]'>
                {siteConfig('HEO_SOCIAL_CARD_TITLE_3', null, CONFIG)}
              </div>
            </div>
          </Link>
        }
      />
    </div>
  )
}
