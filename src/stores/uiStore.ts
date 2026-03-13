import { defineStore } from 'pinia'
import { useDark } from '@vueuse/core'

export const useUiStore = defineStore('ui', () => {
  const isDarkMode = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
  })

  function setDarkMode(value: boolean) {
    isDarkMode.value = value
  }

  return {
    isDarkMode,
    setDarkMode,
  }
})
