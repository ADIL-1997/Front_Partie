<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Projects</h2>

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
                   @click="deleteProject(project.id)"
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
        :disabled="!pagination.prev_page_url"
        @click="fetchProjects(pagination.current_page - 1)"
      >
        Prev
      </button>
      <span class="px-3 py-1 border rounded">{{ pagination.current_page }} / {{ pagination.last_page }}</span>
      <button
        class="px-3 py-1 border rounded hover:bg-gray-100"
        :disabled="!pagination.next_page_url"
        @click="fetchProjects(pagination.current_page + 1)"
      >
        Next
      </button>
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

// Pagination info
const pagination = ref({
  current_page: 1,
  last_page: 1,
  next_page_url: null,
  prev_page_url: null,
});

const fetchProjects = async (page = 1) => {
  await projectsStore.fetchProjects(page);
  projects.value = projectsStore.projects;
  loading.value = projectsStore.loading;
  error.value = projectsStore.error;

  // Update pagination
  pagination.value = projectsStore.pagination || pagination.value;
};


// Delete a project
const deleteProject = async (id: number) => {
  // if (!confirm('Are you sure you want to delete this project?')) return
  await projectsStore.deleteProject(id)
  fetchProjects(pagination.value.current_page) // refresh list
}


</script>
