import { defineStore } from 'pinia'
import { useColorMode } from '@vueuse/core'

export const useUiStore = defineStore('ui', () => {
  const mode = useColorMode({
    selector: 'html',
    attribute: 'class',
    modes: {
      light: '',
      dark: 'dark',
    },
  })

  return {
    mode,
  }
})
