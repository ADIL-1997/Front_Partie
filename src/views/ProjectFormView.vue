<template>
  <AppLayout>
    <div class="p-6 lg:p-8">
      <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="flex items-center space-x-4 mb-8">
          <router-link
            to="/dashboard"
            class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeftIcon class="h-5 w-5" />
          </router-link>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEditing ? 'Edit Project' : 'Create New Project' }}
          </h1>
        </div>

        <!-- Form -->
        <div class="card">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Title *
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                class="input-field"
                :class="{ 'border-red-500': errors.title }"
                placeholder="Enter project title"
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
                rows="4"
                class="input-field resize-none"
                placeholder="Describe your project"
              ></textarea>
            </div>

            

            <!-- Error message -->
            <div v-if="error" class="text-sm text-red-600 dark:text-red-400">
              {{ error }}
            </div>

            <!-- Submit buttons -->
            <div class="flex justify-end space-x-3 pt-6">
              <router-link
                to="/dashboard"
                class="btn-secondary"
              >
                Cancel
              </router-link>
              <button
                type="submit"
                :disabled="projectsStore.loading"
                class="btn-primary flex items-center"
              >
                <span v-if="projectsStore.loading" class="flex items-center">
                  <LoadingSpinner size="sm" />
                  <span class="ml-2">{{ isEditing ? 'Updating...' : 'Creating...' }}</span>
                </span>
                <span v-else>{{ isEditing ? 'Update Project' : 'Create Project' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import  {useProjectsStore}  from '@/stores/projects';



// import type { User } from '@/types';
import AppLayout from '@/components/AppLayout.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { ArrowLeftIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
// const router = useRouter();
const projectsStore = useProjectsStore();
console.log(projectsStore.createProject);
interface FormData {
  title: string;
  description: string;
}

const form = reactive<FormData>({
  id:'',
  title: '',
  description: '',
});

const errors = ref<Partial<FormData>>({});
const error = ref('');

const isEditing = computed(() => !!route.params.id);



const validateForm = (): boolean => {
  errors.value = {};
  
  if (!form.title.trim()) {
    alert('Project title is required');
    errors.value.title = 'Project title is required';
  }
  
  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  error.value = '';
  
  if (!validateForm()) return;
   
  try {
   
    const projectData = {
      id:form.id,
      title: form.title.trim(),
      description: form.description.trim(),
    }
    console.log('isEditing:', isEditing.value);
    if (isEditing.value) {
      await projectsStore.updateProject(projectData.id,projectData);
    } else {
      alert('Creating project.111..');
      await projectsStore.createProject(projectData);
    }
    
    // router.push('/dashboard');
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An error occurred';
  }
};






onMounted(async () => {
  if (isEditing.value) {
    const projectId = route.params.id as string;
    await projectsStore.fetchProject(projectId);
    
    const project = projectsStore.currentProject;
    if (project) {
      form.id=route.params.id
      form.title = project.titre;
      form.description = project.description;
    }
  }
});
</script>