/**
 * 全局置顶排序工具（纯函数，无依赖主题/配置，便于测试）
 *
 * 规则：
 * - 置顶文章提到列表最前
 * - 置顶子集按 lastEditedDate（兜底 publishDate）倒序；相同时间保持稳定
 * - 非置顶文章保持原相对顺序
 * - 判定：sticky 勾选 或 tags 含 topTag
 */

function getPostLatestTime(post) {
  if (post?.lastEditedDate) {
    return post.lastEditedDate
  }
  if (post?.publishDate) {
    return post.publishDate
  }
  return 0
}

function isTruthySticky(value) {
  if (value === true || value === 1) return true
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase()
    return v === 'yes' || v === 'true' || v === '1' || v === '是' || v === '置顶'
  }
  return false
}

/**
 * 是否置顶
 */
export function isPostPinned(post, topTag) {
  if (!post) return false
  if (
    isTruthySticky(post.sticky) ||
    isTruthySticky(post['置顶']) ||
    isTruthySticky(post.pin)
  ) {
    return true
  }
  if (!topTag) return false
  const tags = Array.isArray(post.tags) ? post.tags : []
  return tags.includes(topTag)
}

/**
 * 置顶文章移到最前，并按更新时间倒序
 */
export function sortPinnedPostsByLatestUpdate(posts, topTag) {
  if (!Array.isArray(posts)) {
    return posts
  }

  const pinned = []
  const normal = []

  for (let i = 0; i < posts.length; i++) {
    const p = posts[i]
    if (isPostPinned(p, topTag)) {
      pinned.push({ post: p, idx: i })
    } else {
      normal.push(p)
    }
  }

  if (pinned.length === 0) {
    return posts
  }

  pinned.sort((a, b) => {
    const timeA = new Date(getPostLatestTime(a.post)).getTime()
    const timeB = new Date(getPostLatestTime(b.post)).getTime()
    if (timeB !== timeA) {
      return timeB - timeA
    }
    return a.idx - b.idx
  })

  return [...pinned.map(x => x.post), ...normal]
}
