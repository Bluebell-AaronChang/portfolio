import { createI18n } from 'vue-i18n'
import zhTw from '@/i18n/locales/zh-tw'
import en from '@/i18n/locales/en'

export type Locale = 'zh-tw' | 'en'

const savedLocale = (typeof localStorage !== 'undefined' && localStorage.getItem('locale')) as Locale | null

const i18n = createI18n({
  legacy: false,
  locale: savedLocale || 'zh-tw',
  fallbackLocale: 'en',
  messages: {
    'zh-tw': zhTw,
    en,
  },
})

export default i18n
