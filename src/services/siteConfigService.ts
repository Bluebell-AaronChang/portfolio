import { tryit } from 'radash'
import { supabase } from '@/api/supabase'
import type { SiteConfig } from '@/types/siteConfig'

export async function getSiteConfig<T = string>(key: string): Promise<T | null> {
  if (!supabase) return null

  const client = supabase

  const [err, result] = await tryit(async () => {
    const { data, error } = await client
      .from('site_config')
      .select('value')
      .eq('key', key)
      .single()

    if (error) throw { code: error.code, message: error.message, type: 'business' as const }
    return (data as Pick<SiteConfig, 'value'>)?.value as T ?? null
  })()

  if (err) {
    console.warn(`[SiteConfigService] Failed to fetch config "${key}":`, err)
    return null
  }

  return result
}
