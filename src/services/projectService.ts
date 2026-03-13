import { tryit } from 'radash'
import { supabase } from '@/api/supabase'
import type { Project } from '@/types/project'

export interface GetProjectsOptions {
  signal?: AbortSignal
}

const PROJECTS_SELECT = [
  'id',
  'title_zh', 'title_en',
  'description_zh', 'description_en',
  'contribution_zh', 'contribution_en',
  'image', 'tags',
  'github_url', 'live_url',
  'status', 'featured',
  '"order"',
  'start_date', 'end_date',
  'created_at', 'updated_at',
].join(', ')

export async function getProjects(options?: GetProjectsOptions): Promise<Project[]> {
  if (!supabase) throw new Error('[ProjectService] Supabase client not initialized')

  const query = supabase
    .from('projects')
    .select(PROJECTS_SELECT)
    .order('order', { ascending: true })

  if (options?.signal) {
    query.abortSignal(options.signal)
  }

  const [err, result] = await tryit(async () => {
    const { data, error } = await query
    if (error) throw { code: error.code, message: error.message, type: 'business' as const }
    return (data as unknown as Project[]) ?? []
  })()

  if (err) {
    console.error('[ProjectService] Failed to fetch projects:', err)
    throw err
  }

  return result
}
