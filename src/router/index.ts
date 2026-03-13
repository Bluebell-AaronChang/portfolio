import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { supabase } from '@/api/supabase'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/notes',
    name: 'Notes',
    component: () => import('@/pages/NotesPage.vue'),
  },
  {
    path: '/notes/:slug',
    name: 'NoteDetail',
    component: () => import('@/pages/NoteDetailPage.vue'),
    props: true,
  },
  {
    path: '/admin',
    redirect: '/admin/projects',
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/pages/admin/AdminLoginPage.vue'),
  },
  {
    path: '/admin/projects',
    name: 'AdminProjects',
    component: () => import('@/pages/admin/AdminProjectsPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/skills',
    name: 'AdminSkills',
    component: () => import('@/pages/admin/AdminSkillsPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/notes',
    name: 'AdminNotes',
    component: () => import('@/pages/admin/AdminNotesPage.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach(async (to, _from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  const { data } = await supabase?.auth.getSession() ?? { data: { session: null } }
  const isAuthenticated = !!data.session

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'AdminLogin', query: { redirect: to.fullPath } })
  } else if (to.name === 'AdminLogin' && isAuthenticated) {
    next({ name: 'AdminProjects' })
  } else {
    next()
  }
})

export default router
