import { tryit } from 'radashi'
import { supabase } from '@/api/supabase'

export interface BlogTag {
    id: string
    name: string
    slug: string
    color: string | null
    created_at: string
}

export interface CreateBlogTagDto {
    name: string
    slug: string
    color?: string
}

export async function getBlogTags(): Promise<BlogTag[]> {
    if (!supabase) return []

    const [err, result] = await tryit(async () => {
        const { data, error } = await supabase!
            .from('blog_tags')
            .select('*')
            .order('name')
        if (error) throw error
        return (data as BlogTag[]) ?? []
    })()

    if (err) {
        console.warn('[BlogTagService] Failed to fetch tags:', err)
        return []
    }
    return result
}

export async function createBlogTag(dto: CreateBlogTagDto): Promise<BlogTag> {
    if (!supabase) throw new Error('Supabase not initialized')
    const { data, error } = await supabase
        .from('blog_tags')
        .insert(dto)
        .select('*')
        .single()
    if (error) throw error
    return data as BlogTag
}

export async function updateBlogTag(id: string, dto: Partial<CreateBlogTagDto>): Promise<BlogTag> {
    if (!supabase) throw new Error('Supabase not initialized')
    const { data, error } = await supabase
        .from('blog_tags')
        .update(dto)
        .eq('id', id)
        .select('*')
        .single()
    if (error) throw error
    return data as BlogTag
}

export async function deleteBlogTag(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not initialized')
    const { error } = await supabase.from('blog_tags').delete().eq('id', id)
    if (error) throw error
}

export const blogTagService = { getBlogTags, createBlogTag, updateBlogTag, deleteBlogTag }
