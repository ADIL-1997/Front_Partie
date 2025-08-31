import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks',
    name: 'My Tasks',
    component: () => import('@/views/MyTasksView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/create',
    name: 'CreateProject',
    component: () => import('@/views/ProjectFormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/:id/edit',
    name: 'EditProject',
    component: () => import('@/views/ProjectFormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/:projectId/tasks/create',
    name: 'CreateTask',
    component: () => import('@/views/TaskFormView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/:projectId/tasks/:id/edit',
    name: 'EditTask',
    component: () => import('@/views/TaskFormView.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // If user is not set, try to check authentication
  if (!authStore.user) {
    await authStore.checkAuth();
  }
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (!to.meta.requiresAuth && authStore.isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;