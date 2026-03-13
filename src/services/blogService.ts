import { tryit } from 'radashi'
import { supabase } from '@/api/supabase'
import type { BlogPost } from '@/types/blog'

const BLOG_POSTS_SELECT = 'id, slug, title_zh, title_en, summary_zh, summary_en, content_zh, content_en, cover_image, tags, published, featured, view_count, published_at, created_at, updated_at, status'

export interface GetBlogPostsOptions {
  signal?: AbortSignal
  tag?: string
  limit?: number
  featuredOnly?: boolean
  includeUnpublished?: boolean
}

export interface GetBlogPostBySlugOptions {
  signal?: AbortSignal
}

export interface CreateBlogPostDto {
  slug: string
  title_zh: string
  title_en: string
  summary_zh?: string
  summary_en?: string
  content_zh?: string
  content_en?: string
  cover_image?: string
  tags?: string[]
  status: 'published' | 'draft' | 'archived'
  featured?: boolean
  published_at?: string
}

export interface UpdateBlogPostDto extends Partial<CreateBlogPostDto> { }

export async function getBlogPosts(options?: GetBlogPostsOptions): Promise<BlogPost[]> {
  if (!supabase) return []

  let query = supabase
    .from('blog_posts')
    .select(BLOG_POSTS_SELECT)

  if (!options?.includeUnpublished) {
    query = query.eq('published', true)
  }

  query = query.order('published_at', { ascending: false })

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

  const BLOG_POST_DETAIL_SELECT = 'id, slug, title_zh, title_en, summary_zh, summary_en, content_zh, content_en, cover_image, tags, published, featured, view_count, published_at, created_at, updated_at, status'

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

export async function createPost(post: CreateBlogPostDto): Promise<BlogPost> {
  if (!supabase) throw new Error('[BlogService] Supabase client not initialized')

  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      ...post,
      published: post.status === 'published',
    })
    .select(BLOG_POSTS_SELECT)
    .single()

  if (error) throw error
  return data as BlogPost
}

export async function updatePost(id: string, post: UpdateBlogPostDto): Promise<BlogPost> {
  if (!supabase) throw new Error('[BlogService] Supabase client not initialized')

  const updateData: any = { ...post }
  if (post.status) {
    updateData.published = post.status === 'published'
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .update(updateData)
    .eq('id', id)
    .select(BLOG_POSTS_SELECT)
    .single()

  if (error) throw error
  return data as BlogPost
}

export async function deletePost(id: string): Promise<void> {
  if (!supabase) throw new Error('[BlogService] Supabase client not initialized')

  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export const blogService = {
  getBlogPosts,
  getBlogPostBySlug,
  createPost,
  updatePost,
  deletePost,
}
