<template>
  <AppLayout>
    <div class="p-6 lg:p-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Welcome back, {{ authStore.user?.name }}
          </p>
        </div>
        <router-link
          to="/projects/create"
          class="mt-4 sm:mt-0 btn-primary inline-flex items-center"
        >
          <PlusIcon class="mr-2 h-5 w-5" />
          New Project
        </router-link>
      </div>

      

      <!-- Projects Grid -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Projects</h2>
        
        <LoadingSpinner v-if="projectsStore.loading" text="Loading projects..." />
        
        <div v-else-if="projectsStore.projects.length > 0" class="">
          <!-- <ProjectCard
            v-for="project in projectsStore.projects"
            :key="project.id"
            :project="project"
            @edit="handleEditProject"
            @delete="handleDeleteProject"
          /> -->

          <ProjectCard/>
        </div>
        
        <div v-else class="text-center py-12">
          <FolderIcon class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new project.
          </p>
          <div class="mt-6">
            <router-link to="/projects/create" class="btn-primary">
              <PlusIcon class="mr-2 h-5 w-5" />
              New Project
            </router-link>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click.self="showDeleteModal = false"
      >
        <div class="card max-w-md w-full">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Delete Project</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete this project? This action cannot be undone.
          </p>
          <div class="flex space-x-3 justify-end">
            <button
              @click="showDeleteModal = false"
              class="btn-secondary"
            >
              Cancel
            </button>
            <button
              @click="confirmDelete"
              :disabled="projectsStore.loading"
              class="btn-danger flex items-center"
            >
              <LoadingSpinner v-if="projectsStore.loading" size="sm" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useProjectsStore } from '@/stores/projects';
import AppLayout from '@/components/AppLayout.vue';
import ProjectCard from '@/components/ProjectCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import {
  PlusIcon,
  FolderIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/vue/24/outline';


const router = useRouter();
const authStore = useAuthStore();
const projectsStore = useProjectsStore();

const showDeleteModal = ref(false);
const projectToDelete = ref<string | null>(null);




const handleEditProject = (id: string) => {
  router.push(`/projects/${id}/edit`);
};

const handleDeleteProject = (id: string) => {
  projectToDelete.value = id;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (projectToDelete.value) {
    try {
      await projectsStore.deleteProject(projectToDelete.value);
      showDeleteModal.value = false;
      projectToDelete.value = null;
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  }
};

onMounted(() => {
  projectsStore.fetchProjects();
  
});
</script>