<script setup lang="ts">
import { useAppFeedback } from '@/composables/useAppFeedback'
import { cn } from '@/lib/utils'

const { toasts } = useAppFeedback()
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
      <TransitionGroup name="toast">
        <div v-for="toast in toasts" :key="toast.id" :class="cn(
          'rounded-lg px-4 py-3 text-sm shadow-lg border',
          {
            'bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100': toast.type === 'success',
            'bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100': toast.type === 'error',
            'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100': toast.type === 'info',
            'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100': toast.type === 'warning',
          },
        )
          ">
          <p v-if="toast.title" class="font-semibold mb-0.5">{{ toast.title }}</p>
          <p class="leading-snug">{{ toast.message }}</p>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
