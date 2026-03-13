<template>
    <Dialog :open="open" @update:open="handleOpenChange">
        <DialogContent class="max-w-lg">
            <DialogHeader>
                <DialogTitle>Manage Tags</DialogTitle>
                <DialogDescription>Define tags for blog posts</DialogDescription>
            </DialogHeader>

            <div class="space-y-4">
                <!-- 新增 Tag 表單 -->
                <form @submit.prevent="handleCreate" class="flex gap-2">
                    <Input v-model="newName" placeholder="Tag name, e.g. Vue" class="flex-1" required />
                    <input v-model="newColor" type="color"
                        class="w-10 h-10 rounded border border-input cursor-pointer p-0.5" />
                    <Button type="submit" :disabled="isCreating" size="sm">
                        <PlusIcon class="w-4 h-4" />
                    </Button>
                </form>

                <!-- Tag 列表 -->
                <div class="max-h-80 overflow-y-auto space-y-1.5 pr-1">
                    <div v-if="isLoading" class="text-sm text-muted-foreground text-center py-4">Loading...</div>
                    <div v-else-if="!(tags ?? []).length" class="text-sm text-muted-foreground text-center py-4">No tags
                        yet</div>
                    <div v-else v-for="tag in (tags ?? [])" :key="tag.id"
                        class="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/30"
                        :class="confirmDeleteId === tag.id ? 'border-destructive/50 bg-destructive/5' : ''">
                        <span class="w-3 h-3 rounded-full shrink-0" :style="{ background: tag.color ?? '#6b7280' }" />
                        <span class="flex-1 text-sm font-medium">{{ tag.name }}</span>
                        <span class="text-xs text-muted-foreground">{{ tag.slug }}</span>

                        <!-- 正常狀態：垃圾桶 -->
                        <template v-if="confirmDeleteId !== tag.id">
                            <button type="button"
                                class="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                @click="handleDelete(tag)">
                                <Trash2Icon class="w-3.5 h-3.5" />
                            </button>
                        </template>

                        <!-- 確認刪除狀態 -->
                        <template v-else>
                            <span class="text-xs text-destructive font-medium">Delete?</span>
                            <button type="button"
                                class="text-xs px-2 py-0.5 rounded bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors cursor-pointer"
                                @click="handleDelete(tag)">
                                Yes
                            </button>
                            <button type="button"
                                class="text-xs px-2 py-0.5 rounded border border-border hover:bg-muted transition-colors cursor-pointer"
                                @click="cancelDelete">
                                No
                            </button>
                        </template>
                    </div>
                </div>
            </div>

            <DialogFooter>
                <Button variant="outline" @click="emit('close')">Close</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { PlusIcon, Trash2Icon } from 'lucide-vue-next'
import { blogTagService } from '@/services/blogTagService'
import type { BlogTag } from '@/services/blogTagService'
import { useAppFeedback } from '@/composables/useAppFeedback'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const emit = defineEmits<{ close: [] }>()

const open = ref(true)
const feedback = useAppFeedback()
const queryClient = useQueryClient()

const newName = ref('')
const newColor = ref('#6b7280')

const confirmDeleteId = ref<string | null>(null)

function handleOpenChange(isOpen: boolean) {
    if (!isOpen) emit('close')
}

const { data: tags, isLoading } = useQuery({
    queryKey: ['blog-tags'],
    queryFn: () => blogTagService.getBlogTags(),
})

const { mutate: createTag, isPending: isCreating } = useMutation({
    mutationFn: () => blogTagService.createBlogTag({
        name: newName.value.trim(),
        slug: newName.value.trim().toLowerCase().replace(/\s+/g, '-'),
        color: newColor.value,
    }),
    onSuccess: () => {
        newName.value = ''
        newColor.value = '#6b7280'
        queryClient.invalidateQueries({ queryKey: ['blog-tags'] })
        feedback.success('Tag created', 'Created')
    },
    onError: (err) => feedback.showError(err, 'Failed to create tag'),
})

const { mutate: deleteTag } = useMutation({
    mutationFn: (tag: BlogTag) => blogTagService.deleteBlogTag(tag.id),
    onSuccess: () => {
        confirmDeleteId.value = null
        queryClient.invalidateQueries({ queryKey: ['blog-tags'] })
        feedback.success('Tag deleted', 'Deleted')
    },
    onError: (err) => feedback.showError(err, 'Failed to delete tag'),
})

async function handleCreate() {
    if (!newName.value.trim()) return
    createTag()
}

function handleDelete(tag: BlogTag) {
    if (confirmDeleteId.value === tag.id) {
        deleteTag(tag)
    } else {
        confirmDeleteId.value = tag.id
    }
}

function cancelDelete() {
    confirmDeleteId.value = null
}
</script>
