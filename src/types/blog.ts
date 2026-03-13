export interface BlogPost {
  id: string
  slug: string
  title_zh: string
  title_en: string
  summary_zh: string
  summary_en: string
  content_zh: string
  content_en: string
  cover_image?: string | null
  tags: string[]
  published: boolean
  status: 'published' | 'draft' | 'archived'
  featured: boolean
  view_count: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export type NoteLocale = 'zh-tw' | 'en'

export function getNoteTitle(post: BlogPost, locale: NoteLocale): string {
  return locale === 'zh-tw' ? post.title_zh : post.title_en
}

export function getNoteSummary(post: BlogPost, locale: NoteLocale): string {
  return locale === 'zh-tw' ? post.summary_zh : post.summary_en
}

export function getNoteContent(post: BlogPost, locale: NoteLocale): string {
  return locale === 'zh-tw' ? post.content_zh : post.content_en
}

export function getNoteTags(post: BlogPost): string[] {
  return post.tags ?? []
}
