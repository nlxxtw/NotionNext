/**
 * 全局置顶配置
 *
 * 推荐（Notion 勾选）：
 * 1. 文章库增加 Checkbox 属性，列名「置顶」（默认）
 * 2. 需要置顶的文章勾选即可；取消勾选即取消置顶
 *
 * 也可任选：
 * - tags 打上「置顶」（TOP_TAG）
 * - Checkbox 列名改成 sticky，并设 NEXT_PUBLIC_NOTION_PROPERTY_STICKY=sticky
 * - Config / 环境变量改 TOP_TAG
 *
 * 效果：置顶排最前；多篇置顶按最近更新倒序；非置顶相对顺序不变
 */
module.exports = {
  TOP_TAG: process.env.NEXT_PUBLIC_TOP_TAG || process.env.TOP_TAG || '置顶'
}

