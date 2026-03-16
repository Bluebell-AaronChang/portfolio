import { tryit } from 'radashi'
import { supabase } from '@/api/supabase'
import { toAppError } from '@/api/supabaseError'
import type { Skill, TechCategory, CreateSkillDto, UpdateSkillDto, CreateTechCategoryDto, UpdateTechCategoryDto } from '@/types'

export interface GetSkillsOptions { signal?: AbortSignal }
export interface GetCategoriesOptions { signal?: AbortSignal }

export const skillService = {
    async getAllSkills(options?: GetSkillsOptions): Promise<Skill[]> {
        if (!supabase) throw new Error('Supabase client not initialized')
        const [err, result] = await tryit(async () => {
            let query = supabase!.from('skills').select('*').order('order_index', { ascending: true })
            if (options?.signal) query = query.abortSignal(options.signal) as typeof query
            const { data, error } = await query
            if (error) throw toAppError(error)
            return (data as Skill[]) || []
        })()
        if (err) throw err
        return result
    },

    async getSkillById(id: string, options?: GetSkillsOptions): Promise<Skill | null> {
        if (!supabase) throw new Error('Supabase client not initialized')
        const [err, result] = await tryit(async () => {
            let query = supabase!.from('skills').select('*').eq('id', id)
            if (options?.signal) query = query.abortSignal(options.signal) as typeof query
            const { data, error } = await query.single()
            if (error) throw toAppError(error)
            return data as Skill
        })()
        if (err) throw err
        return result
    },

    async createSkill(skill: CreateSkillDto): Promise<Skill> {
        if (!supabase) throw new Error('Supabase client not initialized')
        const [err, result] = await tryit(async () => {
            const { data, error } = await supabase!.from('skills').insert(skill).select().single()
            if (error) throw toAppError(error)
            return data as Skill
        })()
        if (err) throw err
        return result
    },

    async updateSkill(id: string, skill: UpdateSkillDto): Promise<Skill> {
        if (!supabase) throw new Error('Supabase client not initialized')
        const [err, result] = await tryit(async () => {
            const { data, error } = await supabase!.from('skills').update(skill).eq('id', id).select().single()
            if (error) throw toAppError(error)
            return data as Skill
        })()
        if (err) throw err
        return result
    },

    async deleteSkill(id: string): Promise<void> {
        if (!supabase) throw new Error('Supabase client not initialized')
        const [err] = await tryit(async () => {
            const { error } = await supabase!.from('skills').delete().eq('id', id)
            if (error) throw toAppError(error)
        })()
        if (err) throw err
    },

    async getAllTechCategories(options?: GetCategoriesOptions): Promise<TechCategory[]> {
        if (!supabase) throw new Error('Supabase client not initialized')
        const [err, result] = await tryit(async () => {
            let query = supabase!.from('tech_categories').select('*').order('name', { ascending: true })
            if (options?.signal) query = query.abortSignal(options.signal) as typeof query
            const { data, error } = await query
            if (error) throw toAppError(error)
            return (data as TechCategory[]) || []
        })()
        if (err) throw err
        return result
    },

    async getTechCategoryById(id: string, options?: GetCategoriesOptions): Promise<TechCategory | null> {
        if (!supabase) throw new Error('Supabase client not initialized')
        const [err, result] = await tryit(async () => {
            let query = supabase!.from('tech_categories').select('*').eq('id', id)
            if (options?.signal) query = query.abortSignal(options.signal) as typeof query
            const { data, error } = await query.single()
            if (error) throw toAppError(error)
            return data as TechCategory
        })()
        if (err) throw err
        return result
    },

    async createTechCategory(category: CreateTechCategoryDto): Promise<TechCategory> {
        if (!supabase) throw new Error('Supabase client not initialized')
        const [err, result] = await tryit(async () => {
            const { data, error } = await supabase!.from('tech_categories').insert(category).select().single()
            if (error) throw toAppError(error)
            return data as TechCategory
        })()
        if (err) throw err
        return result
    },

    async updateTechCategory(id: string, category: UpdateTechCategoryDto): Promise<TechCategory> {
        if (!supabase) throw new Error('Supabase client not initialized')
        const [err, result] = await tryit(async () => {
            const { data, error } = await supabase!.from('tech_categories').update(category).eq('id', id).select().single()
            if (error) throw toAppError(error)
            return data as TechCategory
        })()
        if (err) throw err
        return result
    },

    async deleteTechCategory(id: string): Promise<void> {
        if (!supabase) throw new Error('Supabase client not initialized')
        const [err] = await tryit(async () => {
            const { error } = await supabase!.from('tech_categories').delete().eq('id', id)
            if (error) throw toAppError(error)
        })()
        if (err) throw err
    },

    async getSkillsByCategory(categoryId: string, options?: GetSkillsOptions): Promise<Skill[]> {
        if (!supabase) throw new Error('Supabase client not initialized')
        const [err, result] = await tryit(async () => {
            let query = supabase!.from('skills').select('*').eq('category_id', categoryId).order('order_index', { ascending: true })
            if (options?.signal) query = query.abortSignal(options.signal) as typeof query
            const { data, error } = await query
            if (error) throw toAppError(error)
            return (data as Skill[]) || []
        })()
        if (err) throw err
        return result
    },

    async getHeroSkillNames(): Promise<string[]> {
        if (!supabase) return []
        const [err, result] = await tryit(async () => {
            const { data, error } = await supabase!
                .from('skills')
                .select('name')
                .eq('show_in_hero', true)
                .order('order_index', { ascending: true })
            if (error) throw toAppError(error)
            return (data?.map((s: { name: string }) => s.name)) ?? []
        })()
        if (err) throw err
        return result
    },
}
