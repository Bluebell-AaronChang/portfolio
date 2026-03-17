import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const mode = ref('dark' as const)

  return {
    mode,
  }
})
