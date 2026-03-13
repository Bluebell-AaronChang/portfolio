import { useQuery } from '@tanstack/vue-query'
import { getBlogPosts as getBlogPostsService, getBlogPostBySlug } from '@/services/blogService'
import type { Ref } from 'vue'

export const BLOG_POSTS_QUERY_KEY = ['blog-posts'] as const
export const BLOG_POST_QUERY_KEY = ['blog-post'] as const

export function useBlogPostsQuery(options?: { tag?: string; limit?: number; featuredOnly?: boolean }) {
  return useQuery({
    queryKey: [...BLOG_POSTS_QUERY_KEY, options?.tag, options?.limit, options?.featuredOnly],
    queryFn: ({ signal }) => getBlogPostsService({ signal, ...options }),
    staleTime: 1000 * 60 * 5,
  })
}

export function useBlogPostBySlugQuery(slug: Ref<string>) {
  return useQuery({
    queryKey: [...BLOG_POST_QUERY_KEY, slug],
    queryFn: ({ signal }) => getBlogPostBySlug(slug.value, { signal }),
    staleTime: 1000 * 60 * 5,
    enabled: () => !!slug.value,
  })
}

export { getBlogPostsService as getBlogPosts }
