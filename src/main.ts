import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import router from '@/router'
import i18n from '@/i18n'
import { useAppFeedback } from '@/composables/useAppFeedback'
import App from './App.vue'
import '@/styles/main.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

queryClient.getQueryCache().config.onError = (error) => {
  const feedback = useAppFeedback()
  const message = (error as { message?: string })?.message ?? i18n.global.t('error-unknown')
  feedback.error(message)
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')
