import { tryit } from 'radashi'
import { supabase } from '@/api/supabase'
import type { Project } from '@/types/project'

export interface GetProjectsOptions {
  signal?: AbortSignal
}

export interface CreateProjectDto {
  title_zh: string
  title_en: string
  description_zh?: string
  description_en?: string
  contribution_zh?: string
  contribution_en?: string
  image?: string
  skill_ids?: string[]
  github_url?: string
  live_url?: string
  status: 'completed' | 'in-progress' | 'planned'
  project_type: string
  featured?: boolean
  enabled?: boolean
  order?: number
  start_date?: string
  end_date?: string
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> { }

const PROJECTS_SELECT = [
  'id',
  'title_zh', 'title_en',
  'description_zh', 'description_en',
  'contribution_zh', 'contribution_en',
  'image', 'skill_ids',
  'github_url', 'live_url',
  'status', 'project_type', 'featured', 'enabled',
  '"order"',
  'start_date', 'end_date',
  'created_at', 'updated_at',
].join(', ')

export async function getProjects(options?: GetProjectsOptions): Promise<Project[]> {
  if (!supabase) throw new Error('[ProjectService] Supabase client not initialized')

  const query = supabase
    .from('projects')
    .select(PROJECTS_SELECT)
    .eq('enabled', true)
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

export async function getAllProjects(options?: GetProjectsOptions): Promise<Project[]> {
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
    console.error('[ProjectService] Failed to fetch all projects:', err)
    throw err
  }

  return result
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (!supabase) throw new Error('[ProjectService] Supabase client not initialized')

  const { data, error } = await supabase
    .from('projects')
    .select(PROJECTS_SELECT)
    .eq('id', id)
    .single()

  if (error) throw error
  return data as unknown as Project
}

export async function createProject(project: CreateProjectDto): Promise<Project> {
  if (!supabase) throw new Error('[ProjectService] Supabase client not initialized')

  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select(PROJECTS_SELECT)
    .single()

  if (error) throw error
  return data as unknown as Project
}

export async function updateProject(id: string, project: UpdateProjectDto): Promise<Project> {
  if (!supabase) throw new Error('[ProjectService] Supabase client not initialized')

  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id)
    .select(PROJECTS_SELECT)
    .single()

  if (error) throw error
  return data as unknown as Project
}

export async function deleteProject(id: string): Promise<void> {
  if (!supabase) throw new Error('[ProjectService] Supabase client not initialized')

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function toggleEnabled(id: string): Promise<Project> {
  if (!supabase) throw new Error('[ProjectService] Supabase client not initialized')

  const { data: current, error: fetchError } = await supabase
    .from('projects')
    .select('enabled')
    .eq('id', id)
    .single()

  if (fetchError) throw fetchError

  const { data, error } = await supabase
    .from('projects')
    .update({ enabled: !(current as { enabled: boolean }).enabled })
    .eq('id', id)
    .select(PROJECTS_SELECT)
    .single()

  if (error) throw error
  return data as unknown as Project
}

export const projectService = {
  getProjects,
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleEnabled,
}
