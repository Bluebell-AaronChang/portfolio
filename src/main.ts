import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient, QueryCache, MutationCache } from '@tanstack/vue-query'
import router from '@/router'
import i18n from '@/i18n'
import { useAppFeedback } from '@/composables/useAppFeedback'
import { parseError } from '@/lib/parseError'
import { useAuthStore } from '@/stores/authStore'
import App from './App.vue'
import '@/styles/main.css'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError(error) {
      const appError = parseError(error)
      if (appError.type === 'cancelled') return
      const feedback = useAppFeedback()
      feedback.showError(appError)
    },
  }),
  mutationCache: new MutationCache({
    onError(error) {
      const appError = parseError(error)
      if (appError.type === 'cancelled') return
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const appError = parseError(error)
        if (appError.type === 'auth' || appError.type === 'cancelled') return false
        return failureCount < 1
      },
      refetchOnWindowFocus: false,
    },
  },
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(VueQueryPlugin, { queryClient })

const authStore = useAuthStore()
authStore.init().then(() => {
  app.mount('#app')
})
