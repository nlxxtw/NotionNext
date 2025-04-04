import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import CopyRightDate from '@/components/CopyRightDate'
import PoweredBy from '@/components/PoweredBy'
import { siteConfig } from '@/lib/config'

const Footer = () => {
  const BEI_AN = siteConfig('BEI_AN')
  const BIO = siteConfig('BIO')

  return (
    <footer className="relative bg-white dark:bg-[#1a191d] w-full text-gray-600 dark:text-gray-100 text-sm">
      {/* 过渡区保持原高度 */}
      <div className="h-32 bg-gradient-to-b from-[#f7f9fe] to-white dark:from-inherit dark:to-inherit" />

      {/* 主内容容器（无背景覆盖） */}
      <div className="bg-white dark:bg-[#1a191d] px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 上下结构布局 */}
          <div className="flex flex-col lg:flex-row justify-between">
            
            {/* 左侧联系方式（强制左对齐） */}
            <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-8">
              <h3 className="text-base font-bold mb-4 text-left dark:text-white">联系方式</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-6 text-left">
                本站为非经营性个人站点，资源全部来自互联网收集，仅供用于学习和交流，
                请勿用于商业用途。本站自愿捐赠、打赏仅为维持服务器开支与维护。
                如有侵权请联系站长删除！
              </p>
            </div>

            {/* 右侧组合（强制右对齐） */}
            <div className="lg:w-1/2 flex flex-col items-end">
              
              {/* 项目链接右对齐 */}
              <div className="w-full max-w-xs text-right mb-8">
                <h3 className="text-base font-bold mb-4 dark:text-white">作者项目</h3>
                <div className="space-y-2">
                  <div>
                    <a href="https://www.zddown.icu" target="_blank" rel="noopener"
                       className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors block">
                      资源站
                    </a>
                  </div>
                  <div>
                    <a href="https://home.19492035.xyz" target="_blank" rel="noopener"
                       className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors block">
                      个人主页
                    </a>
                  </div>
                  <div>
                    <a href="https://dh.19492035.xyz" target="_blank" rel="noopener"
                       className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors block">
                      导航站
                    </a>
                  </div>
                  <div>
                    <a href="https://movie.19492035.xyz" target="_blank" rel="noopener"
                       className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors block">
                      影视站
                    </a>
                  </div>
                </div>
              </div>

              {/* 二维码组（强制右对齐） */}
              <div className="w-full max-w-xs">
                <div className="flex justify-end gap-4">
                  <div className="text-right">
                    <div className="w-28 mb-2 inline-block">
                      <img
                        src="https://img.19492035.xyz/file/1742989667091.png"
                        alt="官方下载"
                        className="w-full h-auto rounded-lg shadow-sm"
                      />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">官方下载</p>
                  </div>
                  <div className="text-right">
                    <div className="w-28 mb-2 inline-block">
                      <img
                        src="https://img.19492035.xyz/file/1742824264213.jpg"
                        alt="官方微信"
                        className="w-full h-auto rounded-lg shadow-sm"
                      />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">官方微信</p>
                  </div>
                  <div className="text-right">
                    <div className="w-28 mb-2 inline-block">
                      <img
                        src="https://img.19492035.xyz/file/1743351194450.jpg"
                        alt="赞赏作者"
                        className="w-full h-auto rounded-lg shadow-sm"
                      />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">赞赏作者</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部备案信息（保持原位置） */}
      <div className="w-full bg-[#f1f3f7] dark:bg-[#21232A] border-t dark:border-t-[#3D3D3F] py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="text-center md:text-left order-2 md:order-1">
              <PoweredBy />
              <div className="flex items-center justify-center md:justify-start gap-1 mt-1">
                <CopyRightDate />
                <a href="/about" className="underline font-medium dark:text-gray-300">
                  {siteConfig('AUTHOR')}
                </a>
                {BIO && <span className="mx-1">| {BIO}</span>}
              </div>
            </div>
            <div className="order-1 md:order-2 flex items-center gap-2">
              {BEI_AN && (
                <>
                  <i className="fas fa-shield-alt text-sm" />
                  <a href="https://beian.miit.gov.cn" className="text-sm hover:text-blue-500">
                    {BEI_AN}
                  </a>
                </>
              )}
              <BeiAnGongAn />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
