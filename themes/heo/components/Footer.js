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
        <div className='max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8'>
          {/* 左侧联系方式 */}
          <div className='flex-1 max-w-xl'>
            <div className='dark:text-white text-base font-bold mb-4'>联系方式</div>
            <div className='text-gray-600 dark:text-gray-300 text-sm leading-6'>
              本站为非经营性个人站点，资源全部来自互联网收集，仅供用于学习和交流，请勿用于商业用途，本站自愿捐赠、打赏，仅为维持服务器的开支与维护所用。如有侵权不妥之处，请联系站长删除！
            </div>
          </div>

          {/* 右侧二维码组 */}
          <div className='flex-shrink-0'>
            <div className='flex justify-start md:justify-end items-center gap-4 md:gap-6 flex-wrap'>
              {/* 官方下载 */}
              <div className='text-center'>
                <div className='w-28 md:w-32 mb-2'>
                  <img 
                    src="https://img.19492035.xyz/file/1742989667091.png" 
                    alt="官方下载" 
                    className='w-full h-auto rounded-lg shadow-sm transition hover:scale-105 duration-300'
                  />
                </div>
                <p className='text-gray-600 dark:text-gray-300 text-xs md:text-sm'>官方下载</p>
              </div>

              {/* 官方微信号 */}
              <div className='text-center'>
                <div className='w-28 md:w-32 mb-2'>
                  <img 
                    src="https://img.19492035.xyz/file/1742824264213.jpg" 
                    alt="官方微信号" 
                    className='w-full h-auto rounded-lg shadow-sm transition hover:scale-105 duration-300'
                  />
                </div>
                <p className='text-gray-600 dark:text-gray-300 text-xs md:text-sm'>官方微信号</p>
              </div>

              {/* 赞赏作者 */}
              <div className='text-center'>
                <div className='w-28 md:w-32 mb-2'>
                  <img 
                    src="https://img.19492035.xyz/file/1743351194450.jpg" 
                    alt="赞赏作者" 
                    className='w-full h-auto rounded-lg shadow-sm transition hover:scale-105 duration-300'
                  />
                </div>
                <p className='text-gray-600 dark:text-gray-300 text-xs md:text-sm'>赞赏作者</p>
              </div>
            </div>
          </div>
        </div>

        {/* 作者项目 */}
        <div className='max-w-6xl mx-auto mt-8 grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div>
            <div className='dark:text-white text-base font-bold mb-4'>作者项目</div>
            <div className='space-y-3'>
              <div>
                <a href="https://www.zddown.icu" target="_blank" rel="noopener noreferrer" 
                   className='text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors text-sm'>
                  资源站
                </a>
              </div>
              <div>
                <a href="https://home.19492035.xyz" target="_blank" rel="noopener noreferrer"
                   className='text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors text-sm'>
                  个人主页
                </a>
              </div>
              <div>
                <a href="https://dh.19492035.xyz" target="_blank" rel="noopener noreferrer"
                   className='text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors text-sm'>
                  导航站
                </a>
              </div>
              <div>
                <a href="https://movie.19492035.xyz" target="_blank" rel="noopener noreferrer"
                   className='text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors text-sm'>
                  影视站
                </a>
              </div>
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
