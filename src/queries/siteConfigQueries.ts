import { useQuery } from '@tanstack/vue-query'
import { getSiteConfig } from '@/services/siteConfigService'

export const SITE_CONFIG_QUERY_KEY = ['site-config'] as const

export function useSiteConfigQuery<T = string>(key: string) {
  return useQuery({
    queryKey: [...SITE_CONFIG_QUERY_KEY, key],
    queryFn: () => getSiteConfig<T>(key),
    staleTime: 1000 * 60 * 30,
  })
}
