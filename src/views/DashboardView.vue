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

      
      <!-- Stats -->
      <div  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
              <FolderIcon class="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
              <p v-if="projectsStore.projects.length >0" class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ !projectsStore.loading ? projectsStore.projects.length : '' }}
              </p>
              
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-emerald-100 dark:bg-emerald-900">
              <CheckCircleIcon class="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Tasks</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{ tasksStore.tasksStatistics.completedTasksCount }}
              </p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-amber-100 dark:bg-amber-900">
              <ClockIcon class="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Tasks</p>
              <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                {{  tasksStore.tasksStatistics.pendingTasksCount }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- Projects Grid -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Projects</h2>
        
        <LoadingSpinner v-if="projectsStore.loading" text="Loading projects..." />
        
        <div v-else-if="projectsStore.projects.length > 0" class="">
       
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

    
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useProjectsStore } from '@/stores/projects';
import { useTasksStore } from '@/stores/tasks';
import AppLayout from '@/components/AppLayout.vue';
import ProjectCard from '@/components/ProjectCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import {
  PlusIcon,
  FolderIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/vue/24/outline';



const authStore = useAuthStore();
const projectsStore = useProjectsStore();
const tasksStore = useTasksStore();


onMounted(async () => {
  await Promise.all([
    tasksStore.fetchUserTasks_statistics(),
    projectsStore.fetchProjects()
  ]);
});
</script>