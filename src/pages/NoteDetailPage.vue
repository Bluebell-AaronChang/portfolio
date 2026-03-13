<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import AppTag from '@/components/ui/AppTag.vue'
import { useBlogPostBySlugQuery } from '@/queries/blogQueries'
import { getNoteTitle, getNoteSummary, getNoteContent, getNoteTags } from '@/types/blog'
import type { NoteLocale } from '@/types/blog'
import { renderMarkdown } from '@/lib/markdown'

const props = defineProps<{ slug: string }>()

const { t, locale } = useI18n()
const currentLocale = computed(() => locale.value as NoteLocale)

const slugRef = computed(() => props.slug)
const { data: post, isLoading, isError } = useBlogPostBySlugQuery(slugRef)

const renderedHtml = ref('')
const isRendering = ref(false)

watch(
  [post, currentLocale],
  async ([p, loc]) => {
    if (!p) {
      renderedHtml.value = ''
      return
    }
    isRendering.value = true
    try {
      renderedHtml.value = await renderMarkdown(getNoteContent(p, loc))
    } catch {
      renderedHtml.value = `<p>${getNoteContent(p, loc)}</p>`
    } finally {
      isRendering.value = false
    }
  },
  { immediate: true },
)

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString(currentLocale.value === 'zh-tw' ? 'zh-TW' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const linkCopied = ref(false)

function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  linkCopied.value = true
  setTimeout(() => { linkCopied.value = false }, 2000)
}
</script>

<template>
  <main class="pt-24 pb-16 flex-1">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <!-- Back link -->
      <RouterLink
        :to="{ name: 'Notes' }"
        class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        {{ t('notes-back') }}
      </RouterLink>

      <!-- Loading skeleton -->
      <div v-if="isLoading" class="animate-pulse space-y-4">
        <div class="h-8 w-3/4 rounded bg-muted" />
        <div class="h-4 w-1/3 rounded bg-muted" />
        <div class="mt-8 space-y-3">
          <div v-for="i in 8" :key="i" class="h-4 rounded bg-muted" :style="{ width: `${70 + Math.random() * 30}%` }" />
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="isError || !post" class="text-center text-muted-foreground mt-16">
        {{ t('notes-error') }}
      </div>

      <!-- Content -->
      <article v-else>
        <!-- Cover image -->
        <img
          v-if="post.cover_image"
          :src="post.cover_image"
          :alt="getNoteTitle(post, currentLocale)"
          class="w-full rounded-lg object-cover max-h-80 mb-8"
        />

        <!-- Header -->
        <header>
          <h1 class="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            {{ getNoteTitle(post, currentLocale) }}
          </h1>

          <p class="mt-3 text-base text-muted-foreground">
            {{ getNoteSummary(post, currentLocale) }}
          </p>

          <div class="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <time v-if="post.published_at">
              {{ t('notes-published-at', { date: formatDate(post.published_at) }) }}
            </time>
            <span v-if="post.reading_time_minutes">·</span>
            <span v-if="post.reading_time_minutes">
              {{ t('notes-reading-time', { min: post.reading_time_minutes }) }}
            </span>
          </div>

          <div v-if="getNoteTags(post).length" class="mt-4 flex flex-wrap gap-1.5">
            <AppTag
              v-for="tag in getNoteTags(post)"
              :key="tag"
            >
              {{ tag }}
            </AppTag>
          </div>
        </header>

        <!-- Divider -->
        <hr class="my-8 border-border" />

        <!-- Markdown body -->
        <div v-if="isRendering" class="animate-pulse space-y-3">
          <div v-for="i in 6" :key="i" class="h-4 rounded bg-muted" :style="{ width: `${60 + Math.random() * 40}%` }" />
        </div>
        <div
          v-else
          class="prose-custom"
          v-html="renderedHtml"
        />

        <!-- Footer actions -->
        <div class="mt-12 flex items-center justify-between border-t border-border pt-6">
          <RouterLink
            :to="{ name: 'Notes' }"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← {{ t('notes-back') }}
          </RouterLink>

          <button
            class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            @click="copyLink"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            {{ linkCopied ? t('notes-link-copied') : t('notes-copy-link') }}
          </button>
        </div>
      </article>
    </div>
  </main>
</template>

<style>
/* Markdown 文章內容排版 */
.prose-custom {
  line-height: 1.8;
  font-size: 1rem;
}

.prose-custom h1,
.prose-custom h2,
.prose-custom h3,
.prose-custom h4 {
  font-weight: 700;
  margin-top: 2em;
  margin-bottom: 0.75em;
  color: var(--color-foreground);
}

.prose-custom h1 { font-size: 1.75rem; }
.prose-custom h2 { font-size: 1.5rem; }
.prose-custom h3 { font-size: 1.25rem; }
.prose-custom h4 { font-size: 1.125rem; }

.prose-custom p {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
  color: var(--color-foreground);
}

.prose-custom a {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.prose-custom a:hover {
  opacity: 0.8;
}

.prose-custom strong {
  font-weight: 700;
  color: var(--color-foreground);
}

.prose-custom ul,
.prose-custom ol {
  margin-top: 1em;
  margin-bottom: 1em;
  padding-left: 1.5em;
}

.prose-custom ul { list-style-type: disc; }
.prose-custom ol { list-style-type: decimal; }

.prose-custom li {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}

.prose-custom blockquote {
  border-left: 3px solid var(--color-border);
  padding-left: 1em;
  margin: 1.5em 0;
  color: var(--color-muted-foreground);
  font-style: italic;
}

.prose-custom code {
  font-size: 0.875em;
  padding: 0.15em 0.35em;
  border-radius: 0.25rem;
  background-color: #e8e8e8;
  color: var(--color-foreground);
}

.dark .prose-custom code {
  background-color: #2a2a2a;
}

.prose-custom pre {
  margin: 1.5em 0;
  border-radius: 0.5rem;
  overflow-x: auto;
  background-color: #f6f8fa;
  border: 1px solid var(--color-border);
}

.dark .prose-custom pre {
  background-color: #161b22;
}

.prose-custom pre code {
  padding: 0;
  background: transparent;
  font-size: 0.85em;
  border: none;
}

/* Shiki dual theme support */
.prose-custom .shiki,
.prose-custom .shiki span {
  color: var(--shiki-light) !important;
}

.prose-custom .shiki {
  background-color: #f6f8fa !important;
}

.dark .prose-custom .shiki,
.dark .prose-custom .shiki span {
  color: var(--shiki-dark) !important;
}

.dark .prose-custom .shiki {
  background-color: #161b22 !important;
}

.prose-custom .shiki {
  padding: 1em 1.25em;
  border-radius: 0.5rem;
  overflow-x: auto;
}

.prose-custom img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5em 0;
}

.prose-custom hr {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 2em 0;
}

.prose-custom table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
}

.prose-custom th,
.prose-custom td {
  border: 1px solid var(--color-border);
  padding: 0.5em 0.75em;
  text-align: left;
}

.prose-custom th {
  background-color: var(--color-muted);
  font-weight: 600;
}
</style>
