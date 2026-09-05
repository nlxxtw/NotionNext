import {
  isPostPinned,
  sortPinnedPostsByLatestUpdate
} from '@/lib/utils/pinnedPosts'


describe('sortPinnedPostsByLatestUpdate', () => {
  it('returns original array when nothing is pinned', () => {
    const posts = [
      { id: 'a', tags: ['x'], lastEditedDate: '2024-01-01' }
    ]
    const res = sortPinnedPostsByLatestUpdate(posts, '')
    expect(res).toBe(posts)
  })

  it('moves pinned posts to front and sorts them by lastEditedDate desc', () => {
    const posts = [
      { id: 'A', tags: ['x'], lastEditedDate: '2024-01-01' },
      { id: 'P1', tags: ['top'], lastEditedDate: '2024-01-02' },
      { id: 'B', tags: ['x'], lastEditedDate: '2024-02-01' },
      { id: 'P2', tags: ['top'], lastEditedDate: '2024-03-01' },
      { id: 'C', tags: ['x'], lastEditedDate: '2024-01-03' }
    ]

    const res = sortPinnedPostsByLatestUpdate(posts, 'top')
    expect(res.map(p => p.id)).toEqual(['P2', 'P1', 'A', 'B', 'C'])
  })

  it('keeps pinned relative order when lastEditedDate is equal (stable)', () => {
    const posts = [
      { id: 'A', tags: ['x'], lastEditedDate: '2024-01-01' },
      { id: 'P1', tags: ['top'], lastEditedDate: '2024-01-02' },
      { id: 'B', tags: ['x'], lastEditedDate: '2024-02-01' },
      { id: 'P2', tags: ['top'], lastEditedDate: '2024-01-02' },
      { id: 'C', tags: ['x'], lastEditedDate: '2024-01-03' }
    ]

    const res = sortPinnedPostsByLatestUpdate(posts, 'top')
    expect(res.map(p => p.id)).toEqual(['P1', 'P2', 'A', 'B', 'C'])
  })

  it('pins by sticky checkbox even without topTag', () => {
    const posts = [
      { id: 'A', tags: ['x'], lastEditedDate: '2024-01-01' },
      { id: 'P1', sticky: true, lastEditedDate: '2024-01-02' },
      { id: 'B', tags: ['x'], lastEditedDate: '2024-02-01' }
    ]
    const res = sortPinnedPostsByLatestUpdate(posts, '')
    expect(res.map(p => p.id)).toEqual(['P1', 'A', 'B'])
    expect(isPostPinned(posts[1], '')).toBe(true)
  })
})
