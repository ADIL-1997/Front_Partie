<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Mobile menu button -->
     <!-- Menu button - show when sidebar is closed -->
  <div v-if="!sidebarOpen" class="lg:hidden fixed top-4 right-4 z-50">
    <button
      @click="sidebarOpen = true"
      class="p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
      aria-label="Open sidebar"
    >
      <Bars3Icon class="h-6 w-6" />
    </button>
  </div>

  <!-- Close button - show when sidebar is open, positioned on the sidebar -->
  <div v-if="sidebarOpen" class="lg:hidden fixed top-4 right-4 z-50">
    <button
      @click="sidebarOpen = false"
      class="p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
      aria-label="Close sidebar"
    >
      <XMarkIcon class="h-6 w-6" />
    </button>
  </div>

    <!-- Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">Gestion des projets</h1>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-2">
          <router-link
            to="/dashboard"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="$route.name === 'Dashboard' 
              ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' 
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'"
            @click="sidebarOpen = false"
          >
            <HomeIcon class="mr-3 h-5 w-5" />
            Dashboard
          </router-link>
          
          <router-link
            to="/projects/create"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="$route.name === 'CreateProject' 
              ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' 
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'"
            @click="sidebarOpen = false"
          >
            <PlusIcon class="mr-3 h-5 w-5" />
            New Project
          </router-link>

          <router-link
            to="/tasks"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="$route.name === 'My Tasks' 
              ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300' 
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'"
            @click="sidebarOpen = false"
          >
            <DocumentPlusIcon class="mr-3 h-5 w-5" />
            My Tasks
          </router-link>
        </nav>

        <!-- User menu -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-3 mb-4">
            <img
              :src="authStore.user?.avatar"
              :alt="authStore.user?.name"
              class="w-8 h-8 rounded-full object-cover"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ authStore.user?.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ authStore.user?.email }}
              </p>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon class="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="lg:pl-64 sm:py-6 md:py-6">
      <main class="min-h-screen">
        <slot />
      </main>
    </div>

    <!-- Mobile backdrop -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
      @click="sidebarOpen = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
  DocumentPlusIcon 
} from '@heroicons/vue/24/outline';

const router = useRouter();
const authStore = useAuthStore();
const sidebarOpen = ref(false);

const handleLogout = () => {
  authStore.logout();
};
</script>