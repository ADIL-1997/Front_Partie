<template>
    <AppLayout>
        <div class="p-6 lg:p-8">
            <LoadingSpinner v-if="tasksStore.loading" text="Loading tasks..." fullScreen />
            
            <div v-else-if="tasksStore" class="space-y-6">
                
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                    My Tasks
                </h1>
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
                        :insideProject="false"
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
                        :insideProject="false"
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
                        :insideProject="false"
                        />
                    </div>
                    </div>
                </div>
              
            </div>
           
        </div>
    </AppLayout>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useTasksStore } from '@/stores/tasks';
  import type { Task, TaskStatus } from '@/types';
  import AppLayout from '@/components/AppLayout.vue';
  import TaskCard from '@/components/TaskCard.vue';
  import LoadingSpinner from '@/components/LoadingSpinner.vue';

  const tasksStore = useTasksStore();
  
  const draggedTask = ref<Task | null>(null);

  
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
    
    try {
      await Promise.all([
        tasksStore.fetchUserTasks()
      ])
    } catch (err) {
      console.error('Failed to load user tasks:', err)
    }
  })
  </script>