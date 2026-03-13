import { ref } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

const toasts = ref<Toast[]>([])
let toastId = 0

function addToast(message: string, type: Toast['type'], duration = 3000) {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, duration)
}

const isLoading = ref(false)

export function useAppFeedback() {
  return {
    toasts,
    isLoading,
    success(message: string) {
      addToast(message, 'success')
    },
    error(message: string) {
      addToast(message, 'error')
    },
    info(message: string) {
      addToast(message, 'info')
    },
    showLoading() {
      isLoading.value = true
    },
    hideLoading() {
      isLoading.value = false
    },
  }
}
