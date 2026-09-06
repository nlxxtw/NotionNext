import { cs, Text } from 'react-notion-x'
import PaidWall from '@/components/PaidWall'
import { usePostPayContext } from '@/lib/postPayContext'

/**
 * 覆盖 react-notion-x Callout：付费块渲染 PaidWall
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
