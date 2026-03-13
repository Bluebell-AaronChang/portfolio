<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindowSize } from '@vueuse/core'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppTag from '@/components/ui/AppTag.vue'
import { useProjectsQuery } from '@/queries/projectQueries'

const { t } = useI18n()
const { data: projects, isLoading, isError } = useProjectsQuery()

const trackRef = ref<HTMLElement | null>(null)
const currentPage = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

const { width: windowWidth } = useWindowSize()

const visibleCount = computed(() => {
  if (windowWidth.value < 640) return 1
  if (windowWidth.value < 1024) return 2
  return 3
})

const totalPages = computed(() => {
  if (!projects.value) return 0
  return Math.max(0, projects.value.length - visibleCount.value + 1)
})

function scrollToPage(page: number) {
  const track = trackRef.value
  if (!track) return
  const clamped = Math.max(0, Math.min(page, totalPages.value - 1))
  currentPage.value = clamped
  const card = track.children[0] as HTMLElement | undefined
  if (!card) return
  const gap = 24
  const cardWidth = card.offsetWidth + gap
  track.scrollTo({ left: clamped * cardWidth, behavior: 'smooth' })
}

function prev() { scrollToPage(currentPage.value - 1) }
function next() { scrollToPage(currentPage.value + 1) }

function onPointerDown(e: PointerEvent) {
  const track = trackRef.value
  if (!track) return
  isDragging.value = true
  startX.value = e.pageX - track.offsetLeft
  scrollLeft.value = track.scrollLeft
  track.setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value) return
  const track = trackRef.value
  if (!track) return
  e.preventDefault()
  const x = e.pageX - track.offsetLeft
  const walk = (x - startX.value) * 1.2
  track.scrollLeft = scrollLeft.value - walk
}

function onPointerUp() {
  isDragging.value = false
  syncPageFromScroll()
}

function syncPageFromScroll() {
  const track = trackRef.value
  if (!track) return
  const card = track.children[0] as HTMLElement | undefined
  if (!card) return
  const gap = 24
  const cardWidth = card.offsetWidth + gap
  currentPage.value = Math.round(track.scrollLeft / cardWidth)
}

let scrollTimeout: ReturnType<typeof setTimeout> | null = null
function onScroll() {
  if (isDragging.value) return
  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(syncPageFromScroll, 80)
}
</script>

<template>
  <section id="projects" :aria-label="t('projects-title')" class="py-24 bg-muted/30">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <SectionTitle
        :title="t('projects-title')"
        :subtitle="t('projects-subtitle')"
      />

      <div v-if="isLoading" class="flex gap-6">
        <div
          v-for="i in 3"
          :key="i"
          class="h-64 min-w-[calc(33.333%-16px)] rounded-lg bg-muted animate-pulse"
        />
      </div>

      <div v-else-if="isError" class="text-center py-12">
        <p class="text-muted-foreground">{{ t('projects-error') }}</p>
      </div>

      <div v-else class="relative">
        <div
          ref="trackRef"
          class="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 carousel-track"
          :class="{ 'cursor-grabbing': isDragging, 'cursor-grab': !isDragging }"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @scroll="onScroll"
        >
          <AppCard
            v-for="project in projects"
            :key="project.id"
            class="snap-start shrink-0 p-6 flex flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1 select-none"
            :class="{
              'w-full': visibleCount === 1,
              'w-[calc(50%-12px)]': visibleCount === 2,
              'w-[calc(33.333%-16px)]': visibleCount === 3,
            }"
          >
            <h3 class="text-lg font-semibold mb-2">{{ project.i18n_key ? t(`${project.i18n_key}-name`) : project.name }}</h3>
            <p class="text-sm text-muted-foreground mb-4 flex-1">
              {{ project.i18n_key ? t(`${project.i18n_key}-desc`) : project.description }}
            </p>
            <div class="mb-4">
              <p class="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                {{ t('projects-contribution-label') }}
              </p>
              <p class="text-sm text-muted-foreground">{{ project.i18n_key ? t(`${project.i18n_key}-contribution`) : project.contribution }}</p>
            </div>
            <div class="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-border">
              <AppTag v-for="tech in project.tech_stack" :key="tech" variant="outline">
                {{ tech }}
              </AppTag>
            </div>
          </AppCard>
        </div>

        <button
          v-show="currentPage > 0"
          class="absolute -left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border shadow-md hover:bg-accent transition-colors cursor-pointer"
          :aria-label="t('projects-prev')"
          @click="prev"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button
          v-show="currentPage < totalPages - 1"
          class="absolute -right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border shadow-md hover:bg-accent transition-colors cursor-pointer"
          :aria-label="t('projects-next')"
          @click="next"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-6">
          <button
            v-for="page in totalPages"
            :key="page"
            class="h-2 rounded-full transition-all duration-300 cursor-pointer"
            :class="
              currentPage === page - 1
                ? 'w-6 bg-foreground'
                : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            "
            :aria-label="t('projects-go-to-page', { page })"
            @click="scrollToPage(page - 1)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.carousel-track {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.carousel-track::-webkit-scrollbar {
  display: none;
}
</style>
