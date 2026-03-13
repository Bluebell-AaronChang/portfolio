<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppButton from '@/components/ui/AppButton.vue'
import AppTag from '@/components/ui/AppTag.vue'
import avatarImg from '@/assets/aaron_img.jpg'

const { t } = useI18n()

const TECH_TAGS = [
  'C#', '.NET', 'Vue 3', 'TypeScript', 'Flutter', 'MS SQL', 'System Design', 'API Integration', 'Scrum',
]
</script>

<template>
  <section
    id="home"
    :aria-label="t('nav-home')"
    class="relative flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8"
  >
    <div
      class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"
    />

    <div class="mx-auto max-w-4xl text-center">
      <div class="mb-6 flex justify-center">
        <img
          :src="avatarImg"
          :alt="t('hero-avatar-alt')"
          width="112"
          height="112"
          class="h-28 w-28 rounded-full object-cover border-4 border-border shadow-lg animate-float"
        />
      </div>

      <p class="mb-4 text-sm font-medium tracking-widest uppercase text-muted-foreground">
        {{ t('hero-greeting') }}
      </p>

      <h1 class="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
        {{ t('hero-name') }}
      </h1>

      <p class="mt-4 text-xl text-muted-foreground sm:text-2xl">
        {{ t('hero-title') }}
      </p>

      <p class="mt-6 max-w-2xl mx-auto text-base text-muted-foreground leading-relaxed">
        {{ t('hero-description') }}<br class="hidden sm:block" />
        {{ t('hero-description-line2') }}
      </p>

      <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
        <AppButton size="lg" href="#projects">
          {{ t('hero-view-projects') }}
        </AppButton>
        <AppButton variant="ghost" size="lg" href="#contact">
          {{ t('hero-contact') }}
        </AppButton>
      </div>

      <div class="mt-12 flex flex-wrap items-center justify-center gap-2">
        <AppTag v-for="tag in TECH_TAGS" :key="tag" variant="outline">
          {{ tag }}
        </AppTag>
      </div>
    </div>
  </section>
</template>

<style scoped>
.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>
