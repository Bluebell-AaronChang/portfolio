<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppTag from '@/components/ui/AppTag.vue'
import { useBlogPostsQuery } from '@/queries/blogQueries'
import { getNoteTitle, getNoteSummary, getNoteTags } from '@/types/blog'
import type { NoteLocale } from '@/types/blog'

const { t, locale } = useI18n()
const currentLocale = computed(() => locale.value as NoteLocale)

const { data: posts, isLoading, isError } = useBlogPostsQuery()

const activeTag = ref<string | null>(null)

const allTags = computed(() => {
  if (!posts.value) return []
  const tagSet = new Set<string>()
  for (const post of posts.value) {
    for (const tag of getNoteTags(post)) {
      tagSet.add(tag)
    }
  }
  return [...tagSet].sort()
})

const filteredPosts = computed(() => {
  if (!posts.value) return []
  if (!activeTag.value) return posts.value
  return posts.value.filter((p) => getNoteTags(p).includes(activeTag.value!))
})

function setTag(tag: string | null) {
  activeTag.value = tag
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString(currentLocale.value === 'zh-tw' ? 'zh-TW' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <main class="pt-24 pb-16 flex-1">
    <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <SectionTitle :title="t('notes-title')" :subtitle="t('notes-subtitle')" />

      <!-- Loading skeleton -->
      <div v-if="isLoading" class="mt-10 space-y-6">
        <div v-for="i in 3" :key="i" class="animate-pulse">
          <div class="h-6 w-2/3 rounded bg-muted" />
          <div class="mt-3 h-4 w-full rounded bg-muted" />
          <div class="mt-2 h-4 w-4/5 rounded bg-muted" />
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="isError" class="mt-10 text-center text-muted-foreground">
        {{ t('notes-error') }}
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Tag filter -->
        <div v-if="allTags.length > 0" class="mt-8 flex flex-wrap gap-2">
          <button
            class="px-3 py-1.5 text-sm rounded-md transition-colors cursor-pointer"
            :class="!activeTag
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:text-foreground'"
            @click="setTag(null)"
          >
            {{ t('notes-filter-all') }}
          </button>
          <button
            v-for="tag in allTags"
            :key="tag"
            class="px-3 py-1.5 text-sm rounded-md transition-colors cursor-pointer"
            :class="activeTag === tag
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:text-foreground'"
            @click="setTag(tag)"
          >
            {{ tag }}
          </button>
        </div>

        <!-- Empty state -->
        <div
          v-if="filteredPosts.length === 0"
          class="mt-10 text-center text-muted-foreground"
        >
          {{ activeTag ? t('notes-empty-filter') : t('notes-empty') }}
        </div>

        <!-- Notes list -->
        <div class="mt-8 space-y-6">
          <RouterLink
            v-for="post in filteredPosts"
            :key="post.id"
            :to="{ name: 'NoteDetail', params: { slug: post.slug } }"
            class="block group"
          >
            <AppCard class="p-6 transition-shadow hover:shadow-md">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0 flex-1">
                  <h2 class="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {{ getNoteTitle(post, currentLocale) }}
                  </h2>
                  <p class="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {{ getNoteSummary(post, currentLocale) }}
                  </p>

                  <div class="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <time v-if="post.published_at">{{ formatDate(post.published_at) }}</time>
                    <span v-if="post.reading_time_minutes">·</span>
                    <span v-if="post.reading_time_minutes">
                      {{ t('notes-reading-time', { min: post.reading_time_minutes }) }}
                    </span>
                  </div>

                  <div v-if="getNoteTags(post).length" class="mt-3 flex flex-wrap gap-1.5">
                    <AppTag
                      v-for="tag in getNoteTags(post)"
                      :key="tag"
                    >
                      {{ tag }}
                    </AppTag>
                  </div>
                </div>

                <img
                  v-if="post.cover_image"
                  :src="post.cover_image"
                  :alt="getNoteTitle(post, currentLocale)"
                  class="hidden sm:block w-32 h-24 rounded-md object-cover flex-shrink-0"
                />
              </div>
            </AppCard>
          </RouterLink>
        </div>
      </template>
    </div>
  </main>
</template>
