<template>
  <AppLayout>
    <div class="p-6 lg:p-8">
      <LoadingSpinner v-if="projectsStore.loading" text="Loading project..." fullScreen />
      
      <div v-else-if="project" class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-4 mb-4">
              <router-link  
                to="/dashboard"
                class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <ArrowLeftIcon class="h-5 w-5" />
              </router-link>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ project.titre }}
              </h1>
            </div>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              {{ project.description }}
            </p>
            
          
          </div>
          
          <div class="flex space-x-3 mt-4 sm:mt-0">
            <router-link
              :to="`/projects/${project.id}/tasks/create`"
              class="btn-primary inline-flex items-center"
            >
              <PlusIcon class="mr-2 h-4 w-4" />
              New Task
            </router-link>
            <router-link
              :to="`/projects/${project.id}/edit`"
              class="btn-secondary inline-flex items-center"
            >
              <PencilIcon class="mr-2 h-4 w-4" />
              Edit
            </router-link>
          </div>
        </div>

       
       

        <!-- Task Boards -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- To Do -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-900 dark:text-white flex items-center">
                <span class="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                To Do
              </h3>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ tasksStore.tasksByStatus.todo.length }}
              </span>
            </div>
            <div
              class="space-y-3 min-h-[200px]"
              @drop="handleDrop($event, 'todo')"
              @dragover.prevent
              @dragenter.prevent
            >
              <TaskCard
                v-for="task in tasksStore.tasksByStatus.todo"
                :key="task.id"
                :task="task"
                @edit="handleEditTask"
                @delete="handleDeleteTask"
                @statusChange="handleStatusChange"
                @dragStart="handleDragStart"
                class="group"
              />
            </div>
          </div>

          <!-- In Progress -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-900 dark:text-white flex items-center">
                <span class="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
                In Progress
              </h3>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ tasksStore.tasksByStatus['in-progress'].length }}
              </span>
            </div>
            <div
              class="space-y-3 min-h-[200px]"
              @drop="handleDrop($event, 'in-progress')"
              @dragover.prevent
              @dragenter.prevent
            >
              <TaskCard
                v-for="task in tasksStore.tasksByStatus['in-progress']"
                :key="task.id"
                :task="task"
                @edit="handleEditTask"
                @delete="handleDeleteTask"
                @statusChange="handleStatusChange"
                @dragStart="handleDragStart"
                class="group"
              />
            </div>
          </div>

          <!-- Done -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-gray-900 dark:text-white flex items-center">
                <span class="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
                Done
              </h3>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ tasksStore.tasksByStatus.done.length }}
              </span>
            </div>
            <div
              class="space-y-3 min-h-[200px]"
              @drop="handleDrop($event, 'done')"
              @dragover.prevent
              @dragenter.prevent
            >
              <TaskCard
                v-for="task in tasksStore.tasksByStatus.done"
                :key="task.id"
                :task="task"
                @edit="handleEditTask"
                @delete="handleDeleteTask"
                @statusChange="handleStatusChange"
                @dragStart="handleDragStart"
                class="group"
              />
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
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Delete Task</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
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
                :disabled="tasksStore.loading"
                class="btn-danger flex items-center"
              >
                <LoadingSpinner v-if="tasksStore.loading" size="sm" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectsStore } from '@/stores/projects';
import { useTasksStore } from '@/stores/tasks';
import type { Task, TaskStatus } from '@/types';
import AppLayout from '@/components/AppLayout.vue';
import TaskCard from '@/components/TaskCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon
} from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();
const projectsStore = useProjectsStore();
const tasksStore = useTasksStore();

const showDeleteModal = ref(false);
const taskToDelete = ref<string | null>(null);
const draggedTask = ref<Task | null>(null);

const project = computed(() => projectsStore.currentProject);

const progressPercentage = computed(() => {
  if (!project.value || project.value.taskCount === 0) return 0;
  return Math.round((project.value.completedTaskCount / project.value.taskCount) * 100);
});

const handleEditTask = (taskId: string) => {
  
  router.push(`/projects/${route.params.id}/tasks/${taskId}/edit`);
};

const handleDeleteTask = (taskId: string) => {
  taskToDelete.value = taskId;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (taskToDelete.value) {
    try {
      await tasksStore.deleteTask(taskToDelete.value);
      showDeleteModal.value = false;
      taskToDelete.value = null;
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  }
};

const handleStatusChange = async (taskId: string, status: string) => {
  try {
    await tasksStore.updateTaskStatus(taskId, status as TaskStatus);
  } catch (error) {
    console.error('Failed to update task status:', error);
  }
};

const handleDragStart = (task: Task) => {
  draggedTask.value = task;
};

const handleDrop = async (event: DragEvent, status: TaskStatus) => {
  event.preventDefault();
  
  if (draggedTask.value && draggedTask.value.status !== status) {
    try {
      await tasksStore.updateTaskStatus(draggedTask.value.id, status);
      draggedTask.value = null;
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  }
};

onMounted(async () => {
  const projectId = route.params.id as string
  try {
    await Promise.all([
      projectsStore.fetchProject(projectId),
      tasksStore.fetchTasks(projectId)
    ])
  } catch (err) {
    console.error('Failed to load project details:', err)
    // optional: redirect back if project not found
    router.push({ name: 'ProjectsList' })
  }
})
</script>