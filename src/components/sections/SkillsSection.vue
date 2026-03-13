<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import AppTag from '@/components/ui/AppTag.vue'

const { t } = useI18n()

interface SkillCategoryDef {
  titleKey: string
  icon: string
  skills: { key?: string; label: string }[]
}

const SKILL_DEFS: SkillCategoryDef[] = [
  {
    titleKey: 'skills-backend',
    icon: '⚙️',
    skills: [
      { label: 'C#' }, { label: '.NET' }, { label: 'ASP.NET' }, { label: 'API Design' }, { label: 'System Integration' },
    ],
  },
  {
    titleKey: 'skills-frontend',
    icon: '🎨',
    skills: [{ label: 'Vue 3' }, { label: 'TypeScript' }],
  },
  {
    titleKey: 'skills-mobile',
    icon: '📱',
    skills: [{ label: 'Flutter' }, { label: 'Dart' }],
  },
  {
    titleKey: 'skills-database',
    icon: '🗄️',
    skills: [{ label: 'MS SQL Server' }],
  },
  {
    titleKey: 'skills-tools-process',
    icon: '🛠️',
    skills: [{ label: 'Git' }, { label: 'Docker' }, { label: 'Scrum' }],
  },
  {
    titleKey: 'skills-soft-skills',
    icon: '🤝',
    skills: [
      { key: 'skills-mentoring', label: 'Mentoring' },
      { key: 'skills-cross-team', label: 'Cross‑Team Collaboration' },
      { key: 'skills-technical-discussion', label: 'Technical Discussion' },
    ],
  },
]

const categories = computed(() =>
  SKILL_DEFS.map((cat) => ({
    title: t(cat.titleKey),
    icon: cat.icon,
    skills: cat.skills.map((s) => (s.key ? t(s.key) : s.label)),
  }))
)
</script>

<template>
  <section id="skills" :aria-label="t('skills-title')" class="py-24 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-6xl">
      <SectionTitle
        :title="t('skills-title')"
        :subtitle="t('skills-subtitle')"
      />

      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="category in categories"
          :key="category.title"
          class="text-center"
        >
          <div class="text-3xl mb-3">{{ category.icon }}</div>
          <h3 class="font-semibold mb-4">{{ category.title }}</h3>
          <div class="flex flex-wrap items-center justify-center gap-2">
            <AppTag v-for="skill in category.skills" :key="skill">
              {{ skill }}
            </AppTag>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
