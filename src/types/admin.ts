export interface AdminUser {
  id: string
  email: string
  created_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  user?: AdminUser
  error?: string
}

export interface AuthState {
  user: AdminUser | null
  isAuthenticated: boolean
}

export interface TechCategory {
  id: string
  name: string
  display_order: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category_id: string | null
  icon_url: string | null
  display_order: number
  created_at: string
  updated_at: string
  category?: TechCategory
}

export interface SkillFormData {
  name: string
  category_id: string | null
  icon_url: string | null
  display_order: number
}

export interface TechCategoryFormData {
  name: string
  display_order: number
}
