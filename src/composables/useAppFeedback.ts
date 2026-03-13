import { ref, computed, reactive } from 'vue'
import { uid } from 'radashi'
import { parseError } from '@/lib/parseError'

export interface Toast {
  id: string
  title?: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

const toasts = ref<Toast[]>([])
const loadingCount = ref(0)
const isLoading = computed(() => loadingCount.value > 0)

export interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive' | 'outline' | 'ghost'
}

interface ConfirmState extends Required<ConfirmOptions> {
  isOpen: boolean
}

export const confirmState = reactive<ConfirmState>({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'default',
})

let _resolve: ((value: boolean) => void) | null = null

export function resolveConfirm(value: boolean) {
  confirmState.isOpen = false
  _resolve?.(value)
  _resolve = null
}

function addToast(message: string, type: Toast['type'], title?: string, duration = 4000) {
  const id = uid(8)
  toasts.value.push({ id, message, type, title })
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }, duration)
}

export function useAppFeedback() {
  return {
    toasts,
    isLoading,

    success(message: string, title?: string) {
      addToast(message, 'success', title)
    },

    error(message: string, title?: string) {
      addToast(message, 'error', title)
    },

    warning(message: string, title?: string) {
      addToast(message, 'warning', title)
    },

    info(message: string, title?: string) {
      addToast(message, 'info', title)
    },
    showError(err: unknown, fallbackTitle?: string) {
      const appError = parseError(err)
      if (appError.type === 'cancelled') return
      const title = fallbackTitle ?? (
        appError.type === 'auth' ? '身份驗證錯誤' :
          appError.type === 'validation' ? '資料驗證失敗' :
            appError.type === 'network' ? '網路連線錯誤' : '操作失敗'
      )
      addToast(appError.message, 'error', title)
    },

    showLoading() {
      loadingCount.value++
    },

    hideLoading() {
      if (loadingCount.value > 0) loadingCount.value--
    },

    async withLoading<T>(fn: () => Promise<T>): Promise<T> {
      loadingCount.value++
      try {
        return await fn()
      } finally {
        loadingCount.value--
      }
    },

    confirm(options: ConfirmOptions): Promise<boolean> {
      confirmState.isOpen = true
      confirmState.title = options.title
      confirmState.message = options.message
      confirmState.confirmText = options.confirmText ?? 'Confirm'
      confirmState.cancelText = options.cancelText ?? 'Cancel'
      confirmState.variant = options.variant ?? 'default'
      return new Promise<boolean>((resolve) => {
        _resolve = resolve
      })
    },
  }
}
