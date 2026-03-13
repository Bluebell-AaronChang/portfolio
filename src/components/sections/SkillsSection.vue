<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import AppTag from '@/components/ui/AppTag.vue'
import { skillService } from '@/services/skillService'
import type { Skill, TechCategory } from '@/types'

const { t } = useI18n()

const skills = ref<Skill[]>([])
const categories = ref<TechCategory[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const [fetchedSkills, fetchedCategories] = await Promise.all([
      skillService.getAllSkills(),
      skillService.getAllTechCategories(),
    ])
    skills.value = fetchedSkills
    categories.value = fetchedCategories
  } catch (err) {
    console.error('Failed to load skills:', err)
  } finally {
    isLoading.value = false
  }
})

const groupedSkills = computed(() =>
  categories.value
    .map((cat) => ({
      id: cat.id,
      title: cat.name,
      skills: skills.value.filter((s) => s.category_id === cat.id),
    }))
    .filter((cat) => cat.skills.length > 0)
)
</script>

<template>
  <section id="skills" :aria-label="t('skills-title')" class="py-24 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-6xl">
      <SectionTitle :title="t('skills-title')" :subtitle="t('skills-subtitle')" />

      <!-- Loading -->
      <div v-if="isLoading" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="n in 6" :key="n" class="text-center space-y-3 animate-pulse">
          <div class="h-8 w-8 bg-muted rounded-full mx-auto" />
          <div class="h-4 w-24 bg-muted rounded mx-auto" />
          <div class="flex flex-wrap justify-center gap-2">
            <div v-for="m in 4" :key="m" class="h-6 w-16 bg-muted rounded-full" />
          </div>
        </div>
      </div>

      <!-- Skills Grid -->
      <div v-else class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="category in groupedSkills" :key="category.id" class="text-center">
          <h3 class="font-semibold mb-4">{{ category.title }}</h3>
          <div class="flex flex-wrap items-center justify-center gap-2">
            <AppTag v-for="skill in category.skills" :key="skill.id">
              {{ skill.name }}
            </AppTag>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
