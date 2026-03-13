<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { tryit, sort } from 'radash'
import type { GitHubRepo, GitHubReposResponse } from '@/types'

const { t } = useI18n()

const GITHUB_USERNAME = 'Bluebell-AaronChang'
const MAX_REPOS = 5

const repos = ref<GitHubRepo[]>([])
const loading = ref(true)
const error = ref(false)

const recentRepos = computed(() =>
  sort([...repos.value], (r) => new Date(r.pushedAt).getTime(), true).slice(0, MAX_REPOS),
)

function getRelativeTime(dateStr: string): string {
  const now = Date.now()
  const diff = now - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return t('github-time-just-now')
  if (minutes < 60) return t('github-time-minutes', { count: minutes })
  if (hours < 24) return t('github-time-hours', { count: hours })
  return t('github-time-days', { count: days })
}

onMounted(async () => {
  const [err, res] = await tryit(fetch)(`https://ungh.cc/users/${GITHUB_USERNAME}/repos`)

  if (err || !res.ok) {
    error.value = true
    loading.value = false
    return
  }

  const data: GitHubReposResponse = await res.json()
  repos.value = data.repos
  loading.value = false
})
</script>

<template>
  <div class="space-y-2">
    <h3 class="text-sm font-medium text-foreground flex items-center gap-1.5">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      {{ t('github-activity-title') }}
    </h3>

    <!-- Loading -->
    <div v-if="loading" class="space-y-1.5">
      <div
        v-for="i in 3"
        :key="i"
        class="h-4 bg-muted rounded animate-pulse"
        :style="{ width: `${60 + i * 10}%` }"
      />
    </div>

    <!-- Error -->
    <p v-else-if="error" class="text-xs text-muted-foreground/60">
      {{ t('github-activity-error') }}
    </p>

    <!-- Empty -->
    <p v-else-if="recentRepos.length === 0" class="text-xs text-muted-foreground/60">
      {{ t('github-activity-empty') }}
    </p>

    <!-- Repos -->
    <ul v-else class="space-y-1.5">
      <li
        v-for="repo in recentRepos"
        :key="repo.id"
        class="flex items-start gap-1.5 text-xs text-muted-foreground leading-relaxed"
      >
        <span class="shrink-0 mt-0.5">📦</span>
        <span class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <a
            :href="`https://github.com/${repo.repo}`"
            target="_blank"
            rel="noopener noreferrer"
            class="font-medium text-foreground hover:underline"
          >
            {{ repo.name }}
          </a>

          <span v-if="repo.stars > 0" class="inline-flex items-center gap-0.5">
            ⭐ {{ repo.stars }}
          </span>

          <span v-if="repo.forks > 0" class="inline-flex items-center gap-0.5">
            🍴 {{ repo.forks }}
          </span>

          <span class="text-muted-foreground/50">
            {{ t('github-pushed') }} {{ getRelativeTime(repo.pushedAt) }}
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>
