import { useQuery } from '@tanstack/vue-query'
import { getProjects } from '@/services/projectService'

export const PROJECT_QUERY_KEY = ['projects'] as const

export function useProjectsQuery() {
  return useQuery({
    queryKey: PROJECT_QUERY_KEY,
    queryFn: ({ signal }) => getProjects({ signal }),
    staleTime: 1000 * 60 * 5,
  })
}
