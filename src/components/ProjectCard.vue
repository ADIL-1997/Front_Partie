<template>
  <div class="p-4">
    

    <div v-if="loading" class="text-gray-500">Loading projects...</div>
    <div v-if="error" class="text-red-500 mb-2">{{ error }}</div>

    <table class="min-w-full bg-white border rounded-lg overflow-hidden">
      <thead>
        <tr class="bg-gray-100 text-left">
          <th class="px-4 py-2">Title</th>
          <th class="px-4 py-2">Description</th>
          <th class="px-4 py-2">Details</th>
          <th class="px-4 py-2">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in projects" :key="project.id" class="border-t">
          <td class="px-4 py-2">{{ project.titre }}</td>
          <td class="px-4 py-2">{{ project.description }}</td>
          <td class="px-4 py-2">
             <!-- Link to project detail -->
              <div class="flex ">
                <router-link
                  :to="`/projects/${project.id}`"
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  View Details
                </router-link>
              </div>
          </td>
          <td class="px-4 py-2">
            <!-- Link to project detail -->
              <div class="flex ">
                <button
                  class="bg-red-800  text-white font-bold py-2 px-2 rounded-full"
                   @click="openDeleteModal(project.id)"
                >
                  Delete
              </button>
              </div>
          </td>
          
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="mt-4 flex justify-center space-x-2">
      <button
        class="px-3 py-1 border rounded hover:bg-gray-100"
        :disabled="!pagination.prev"
        @click="fetchProjects(pagination.current_page - 1)"
      >
        Prev
      </button>
      <span class="px-3 py-1 border rounded">{{ pagination.current_page }} / {{ pagination.last_page }}</span>
      <button
        class="px-3 py-1 border rounded hover:bg-gray-100"
        :disabled="!pagination.next"
        @click="fetchProjects(pagination.current_page + 1)"
      >
        Next
      </button>
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
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useProjectsStore } from '@/stores/projects';

const projectsStore = useProjectsStore();

const projects = ref(projectsStore.projects);
const loading = ref(projectsStore.loading);
const error = ref(projectsStore.error);
const showDeleteModal = ref(false);
const projectToDelete = ref<string | null>(null);

// Pagination info
const pagination = ref({
  current_page: 1,
  last_page: 1,
  next: null,
  prev: null,
});

// Open modal and set project id
const openDeleteModal = (id: number) => {
  projectToDelete.value = id;
  showDeleteModal.value = true;
};

const fetchProjects = async (page = 1) => {
  await projectsStore.fetchProjects(page);
  projects.value = projectsStore.projects;
  loading.value = projectsStore.loading;
  error.value = projectsStore.error;

  // Update pagination
  pagination.value = {
    current_page: projectsStore.meta.current_page,
    last_page: projectsStore.meta.last_page,
    prev: projectsStore.links.prev,
    next: projectsStore.links.next,
  };
};

// Confirm and delete
const confirmDelete = async () => {
  if (!projectToDelete.value) return;

  await projectsStore.deleteProject(projectToDelete.value);
  showDeleteModal.value = false;
  projectToDelete.value = null;

  fetchProjects(pagination.value.current_page); // refresh list
};





</script>
