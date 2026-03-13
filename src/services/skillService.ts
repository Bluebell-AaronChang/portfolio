import { supabase } from '@/api/supabase'
import type { Skill, TechCategory, CreateSkillDto, UpdateSkillDto, CreateTechCategoryDto, UpdateTechCategoryDto } from '@/types'

export interface GetSkillsOptions { signal?: AbortSignal }
export interface GetCategoriesOptions { signal?: AbortSignal }

export const skillService = {
    async getAllSkills(options?: GetSkillsOptions): Promise<Skill[]> {
        if (!supabase) throw new Error('Supabase client not initialized')
        let query = supabase.from('skills').select('*').order('order_index', { ascending: true })
        if (options?.signal) query = query.abortSignal(options.signal) as typeof query
        const { data, error } = await query
        if (error) throw { code: error.code, message: error.message, hint: error.hint, details: error.details, type: 'business' as const }
        return data || []
    },

    async getSkillById(id: string, options?: GetSkillsOptions): Promise<Skill | null> {
        if (!supabase) throw new Error('Supabase client not initialized')
        let query = supabase.from('skills').select('*').eq('id', id)
        if (options?.signal) query = query.abortSignal(options.signal) as typeof query
        const { data, error } = await query.single()
        if (error) throw { code: error.code, message: error.message, hint: error.hint, details: error.details, type: 'business' as const }
        return data
    },

    async createSkill(skill: CreateSkillDto): Promise<Skill> {
        if (!supabase) throw new Error('Supabase client not initialized')
        const { data, error } = await supabase.from('skills').insert(skill).select().single()
        if (error) throw { code: error.code, message: error.message, hint: error.hint, details: error.details, type: 'business' as const }
        return data
    },

    async updateSkill(id: string, skill: UpdateSkillDto): Promise<Skill> {
        if (!supabase) throw new Error('Supabase client not initialized')
        const { data, error } = await supabase.from('skills').update(skill).eq('id', id).select().single()
        if (error) throw { code: error.code, message: error.message, hint: error.hint, details: error.details, type: 'business' as const }
        return data
    },

    async deleteSkill(id: string): Promise<void> {
        if (!supabase) throw new Error('Supabase client not initialized')
        const { error } = await supabase.from('skills').delete().eq('id', id)
        if (error) throw { code: error.code, message: error.message, hint: error.hint, details: error.details, type: 'business' as const }
    },

    async getAllTechCategories(options?: GetCategoriesOptions): Promise<TechCategory[]> {
        if (!supabase) throw new Error('Supabase client not initialized')
        let query = supabase.from('tech_categories').select('*').order('name', { ascending: true })
        if (options?.signal) query = query.abortSignal(options.signal) as typeof query
        const { data, error } = await query
        if (error) throw { code: error.code, message: error.message, hint: error.hint, details: error.details, type: 'business' as const }
        return data || []
    },

    async getTechCategoryById(id: string, options?: GetCategoriesOptions): Promise<TechCategory | null> {
        if (!supabase) throw new Error('Supabase client not initialized')
        let query = supabase.from('tech_categories').select('*').eq('id', id)
        if (options?.signal) query = query.abortSignal(options.signal) as typeof query
        const { data, error } = await query.single()
        if (error) throw { code: error.code, message: error.message, hint: error.hint, details: error.details, type: 'business' as const }
        return data
    },

    async createTechCategory(category: CreateTechCategoryDto): Promise<TechCategory> {
        if (!supabase) throw new Error('Supabase client not initialized')
        const { data, error } = await supabase.from('tech_categories').insert(category).select().single()
        if (error) throw { code: error.code, message: error.message, hint: error.hint, details: error.details, type: 'business' as const }
        return data
    },

    async updateTechCategory(id: string, category: UpdateTechCategoryDto): Promise<TechCategory> {
        if (!supabase) throw new Error('Supabase client not initialized')
        const { data, error } = await supabase.from('tech_categories').update(category).eq('id', id).select().single()
        if (error) throw { code: error.code, message: error.message, hint: error.hint, details: error.details, type: 'business' as const }
        return data
    },

    async deleteTechCategory(id: string): Promise<void> {
        if (!supabase) throw new Error('Supabase client not initialized')
        const { error } = await supabase.from('tech_categories').delete().eq('id', id)
        if (error) throw { code: error.code, message: error.message, hint: error.hint, details: error.details, type: 'business' as const }
    },

    async getSkillsByCategory(categoryId: string, options?: GetSkillsOptions): Promise<Skill[]> {
        if (!supabase) throw new Error('Supabase client not initialized')
        let query = supabase.from('skills').select('*').eq('category_id', categoryId).order('order_index', { ascending: true })
        if (options?.signal) query = query.abortSignal(options.signal) as typeof query
        const { data, error } = await query
        if (error) throw { code: error.code, message: error.message, hint: error.hint, details: error.details, type: 'business' as const }
        return data || []
    },
}
