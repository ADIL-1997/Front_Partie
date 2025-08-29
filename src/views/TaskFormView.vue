<template>
  <AppLayout>
    <div class="p-6 lg:p-8">
      <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="flex items-center space-x-4 mb-8">
          <router-link
            :to="`/projects/${projectId}`"
            class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeftIcon class="h-5 w-5" />
          </router-link>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Task' : 'Create New Task' }}
          </h1>
        </div>

        <!-- Form -->
        <div class="card">
          <TaskForm
            :task="currentTask"
            :project-id="projectId"
            :loading="tasksStore.loading"
            @submit="handleSubmit"
            @cancel="handleCancel"
          />
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTasksStore } from '@/stores/tasks';
import type { Task } from '@/types';
import AppLayout from '@/components/AppLayout.vue';
import TaskForm from '@/components/TaskForm.vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();
const tasksStore = useTasksStore();

const currentTask = ref<Task | undefined>();
const projectId = computed(() => route.params.projectId as string);
const isEditing = computed(() => !!route.params.id);



const handleCancel = () => {
  router.push(`/projects/${projectId.value}`);
};

onMounted(async () => {
  if (isEditing.value) {
   
    
    // Find the current task
    const taskId = route.params.id as string;
    currentTask.value = await tasksStore.getTaskById(taskId);
    console.log("currentTask.value",currentTask.value)
  }
});
</script>