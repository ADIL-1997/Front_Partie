import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import type { User } from '@/types';

export const useUsersStore = defineStore('users', () => {
  const availableUsers = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchAvailableUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await axios.get('http://localhost:8000/api/users/available', {
        withCredentials: true,
      });
      availableUsers.value = response.data.data; // assuming backend returns { data: [...] }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch users';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  

  return { availableUsers, loading, error, fetchAvailableUsers };
});
