<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import AppCard from '@/components/ui/AppCard.vue'

const { t } = useI18n()

const CAPABILITY_KEYS = [
  { icon: '🏗️', titleKey: 'about-cap-architecture-title', descKey: 'about-cap-architecture-desc' },
  { icon: '⚙️', titleKey: 'about-cap-business-logic-title', descKey: 'about-cap-business-logic-desc' },
  { icon: '🔗', titleKey: 'about-cap-integration-title', descKey: 'about-cap-integration-desc' },
  { icon: '🚀', titleKey: 'about-cap-performance-title', descKey: 'about-cap-performance-desc' },
  { icon: '🤝', titleKey: 'about-cap-collaboration-title', descKey: 'about-cap-collaboration-desc' },
  { icon: '🌏', titleKey: 'about-cap-global-title', descKey: 'about-cap-global-desc' },
]

const capabilities = computed(() =>
  CAPABILITY_KEYS.map((cap) => ({
    icon: cap.icon,
    title: t(cap.titleKey),
    description: t(cap.descKey),
  }))
)
</script>

<template>
  <section id="about" :aria-label="t('about-title')" class="py-24 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-6xl">
      <SectionTitle
        :title="t('about-title')"
        :subtitle="t('about-subtitle')"
      />

      <div class="mb-12 max-w-3xl mx-auto text-center">
        <p class="text-muted-foreground leading-relaxed">
          {{ t('about-bio') }}
        </p>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AppCard
          v-for="cap in capabilities"
          :key="cap.title"
          class="p-6 text-center hover:shadow-md transition-shadow"
        >
          <div class="text-3xl mb-4">{{ cap.icon }}</div>
          <h3 class="font-semibold mb-2">{{ cap.title }}</h3>
          <p class="text-sm text-muted-foreground">{{ cap.description }}</p>
        </AppCard>
      </div>
    </div>
  </section>
</template>
