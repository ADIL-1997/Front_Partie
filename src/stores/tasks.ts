// stores/tasks.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import type { Task, TaskStatus } from '@/types'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    tasksStatistics: { completedTasksCount: '', pendingTasksCount: '' },
    loading: false,
  }),

  getters: {
    tasksByStatus: (state) => ({
      todo: state.tasks.filter(t => t.status === 'todo'),
      'in-progress': state.tasks.filter(t => t.status === 'in-progress'),
      done: state.tasks.filter(t => t.status === 'done'),
    })
  },

  actions: {
    //  fetch a single task by projectId and taskId
  async fetchTask(projectId: string | number, taskId: string | number): Promise<Task | null> {
    this.loading = true
    try {
      const res = await axios.get(`http://localhost:8000/api/projects/${projectId}/tasks/${taskId}`)
      const task: Task = res.data

      // Update the tasks array: replace existing task if exists, or push new
      const idx = this.tasks.findIndex(t => t.id === task.id)
      if (idx !== -1) {
        this.tasks[idx] = task
      } else {
        this.tasks.push(task)
      }

      return task
    } catch (err) {
      console.error('Error fetching task:', err)
      return null
    } finally {
      this.loading = false
    }
  },

    async fetchTasks(projectId: string | number) {
      this.loading = true
      try {
        const res = await axios.get(`http://localhost:8000/api/projects/${projectId}/tasks`)
        this.tasks = res.data   // <--- backend returns an array
      } catch (err) {
        console.error('Error fetching tasks:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchUserTasks() {
      this.loading = true
      try {
        const res = await axios.get(`http://localhost:8000/api/userTasks`)
        this.tasks = res.data   // <--- backend returns an array
      } catch (err) {
        console.error('Error fetching tasks:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchUserTasks_statistics() {
      this.loading = true
      try {
        const res = await axios.get(`http://localhost:8000/api/userTasks_statistic`)
        this.tasksStatistics  = res.data   // <--- backend returns an array
      } catch (err) {
        console.error('Error fetching tasks statistics:', err)
      } finally {
        this.loading = false
      }
    },

      // Inside your tasks store
      async getTaskById(taskId: string | number) {
        try {
          const res = await axios.get(`http://localhost:8000/api/task/${taskId}`);
          return res.data; // This is your task object
        } catch (err) {
          console.error('Failed to fetch task:', err);
          return null;
        }
      },

    async storeTask(projectId: string | number, taskData: Partial<Task>) {
      try {
        this.loading = true
        console.log("taskkkkkkkkkk to add",projectId)
        const res = await axios.post(`http://localhost:8000/api/projects/${projectId}/tasks`, taskData)
        this.tasks.push(res.data)
      } catch (err) {
        this.loading = false
        console.error('Error creating task:', err)
      }
    },

    async updateTask(taskId: string | number, taskData: Partial<Task>) {
      this.loading = true
      try {
        console.log("taskkkkkkkkkk to updaate",taskId)
        const res = await axios.put(`http://localhost:8000/api/tasks/${taskId}`, taskData)
        // this.tasks.push(res.data)
      } catch (err) {
        this.loading = false
        console.error('Error creating task:', err)
      }
    },

    async updateTaskStatus(taskId: string | number, status: TaskStatus) {
      try {
        
        const res = await axios.patch(`http://localhost:8000/api/tasks/${taskId}/status`, { status })
        const idx = this.tasks.findIndex(t => t.id === taskId)
        if (idx !== -1) this.tasks[idx] = res.data
      } catch (err) {
        console.error('Error updating task status:', err)
      }
    },

    async deleteTask(taskId: string | number) {
      try {
        
        await axios.delete(`http://localhost:8000/api/tasks/${taskId}`)
        this.tasks = this.tasks.filter(t => t.id !== taskId)
      } catch (err) {
        console.error('Error deleting task:', err)
      }
    }


  }
})
