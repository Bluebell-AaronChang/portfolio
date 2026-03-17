<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, RouterLink } from 'vue-router'
import { useWindowScroll, useWindowSize } from '@vueuse/core'
import { useLocale } from '@/composables/useLocale'
import AppButton from '@/components/ui/AppButton.vue'

const { t } = useI18n()
const route = useRoute()
const { currentLocale, toggleLocale } = useLocale()

const SECTION_NAV_KEYS = [
  { key: 'nav-home', href: '#home' },
  { key: 'nav-about', href: '#about' },
  { key: 'nav-projects', href: '#projects' },
  { key: 'nav-skills', href: '#skills' },
  { key: 'nav-mindset', href: '#mindset' },
  { key: 'nav-contact', href: '#contact' },
]

const ROUTE_NAV_KEYS = [
  { key: 'nav-notes', to: '/notes' },
]

const isHomePage = computed(() => route.path === '/')

const { y: scrollY } = useWindowScroll()
const { height: windowHeight } = useWindowSize()
const isScrolled = computed(() => scrollY.value > 20)
const isMobileMenuOpen = ref(false)

const activeSection = ref('home')
const sectionIds = SECTION_NAV_KEYS.map((n) => n.href.slice(1))

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

function handleNavClick(event: Event, href: string) {
  event.preventDefault()
  const id = href.slice(1)
  activeSection.value = id
  scrollToSection(id)
  history.replaceState(null, '', href)
}

function updateActiveByScroll() {
  if (!isHomePage.value) return

  const offset = 100
  const scrollPosition = scrollY.value
  const viewportHeight = windowHeight.value

  const body = document.body
  const html = document.documentElement
  const documentHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  )

  // Only treat as "at bottom" when the user has actually scrolled down
  const atBottom =
    scrollPosition > 0 &&
    Math.abs((viewportHeight + scrollPosition) - documentHeight) < 2

  if (atBottom) {
    const last = sectionIds[sectionIds.length - 1]
    if (last !== activeSection.value) {
      activeSection.value = last
      history.replaceState(null, '', `#${last}`)
    }
    return
  }

  let current = sectionIds[0]

  for (const id of sectionIds) {
    const el = document.querySelector(`#${id}`)
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.top <= offset) {
        current = id
      }
    }
  }

  if (current !== activeSection.value) {
    activeSection.value = current
    history.replaceState(null, '', `#${current}`)
  }
}

watch(scrollY, updateActiveByScroll)

onMounted(() => {
  if (!isHomePage.value) return
  const hash = route.hash.slice(1)
  if (hash && sectionIds.includes(hash)) {
    activeSection.value = hash
  } else {
    updateActiveByScroll()
  }
})

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

const localeLabel = computed(() => (currentLocale.value === 'zh-tw' ? 'EN' : '中'))
</script>

<template>
  <nav aria-label="Main navigation" :class="[
    'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
    isScrolled
      ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm'
      : 'bg-transparent',
  ]">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <RouterLink to="/" class="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
          Aaron Chang
        </RouterLink>

        <div class="hidden md:flex items-center gap-1">
          <template v-if="isHomePage">
            <a v-for="nav in SECTION_NAV_KEYS" :key="nav.href" :href="nav.href"
              class="px-3 py-2 text-sm transition-colors rounded-md" :class="activeSection === nav.href.slice(1)
                ? 'text-foreground font-semibold bg-accent'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'"
              @click="handleNavClick($event, nav.href)">
              {{ t(nav.key) }}
            </a>
          </template>
          <template v-else>
            <RouterLink to="/"
              class="px-3 py-2 text-sm transition-colors rounded-md text-muted-foreground hover:text-foreground hover:bg-accent">
              {{ t('nav-home') }}
            </RouterLink>
          </template>
          <RouterLink v-for="nav in ROUTE_NAV_KEYS" :key="nav.to" :to="nav.to"
            class="px-3 py-2 text-sm transition-colors rounded-md" :class="route.path.startsWith(nav.to)
              ? 'text-foreground font-semibold bg-accent'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'">
            {{ t(nav.key) }}
          </RouterLink>
          <button
            class="ml-3 p-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent cursor-pointer"
            :aria-label="t('nav-toggle-locale')" @click="toggleLocale">
            {{ localeLabel }}
          </button>
        </div>

        <div class="md:hidden flex items-center gap-2">
          <button
            class="p-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent cursor-pointer"
            :aria-label="t('nav-toggle-locale')" @click="toggleLocale">
            {{ localeLabel }}
          </button>
          <AppButton variant="ghost" size="sm" @click="toggleMobileMenu">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
        <div class="px-4 py-4 space-y-1">
          <template v-if="isHomePage">
            <a v-for="nav in SECTION_NAV_KEYS" :key="nav.href" :href="nav.href"
              class="block px-3 py-2 text-sm transition-colors rounded-md" :class="activeSection === nav.href.slice(1)
                ? 'text-foreground font-semibold bg-accent'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'"
              @click="handleNavClick($event, nav.href); closeMobileMenu()">
              {{ t(nav.key) }}
            </a>
          </template>
          <template v-else>
            <RouterLink to="/"
              class="block px-3 py-2 text-sm transition-colors rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
              @click="closeMobileMenu()">
              {{ t('nav-home') }}
            </RouterLink>
          </template>
          <RouterLink v-for="nav in ROUTE_NAV_KEYS" :key="nav.to" :to="nav.to"
            class="block px-3 py-2 text-sm transition-colors rounded-md" :class="route.path.startsWith(nav.to)
              ? 'text-foreground font-semibold bg-accent'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'" @click="closeMobileMenu()">
            {{ t(nav.key) }}
          </RouterLink>
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
