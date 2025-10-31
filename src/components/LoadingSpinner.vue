<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div
      class="animate-spin rounded-full border-t-2 border-b-2"
      :class="[sizeClass, colorClass]"
      role="status"
      aria-label="Cargando"
    >
      <span class="sr-only">Cargando...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'orange' | 'pink' | 'purple' | 'white';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'orange'
});

const sizeClass = computed(() => {
  const sizes = {
    sm: 'h-5 w-5 sm:h-6 sm:w-6 border-2',
    md: 'h-10 w-10 sm:h-12 sm:w-12 border-2 sm:border-3',
    lg: 'h-14 w-14 sm:h-16 sm:w-16 border-3',
    xl: 'h-20 w-20 sm:h-24 sm:w-24 border-4'
  };
  return sizes[props.size];
});

const colorClass = computed(() => {
  const colors = {
    orange: 'border-altar-orange-500',
    pink: 'border-vibrant-pink-500',
    purple: 'border-deep-purple-600',
    white: 'border-white'
  };
  return colors[props.color];
});

const containerClass = computed(() => {
  const padding = {
    sm: 'p-2',
    md: 'p-3 sm:p-4',
    lg: 'p-4 sm:p-6',
    xl: 'p-6 sm:p-8'
  };
  return padding[props.size];
});
</script>
