<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSiteConfigQuery } from '@/queries/siteConfigQueries'

const { t } = useI18n()

const FALLBACK_LAUNCH_DATE = '2026-03-13T00:00:00Z'

const { data: launchDateConfig } = useSiteConfigQuery('site_launch_date')

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

let timer: ReturnType<typeof setInterval> | null = null

function getLaunchDate(): Date {
  const raw = launchDateConfig.value
  if (raw && typeof raw === 'string') {
    const parsed = new Date(raw)
    if (!isNaN(parsed.getTime())) return parsed
  }
  return new Date(FALLBACK_LAUNCH_DATE)
}

function updateUptime() {
  const now = Date.now()
  const diff = now - getLaunchDate().getTime()

  days.value = Math.floor(diff / 86400000)
  hours.value = Math.floor((diff % 86400000) / 3600000)
  minutes.value = Math.floor((diff % 3600000) / 60000)
  seconds.value = Math.floor((diff % 60000) / 1000)
}

watch(launchDateConfig, () => updateUptime())

onMounted(() => {
  updateUptime()
  timer = setInterval(updateUptime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="flex items-center gap-1.5 text-xs text-muted-foreground/60">
    <span class="relative flex h-2 w-2">
      <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
      <span class="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
    </span>
    <span>
      {{ t('footer-uptime', { days: days, hours: hours, minutes: minutes, seconds: seconds }) }}
    </span>
  </div>
</template>
