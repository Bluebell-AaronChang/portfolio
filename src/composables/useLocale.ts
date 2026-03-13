import { computed, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Locale } from '@/i18n'

const LOCALE_HTML_LANG_MAP: Record<Locale, string> = {
  'zh-tw': 'zh-Hant-TW',
  en: 'en',
}

export function useLocale() {
  const { locale } = useI18n({ useScope: 'global' })

  const currentLocale = computed(() => locale.value as Locale)

  watchEffect(() => {
    const htmlLang = LOCALE_HTML_LANG_MAP[currentLocale.value] ?? 'zh-Hant-TW'
    if (typeof document !== 'undefined') {
      document.documentElement.lang = htmlLang
    }
  })

  function setLocale(value: Locale) {
    locale.value = value
    localStorage.setItem('locale', value)
  }

  function toggleLocale() {
    setLocale(currentLocale.value === 'zh-tw' ? 'en' : 'zh-tw')
  }

  return {
    currentLocale,
    setLocale,
    toggleLocale,
  }
}
