export interface Project {
  id: string
  title_zh: string
  title_en: string
  description_zh: string
  description_en: string
  contribution_zh: string
  contribution_en: string
  image?: string | null
  tags: string[]
  github_url?: string | null
  live_url?: string | null
  status: 'active' | 'completed' | 'archived' | 'in-progress'
  featured: boolean
  order: number
  start_date?: string | null
  end_date?: string | null
  created_at: string
  updated_at: string
}

export type ProjectLocale = 'zh-tw' | 'en'

/** 依據 locale 取得專案名稱 */
export function getProjectTitle(p: Project, locale: ProjectLocale): string {
  return locale === 'zh-tw' ? p.title_zh : p.title_en
}

/** 依據 locale 取得專案描述 */
export function getProjectDescription(p: Project, locale: ProjectLocale): string {
  return locale === 'zh-tw' ? p.description_zh : p.description_en
}

/** 依據 locale 取得專案貢獻 */
export function getProjectContribution(p: Project, locale: ProjectLocale): string {
  return locale === 'zh-tw' ? p.contribution_zh : p.contribution_en
}

/** 取得專案技術標籤 */
export function getProjectTags(p: Project): string[] {
  return p.tags ?? []
}
