<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute } from 'vue-router'
import { useClipboard, useColorMode } from '@vueuse/core'
import AppTag from '@/components/ui/AppTag.vue'
import { useBlogPostBySlugQuery } from '@/queries/blogQueries'
import { getNoteTitle, getNoteSummary, getNoteContent, getNoteTags } from '@/types/blog'
import type { NoteLocale } from '@/types/blog'
import { renderMarkdown } from '@/lib/markdown'
import { useAppFeedback } from '@/composables/useAppFeedback'

const props = defineProps<{ slug: string }>()

const { t, locale } = useI18n()
const route = useRoute()
const { success } = useAppFeedback()
const currentLocale = computed(() => locale.value as NoteLocale)
const colorMode = useColorMode()

const slugRef = computed(() => props.slug)
const { data: post, isLoading, isError } = useBlogPostBySlugQuery(slugRef)

const renderedHtml = ref('')
const isRendering = ref(false)

/** Render all `.mermaid-block` divs inside the article using mermaid.js */
async function renderMermaidBlocks() {
  await nextTick()
  const blocks = document.querySelectorAll<HTMLElement>('.mermaid-block')
  if (blocks.length === 0) return

  const mermaid = (await import('mermaid')).default
  const isDark = colorMode.value === 'dark'
    || (colorMode.value === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  mermaid.initialize({
    startOnLoad: false,
    theme: isDark ? 'dark' : 'default',
    securityLevel: 'loose',
  })

  for (const block of blocks) {
    // Skip already-rendered blocks
    if (block.getAttribute('data-mermaid-rendered')) continue
    const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`
    try {
      const { svg } = await mermaid.render(id, block.textContent?.trim() ?? '')
      block.innerHTML = svg
      block.setAttribute('data-mermaid-rendered', 'true')
    } catch {
      // If rendering fails, fall back to showing the code as-is
      block.classList.add('mermaid-error')
    }
  }
}

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
    // After html is set, render mermaid blocks
    await renderMermaidBlocks()
  },
  { immediate: true },
)

// Re-render mermaid when color mode changes (light ↔ dark)
watch(colorMode, async () => {
  // Reset rendered state so blocks get re-rendered with new theme
  const blocks = document.querySelectorAll<HTMLElement>('.mermaid-block[data-mermaid-rendered]')
  // We need to re-render from source, so re-trigger the full markdown render
  const p = post.value
  if (!p || blocks.length === 0) return
  // Clear rendered flag and content, then re-render
  renderedHtml.value = await renderMarkdown(getNoteContent(p, currentLocale.value))
  await renderMermaidBlocks()
})

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString(currentLocale.value === 'zh-tw' ? 'zh-TW' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const { copy, copied } = useClipboard()

const copyLink = async () => {
  const origin = import.meta.env.PROD
    ? 'https://aachang.me'
    : 'http://localhost:5173'
  const fullUrl = `${origin}${route.fullPath}`
  await copy(fullUrl)
  success(t('notes-link-copied'))
}
</script>

<template>
  <main class="pt-24 pb-16 flex-1">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <!-- Back link -->
      <RouterLink :to="{ name: 'Notes' }"
        class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
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
        <img v-if="post.cover_image" :src="post.cover_image" :alt="getNoteTitle(post, currentLocale)"
          class="w-full rounded-lg object-cover max-h-80 mb-8" />

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
          </div>

          <div v-if="getNoteTags(post).length" class="mt-4 flex flex-wrap gap-1.5">
            <AppTag v-for="tag in getNoteTags(post)" :key="tag">
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
        <div v-else class="prose-custom" v-html="renderedHtml" />

        <!-- Footer actions -->
        <div class="mt-12 flex items-center justify-between border-t border-border pt-6">
          <RouterLink :to="{ name: 'Notes' }"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← {{ t('notes-back') }}
          </RouterLink>

          <button
            class="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            @click="copyLink">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            {{ copied ? t('notes-link-copied') : t('notes-copy-link') }}
          </button>
        </div>
      </article>
    </div>
  </main>
</template>

<style>
.mermaid-block {
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
  overflow-x: auto;
}

.mermaid-block svg {
  max-width: 100%;
  height: auto;
}

.mermaid-block.mermaid-error {
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 0.875rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background: var(--color-muted, #f3f4f6);
  color: var(--color-muted-foreground, #6b7280);
}
</style>
