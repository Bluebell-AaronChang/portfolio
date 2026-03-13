<template>
    <AdminLayout>
        <div class="space-y-6">
            <!-- Header Actions -->
            <div class="flex justify-between items-center">
                <div class="flex-1 max-w-md">
                    <Input v-model="searchQuery" type="text" placeholder="Search notes..." />
                </div>
                <div class="flex gap-2">
                    <Button variant="outline" @click="showTagManager = true">
                        <TagIcon class="w-4 h-4 mr-1" />
                        Manage Tags
                    </Button>
                    <Button @click="openCreateDialog">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        New Note
                    </Button>
                </div>
            </div>

            <!-- Notes Table -->
            <div class="bg-card rounded-lg border border-border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Published Date</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead class="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-if="isLoading">
                            <TableCell colspan="5" class="text-center text-muted-foreground">
                                Loading notes...
                            </TableCell>
                        </TableRow>
                        <TableRow v-else-if="filteredNotes.length === 0">
                            <TableCell colspan="5" class="text-center text-muted-foreground">
                                No notes found
                            </TableCell>
                        </TableRow>
                        <TableRow v-else v-for="note in filteredNotes" :key="note.id">
                            <TableCell>
                                <div class="font-medium">{{ note.title_en }}</div>
                                <div class="text-sm text-muted-foreground">{{ note.title_zh }}</div>
                            </TableCell>
                            <TableCell>
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                                    :class="getStatusClass(note.status)">
                                    {{ note.status }}
                                </span>
                            </TableCell>
                            <TableCell>{{ formatDate(note.published_at) }}</TableCell>
                            <TableCell>
                                <div class="flex flex-wrap gap-1">
                                    <span v-for="tag in note.tags?.slice(0, 3)" :key="tag"
                                        class="inline-flex px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                                        {{ tag }}
                                    </span>
                                    <span v-if="note.tags && note.tags.length > 3"
                                        class="text-xs text-muted-foreground">
                                        +{{ note.tags.length - 3 }}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell class="text-right">
                                <div class="flex justify-end gap-2">
                                    <Button variant="ghost" size="sm" @click="openEditDialog(note)">
                                        Edit
                                    </Button>
                                    <Button variant="ghost" size="sm" @click="handleDelete(note)"
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

        <!-- Create/Edit Dialog -->
        <NoteDialog v-if="showDialog" :note="selectedNote" @close="closeDialog" @save="handleSave" />

        <!-- Tag Manager Dialog -->
        <TagManagerDialog v-if="showTagManager" @close="showTagManager = false" />
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import NoteDialog from '@/components/admin/NoteDialog.vue'
import TagManagerDialog from '@/components/admin/TagManagerDialog.vue'
import { getBlogPosts } from '@/queries/blogQueries'
import { blogService } from '@/services/blogService'
import { useAppFeedback } from '@/composables/useAppFeedback'
import { useRouteQueryCancel } from '@/composables/useRouteQueryCancel'
import type { BlogPost } from '@/types'
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
import { TagIcon } from 'lucide-vue-next'

const queryClient = useQueryClient()
const feedback = useAppFeedback()
const searchQuery = ref('')
const showDialog = ref(false)
const selectedNote = ref<BlogPost | null>(null)
const showTagManager = ref(false)

useRouteQueryCancel({ queryKey: ['admin-notes'] })

const { data: notes, isLoading } = useQuery({
    queryKey: ['admin-notes'],
    queryFn: ({ signal }) => getBlogPosts({ includeUnpublished: true, signal }),
})

const filteredNotes = computed(() => {
    if (!notes.value) return []
    if (!searchQuery.value) return notes.value
    const query = searchQuery.value.toLowerCase()
    return notes.value.filter((n: BlogPost) =>
        n.title_en.toLowerCase().includes(query) ||
        n.title_zh.toLowerCase().includes(query) ||
        n.summary_en?.toLowerCase().includes(query) ||
        n.summary_zh?.toLowerCase().includes(query)
    )
})

const { mutate: deleteNote } = useMutation({
    mutationFn: (note: BlogPost) => blogService.deletePost(note.id),
    onSuccess: (_, note) => {
        feedback.success(`"${note.title_en}" has been deleted.`, 'Deleted')
        queryClient.invalidateQueries({ queryKey: ['admin-notes'] })
    },
    onError: (err) => {
        feedback.showError(err, 'Failed to delete note')
    },
})

function getStatusClass(status: string) {
    const classes = {
        published: 'bg-green-100 text-green-800',
        draft: 'bg-yellow-100 text-yellow-800',
        archived: 'bg-muted text-muted-foreground',
    }
    return classes[status as keyof typeof classes] || classes.draft
}

function formatDate(date?: string | null) {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

function openCreateDialog() {
    selectedNote.value = null
    showDialog.value = true
}

function openEditDialog(note: BlogPost) {
    selectedNote.value = note
    showDialog.value = true
}

function closeDialog() {
    showDialog.value = false
    selectedNote.value = null
}

async function handleSave() {
    await queryClient.invalidateQueries({ queryKey: ['admin-notes'] })
    closeDialog()
}

async function handleDelete(note: BlogPost) {
    const confirmed = await feedback.confirm({
        title: 'Delete Note',
        message: `Are you sure you want to delete "${note.title_en}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'destructive',
    })
    if (!confirmed) return
    deleteNote(note)
}
</script>
