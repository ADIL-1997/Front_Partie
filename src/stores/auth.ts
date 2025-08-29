import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types';
import axios from 'axios';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(false);

  const isAuthenticated = computed(() => !!user.value);
  axios.defaults.baseURL = 'http://localhost:8000';
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken= true  ;
 

  const getCsrf = async () => {
    await axios.get('/sanctum/csrf-cookie');
  };


 
  
  const login = async (email: string, password: string): Promise<void> => {
    loading.value = true;
    try {
      await getCsrf();
      const response = await axios.post('/api/login', { email, password });
      user.value = response.data.user; // keep only once
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      loading.value = false;
    }
  };


  const register = async (name: string, email: string, password: string,confirmPassword:string): Promise<void> => {
    loading.value = true;
    try {
      await getCsrf();
      const response = await axios.post('/api/register', { name, email, password,password_confirmation: confirmPassword });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      user.value =response.data.user
      
      localStorage.setItem('auth_token', 'mock_token_123');
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    } finally {
      loading.value = false;
    }
  };

  
  const logout = async () => {
    try {
      await getCsrf();
      await axios.post("http://localhost:8000/api/logout",{ withCredentials: true });
      
      user.value = null;
      router.push('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const checkAuth = async () => {
    try {
      // Get CSRF cookie first
      await axios.get('http://localhost:8000/sanctum/csrf-cookie');

      const response = await axios.get("http://localhost:8000/api/user", { withCredentials: true });
      // Set user from response
      user.value = response.data.user;
      return true;
    } catch (error: any) {
      console.error("Failed to get user:", error);
      // If we get "Unauthenticated" message, clear the user and redirect to login
      // if (error.response?.data?.message === "Unauthenticated.") {
      //   user.value = null;
      //   // Redirect to login page
      //   window.location.href = '/login';
      // }
      return false;
    }
  };

  // const initAuth = async () => {
  //   // Check if user is authenticated on app startup
  //   await checkAuth();
  // };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth
    
  };
});