<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { skillService } from '@/services/skillService'
import { useAppFeedback } from '@/composables/useAppFeedback'
import type { CreateTechCategoryDto } from '@/types'
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

const emit = defineEmits<{
    close: []
    save: []
}>()

const feedback = useAppFeedback()
const open = ref(true)

const formData = reactive<CreateTechCategoryDto>({
    name: '',
})

function handleOpenChange(isOpen: boolean) {
    if (!isOpen) emit('close')
}

const { mutate: createCategory, isPending: isSubmitting } = useMutation({
    mutationFn: () => skillService.createTechCategory(formData),
    onSuccess: () => {
        feedback.success('Category created successfully', 'Created')
        emit('save')
    },
    onError: (err) => {
        feedback.showError(err, 'Failed to create category')
    },
})

function handleSubmit() {
    createCategory()
}
</script>

<template>
    <Dialog :open="open" @update:open="handleOpenChange">
        <DialogContent class="max-w-2xl">
            <DialogHeader>
                <DialogTitle>New Tech Category</DialogTitle>
                <DialogDescription>Create a new technology category for organizing skills</DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="space-y-2">
                    <Label for="name">Category Name *</Label>
                    <Input id="name" v-model="formData.name" required placeholder="e.g., Backend, Frontend, Mobile" />
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" @click="emit('close')">Cancel</Button>
                    <Button type="submit" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Creating...' : 'Create' }}
                    </Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
</template>
