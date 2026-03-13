<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppTag from '@/components/ui/AppTag.vue'
import { useProjectsQuery } from '@/queries/projectQueries'
import { getAllCategories, getTechCategory } from '@/data/techCategories'
import { getProjectTags, getProjectTitle, getProjectDescription, getProjectContribution } from '@/types/project'
import type { ProjectLocale } from '@/types/project'

const { t, locale } = useI18n()
const currentLocale = computed(() => locale.value as ProjectLocale)
const { data: projects, isLoading, isError } = useProjectsQuery()

const categories = getAllCategories()
const activeFilter = ref('All')
const gridVisible = ref(true)

function setFilter(cat: string) {
  if (cat === activeFilter.value) return
  expandedId.value = null

  gridVisible.value = false

  setTimeout(() => {
    activeFilter.value = cat
    showCount.value = INITIAL_SHOW
    nextTick(() => {
      gridVisible.value = true
    })
  }, 200)
}

const filteredProjects = computed(() => {
  if (!projects.value) return []
  if (activeFilter.value === 'All') return projects.value
  return projects.value.filter((p) =>
    getProjectTags(p).some((tech) => getTechCategory(tech) === activeFilter.value),
  )
})

const INITIAL_SHOW = 6
const showCount = ref(INITIAL_SHOW)

const visibleProjects = computed(() =>
  filteredProjects.value.slice(0, showCount.value),
)

const hasMore = computed(() => showCount.value < filteredProjects.value.length)

function showMore() {
  showCount.value = Math.min(showCount.value + 6, filteredProjects.value.length)
}

function showLess() {
  showCount.value = INITIAL_SHOW
  expandedId.value = null
}

const expandedId = ref<string | null>(null)

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

const isMounted = ref(false)
onMounted(() => {
  requestAnimationFrame(() => {
    isMounted.value = true
  })
})

function onMouseMove(e: MouseEvent) {
  const card = (e.currentTarget as HTMLElement)
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const rotateX = ((y - centerY) / centerY) * -6
  const rotateY = ((x - centerX) / centerX) * 6
  card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
}

function onMouseLeave(e: MouseEvent) {
  const card = (e.currentTarget as HTMLElement)
  card.style.transform = ''
}
</script>

<template>
  <section id="projects" :aria-label="t('projects-title')" class="py-24 bg-muted/30">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <SectionTitle
        :title="t('projects-title')"
        :subtitle="t('projects-subtitle')"
      />

      <!-- Filter chip bar -->
      <div class="flex flex-wrap justify-center gap-2 mb-10">
        <button
          v-for="cat in categories"
          :key="cat"
          class="filter-chip"
          :class="activeFilter === cat ? 'filter-chip--active' : 'filter-chip--inactive'"
          @click="setFilter(cat)"
        >
          {{ t(`projects-filter-${cat.toLowerCase().replace(/ & /g, '-')}`, cat) }}
          <span
            v-if="cat !== 'All'"
            class="ml-1 text-[10px] opacity-60"
          >({{ projects ? projects.filter(p => getProjectTags(p).some(tech => getTechCategory(tech) === cat)).length : 0 }})</span>
        </button>
      </div>

      <!-- Loading skeleton (grid) -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="i in 6"
          :key="i"
          class="h-64 rounded-lg bg-muted animate-pulse"
        />
      </div>

      <!-- Error -->
      <div v-else-if="isError" class="text-center py-12">
        <p class="text-muted-foreground">{{ t('projects-error') }}</p>
      </div>

      <!-- Empty filter result -->
      <div v-else-if="filteredProjects.length === 0" class="text-center py-16">
        <p class="text-muted-foreground text-lg">{{ t('projects-empty') }}</p>
      </div>

      <!-- Project grid -->
      <div v-else>
        <Transition name="grid-fade" mode="out-in">
          <div
            v-if="gridVisible"
            :key="activeFilter"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AppCard
              v-for="(project, index) in visibleProjects"
              :key="project.id"
              class="project-card group p-6 flex flex-col cursor-pointer select-none"
              :style="{ '--stagger': `${index * 60}ms` }"
              :class="{ 'is-mounted': isMounted }"
              @click="toggleExpand(project.id)"
              @mousemove="onMouseMove"
              @mouseleave="onMouseLeave"
            >
            <!-- Glow overlay -->
            <div class="glow-overlay" />

            <!-- Header -->
            <div class="flex items-start justify-between mb-2">
              <h3 class="text-lg font-semibold leading-snug pr-2">
                {{ getProjectTitle(project, currentLocale) }}
              </h3>
              <svg
                class="shrink-0 w-4 h-4 mt-1 text-muted-foreground transition-transform duration-300"
                :class="{ 'rotate-180': expandedId === project.id }"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            <!-- Description -->
            <p
              class="text-sm text-muted-foreground mb-4"
              :class="expandedId === project.id ? '' : 'line-clamp-3'"
            >
              {{ getProjectDescription(project, currentLocale) }}
            </p>

            <!-- Expanded: Contribution -->
            <Transition name="expand">
              <div v-if="expandedId === project.id" class="mb-4">
                <p class="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                  {{ t('projects-contribution-label') }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ getProjectContribution(project, currentLocale) }}
                </p>
              </div>
            </Transition>

            <!-- Tech tags -->
            <div class="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-border">
              <AppTag
                v-for="tech in getProjectTags(project)"
                :key="tech"
                variant="outline"
                :class="activeFilter !== 'All' && getTechCategory(tech) === activeFilter
                  ? 'ring-1 ring-primary/30 bg-primary/5 text-foreground'
                  : ''"
              >
                {{ tech }}
              </AppTag>
            </div>
          </AppCard>
          </div>
        </Transition>

        <Transition name="grid-fade" mode="out-in">
          <div v-if="gridVisible" :key="'btns-' + activeFilter" class="mt-10">
            <div class="flex justify-center gap-3">
              <button
                v-if="hasMore"
                class="show-more-btn"
                @click="showMore"
              >
                {{ t('projects-show-more') }}
                <span class="ml-1 text-xs opacity-60">({{ filteredProjects.length - showCount }})</span>
              </button>
              <button
                v-if="showCount > INITIAL_SHOW"
                class="show-more-btn show-more-btn--outline"
                @click="showLess"
              >
                {{ t('projects-show-less') }}
              </button>
            </div>

            <!-- Result count -->
            <p class="text-center text-xs text-muted-foreground mt-4">
              {{ t('projects-count', { shown: visibleProjects.length, total: filteredProjects.length }) }}
            </p>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ─── Filter chips ──────────────────────────────────────────── */
.filter-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s;
  cursor: pointer;
  border-width: 1px;
  border-style: solid;
}
.filter-chip--active {
  background-color: var(--color-foreground);
  color: var(--color-background);
  border-color: var(--color-foreground);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
.filter-chip--inactive {
  background-color: transparent;
  color: var(--color-muted-foreground);
  border-color: var(--color-border);
}
.filter-chip--inactive:hover {
  border-color: color-mix(in srgb, var(--color-foreground) 40%, transparent);
  color: var(--color-foreground);
}

/* ─── Project card ──────────────────────────────────────────── */
.project-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1),
              box-shadow 0.4s ease;
  opacity: 0;
  transform: translateY(24px);
}
.project-card.is-mounted {
  animation: stagger-in 0.5s ease forwards;
  animation-delay: var(--stagger, 0ms);
}
.project-card:hover {
  box-shadow:
    0 8px 30px -8px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(0, 0, 0, 0.04);
  z-index: 2;
}
.dark .project-card:hover {
  box-shadow:
    0 8px 30px -8px rgba(255, 255, 255, 0.07),
    0 0 0 1px rgba(255, 255, 255, 0.06);
}

/* Glow overlay */
.glow-overlay {
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s;
  background: radial-gradient(
    600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(120, 120, 255, 0.06),
    transparent 40%
  );
}
.project-card:hover .glow-overlay {
  opacity: 1;
}

/* ─── Stagger animation ─────────────────────────────────────── */
@keyframes stagger-in {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ─── Grid fade transition (filter switch) ──────────────────── */
.grid-fade-enter-active {
  transition: opacity 0.25s ease;
}
.grid-fade-leave-active {
  transition: opacity 0.2s ease;
}
.grid-fade-enter-from,
.grid-fade-leave-to {
  opacity: 0;
}

/* ─── Expand transition ─────────────────────────────────────── */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  margin-bottom: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 200px;
}

/* ─── Show more button ──────────────────────────────────────── */
.show-more-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.625rem 1.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s;
  cursor: pointer;
  background-color: var(--color-foreground);
  color: var(--color-background);
}
.show-more-btn:hover {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  transform: scale(1.05);
}
.show-more-btn:active {
  transform: scale(0.95);
}
.show-more-btn--outline {
  background-color: transparent;
  color: var(--color-foreground);
  border: 1px solid var(--color-border);
}
.show-more-btn--outline:hover {
  border-color: color-mix(in srgb, var(--color-foreground) 40%, transparent);
}

/* ─── Line clamp ────────────────────────────────────────────── */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
