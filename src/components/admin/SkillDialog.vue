<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { skillService } from '@/services/skillService'
import { useAppFeedback } from '@/composables/useAppFeedback'
import type { Skill, TechCategory, CreateSkillDto } from '@/types'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const props = defineProps<{
    skill?: Skill | null
    categories: TechCategory[]
}>()

const emit = defineEmits<{
    close: []
    save: []
}>()

const feedback = useAppFeedback()
const open = ref(true)
const isEditMode = computed(() => !!props.skill)

const formData = reactive<CreateSkillDto>({
    name: props.skill?.name || '',
    name_key: props.skill?.name_key || '',
    category_id: props.skill?.category_id || '',
    icon: props.skill?.icon || '',
    color: props.skill?.color || '',
    order_index: props.skill?.order_index || 0,
    show_in_hero: props.skill?.show_in_hero || false,
})

const selectedCategoryId = ref(formData.category_id || 'none')

function handleOpenChange(isOpen: boolean) {
    if (!isOpen) emit('close')
}

const { mutate: saveSkill, isPending: isSubmitting } = useMutation({
    mutationFn: () => {
        formData.category_id = selectedCategoryId.value === 'none' ? '' : selectedCategoryId.value
        if (isEditMode.value && props.skill) {
            return skillService.updateSkill(props.skill.id, formData)
        }
        return skillService.createSkill(formData)
    },
    onSuccess: () => {
        feedback.success(
            isEditMode.value ? 'Skill updated successfully' : 'Skill created successfully',
            isEditMode.value ? 'Updated' : 'Created',
        )
        emit('save')
    },
    onError: (err) => {
        feedback.showError(err, isEditMode.value ? 'Failed to update skill' : 'Failed to create skill')
    },
})

function handleSubmit() {
    saveSkill()
}
</script>

<template>
    <Dialog :open="open" @update:open="handleOpenChange">
        <DialogContent class="max-w-4xl">
            <DialogHeader>
                <DialogTitle>{{ isEditMode ? 'Edit Skill' : 'New Skill' }}</DialogTitle>
                <DialogDescription>
                    {{ isEditMode ? 'Update skill information' : 'Add a new skill to your portfolio' }}
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Skill Name -->
                <div class="space-y-2">
                    <Label for="name">Skill Name *</Label>
                    <Input id="name" v-model="formData.name" required placeholder="e.g., Vue 3, TypeScript" />
                </div>

                <!-- Name Key (i18n) -->
                <div class="space-y-2">
                    <Label for="name-key">Name Key (i18n - optional)</Label>
                    <Input id="name-key" v-model="formData.name_key" placeholder="e.g., skills-vue3" />
                </div>

                <!-- Category -->
                <div class="space-y-2">
                    <Label for="category">Category</Label>
                    <Select v-model="selectedCategoryId">
                        <SelectTrigger id="category">
                            <SelectValue placeholder="No Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">No Category</SelectItem>
                            <SelectItem v-for="category in categories" :key="category.id" :value="category.id">
                                {{ category.name }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <!-- Icon -->
                <div class="space-y-2">
                    <Label for="icon">Icon (emoji)</Label>
                    <div class="flex gap-2">
                        <Input id="icon" v-model="formData.icon" class="flex-1" placeholder="e.g., 🎨, ⚙️, 📱" />
                        <div
                            class="w-12 h-12 flex items-center justify-center border border-input rounded-lg text-2xl bg-muted">
                            {{ formData.icon || '?' }}
                        </div>
                    </div>
                </div>

                <!-- Color -->
                <div class="space-y-2">
                    <Label for="color">Color</Label>
                    <div class="flex items-center gap-3">
                        <input id="color" v-model="formData.color" type="color"
                            class="w-10 h-10 rounded border border-input cursor-pointer p-0.5" />
                        <Input v-model="formData.color" placeholder="#3178c6" class="flex-1 font-mono text-sm" />
                        <button v-if="formData.color" type="button"
                            class="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            @click="formData.color = ''">Clear</button>
                    </div>
                </div>

                <!-- Order Index -->
                <div class="space-y-2">
                    <Label for="order">Order Index</Label>
                    <Input id="order" v-model.number="formData.order_index" type="number" placeholder="0" />
                </div>

                <!-- Show in Hero -->
                <div class="space-y-2">
                    <Label class="flex items-center gap-2 cursor-pointer">
                        <input v-model="formData.show_in_hero" type="checkbox" class="w-4 h-4 rounded border-input" />
                        <span>Show in Hero Section</span>
                    </Label>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" @click="emit('close')">Cancel</Button>
                    <Button type="submit" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
