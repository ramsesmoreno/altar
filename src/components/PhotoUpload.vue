<template>
  <div class="w-full">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Foto de tu ser querido
    </label>
    
    <div
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
      @touchstart.passive="handleTouchStart"
      @touchend.passive="handleTouchEnd"
      :class="[
        'relative border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 transition-all duration-200 cursor-pointer min-h-[200px] sm:min-h-[240px] md:min-h-[280px] flex items-center justify-center',
        isDragging || isTouching ? 'border-altar-orange-500 bg-marigold-50 scale-[1.02]' : 'border-gray-300 hover:border-marigold-400 active:border-altar-orange-500 active:bg-marigold-50',
        'focus-within:ring-2 focus-within:ring-altar-orange-500 focus-within:ring-offset-2',
        'drag-area'
      ]"
      role="button"
      tabindex="0"
      @keydown.enter="triggerFileInput"
      @keydown.space.prevent="triggerFileInput"
      aria-describedby="upload-instructions"
    >
      <input
        ref="fileInputRef"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        @change="handleFileSelect"
        class="sr-only"
        aria-label="Seleccionar foto"
      />
      
      <!-- Preview -->
      <div v-if="previewUrl" class="space-y-3 sm:space-y-4 w-full px-2">
        <img
          :src="previewUrl"
          alt="Vista previa de la foto"
          class="max-h-48 sm:max-h-64 md:max-h-72 w-full mx-auto rounded-lg shadow-md object-contain"
        />
        <button
          @click.stop="clearFile"
          type="button"
          class="w-full sm:w-auto mx-auto block px-6 py-3 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-lg transition-colors min-h-[44px] text-base font-medium touch-target"
        >
          Cambiar foto
        </button>
      </div>
      
      <!-- Upload prompt -->
      <div v-else class="text-center w-full px-4" id="upload-instructions">
        <svg
          class="mx-auto h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="mt-4 sm:mt-5 text-base sm:text-lg text-gray-600">
          <span class="font-semibold text-altar-orange-600 block sm:inline">Toca para seleccionar</span>
          <span class="hidden sm:inline"> o arrastra una foto aquí</span>
        </div>
        <p class="mt-2 sm:mt-3 text-sm sm:text-base text-gray-500">
          JPEG, PNG o WEBP hasta 10MB
        </p>
      </div>
    </div>
    
    <!-- Error message -->
    <ErrorMessage
      v-if="errorMessage"
      :message="errorMessage"
      :dismissible="true"
      @close="clearError"
      class="mt-3"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { validateFile } from '../utils/validators';
import ErrorMessage from './ErrorMessage.vue';

interface Props {
  modelValue: File | null;
  maxSizeMB?: number;
}

const props = withDefaults(defineProps<Props>(), {
  maxSizeMB: 10
});

const emit = defineEmits<{
  'update:modelValue': [file: File | null];
  error: [message: string];
}>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const isTouching = ref(false);
const previewUrl = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

// Watch for external changes to modelValue
watch(() => props.modelValue, (newFile) => {
  if (newFile) {
    generatePreview(newFile);
  } else {
    clearPreview();
  }
}, { immediate: true });

const handleDragOver = () => {
  isDragging.value = true;
};

const handleDragLeave = () => {
  isDragging.value = false;
};

const handleDrop = async (e: DragEvent) => {
  isDragging.value = false;
  
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    await processFile(files[0]);
  }
};

const handleTouchStart = () => {
  isTouching.value = true;
};

const handleTouchEnd = () => {
  setTimeout(() => {
    isTouching.value = false;
  }, 200);
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileSelect = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  
  if (files && files.length > 0) {
    await processFile(files[0]);
  }
};

const processFile = async (file: File) => {
  clearError();
  
  // Validate file
  const validation = await validateFile(file);
  
  if (!validation.isValid) {
    errorMessage.value = validation.error || 'Invalid file';
    emit('error', errorMessage.value);
    return;
  }
  
  // Generate preview
  generatePreview(file);
  
  // Emit the file
  emit('update:modelValue', file);
};

const generatePreview = (file: File) => {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const result = e.target?.result;
      if (!result) {
        throw new Error('No se pudo leer el archivo');
      }
      previewUrl.value = result as string;
    } catch (error) {
      console.error('Preview generation error:', error);
      errorMessage.value = 'Error al generar vista previa de la imagen';
      emit('error', errorMessage.value);
    }
  };
  
  reader.onerror = (error) => {
    console.error('FileReader error:', error);
    errorMessage.value = 'No se pudo leer el archivo. Por favor, intenta con otra imagen.';
    emit('error', errorMessage.value);
  };
  
  reader.onabort = () => {
    errorMessage.value = 'La lectura del archivo fue cancelada';
    emit('error', errorMessage.value);
  };
  
  try {
    reader.readAsDataURL(file);
  } catch (error) {
    console.error('Error starting file read:', error);
    errorMessage.value = 'Error al leer el archivo';
    emit('error', errorMessage.value);
  }
};

const clearPreview = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }
};

const clearFile = () => {
  clearPreview();
  clearError();
  emit('update:modelValue', null);
  
  // Reset file input
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const clearError = () => {
  errorMessage.value = null;
};
</script>
