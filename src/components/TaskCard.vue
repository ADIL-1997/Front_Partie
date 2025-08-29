<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 cursor-move hover:shadow-md transition-shadow"
    :draggable="true"
    @dragstart="handleDragStart"
  >
    <!-- Task Header -->
    <div class="flex items-start justify-between mb-3">
      <h3 class="font-medium text-gray-900 dark:text-white text-sm">
        {{ task.title }} 
      </h3>
      <div class="flex space-x-1">
        <button
          @click="$emit('edit', task.id)"
          class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1"
          title="Edit task"
        >
          <PencilIcon class="h-4 w-4" />
        </button>
        <button
          @click="$emit('delete', task.id)"
          class="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1"
          title="Delete task"
        >
          <TrashIcon class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Task Description -->
    <p class="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
      {{ task.description }}
    </p>

    <!-- Task Details -->
    <div class="space-y-2">
      <!-- Status -->
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-500 dark:text-gray-400">Status:</span>
        <select
          :value="task.status"
          @change="handleStatusChange"
          class="text-xs px-6 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <!-- Priority -->
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-500 dark:text-gray-400">Priority:</span>
        <span
          class="text-xs px-2 py-1 rounded-full"
          :class="getPriorityClass(task.priorite)"
        >
          {{ task.priorite }}
        </span>
      </div>

      <!-- Assigned Person -->
      <div class="flex items-center justify-between">
        <span class="text-xs text-gray-500 dark:text-gray-400">Assigned:</span>
        <span class="text-xs text-gray-900 dark:text-white">
          {{ usersStore.availableUsers.find(u => u.id === task.personne_assignee_id)?.name || 'Unassigned'}}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task, TaskStatus } from '@/types';
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { onMounted } from 'vue';
import { useUsersStore } from '@/stores/users';


interface Props {
  task: Task;
}

const { task } = defineProps<Props>();

const emit = defineEmits<{
  edit: [taskId: string];
  delete: [taskId: string];
  statusChange: [taskId: string, status: TaskStatus];
  dragStart: [task: Task];
}>();

const handleStatusChange = (event: Event) => {
  
  const target = event.target as HTMLSelectElement;
  alert(target.value)
  emit('statusChange', task.id, target.value as TaskStatus);
};

const handleDragStart = () => {
  emit('dragStart', task);
};
const usersStore = useUsersStore();

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};
onMounted(async () => {
  usersStore.fetchAvailableUsers();
  
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
