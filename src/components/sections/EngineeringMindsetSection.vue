<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import AppCard from '@/components/ui/AppCard.vue'

const { t } = useI18n()

const MINDSET_KEYS = [
  { icon: '👤', titleKey: 'mindset-user-centered-title', descKey: 'mindset-user-centered-desc' },
  { icon: '🧱', titleKey: 'mindset-maintainable-title', descKey: 'mindset-maintainable-desc' },
  { icon: '📚', titleKey: 'mindset-learning-title', descKey: 'mindset-learning-desc' },
  { icon: '🤝', titleKey: 'mindset-mentoring-title', descKey: 'mindset-mentoring-desc' },
]

const mindsetItems = computed(() =>
  MINDSET_KEYS.map((item) => ({
    icon: item.icon,
    title: t(item.titleKey),
    description: t(item.descKey),
  }))
)
</script>

<template>
  <section id="mindset" :aria-label="t('mindset-title')" class="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
    <div class="mx-auto max-w-6xl">
      <SectionTitle
        :title="t('mindset-title')"
        :subtitle="t('mindset-subtitle')"
      />

      <div class="grid gap-6 sm:grid-cols-2">
        <AppCard
          v-for="item in mindsetItems"
          :key="item.title"
          class="p-8 text-center hover:shadow-md transition-shadow"
        >
          <div class="text-4xl mb-4">{{ item.icon }}</div>
          <h3 class="text-lg font-semibold mb-3">{{ item.title }}</h3>
          <p class="text-sm text-muted-foreground leading-relaxed">
            {{ item.description }}
          </p>
        </AppCard>
      </div>
    </div>
  </section>
</template>
