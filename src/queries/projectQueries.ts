import { useQuery } from '@tanstack/vue-query'
import { getProjects as getProjectsService, getAllProjects as getAllProjectsService } from '@/services/projectService'

export const PROJECT_QUERY_KEY = ['projects'] as const

export function useProjectsQuery() {
  return useQuery({
    queryKey: PROJECT_QUERY_KEY,
    queryFn: ({ signal }) => getProjectsService({ signal }),
    staleTime: 1000 * 60 * 5,
  })
}

export { getProjectsService as getProjects }

export { getAllProjectsService as getAllProjects }
