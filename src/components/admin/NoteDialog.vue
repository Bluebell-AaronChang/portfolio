<template>
    <Dialog :open="open" @update:open="handleOpenChange">
        <DialogContent class="max-w-[85vw] xl:max-w-250 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{{ isEditMode ? 'Edit Note' : 'New Note' }}</DialogTitle>
                <DialogDescription>
                    {{ isEditMode ? 'Update note information' : 'Create a new blog post or note' }}
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="space-y-6">

                <!-- Top Tabs: Edit / Preview -->
                <div class="flex gap-2 border-b border-border">
                    <button type="button" @click="activeTab = 'edit'"
                        :class="tabClass(activeTab === 'edit')">Edit</button>
                    <button type="button" @click="activeTab = 'preview'"
                        :class="tabClass(activeTab === 'preview')">Preview</button>
                </div>

                <!-- ── Edit Tab ── -->
                <div v-show="activeTab === 'edit'" class="space-y-6">

                    <!-- Basic Info -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="slug">Slug *</Label>
                            <Input id="slug" v-model="formData.slug" required :disabled="isEditMode"
                                placeholder="my-blog-post" />
                        </div>
                        <div class="space-y-2">
                            <Label for="status">Status *</Label>
                            <Select v-model="formData.status" required>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <!-- Language Tabs -->
                    <div class="border border-border rounded-lg overflow-hidden">
                        <!-- Lang Tab Bar -->
                        <div class="flex border-b border-border bg-muted/30">
                            <button type="button" @click="langTab = 'en'" :class="[
                                'px-5 py-2 text-sm font-medium transition-colors border-b-2',
                                langTab === 'en'
                                    ? 'border-primary text-primary bg-background'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            ]">
                                🇺🇸 English
                            </button>
                            <button type="button" @click="langTab = 'zh'" :class="[
                                'px-5 py-2 text-sm font-medium transition-colors border-b-2',
                                langTab === 'zh'
                                    ? 'border-primary text-primary bg-background'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            ]">
                                🇹🇼 中文
                            </button>
                        </div>

                        <div class="p-4 space-y-4">
                            <!-- English Fields -->
                            <template v-if="langTab === 'en'">
                                <div class="space-y-2">
                                    <Label for="title-en">Title *</Label>
                                    <Input id="title-en" v-model="formData.title_en" required
                                        placeholder="My Blog Post" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="summary-en">Summary</Label>
                                    <Textarea id="summary-en" v-model="formData.summary_en" rows="3"
                                        placeholder="A short description..." />
                                </div>
                                <div class="space-y-2">
                                    <Label>Content</Label>
                                    <MarkdownEditor v-model="formData.content_en"
                                        placeholder="Write your content in English..." />
                                </div>
                            </template>

                            <!-- Chinese Fields -->
                            <template v-else>
                                <div class="space-y-2">
                                    <Label for="title-zh">標題 *</Label>
                                    <Input id="title-zh" v-model="formData.title_zh" required placeholder="我的文章" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="summary-zh">摘要</Label>
                                    <Textarea id="summary-zh" v-model="formData.summary_zh" rows="3"
                                        placeholder="簡短的描述..." />
                                </div>
                                <div class="space-y-2">
                                    <Label>內容</Label>
                                    <MarkdownEditor v-model="formData.content_zh" placeholder="在這裡寫下你的內容..." />
                                </div>
                            </template>
                        </div>
                    </div>

                    <!-- Cover Image -->
                    <div class="space-y-2">
                        <Label for="cover">Cover Image URL</Label>
                        <Input id="cover" v-model="formData.cover_image" type="url" />
                        <img v-if="formData.cover_image" :src="formData.cover_image" alt="Cover"
                            class="mt-2 w-full h-48 object-cover rounded-lg" />
                    </div>

                    <!-- Tags -->
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <Label>Tags</Label>
                            <span class="text-xs text-muted-foreground">{{ formData.tags?.length ?? 0 }} selected</span>
                        </div>
                        <div v-if="tagsLoading" class="text-sm text-muted-foreground">Loading tags...</div>
                        <div v-else class="flex flex-wrap gap-2">
                            <button v-for="tag in allTags" :key="tag.id" type="button" @click="toggleTag(tag.name)"
                                :class="[
                                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border transition-colors cursor-pointer',
                                    formData.tags?.includes(tag.name)
                                        ? 'border-transparent text-white'
                                        : 'border-border bg-background text-muted-foreground hover:text-foreground'
                                ]" :style="formData.tags?.includes(tag.name)
                                    ? { background: tag.color ?? '#6b7280' }
                                    : {}">
                                <span class="w-2 h-2 rounded-full" :style="formData.tags?.includes(tag.name)
                                    ? { background: 'white' }
                                    : { background: tag.color ?? '#6b7280' }" />
                                {{ tag.name }}
                            </button>
                        </div>
                    </div>

                    <!-- Meta -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label>Published Date</Label>
                            <DateTimePicker v-model="formData.published_at" />
                        </div>
                        <div class="space-y-2">
                            <Label class="flex items-center gap-2 cursor-pointer mt-8">
                                <input v-model="formData.featured" type="checkbox"
                                    class="w-4 h-4 rounded border-input" />
                                <span>Featured</span>
                            </Label>
                        </div>
                    </div>
                </div>

                <!-- ── Preview Tab ── -->
                <div v-show="activeTab === 'preview'" class="space-y-6">
                    <!-- Preview Lang Toggle -->
                    <div class="flex gap-2">
                        <button type="button" @click="previewLang = 'en'" :class="tabClass(previewLang === 'en')">🇺🇸
                            English</button>
                        <button type="button" @click="previewLang = 'zh'" :class="tabClass(previewLang === 'zh')">🇹🇼
                            中文</button>
                    </div>
                    <div class="bg-muted p-6 rounded-lg">
                        <div v-if="formData.cover_image" class="mb-6">
                            <img :src="formData.cover_image" alt="Cover" class="w-full h-64 object-cover rounded-lg" />
                        </div>
                        <h1 class="text-4xl font-bold mb-2">
                            {{ (previewLang === 'en' ? formData.title_en : formData.title_zh) || 'Untitled' }}
                        </h1>
                        <div v-if="previewLang === 'en' ? formData.summary_en : formData.summary_zh"
                            class="text-lg italic text-muted-foreground mb-6">
                            {{ previewLang === 'en' ? formData.summary_en : formData.summary_zh }}
                        </div>
                        <div v-if="formData.tags?.length" class="flex flex-wrap gap-2 mb-6">
                            <span v-for="tag in formData.tags" :key="tag"
                                class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                {{ tag }}
                            </span>
                        </div>
                        <div class="prose-custom max-w-none" v-html="previewHtml"></div>
                    </div>
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

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { blogService } from '@/services/blogService'
import { renderMarkdown } from '@/lib/markdown'
import { useAppFeedback } from '@/composables/useAppFeedback'
import type { BlogPost } from '@/types'
import type { CreateBlogPostDto } from '@/services/blogService'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DateTimePicker from '@/components/ui/DateTimePicker.vue'
import MarkdownEditor from '@/components/ui/MarkdownEditor.vue'
import { blogTagService } from '@/services/blogTagService'

const props = defineProps<{ note?: BlogPost | null }>()
const emit = defineEmits<{ close: []; save: [] }>()

const feedback = useAppFeedback()
const activeTab = ref<'edit' | 'preview'>('edit')
const langTab = ref<'en' | 'zh'>('en')
const previewLang = ref<'en' | 'zh'>('en')
const open = ref(true)

const isEditMode = computed(() => !!props.note)

function tabClass(active: boolean) {
    return [
        'px-4 py-2 font-medium border-b-2 transition-colors text-sm',
        active
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground hover:text-foreground',
    ]
}

const formData = reactive<CreateBlogPostDto>({
    slug: '',
    title_en: '',
    title_zh: '',
    summary_en: '',
    summary_zh: '',
    content_en: '',
    content_zh: '',
    cover_image: '',
    tags: [],
    status: 'draft',
    featured: false,
    published_at: new Date().toISOString().slice(0, 16),
})

if (props.note) {
    Object.assign(formData, {
        slug: props.note.slug,
        title_en: props.note.title_en,
        title_zh: props.note.title_zh,
        summary_en: props.note.summary_en || '',
        summary_zh: props.note.summary_zh || '',
        content_en: props.note.content_en || '',
        content_zh: props.note.content_zh || '',
        cover_image: props.note.cover_image || '',
        tags: [...(props.note.tags ?? [])],
        status: props.note.status || 'draft',
        featured: props.note.featured || false,
        published_at: props.note.published_at?.slice(0, 16) || new Date().toISOString().slice(0, 16),
    })
}

const { data: allTags, isLoading: tagsLoading } = useQuery({
    queryKey: ['blog-tags'],
    queryFn: () => blogTagService.getBlogTags(),
})

function toggleTag(tagName: string) {
    if (!formData.tags) formData.tags = []
    const index = formData.tags.indexOf(tagName)
    if (index === -1) {
        formData.tags.push(tagName)
    } else {
        formData.tags.splice(index, 1)
    }
}

const previewHtml = ref('<p class="text-muted-foreground">No content to preview</p>')

async function updatePreview() {
    const content = previewLang.value === 'en' ? formData.content_en : formData.content_zh
    if (!content) {
        previewHtml.value = '<p class="text-muted-foreground">No content to preview</p>'
        return
    }
    previewHtml.value = await renderMarkdown(content)
}

watch([() => formData.content_en, () => formData.content_zh, previewLang], updatePreview, { immediate: true })

const { mutate: saveNote, isPending: isSubmitting } = useMutation({
    mutationFn: () => {
        if (isEditMode.value && props.note) {
            return blogService.updatePost(props.note.id, formData)
        }
        return blogService.createPost(formData)
    },
    onSuccess: () => {
        feedback.success(
            isEditMode.value ? 'Note updated successfully' : 'Note created successfully',
            isEditMode.value ? 'Updated' : 'Created',
        )
        emit('save')
    },
    onError: (err) => {
        feedback.showError(err, isEditMode.value ? 'Failed to update note' : 'Failed to create note')
    },
})

function handleOpenChange(isOpen: boolean) {
    if (!isOpen) emit('close')
}

function handleSubmit() {
    saveNote()
}
</script>
