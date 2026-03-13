<template>
    <Dialog :open="open" @update:open="handleOpenChange">
        <DialogContent class="max-w-[85vw] xl:max-w-250 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{{ isEditMode ? 'Edit Project' : 'New Project' }}</DialogTitle>
                <DialogDescription>
                    {{ isEditMode ? 'Update project information' : 'Create a new project' }}
                </DialogDescription>
            </DialogHeader>

            <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="flex gap-2 border-b border-border">
                    <button type="button" @click="activeTab = 'edit'"
                        :class="tabClass(activeTab === 'edit')">Edit</button>
                    <button type="button" @click="activeTab = 'preview'"
                        :class="tabClass(activeTab === 'preview')">Preview</button>
                </div>

                <div v-show="activeTab === 'edit'" class="space-y-6">

                    <div class="border border-border rounded-lg overflow-hidden">
                        <div class="flex border-b border-border bg-muted/30">
                            <button type="button" @click="langTab = 'en'" :class="[
                                'px-5 py-2 text-sm font-medium transition-colors border-b-2',
                                langTab === 'en'
                                    ? 'border-primary text-primary bg-background'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            ]">🇺🇸 English</button>
                            <button type="button" @click="langTab = 'zh'" :class="[
                                'px-5 py-2 text-sm font-medium transition-colors border-b-2',
                                langTab === 'zh'
                                    ? 'border-primary text-primary bg-background'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            ]">🇹🇼 中文</button>
                        </div>
                        <div class="p-4 space-y-4">
                            <template v-if="langTab === 'en'">
                                <div class="space-y-2">
                                    <Label for="title-en">Title *</Label>
                                    <Input id="title-en" v-model="formData.title_en" required
                                        placeholder="My Project" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="desc-en">Description</Label>
                                    <Textarea id="desc-en" v-model="formData.description_en" rows="4"
                                        placeholder="A short description..." />
                                </div>
                                <div class="space-y-2">
                                    <Label for="contrib-en">Contribution</Label>
                                    <Textarea id="contrib-en" v-model="formData.contribution_en" rows="3"
                                        placeholder="What I contributed..." />
                                </div>
                            </template>
                            <template v-else>
                                <div class="space-y-2">
                                    <Label for="title-zh">標題 *</Label>
                                    <Input id="title-zh" v-model="formData.title_zh" required placeholder="我的專案" />
                                </div>
                                <div class="space-y-2">
                                    <Label for="desc-zh">描述</Label>
                                    <Textarea id="desc-zh" v-model="formData.description_zh" rows="4"
                                        placeholder="簡短的描述..." />
                                </div>
                                <div class="space-y-2">
                                    <Label for="contrib-zh">貢獻</Label>
                                    <Textarea id="contrib-zh" v-model="formData.contribution_zh" rows="3"
                                        placeholder="我的貢獻..." />
                                </div>
                            </template>
                        </div>
                    </div>

                    <!-- Image -->
                    <div class="space-y-2">
                        <Label for="image">Image URL</Label>
                        <Input id="image" v-model="formData.image" type="url"
                            placeholder="https://example.com/image.jpg" />
                        <img v-if="formData.image" :src="formData.image" alt="Preview"
                            class="mt-2 w-32 h-32 object-cover rounded-md" />
                    </div>

                    <!-- Links -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="github">GitHub URL</Label>
                            <Input id="github" v-model="formData.github_url" type="url" />
                        </div>
                        <div class="space-y-2">
                            <Label for="live">Live URL</Label>
                            <Input id="live" v-model="formData.live_url" type="url" />
                        </div>
                    </div>

                    <!-- Skills -->
                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <Label>Skills</Label>
                            <span class="text-xs text-muted-foreground">{{ (formData.skill_ids ?? []).length }}
                                selected</span>
                        </div>
                        <div v-if="isSkillsLoading" class="text-sm text-muted-foreground">Loading skills...</div>
                        <div v-else class="flex flex-wrap gap-2">
                            <button v-for="skill in (skills ?? [])" :key="skill.id" type="button"
                                @click="toggleSkill(skill.id)" :class="[
                                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border transition-colors cursor-pointer',
                                    (formData.skill_ids ?? []).includes(skill.id)
                                        ? 'border-transparent text-white'
                                        : 'border-border bg-background text-muted-foreground hover:text-foreground'
                                ]" :style="(formData.skill_ids ?? []).includes(skill.id)
                                    ? { background: skill.color ?? '#6b7280' }
                                    : {}">
                                <span class="w-2 h-2 rounded-full shrink-0" :style="(formData.skill_ids ?? []).includes(skill.id)
                                    ? { background: 'white' }
                                    : { background: skill.color ?? '#6b7280' }" />
                                {{ skill.name }}
                            </button>
                        </div>
                    </div>

                    <!-- Status, Type, Featured, Enabled -->
                    <div class="grid grid-cols-4 gap-4">
                        <div class="space-y-2">
                            <Label for="status">Status *</Label>
                            <Select v-model="formData.status" required>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="planned">Planned</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div class="space-y-2">
                            <Label for="type">Type *</Label>
                            <Input id="type" v-model="formData.project_type" required placeholder="Web, Mobile, etc." />
                        </div>
                        <div class="space-y-2">
                            <Label class="flex items-center gap-2 cursor-pointer mt-8">
                                <input v-model="formData.featured" type="checkbox"
                                    class="w-4 h-4 rounded border-input" />
                                <span>Featured</span>
                            </Label>
                        </div>
                        <div class="space-y-2">
                            <Label class="flex items-center gap-2 cursor-pointer mt-8">
                                <input v-model="formData.enabled" type="checkbox"
                                    class="w-4 h-4 rounded border-input" />
                                <span>Enabled</span>
                                <span class="text-xs"
                                    :class="formData.enabled ? 'text-green-500' : 'text-muted-foreground'">
                                    {{ formData.enabled ? '(公開顯示)' : '(隱藏)' }}
                                </span>
                            </Label>
                        </div>
                    </div>

                    <!-- Dates -->
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="start-date">Start Date</Label>
                            <Input id="start-date" v-model="formData.start_date" type="date" />
                        </div>
                        <div class="space-y-2">
                            <Label for="end-date">End Date</Label>
                            <Input id="end-date" v-model="formData.end_date" type="date" />
                        </div>
                    </div>
                </div>

                <!-- Preview Tab -->
                <div v-show="activeTab === 'preview'" class="space-y-4">
                    <div class="flex gap-2">
                        <button type="button" @click="previewLang = 'en'" :class="tabClass(previewLang === 'en')">🇺🇸
                            English</button>
                        <button type="button" @click="previewLang = 'zh'" :class="tabClass(previewLang === 'zh')">🇹🇼
                            中文</button>
                    </div>
                    <div class="bg-muted p-6 rounded-lg">
                        <div v-if="formData.image" class="mb-4">
                            <img :src="formData.image" alt="Project" class="w-full h-48 object-cover rounded-lg" />
                        </div>
                        <h2 class="text-2xl font-bold mb-1">
                            {{ (previewLang === 'en' ? formData.title_en : formData.title_zh) || 'Untitled' }}
                        </h2>
                        <p v-if="previewLang === 'en' ? formData.description_en : formData.description_zh"
                            class="text-muted-foreground mb-3">
                            {{ previewLang === 'en' ? formData.description_en : formData.description_zh }}
                        </p>
                        <p v-if="previewLang === 'en' ? formData.contribution_en : formData.contribution_zh"
                            class="text-sm text-foreground mb-4">
                            {{ previewLang === 'en' ? formData.contribution_en : formData.contribution_zh }}
                        </p>
                        <div v-if="(formData.skill_ids ?? []).length > 0" class="flex flex-wrap gap-2">
                            <span v-for="skill in selectedSkills" :key="skill.id"
                                class="px-3 py-1 rounded-full text-sm text-white"
                                :style="{ backgroundColor: skill.color ?? '#6b7280' }">
                                {{ skill.name }}
                            </span>
                        </div>
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
import { ref, reactive, computed } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { projectService } from '@/services/projectService'
import { useAppFeedback } from '@/composables/useAppFeedback'
import { useSkillsQuery } from '@/queries/skillQueries'
import type { Project } from '@/types'
import type { CreateProjectDto } from '@/services/projectService'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const props = defineProps<{ project?: Project | null }>()
const emit = defineEmits<{ close: []; save: [] }>()

const feedback = useAppFeedback()
const activeTab = ref<'edit' | 'preview'>('edit')
const langTab = ref<'en' | 'zh'>('en')
const previewLang = ref<'en' | 'zh'>('en')
const open = ref(true)

const isEditMode = computed(() => !!props.project)

function tabClass(active: boolean) {
    return [
        'px-4 py-2 font-medium border-b-2 transition-colors text-sm',
        active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
    ]
}

const formData = reactive<CreateProjectDto>({
    title_en: '',
    title_zh: '',
    description_en: '',
    description_zh: '',
    contribution_en: '',
    contribution_zh: '',
    image: '',
    skill_ids: [],
    github_url: '',
    live_url: '',
    status: 'planned',
    project_type: '',
    featured: false,
    enabled: true,
    start_date: '',
    end_date: '',
})

if (props.project) {
    Object.assign(formData, {
        title_en: props.project.title_en,
        title_zh: props.project.title_zh,
        description_en: props.project.description_en || '',
        description_zh: props.project.description_zh || '',
        contribution_en: props.project.contribution_en || '',
        contribution_zh: props.project.contribution_zh || '',
        image: props.project.image || '',
        skill_ids: [...(props.project.skill_ids ?? [])],
        github_url: props.project.github_url || '',
        live_url: props.project.live_url || '',
        status: props.project.status,
        project_type: props.project.project_type,
        featured: props.project.featured || false,
        enabled: props.project.enabled ?? true,
        start_date: props.project.start_date || '',
        end_date: props.project.end_date || '',
    })
}

const { data: skills, isLoading: isSkillsLoading } = useSkillsQuery()

const selectedSkills = computed(() =>
    (skills.value ?? []).filter(s => (formData.skill_ids ?? []).includes(s.id))
)

function toggleSkill(id: string) {
    if (!formData.skill_ids) formData.skill_ids = []
    const idx = formData.skill_ids.indexOf(id)
    if (idx === -1) {
        formData.skill_ids.push(id)
    } else {
        formData.skill_ids.splice(idx, 1)
    }
}

const { mutate: saveProject, isPending: isSubmitting } = useMutation({
    mutationFn: () => {
        if (isEditMode.value && props.project) {
            return projectService.updateProject(props.project.id, formData)
        }
        return projectService.createProject(formData)
    },
    onSuccess: () => {
        feedback.success(
            isEditMode.value ? 'Project updated successfully' : 'Project created successfully',
            isEditMode.value ? 'Updated' : 'Created',
        )
        emit('save')
    },
    onError: (err) => {
        feedback.showError(err, isEditMode.value ? 'Failed to update project' : 'Failed to create project')
    },
})

function handleOpenChange(isOpen: boolean) {
    if (!isOpen) emit('close')
}

function handleSubmit() {
    saveProject()
}
</script>
