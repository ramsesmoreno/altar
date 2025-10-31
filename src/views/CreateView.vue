<template>
  <div class="min-h-screen bg-gradient-to-br from-marigold-50 via-vibrant-pink-50 to-deep-purple-50 py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8 papel-picado-pattern">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-6 sm:mb-8 md:mb-10">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
          Crear Altar Digital
        </h1>
        <p class="text-base sm:text-lg text-gray-600 px-4 leading-relaxed">
          Honra a tus seres queridos con un altar de Día de Muertos
        </p>
      </div>

      <!-- Creation Form -->
      <div v-if="!createdAltar" class="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 md:space-y-8">
        <form @submit.prevent="handleSubmit" class="space-y-5 sm:space-y-6 md:space-y-8">
          <!-- Photo Upload -->
          <PhotoUpload
            v-model="photoFile"
            :max-size-m-b="10"
          />

          <!-- Food Description Input -->
          <FoodDescriptionInput
            v-model="foodDescription"
            :min-length="10"
            :max-length="500"
          />

          <!-- Error Message with Retry -->
          <div v-if="altarStore.error" class="space-y-3">
            <ErrorMessage
              :message="altarStore.error"
              :dismissible="true"
              @close="altarStore.clearError()"
            />
            <button
              v-if="canRetry"
              @click="handleRetry"
              type="button"
              class="w-full py-3 px-6 bg-marigold-100 hover:bg-marigold-200 active:bg-marigold-300 text-altar-orange-700 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-altar-orange-500 focus:ring-offset-2 min-h-[44px] text-base flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reintentar</span>
            </button>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="!canSubmit || altarStore.isLoading"
            class="w-full py-4 px-6 bg-gradient-to-r from-altar-orange-500 to-vibrant-pink-500 hover:from-altar-orange-600 hover:to-vibrant-pink-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-altar-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed min-h-[44px] text-base sm:text-lg shadow-md hover:shadow-lg active:shadow-sm touch-target"
          >
            {{ altarStore.isLoading ? 'Creando altar...' : 'Crear Altar' }}
          </button>
        </form>

        <!-- Loading State -->
        <div v-if="altarStore.isLoading" class="space-y-4">
          <LoadingSpinner size="lg" color="orange" />
          
          <!-- Progress indicator -->
          <div class="space-y-2">
            <div class="flex justify-between text-sm text-gray-600">
              <span>{{ progressMessage }}</span>
              <span>{{ altarStore.uploadProgress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                class="bg-gradient-to-r from-marigold-500 to-vibrant-pink-500 h-full transition-all duration-500 ease-out"
                :style="{ width: `${altarStore.uploadProgress}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success State - Display Created Altar -->
      <div v-else class="space-y-5 sm:space-y-6">
        <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-5 sm:mb-6 text-center leading-tight">
            ¡Tu altar ha sido creado!
          </h2>
          
          <AltarDisplay
            :altar="createdAltar"
            :show-download="true"
          />
        </div>

        <!-- Create Another Button -->
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            @click="resetForm"
            type="button"
            class="px-6 py-3 sm:py-4 bg-gradient-to-r from-altar-orange-500 to-vibrant-pink-500 hover:from-altar-orange-600 hover:to-vibrant-pink-600 text-white font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-altar-orange-500 focus:ring-offset-2 min-h-[44px] text-base sm:text-lg shadow-md hover:shadow-lg touch-target"
          >
            Crear Otro Altar
          </button>
          
          <router-link
            to="/gallery"
            class="px-6 py-3 sm:py-4 bg-deep-purple-500 hover:bg-deep-purple-600 active:bg-deep-purple-700 text-white font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-deep-purple-500 focus:ring-offset-2 min-h-[44px] flex items-center justify-center text-base sm:text-lg shadow-md hover:shadow-lg touch-target"
          >
            Ver Galería
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAltarStore } from '../stores/altarStore';
import type { Altar } from '../types/altar';
import PhotoUpload from '../components/PhotoUpload.vue';
import FoodDescriptionInput from '../components/FoodDescriptionInput.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import ErrorMessage from '../components/ErrorMessage.vue';
import AltarDisplay from '../components/AltarDisplay.vue';

const altarStore = useAltarStore();

const photoFile = ref<File | null>(null);
const foodDescription = ref('');
const createdAltar = ref<Altar | null>(null);
const lastSubmitData = ref<{ photoFile: File; foodDescription: string } | null>(null);

const canSubmit = computed(() => {
  return (
    photoFile.value !== null &&
    foodDescription.value.trim().length >= 10 &&
    foodDescription.value.trim().length <= 500
  );
});

const canRetry = computed(() => {
  return lastSubmitData.value !== null && !altarStore.isLoading;
});

const progressMessage = computed(() => {
  const progress = altarStore.uploadProgress;
  if (progress < 25) return 'Preparando...';
  if (progress < 50) return 'Subiendo foto...';
  if (progress < 75) return 'Generando altar...';
  if (progress < 100) return 'Guardando...';
  return 'Completado';
});

const handleSubmit = async () => {
  if (!canSubmit.value) return;

  // Store submission data for retry
  lastSubmitData.value = {
    photoFile: photoFile.value!,
    foodDescription: foodDescription.value.trim()
  };

  try {
    const altar = await altarStore.createAltar({
      photoFile: photoFile.value!,
      foodDescription: foodDescription.value.trim()
    });

    createdAltar.value = altar;
    lastSubmitData.value = null; // Clear retry data on success
  } catch (error) {
    // Error is already set in the store
    console.error('Failed to create altar:', error);
  }
};

const handleRetry = async () => {
  if (!lastSubmitData.value) return;

  altarStore.clearError();

  try {
    const altar = await altarStore.createAltar({
      photoFile: lastSubmitData.value.photoFile,
      foodDescription: lastSubmitData.value.foodDescription
    });

    createdAltar.value = altar;
    lastSubmitData.value = null; // Clear retry data on success
  } catch (error) {
    // Error is already set in the store
    console.error('Failed to create altar on retry:', error);
  }
};

const resetForm = () => {
  photoFile.value = null;
  foodDescription.value = '';
  createdAltar.value = null;
  lastSubmitData.value = null;
  altarStore.clearError();
};
</script>
