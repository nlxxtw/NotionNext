import { DynamicLayout } from '@/themes/theme'
import { siteConfig } from '@/lib/config'
import { getGlobalData } from '@/lib/db/getSiteData'  //若为NotionNext 4.3.2之下版本，此处应为@/lib/notion/getNotionData
import React from 'react'
import BLOG from '@/blog.config'

const MemosIndex = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutMemos' {...props} />
}

export async function getStaticProps() {
  const from = 'tag-index-props'
  const props = await getGlobalData({ from })
  delete props.allPages
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}

export default MemosIndex
