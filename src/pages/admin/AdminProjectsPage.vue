<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header Actions -->
      <div class="flex justify-between items-center">
        <div class="flex-1 max-w-md">
          <Input v-model="searchQuery" type="text" placeholder="Search projects..." />
        </div>
        <Button @click="openCreateDialog">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </Button>
      </div>

      <!-- Projects Table -->
      <div class="bg-card rounded-lg border border-border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Enabled</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="isLoading">
              <TableCell colspan="6" class="text-center text-muted-foreground">
                Loading projects...
              </TableCell>
            </TableRow>
            <TableRow v-else-if="filteredProjects.length === 0">
              <TableCell colspan="6" class="text-center text-muted-foreground">
                No projects found
              </TableCell>
            </TableRow>
            <TableRow v-else v-for="project in filteredProjects" :key="project.id"
              :class="!project.enabled ? 'opacity-50' : ''">
              <TableCell>
                <div class="flex items-center gap-3">
                  <img v-if="project.image" :src="project.image" :alt="project.title_en"
                    class="w-12 h-12 rounded object-cover" />
                  <div>
                    <div class="font-medium">{{ project.title_en }}</div>
                    <div class="text-sm text-muted-foreground">{{ project.title_zh }}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusClass(project.status)">
                  {{ project.status }}
                </span>
              </TableCell>
              <TableCell>{{ project.project_type }}</TableCell>
              <TableCell>
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="project.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-muted text-muted-foreground'">
                  {{ project.featured ? 'Yes' : 'No' }}
                </span>
              </TableCell>
              <TableCell>
                <button type="button" @click="toggleEnabled(project)" :disabled="togglingId === project.id"
                  class="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer disabled:opacity-50"
                  :class="project.enabled ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-muted text-muted-foreground hover:bg-muted/70'">
                  <span class="w-1.5 h-1.5 rounded-full" :class="project.enabled ? 'bg-green-500' : 'bg-gray-400'" />
                  {{ project.enabled ? 'Public' : 'Hidden' }}
                </button>
              </TableCell>
              <TableCell class="text-right">
                <div class="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" @click="openEditDialog(project)">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" @click="handleDelete(project)"
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
    <ProjectDialog v-if="showDialog" :project="selectedProject" @close="closeDialog" @save="handleSave" />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import ProjectDialog from '@/components/admin/ProjectDialog.vue'
import { getAllProjects } from '@/queries/projectQueries'
import { projectService } from '@/services/projectService'
import { useAppFeedback } from '@/composables/useAppFeedback'
import { useRouteQueryCancel } from '@/composables/useRouteQueryCancel'
import type { Project } from '@/types'
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

const queryClient = useQueryClient()
const feedback = useAppFeedback()
const searchQuery = ref('')
const showDialog = ref(false)
const selectedProject = ref<Project | null>(null)
const togglingId = ref<string | null>(null)

useRouteQueryCancel({ queryKey: ['admin-projects'] })

const { data: projects, isLoading } = useQuery({
  queryKey: ['admin-projects'],
  queryFn: ({ signal }) => getAllProjects({ signal }),
})

const filteredProjects = computed(() => {
  if (!projects.value) return []
  if (!searchQuery.value) return projects.value
  const query = searchQuery.value.toLowerCase()
  return projects.value.filter((p: Project) =>
    p.title_en.toLowerCase().includes(query) ||
    p.title_zh.toLowerCase().includes(query) ||
    p.description_en?.toLowerCase().includes(query) ||
    p.description_zh?.toLowerCase().includes(query)
  )
})

const { mutate: deleteProject } = useMutation({
  mutationFn: (project: Project) => projectService.deleteProject(project.id),
  onSuccess: (_, project) => {
    feedback.success(`"${project.title_en}" has been deleted.`, 'Deleted')
    queryClient.invalidateQueries({ queryKey: ['admin-projects'] })
  },
  onError: (err) => {
    feedback.showError(err, 'Failed to delete project')
  },
})

const { mutate: toggleProjectEnabled } = useMutation({
  mutationFn: (project: Project) => projectService.toggleEnabled(project.id),
  onSuccess: (_, project) => {
    feedback.success(`"${project.title_en}" has been updated.`, 'Updated')
    queryClient.invalidateQueries({ queryKey: ['admin-projects'] })
  },
  onError: (err) => {
    feedback.showError(err, 'Failed to update project')
  },
  onSettled: () => {
    togglingId.value = null
  },
})

function getStatusClass(status: string) {
  const classes = {
    completed: 'bg-green-100 text-green-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    planned: 'bg-muted text-muted-foreground',
  }
  return classes[status as keyof typeof classes] || classes.planned
}

function openCreateDialog() {
  selectedProject.value = null
  showDialog.value = true
}

function openEditDialog(project: Project) {
  selectedProject.value = project
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
  selectedProject.value = null
}

async function handleSave() {
  await queryClient.invalidateQueries({ queryKey: ['admin-projects'] })
  closeDialog()
}

async function handleDelete(project: Project) {
  const confirmed = await feedback.confirm({
    title: 'Delete Project',
    message: `Are you sure you want to delete "${project.title_en}"?`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    variant: 'destructive',
  })
  if (!confirmed) return
  deleteProject(project)
}

function toggleEnabled(project: Project) {
  togglingId.value = project.id
  toggleProjectEnabled(project)
}
</script>
