import { tryit } from 'radash'
import { supabase } from '@/api/supabase'
import { STATIC_PROJECTS } from '@/data/projects'
import type { Project } from '@/types/project'

export interface GetProjectsOptions {
  signal?: AbortSignal
}

interface ProjectDataSource {
  getAll(options?: GetProjectsOptions): Promise<Project[]>
}

const localDataSource: ProjectDataSource = {
  async getAll() {
    return STATIC_PROJECTS
  },
}

const remoteDataSource: ProjectDataSource = {
  async getAll(options?: GetProjectsOptions) {
    if (!supabase) throw new Error('[ProjectService] Supabase client not initialized')

    const query = supabase
      .from('projects')
      .select('*')
      .order('order', { ascending: true })

    if (options?.signal) {
      query.abortSignal(options.signal)
    }

    const { data, error } = await query
    if (error) throw { code: error.code, message: error.message, type: 'business' as const }
    return (data as Project[]) ?? []
  },
}

const useRemote = import.meta.env.VITE_USE_REMOTE_PROJECTS === 'true' && !!supabase

const primarySource: ProjectDataSource = useRemote ? remoteDataSource : localDataSource

export async function getProjects(options?: GetProjectsOptions): Promise<Project[]> {
  const [err, data] = await tryit(primarySource.getAll.bind(primarySource))(options)

  if (err) {
    if (useRemote) {
      console.warn('[ProjectService] Remote fetch failed, falling back to local data:', err)
      return localDataSource.getAll()
    }
    throw err
  }

  return data
}
