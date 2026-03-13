import { supabase } from '@/api/supabase'
import type { LoginCredentials, LoginResponse, AdminUser } from '@/types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      if (!supabase) throw new Error('Supabase client not initialized')

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) return { success: false, error: error.message }

      const user: AdminUser = {
        id: data.user.id,
        email: data.user.email ?? '',
        created_at: data.user.created_at,
      }

      return { success: true, user }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed' }
    }
  },

  async logout(): Promise<void> {
    if (!supabase) return
    await supabase.auth.signOut()
  },

  async isAuthenticated(): Promise<boolean> {
    if (!supabase) return false
    const { data } = await supabase.auth.getSession()
    return !!data.session
  },

  async getCurrentUser(): Promise<AdminUser | null> {
    if (!supabase) return null
    const { data } = await supabase.auth.getUser()
    if (!data.user) return null
    return {
      id: data.user.id,
      email: data.user.email ?? '',
      created_at: data.user.created_at,
    }
  },
}
