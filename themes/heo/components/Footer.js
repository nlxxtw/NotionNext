import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import CopyRightDate from '@/components/CopyRightDate'
import PoweredBy from '@/components/PoweredBy'
import { siteConfig } from '@/lib/config'
import SocialButton from './SocialButton'

const Footer = ({ total }) => {
  const BEI_AN = siteConfig('BEI_AN')
  const BIO = siteConfig('BIO')

  return (
    <footer className='relative flex-shrink-0 bg-white dark:bg-[#1a191d] w-full leading-6 text-gray-600 dark:text-gray-100 text-sm'>
      {/* 颜色过渡区 */}
      <div className='h-32 bg-gradient-to-b from-[#f7f9fe] to-white dark:bg-[#1a191d] dark:from-inherit dark:to-inherit'/>

      {/* 主要内容容器 */}
      <div className='bg-white py-8 px-4 mx-auto dark:bg-[#1a191d] dark:border-t dark:border-[#3D3D3F]'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
          {/* 联系方式 */}
          <div>
            <div className='dark:text-white text-base font-bold mb-8'>联系方式</div>
            <div className='text-gray-600 dark:text-gray-300 mb-6'>
              问题反馈：chinavredu@gmail.com
            </div>
            <div className='text-gray-600 dark:text-gray-300 mb-6'>
              微信公众号：zdDown
            </div>
          </div>

          {/* 网站信息 */}
          <div>
            <div className='dark:text-white text-base font-bold mb-8'>网站信息</div>
            <div className='text-gray-600 dark:text-gray-300 mb-6'>共收录 {total} 个网站</div>
            <div className='mb-6'>
              <a href="/apply" className='text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors'>
                申请收录
              </a>
            </div>
          </div>

          {/* 其他项目 */}
          <div>
            <div className='dark:text-white text-base font-bold mb-8'>其他项目</div>
            <div className='mb-6'>
              <a href="https://bg.19492035.xyz" target="_blank" rel="noopener noreferrer" 
                 className='text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors'>
                博客
              </a>
            </div>
            <div className='mb-6'>
              <a href="https://home.19492035.xyz" target="_blank" rel="noopener noreferrer"
                 className='text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors'>
                Home
              </a>
            </div>
          </div>

          {/* 二维码 */}
          <div className='flex justify-center md:justify-end'>
            <div className='w-32'>
              <img 
                src="https://img.19492035.xyz/file/1742824264213.jpg" 
                alt="二维码" 
                className='w-full h-auto rounded-lg shadow-sm'
              />
            </div>
          </div>
        </div>
      </div>

      {/* 底部备案信息 */}
      <div className='w-full h-20 flex flex-col p-3 lg:flex-row justify-between px-6 items-center bg-[#f1f3f7] dark:bg-[#21232A] border-t dark:border-t-[#3D3D3F]'>
        <div className='text-center lg:text-start'>
          <PoweredBy />
          <div className='flex gap-x-1'>
            <CopyRightDate />
            <a href={'/about'} className='underline font-semibold dark:text-gray-300 '>
              {siteConfig('AUTHOR')}
            </a>
            {BIO && <span className='mx-1'> | {BIO}</span>}
          </div>
        </div>

        <div>
          {BEI_AN && (
            <>
              <i className='fas fa-shield-alt' />{' '}
              <a href='https://beian.miit.gov.cn/' className='mr-2'>
                {siteConfig('BEI_AN')}
              </a>
            </>
          )}
          <BeiAnGongAn />
        </div>
      </div>
    </footer>
  )
}

export default Footer
