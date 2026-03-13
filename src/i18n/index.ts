import { createI18n } from 'vue-i18n'
import zhTw from '@/i18n/locales/zh-tw'
import en from '@/i18n/locales/en'

export type Locale = 'zh-tw' | 'en'

const VALID_LOCALES: Locale[] = ['zh-tw', 'en']

function getSavedLocale(): Locale {
  if (typeof localStorage === 'undefined') return 'zh-tw'
  const saved = localStorage.getItem('locale')
  if (saved === 'zh' || saved === 'zh-TW' || saved === 'zh-Hant') return 'zh-tw'
  if (VALID_LOCALES.includes(saved as Locale)) return saved as Locale
  return 'zh-tw'
}

const i18n = createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'en',
  messages: {
    'zh-tw': zhTw,
    en,
  },
})

export default i18n
