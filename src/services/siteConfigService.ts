import { tryit } from 'radashi'
import { supabase } from '@/api/supabase'
import { toAppError } from '@/api/supabaseError'
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
    if (error) throw toAppError(error)
    return (data as Pick<SiteConfig, 'value'>)?.value as T ?? null
  })()

  if (err) throw err

  return result
}
