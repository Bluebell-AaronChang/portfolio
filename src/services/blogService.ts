import { tryit } from 'radash'
import { supabase } from '@/api/supabase'
import type { BlogPost } from '@/types/blog'

const BLOG_POSTS_SELECT = 'id, slug, title_zh, title_en, summary_zh, summary_en, cover_image, tags, published, featured, view_count, reading_time_minutes, published_at, created_at, updated_at'

export interface GetBlogPostsOptions {
  signal?: AbortSignal
  tag?: string
  limit?: number
  featuredOnly?: boolean
}

export interface GetBlogPostBySlugOptions {
  signal?: AbortSignal
}

export async function getBlogPosts(options?: GetBlogPostsOptions): Promise<BlogPost[]> {
  if (!supabase) return []

  let query = supabase
    .from('blog_posts')
    .select(BLOG_POSTS_SELECT)
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (options?.tag) {
    query = query.contains('tags', [options.tag])
  }

  if (options?.featuredOnly) {
    query = query.eq('featured', true)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.signal) {
    query.abortSignal(options.signal)
  }

  const [err, result] = await tryit(async () => {
    const { data, error } = await query
    if (error) throw { code: error.code, message: error.message, type: 'business' as const }
    return (data as BlogPost[]) ?? []
  })()

  if (err) {
    console.warn('[BlogService] Failed to fetch posts:', err)
    return []
  }

  return result
}

export async function getBlogPostBySlug(slug: string, options?: GetBlogPostBySlugOptions): Promise<BlogPost | null> {
  if (!supabase) return null

  const BLOG_POST_DETAIL_SELECT = 'id, slug, title_zh, title_en, summary_zh, summary_en, content_zh, content_en, cover_image, tags, published, featured, view_count, reading_time_minutes, published_at, created_at, updated_at'

  const query = supabase
    .from('blog_posts')
    .select(BLOG_POST_DETAIL_SELECT)
    .eq('slug', slug)
    .eq('published', true)
    .abortSignal(options?.signal ?? AbortSignal.timeout(15000))
    .single()

  const [err, result] = await tryit(async () => {
    const { data, error } = await query
    if (error) throw { code: error.code, message: error.message, type: 'business' as const }
    return data as BlogPost | null
  })()

  if (err) {
    console.warn('[BlogService] Failed to fetch post by slug:', err)
    return null
  }

  return result
}
