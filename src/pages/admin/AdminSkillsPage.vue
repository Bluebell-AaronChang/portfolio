<template>
    <AdminLayout>
        <div class="space-y-6">
            <!-- Header Actions -->
            <div class="flex justify-between items-center">
                <div class="flex-1 max-w-md">
                    <Input v-model="searchQuery" type="text" placeholder="Search skills..." />
                </div>
                <div class="flex gap-3">
                    <Button variant="outline" @click="openCategoryDialog">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        New Category
                    </Button>
                    <Button @click="openSkillDialog">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        New Skill
                    </Button>
                </div>
            </div>

            <!-- Categories -->
            <Card>
                <CardHeader>
                    <CardTitle>Tech Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div v-for="category in categories" :key="category.id"
                            class="p-4 border border-border rounded-lg hover:border-ring transition-colors">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-medium">{{ category.name }}</span>
                                <Button variant="ghost" size="icon" @click="handleDeleteCategory(category)">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </Button>
                            </div>
                            <p class="text-sm text-muted-foreground">{{ getCategorySkillCount(category.id) }} skills</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Skills Table -->
            <div class="bg-card rounded-lg border border-border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Skill</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Icon</TableHead>
                            <TableHead>Hero</TableHead>
                            <TableHead class="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-if="isLoadingSkills">
                            <TableCell colspan="5" class="text-center text-muted-foreground">
                                Loading skills...
                            </TableCell>
                        </TableRow>
                        <TableRow v-else-if="filteredSkills.length === 0">
                            <TableCell colspan="5" class="text-center text-muted-foreground">
                                No skills found
                            </TableCell>
                        </TableRow>
                        <TableRow v-else v-for="skill in filteredSkills" :key="skill.id">
                            <TableCell>
                                <div class="font-medium">{{ skill.name }}</div>
                                <div v-if="skill.name_key" class="text-sm text-muted-foreground">
                                    {{ skill.name_key }}
                                </div>
                            </TableCell>
                            <TableCell>{{ getCategoryName(skill.category_id) }}</TableCell>
                            <TableCell class="text-2xl">{{ skill.icon || '-' }}</TableCell>
                            <TableCell>
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                                    :class="skill.show_in_hero ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'">
                                    {{ skill.show_in_hero ? 'Yes' : 'No' }}
                                </span>
                            </TableCell>
                            <TableCell class="text-right">
                                <div class="flex justify-end gap-2">
                                    <Button variant="ghost" size="sm" @click="editSkill(skill)">
                                        Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" @click="handleDeleteSkill(skill)"
                                        class="text-destructive hover:text-destructive">
                                        Delete
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>

        <!-- Skill Dialog -->
        <SkillDialog v-if="showSkillDialog" :skill="selectedSkill" :categories="categories || []"
            @close="closeSkillDialog" @save="handleSkillSave" />

        <!-- Category Dialog -->
        <CategoryDialog v-if="showCategoryDialog" @close="closeCategoryDialog" @save="handleCategorySave" />
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import SkillDialog from '@/components/admin/SkillDialog.vue'
import CategoryDialog from '@/components/admin/CategoryDialog.vue'
import { skillService } from '@/services/skillService'
import { useAppFeedback } from '@/composables/useAppFeedback'
import { useRouteQueryCancel } from '@/composables/useRouteQueryCancel'
import type { Skill, TechCategory } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const queryClient = useQueryClient()
const feedback = useAppFeedback()
const searchQuery = ref('')
const showSkillDialog = ref(false)
const showCategoryDialog = ref(false)
const selectedSkill = ref<Skill | null>(null)

useRouteQueryCancel({ queryKey: ['admin-skills'] })

const { data: skills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ['admin-skills'],
    queryFn: ({ signal }) => skillService.getAllSkills({ signal }),
})

const { data: categories } = useQuery({
    queryKey: ['admin-tech-categories'],
    queryFn: ({ signal }) => skillService.getAllTechCategories({ signal }),
})

const filteredSkills = computed(() => {
    if (!skills.value) return []
    if (!searchQuery.value) return skills.value
    const query = searchQuery.value.toLowerCase()
    return skills.value.filter((s: Skill) =>
        s.name.toLowerCase().includes(query) ||
        s.name_key?.toLowerCase().includes(query)
    )
})

const { mutate: deleteSkill } = useMutation({
    mutationFn: (skill: Skill) => skillService.deleteSkill(skill.id),
    onSuccess: (_, skill) => {
        feedback.success(`"${skill.name}" has been deleted.`, 'Deleted')
        queryClient.invalidateQueries({ queryKey: ['admin-skills'] })
    },
    onError: (err) => {
        feedback.showError(err, 'Failed to delete skill')
    },
})

const { mutate: deleteCategory } = useMutation({
    mutationFn: (category: TechCategory) => skillService.deleteTechCategory(category.id),
    onSuccess: (_, category) => {
        feedback.success(`Category "${category.name}" has been deleted.`, 'Deleted')
        queryClient.invalidateQueries({ queryKey: ['admin-tech-categories'] })
    },
    onError: (err) => {
        feedback.showError(err, 'Failed to delete category')
    },
})

function getCategoryName(categoryId?: string | null) {
    if (!categoryId || !categories.value) return '-'
    return categories.value.find(c => c.id === categoryId)?.name || '-'
}

function getCategorySkillCount(categoryId: string) {
    if (!skills.value) return 0
    return skills.value.filter(s => s.category_id === categoryId).length
}

function openSkillDialog() {
    selectedSkill.value = null
    showSkillDialog.value = true
}

function editSkill(skill: Skill) {
    selectedSkill.value = skill
    showSkillDialog.value = true
}

function closeSkillDialog() {
    showSkillDialog.value = false
    selectedSkill.value = null
}

async function handleSkillSave() {
    await queryClient.invalidateQueries({ queryKey: ['admin-skills'] })
    closeSkillDialog()
}

async function handleDeleteSkill(skill: Skill) {
    const confirmed = await feedback.confirm({
        title: 'Delete Skill',
        message: `Are you sure you want to delete "${skill.name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'destructive',
    })
    if (!confirmed) return
    deleteSkill(skill)
}

function openCategoryDialog() {
    showCategoryDialog.value = true
}

function closeCategoryDialog() {
    showCategoryDialog.value = false
}

async function handleCategorySave() {
    await queryClient.invalidateQueries({ queryKey: ['admin-tech-categories'] })
    closeCategoryDialog()
}

async function handleDeleteCategory(category: TechCategory) {
    const skillCount = getCategorySkillCount(category.id)
    if (skillCount > 0) {
        feedback.warning(
            `Please delete or reassign the ${skillCount} skill(s) in this category first.`,
            `Cannot delete "${category.name}"`,
        )
        return
    }
    const confirmed = await feedback.confirm({
        title: 'Delete Category',
        message: `Are you sure you want to delete category "${category.name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'destructive',
    })
    if (!confirmed) return
    deleteCategory(category)
}
</script>
