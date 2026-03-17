<template>
    <div class="min-h-screen flex items-center justify-center bg-background px-4">
        <div class="w-full max-w-md">
            <Card>
                <CardHeader class="text-center">
                    <CardTitle class="text-3xl">Admin Login</CardTitle>
                    <CardDescription>Enter your credentials to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="handleLogin" class="space-y-6">
                        <!-- Email -->
                        <div class="space-y-2">
                            <Label for="email">Email</Label>
                            <Input id="email" v-model="credentials.email" type="email" required autocomplete="email"
                                placeholder="Enter your email" :disabled="isLockedOut" />
                        </div>

                        <!-- Password -->
                        <div class="space-y-2">
                            <Label for="password">Password</Label>
                            <Input id="password" v-model="credentials.password" type="password" required
                                autocomplete="current-password" placeholder="Enter your password"
                                :disabled="isLockedOut" />
                        </div>

                        <!-- Lockout Message -->
                        <div v-if="isLockedOut" class="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <p class="text-sm text-destructive font-medium">
                                Too many failed attempts. Please try again in
                                <span class="font-bold">{{ lockoutCountdown }}</span>.
                            </p>
                        </div>

                        <!-- Error Message -->
                        <div v-else-if="authStore.error"
                            class="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                            <p class="text-sm text-destructive">
                                {{ authStore.error }}
                                <span v-if="failedAttempts > 0" class="block mt-1 text-xs opacity-75">
                                    Failed attempts: {{ failedAttempts }} / {{ MAX_ATTEMPTS }}
                                </span>
                            </p>
                        </div>

                        <!-- Submit Button -->
                        <Button type="submit" :disabled="authStore.isLoading || isLockedOut" class="w-full">
                            <span v-if="!authStore.isLoading">Sign In</span>
                            <span v-else class="flex items-center gap-2">
                                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4" fill="none" />
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Signing in...
                            </span>
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <!-- Back to Home -->
            <div class="text-center mt-6">
                <Button variant="link" as-child>
                    <RouterLink to="/">
                        ← Back to Home
                    </RouterLink>
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onUnmounted } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const credentials = reactive({ email: '', password: '' })

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000 // 15 minutes

const failedAttempts = ref(0)
const lockoutUntil = ref<number | null>(null)
const remainingSeconds = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

const isLockedOut = computed(() => {
    if (!lockoutUntil.value) return false
    return Date.now() < lockoutUntil.value
})

const lockoutCountdown = computed(() => {
    const m = Math.floor(remainingSeconds.value / 60)
    const s = remainingSeconds.value % 60
    return m > 0 ? `${m}m ${s}s` : `${s}s`
})

function startCountdown() {
    if (countdownTimer) clearInterval(countdownTimer)
    remainingSeconds.value = Math.ceil((lockoutUntil.value! - Date.now()) / 1000)
    countdownTimer = setInterval(() => {
        remainingSeconds.value = Math.ceil((lockoutUntil.value! - Date.now()) / 1000)
        if (remainingSeconds.value <= 0) {
            clearInterval(countdownTimer!)
            lockoutUntil.value = null
            failedAttempts.value = 0
        }
    }, 1000)
}

async function handleLogin() {
    if (isLockedOut.value) return

    const success = await authStore.login(credentials)

    if (success) {
        failedAttempts.value = 0
        const redirect = route.query.redirect as string || '/admin/projects'
        router.push(redirect)
    } else {
        failedAttempts.value++
        credentials.password = '' // Clear password on failure

        if (failedAttempts.value >= MAX_ATTEMPTS) {
            lockoutUntil.value = Date.now() + LOCKOUT_MS
            startCountdown()
        }
    }
}

onUnmounted(() => {
    if (countdownTimer) clearInterval(countdownTimer)
})
</script>
