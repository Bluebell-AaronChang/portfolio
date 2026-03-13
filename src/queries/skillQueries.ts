import { useQuery } from '@tanstack/vue-query'
import { skillService } from '@/services/skillService'

export const SKILLS_QUERY_KEY = ['skills'] as const
export const TECH_CATEGORIES_QUERY_KEY = ['tech-categories'] as const

export function useSkillsQuery() {
    return useQuery({
        queryKey: SKILLS_QUERY_KEY,
        queryFn: ({ signal }) => skillService.getAllSkills({ signal }),
        staleTime: 1000 * 60 * 5,
    })
}

export function useTechCategoriesQuery() {
    return useQuery({
        queryKey: TECH_CATEGORIES_QUERY_KEY,
        queryFn: ({ signal }) => skillService.getAllTechCategories({ signal }),
        staleTime: 1000 * 60 * 5,
    })
}
