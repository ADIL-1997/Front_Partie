<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div
      :class="[
        'animate-spin rounded-full border-2 border-gray-300 border-t-primary-600',
        sizeClass
      ]"
    ></div>
    <span v-if="text" class="ml-3 text-sm text-gray-600 dark:text-gray-400">
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  fullScreen: false
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-4 w-4';
    case 'lg':
      return 'h-8 w-8';
    default:
      return 'h-6 w-6';
  }
});

const containerClass = computed(() => 
  props.fullScreen ? 'min-h-screen' : 'py-4'
);
</script>