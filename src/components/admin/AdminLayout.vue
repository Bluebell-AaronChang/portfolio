<template>
    <div class="min-h-screen bg-background">
        <!-- Sidebar -->
        <aside class="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-background">
            <div class="flex h-full flex-col">
                <!-- Header -->
                <div class="flex h-16 items-center justify-between border-b border-border px-6">
                    <h1 class="text-xl font-bold tracking-tight">Admin Panel</h1>
                    <ModeToggle />
                </div>

                <!-- Navigation -->
                <nav class="flex-1 overflow-y-auto p-4">
                    <ul class="space-y-1">
                        <li>
                            <router-link to="/admin/projects"
                                class="flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
                                active-class="bg-accent text-foreground font-semibold">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <span>Projects</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/admin/skills"
                                class="flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
                                active-class="bg-accent text-foreground font-semibold">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                <span>Skills</span>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/admin/notes"
                                class="flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
                                active-class="bg-accent text-foreground font-semibold">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Notes</span>
                            </router-link>
                        </li>
                    </ul>
                </nav>

                <!-- User Info & Logout -->
                <div class="border-t border-border p-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div>
                                <p class="text-sm font-medium">{{ authStore.user?.email }}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" @click="handleLogout" title="Logout">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="ml-64">
            <!-- Top Bar -->
            <header class="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur-md">
                <div class="flex h-full items-center justify-between px-6">
                    <h2 class="text-lg font-semibold">{{ pageTitle }}</h2>
                    <Button variant="ghost" size="sm" as-child>
                        <router-link to="/" target="_blank" class="flex items-center gap-2">
                            <span>View Site</span>
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </router-link>
                    </Button>
                </div>
            </header>

            <!-- Page Content -->
            <main class="p-6">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import ModeToggle from '@/components/ui/ModeToggle.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const pageTitle = computed(() => {
    const routeName = route.name as string
    const titles: Record<string, string> = {
        AdminProjects: 'Projects Management',
        AdminSkills: 'Skills Management',
        AdminNotes: 'Notes Management',
    }
    return titles[routeName] || 'Admin Panel'
})

function handleLogout() {
    authStore.logout()
    router.push('/admin/login')
}
</script>