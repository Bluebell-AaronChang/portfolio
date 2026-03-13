import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/api/supabase'
import { authService } from '@/services/authService'
import type { AdminUser, LoginCredentials } from '@/types'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<AdminUser | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const isAuthenticated = computed(() => !!user.value)

    supabase?.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
            user.value = {
                id: session.user.id,
                email: session.user.email ?? '',
                created_at: session.user.created_at,
            }
        } else {
            user.value = null
        }
    })

    async function init() {
        const currentUser = await authService.getCurrentUser()
        user.value = currentUser
    }

    async function login(credentials: LoginCredentials) {
        isLoading.value = true
        error.value = null

        try {
            const result = await authService.login(credentials)

            if (result.success && result.user) {
                user.value = result.user
                return true
            } else {
                error.value = result.error || 'Login failed'
                return false
            }
        } catch (e) {
            error.value = 'An error occurred during login'
            console.error('Login error:', e)
            return false
        } finally {
            isLoading.value = false
        }
    }

    async function logout() {
        await authService.logout()
        user.value = null
        error.value = null
    }

    function clearError() {
        error.value = null
    }

    return {
        user,
        isLoading,
        error,
        isAuthenticated,
        init,
        login,
        logout,
        clearError,
    }
})
