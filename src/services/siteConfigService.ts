import { tryit } from 'radashi'
import { supabase } from '@/api/supabase'
import type { SiteConfig } from '@/types/siteConfig'

export interface GetSiteConfigOptions { signal?: AbortSignal }

export async function getSiteConfig<T = string>(key: string, options?: GetSiteConfigOptions): Promise<T | null> {
  if (!supabase) return null

  const [err, result] = await tryit(async () => {
    let query = supabase!
      .from('site_config')
      .select('value')
      .eq('key', key)

    if (options?.signal) query = query.abortSignal(options.signal) as typeof query

    const { data, error } = await query.single()
    if (error) throw { code: error.code, message: error.message, hint: error.hint, details: error.details, type: 'business' as const }
    return (data as Pick<SiteConfig, 'value'>)?.value as T ?? null
  })()

  if (err) {
    console.warn(`[SiteConfigService] Failed to fetch config "${key}":`, err)
    return null
  }

  return result
}
