<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Title -->
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Title *
      </label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        required
        class="input-field"
        :class="{ 'border-red-500': errors.title }"
        placeholder="Enter task title"
      />
      <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
    </div>

    <!-- Description -->
    <div>
      <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Description
      </label>
      <textarea
        id="description"
        v-model="form.description"
        rows="3"
        class="input-field resize-none"
        placeholder="Enter task description"
      ></textarea>
    </div>

    <!-- Status -->
    <div>
      <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Status *
      </label>
      <select
        id="status"
        v-model="form.status"
        required
        class="input-field"
        :class="{ 'border-red-500': errors.status }"
      >
        <option value="">Select status</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status }}</p>
    </div>

    <!-- Priority -->
    <div>
      <label for="priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Priority *
      </label>
      <select
        id="priority"
        v-model="form.priority"
        required
        class="input-field"
        :class="{ 'border-red-500': errors.priority }"
      >
        <option value="">Select priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <p v-if="errors.priority" class="mt-1 text-sm text-red-600">{{ errors.priority }}</p>
    </div>

    <!-- Assigned User Dropdown -->
    <div>
      <label for="assignedTo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Assign to
      </label>
      <select
        id="assignedTo"
        v-model="form.assignedToId"
        class="input-field"
      >
        <option value="">Unassigned</option>
        <option
          v-for="user in availableUsers"
          :key="user.id"
          :value="user.id"
        >
          {{ user.name }} ({{ user.email }})
        </option>
      </select>
    </div>

    

    <!-- Submit buttons -->
    <div class="flex justify-end space-x-3 pt-6">
      <button
        type="button"
        @click="$emit('cancel')"
        class="btn-secondary"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="isLoading"
        class="btn-primary"
      >
        <LoadingSpinner v-if="isLoading" size="sm" />
        <span v-if="!isLoading">{{ isEditing ? 'Update Task' : 'Create Task' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue';
import type { Task, User, TaskStatus, TaskPriority } from '@/types';
import LoadingSpinner from './LoadingSpinner.vue';
import { useUsersStore } from '@/stores/users';
import { useTasksStore } from '@/stores/tasks';
import { useRoute, useRouter } from 'vue-router';
interface Props {
  task?: Task;
  projectId: string;
  loading?: boolean;
}

interface FormData {
  title: string;
  description: string;
  priority: TaskPriority | '';
  status: TaskStatus | '';
  assignedToId: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<{
  submit: [data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>];
  cancel: [];
}>();

const form = reactive<FormData>({
  title: '',
  description: '',
  priority: '',
  status: '',
  assignedToId: '',
});

const errors = ref<Partial<FormData>>({});
const isEditing = ref(false);
const isLoading = ref(false); 
const route = useRoute();
const router = useRouter();
// Users store
const usersStore = useUsersStore();

// task store 
const tasksStore = useTasksStore();

// Computed users for dropdown (excluding current user)
const availableUsers = computed(() =>
  usersStore.availableUsers.filter(user => user.id !== usersStore.currentUser?.id)
);

// Field validation
const validateForm = (): boolean => {
  errors.value = {};

  if (!form.title.trim()) {
    errors.value.title = 'Title is required';
  }

  if (!form.priority) {
    errors.value.priority = 'Priority is required';
  }

  if (!form.status) {
    errors.value.status = 'Status is required';
  }

  return Object.keys(errors.value).length === 0;
};
const projectId=Number(props.projectId);

const handleSubmit = async () => {
  if (!validateForm()) return;

  const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
    titre: form.title.trim(),
    description: form.description.trim(),
    priorite: form.priority as TaskPriority,
    status: form.status as TaskStatus,
    project_id: projectId,
    personne_assignee_id: form.assignedToId || null,
  };

  try {
    isLoading.value = true; // ✅ start loading
    if (props.task) {
      await tasksStore.updateTask(props.task.id, taskData);
    } else {
      await tasksStore.storeTask(projectId, taskData);
    }
    // redirect after success
    router.push(`/projects/${projectId}`);
  } catch (err: any) {
    errors.value.submit = err.response?.data?.message || 'Failed to save task';
    console.error('Failed to save task:', err);
  } finally {
    isLoading.value = false; // ✅ stop loading
  }
};


// Watch for task prop changes (for editing)
watch(() => props.task, (task) => {
  if (task) {
    
    isEditing.value = true;
    form.title = task.titre;
    form.description = task.description;
    form.priority = task.priorite;
    form.status = task.status;
    form.assignedToId = task.personne_assignee_id || '';
  } else {
    isEditing.value = false;
    form.status = 'todo';
    form.priority = 'medium';
  }
}, { immediate: true });

// Fetch users on mounted
onMounted(async () => {
  usersStore.fetchAvailableUsers();

 
  

});
</script>
