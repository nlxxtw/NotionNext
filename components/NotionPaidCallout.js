import { cs, Text } from 'react-notion-x'
import PaidWall from '@/components/PaidWall'
import { usePostPayContext } from '@/lib/postPayContext'

/**
 * 覆盖 react-notion-x Callout：付费块渲染 PaidWall
 * 注意：自定义 Callout 收不到 children，依赖 getPostBlocks 把子块文字并进 title
 */
export default function NotionPaidCallout({ block, className }) {
  const { postSlug, pageId } = usePostPayContext()
  const paid = block?.format?.paid_wall

  if (paid?.key) {
    return (
      <PaidWall
        contentKey={paid.key}
        price={paid.price}
        label={paid.label}
        postSlug={postSlug || pageId}
        pageId={pageId}
      />
    )
  }

  // 兜底：title 以【付费】开头但未打上 paid_wall（缓存旧数据等）
  const titleSegs = block?.properties?.title
  const titlePlain = Array.isArray(titleSegs)
    ? titleSegs.map(s => (Array.isArray(s) ? String(s[0] || '') : '')).join('')
    : ''
  if (/^【\s*(付费|隐藏)\s*】/.test(titlePlain.trim())) {
    const rest = titlePlain.replace(/^【\s*(付费|隐藏)\s*】/, '').trim()
    const priceMatch = rest.match(/(\d+(?:\.\d{1,2})?)\s*(?:元|块)?/)
    const price = priceMatch ? Number(priceMatch[1]) : undefined
    const label =
      rest.replace(/(?:¥|￥|\$)?\s*\d+(?:\.\d{1,2})?\s*(?:元|块)?/g, '').trim() ||
      '付费资源'
    return (
      <PaidWall
        contentKey={String(block?.id || '')}
        price={price}
        label={label}
        postSlug={postSlug || pageId}
        pageId={pageId}
      />
    )
  }

  const color = block?.format?.block_color
  return (
    <div
      className={cs(
        'notion-callout',
        color && `notion-${color}_co`,
        className
      )}>
      {!block?.format?.callout_no_icon && block?.format?.page_icon ? (
        <div className='notion-page-icon-inline notion-page-icon-span'>
          <span className='notion-page-icon'>{block.format.page_icon}</span>
        </div>
      ) : null}
      <div className='notion-callout-text'>
        <Text value={block?.properties?.title} block={block} />
      </div>
    </div>
  )
}
