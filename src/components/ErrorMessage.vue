<template>
  <div
    v-if="visible"
    class="bg-red-50 border border-red-400 text-red-800 px-3 sm:px-4 py-3 rounded-lg relative flex items-start gap-2 sm:gap-3"
    role="alert"
  >
    <svg
      class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clip-rule="evenodd"
      />
    </svg>
    <div class="flex-1 min-w-0">
      <p class="font-medium text-sm sm:text-base break-words">{{ message }}</p>
    </div>
    <button
      v-if="dismissible"
      @click="handleClose"
      class="flex-shrink-0 text-red-800 hover:text-red-900 active:text-red-950 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-md p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
      aria-label="Cerrar mensaje de error"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  message: string;
  dismissible?: boolean;
}

withDefaults(defineProps<Props>(), {
  dismissible: true
});

const emit = defineEmits<{
  close: [];
}>();

const visible = ref(true);

const handleClose = () => {
  visible.value = false;
  emit('close');
};
</script>
