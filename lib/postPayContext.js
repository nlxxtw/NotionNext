import { createContext, useContext } from 'react'

export const PostPayContext = createContext({
  postSlug: '',
  pageId: ''
})

export function usePostPayContext() {
  return useContext(PostPayContext)
}
