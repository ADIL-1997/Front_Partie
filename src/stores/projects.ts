import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Project } from '@/types';
import axios from 'axios';

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([]);
  const currentProject = ref<Project | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  

  const fetchProjects = async (page = 1): Promise<void> => {
    loading.value = true;
    error.value = null;
  
    try {
      const response = await axios.get(`http://localhost:8000/api/projects?page=${page}`, {
        withCredentials: true, // Important for Sanctum SPA auth
      });
  
      // Set projects from response
      projects.value = response.data.data;
  
     
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch projects';
    } finally {
      loading.value = false;
    }
  };
  

  const fetchProject = async (id: string): Promise<void> => {
    loading.value = true
    error.value = null
  
    try {
      // Call your API to get a single project by ID
      const response = await axios.get(`http://localhost:8000/api/projects/${id}`, {
        withCredentials: true, // if using Sanctum SPA auth
      })
  
      // Assign the fetched project to the store
      currentProject.value = response.data.data
  
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch project details'
      currentProject.value = null
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  

  const createProject = async (projectData: { title: string; description: string }): Promise<void> => {
    
    console.log('Store: entering createProject'); 
    
    loading.value = true;
    error.value = null;
  
    try {
      
      // 1️⃣ Get CSRF cookie first (required for Sanctum SPA auth)
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
  
      // 2️⃣ Call backend API to create the project
      const response = await axios.post(
        'http://localhost:8000/api/projects',
        {
          titre: projectData.title,
          description: projectData.description,
        },
        { withCredentials: true } // send cookies
      );
  
      // 3️⃣ Add the newly created project to local state
      const newProject: Project = {
        ...response.data.data, // assuming your ProjectResource returns data as { data: {...} }
        taskCount: 0,
        completedTaskCount: 0,
      };
  
      projects.value.unshift(newProject);
  
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create project';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  

  const updateProject = async (id: string, projectData: Partial<Project>): Promise<void> => {
    loading.value = true;
    error.value = null;
   
    try {
      // 1️⃣ Get CSRF cookie if using Laravel Sanctum (required for state-changing requests)
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
     
      // 2️⃣ Send PUT or PATCH request to update project
      const response = await axios.put(
        `http://localhost:8000/api/projects/${id}`,
        {
          // userId:id,
          titre: projectData.title, // or projectData.titre depending on backend
          description: projectData.description,
        },
        { withCredentials: true } // include cookies
      );
       
      // 3️⃣ Update local state with response
      const updatedProject: Project = {
        ...response.data.data, // assuming backend returns { data: {...} }
      };
  
      const index = projects.value.findIndex(p => p.id === id);
      if (index !== -1) {
        projects.value[index] = updatedProject;
      }
  
      if (currentProject.value?.id === id) {
        currentProject.value = updatedProject;
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update project';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  

  const deleteProject = async (id: Number): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      // Call your API to delete the project
      await axios.delete(`/api/projects/${id}`);
  
      // Update local state after success
      projects.value = projects.value.filter(p => p.id !== id);
  
      // Reset current project if it's the deleted one
      if (currentProject.value?.id === id) {
        currentProject.value = null;
      }
    } catch (err) {
      error.value = 'Failed to delete project';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };
  

  return {
    projects,
    currentProject,
    loading,
    error,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject
  };
});