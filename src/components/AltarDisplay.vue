<template>
  <div class="w-full max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden border-4 border-marigold-300 altar-glow">
      <!-- Altar Image -->
      <div class="relative bg-gray-100">
        <img
          :src="altar.altarImageUrl"
          :alt="`Altar digital creado el ${formattedDate}`"
          class="w-full h-auto object-contain"
          @error="handleImageError"
        />
        
        <!-- Loading state for image -->
        <div
          v-if="imageLoading"
          class="absolute inset-0 flex items-center justify-center bg-gray-100"
        >
          <LoadingSpinner size="lg" color="orange" />
        </div>
      </div>
      
      <!-- Altar Details -->
      <div class="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
        <!-- Food Description -->
        <div>
          <h3 class="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
            Comidas favoritas:
          </h3>
          <p class="text-base sm:text-lg text-gray-800 leading-relaxed">
            {{ altar.foodDescription }}
          </p>
        </div>
        
        <!-- Creation Date -->
        <div class="text-sm sm:text-base text-gray-500 font-medium">
          Creado el {{ formattedDate }}
        </div>
        
        <!-- Download Button -->
        <button
          v-if="showDownload"
          @click="handleDownload"
          :disabled="isDownloading"
          type="button"
          class="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-6 py-3 sm:py-4 bg-altar-orange-500 hover:bg-altar-orange-600 active:bg-altar-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-altar-orange-500 focus:ring-offset-2 min-h-[44px] text-base sm:text-lg touch-target altar-glow"
        >
          <svg
            v-if="!isDownloading"
            class="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <LoadingSpinner v-else size="sm" color="white" />
          <span>{{ isDownloading ? 'Descargando...' : 'Descargar imagen' }}</span>
        </button>
        
        <!-- Download confirmation -->
        <div
          v-if="downloadSuccess"
          class="text-sm sm:text-base text-green-600 flex items-center gap-2 font-medium"
          role="status"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <span>¡Descarga iniciada!</span>
        </div>
        
        <!-- Download error -->
        <ErrorMessage
          v-if="downloadError"
          :message="downloadError"
          @close="downloadError = null"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Altar } from '../types/altar';
import LoadingSpinner from './LoadingSpinner.vue';
import ErrorMessage from './ErrorMessage.vue';

interface Props {
  altar: Altar;
  showDownload?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showDownload: true
});

const emit = defineEmits<{
  download: [];
}>();

const imageLoading = ref(true);
const isDownloading = ref(false);
const downloadSuccess = ref(false);
const downloadError = ref<string | null>(null);

const formattedDate = computed(() => {
  const date = new Date(props.altar.createdAt);
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

const handleImageError = () => {
  imageLoading.value = false;
  downloadError.value = 'Error al cargar la imagen';
};

onMounted(() => {
  // Preload image
  const img = new Image();
  img.onload = () => {
    imageLoading.value = false;
  };
  img.onerror = handleImageError;
  img.src = props.altar.altarImageUrl;
});

const handleDownload = async () => {
  isDownloading.value = true;
  downloadSuccess.value = false;
  downloadError.value = null;
  
  try {
    // Check network connectivity
    if (!navigator.onLine) {
      throw new Error('No hay conexión a internet');
    }

    // Fetch the image with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(props.altar.altarImageUrl, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    // Validate blob
    if (!blob || blob.size === 0) {
      throw new Error('La imagen descargada está vacía');
    }
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Generate descriptive filename with creation date
    const date = new Date(props.altar.createdAt);
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    link.href = url;
    link.download = `altar-${dateStr}-${props.altar.id}.png`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    // Show success message
    downloadSuccess.value = true;
    setTimeout(() => {
      downloadSuccess.value = false;
    }, 3000);
    
    // Emit download event
    emit('download');
  } catch (error) {
    console.error('Download error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        downloadError.value = 'La descarga tardó demasiado tiempo. Por favor, intenta de nuevo.';
      } else if (error.message.includes('conexión')) {
        downloadError.value = 'No hay conexión a internet. Por favor, verifica tu conexión.';
      } else {
        downloadError.value = `Error al descargar: ${error.message}`;
      }
    } else {
      downloadError.value = 'Error al descargar la imagen. Por favor, intenta de nuevo.';
    }
  } finally {
    isDownloading.value = false;
  }
};
</script>
