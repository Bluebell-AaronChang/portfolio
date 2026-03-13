<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindowScroll } from '@vueuse/core'
import { useUiStore } from '@/stores/uiStore'
import { useLocale } from '@/composables/useLocale'
import AppButton from '@/components/ui/AppButton.vue'

const { t } = useI18n()
const uiStore = useUiStore()
const { currentLocale, toggleLocale } = useLocale()

const NAV_KEYS = [
  { key: 'nav-home', href: '#home' },
  { key: 'nav-about', href: '#about' },
  { key: 'nav-projects', href: '#projects' },
  { key: 'nav-skills', href: '#skills' },
  { key: 'nav-mindset', href: '#mindset' },
  { key: 'nav-contact', href: '#contact' },
]

const { y: scrollY } = useWindowScroll()
const isScrolled = computed(() => scrollY.value > 20)
const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function toggleDarkMode() {
  uiStore.setDarkMode(!uiStore.isDarkMode)
}

const localeLabel = computed(() => (currentLocale.value === 'zh-tw' ? 'EN' : '中'))
</script>

<template>
  <nav
    aria-label="Main navigation"
    :class="[
      'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
      isScrolled
        ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm'
        : 'bg-transparent',
    ]"
  >
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <a href="#home" class="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
          Aaron Chang
        </a>

        <div class="hidden md:flex items-center gap-1">
          <a
            v-for="nav in NAV_KEYS"
            :key="nav.href"
            :href="nav.href"
            class="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
          >
            {{ t(nav.key) }}
          </a>
          <button
            class="ml-3 p-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent cursor-pointer"
            :aria-label="t('nav-toggle-locale')"
            @click="toggleLocale"
          >
            {{ localeLabel }}
          </button>
          <button
            class="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent cursor-pointer"
            :aria-label="t('nav-toggle-dark-mode')"
            @click="toggleDarkMode"
          >
            <svg v-if="!uiStore.isDarkMode" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          </button>
        </div>

        <div class="md:hidden flex items-center gap-2">
          <button
            class="p-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent cursor-pointer"
            :aria-label="t('nav-toggle-locale')"
            @click="toggleLocale"
          >
            {{ localeLabel }}
          </button>
          <button
            class="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent cursor-pointer"
            :aria-label="t('nav-toggle-dark-mode')"
            @click="toggleDarkMode"
          >
            <svg v-if="!uiStore.isDarkMode" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          </button>
          <AppButton variant="ghost" size="sm" @click="toggleMobileMenu">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line v-if="!isMobileMenuOpen" x1="3" y1="6" x2="21" y2="6" />
              <line v-if="!isMobileMenuOpen" x1="3" y1="12" x2="21" y2="12" />
              <line v-if="!isMobileMenuOpen" x1="3" y1="18" x2="21" y2="18" />
              <line v-if="isMobileMenuOpen" x1="18" y1="6" x2="6" y2="18" />
              <line v-if="isMobileMenuOpen" x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </AppButton>
        </div>
      </div>
    </div>

    <Transition name="slide">
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden border-t border-border bg-background/95 backdrop-blur-md"
      >
        <div class="px-4 py-4 space-y-1">
          <a
            v-for="nav in NAV_KEYS"
            :key="nav.href"
            :href="nav.href"
            class="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
            @click="closeMobileMenu"
          >
            {{ t(nav.key) }}
          </a>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
