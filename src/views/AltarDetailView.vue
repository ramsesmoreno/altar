<template>
  <div class="min-h-screen bg-gradient-to-br from-marigold-50 via-vibrant-pink-50 to-deep-purple-50 py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8 papel-picado-pattern">
    <div class="max-w-5xl mx-auto">
      <!-- Back Button -->
      <div class="mb-5 sm:mb-6">
        <button
          @click="goBack"
          type="button"
          class="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-altar-orange-500 focus:ring-offset-2 shadow-sm hover:shadow-md min-h-[44px] text-base font-medium touch-target"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Volver a la Galería</span>
        </button>
      </div>

      <!-- Altar Not Found -->
      <div
        v-if="!altar && !loading"
        class="bg-white rounded-xl shadow-lg p-6 sm:p-10 md:p-12 text-center"
      >
        <div class="max-w-md mx-auto space-y-5 sm:space-y-6">
          <svg
            class="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mx-auto text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            Altar no encontrado
          </h2>
          
          <p class="text-base sm:text-lg text-gray-600 px-4 leading-relaxed">
            El altar que buscas no existe o ha sido eliminado
          </p>
          
          <router-link
            to="/gallery"
            class="inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:py-4 bg-gradient-to-r from-altar-orange-500 to-vibrant-pink-500 hover:from-altar-orange-600 hover:to-vibrant-pink-600 text-white font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-altar-orange-500 focus:ring-offset-2 min-h-[44px] text-base sm:text-lg shadow-md hover:shadow-lg touch-target"
          >
            Ver Galería
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="bg-white rounded-xl shadow-lg p-8 sm:p-12">
        <LoadingSpinner size="lg" color="orange" />
      </div>

      <!-- Altar Display -->
      <div v-else-if="altar">
        <AltarDisplay
          :altar="altar"
          :show-download="true"
          @download="handleDownload"
        />
      </div>

      <!-- Error Message -->
      <ErrorMessage
        v-if="altarStore.error"
        :message="altarStore.error"
        :dismissible="true"
        @close="altarStore.clearError()"
        class="mt-6"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAltarStore } from '../stores/altarStore';
import type { Altar } from '../types/altar';
import AltarDisplay from '../components/AltarDisplay.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import ErrorMessage from '../components/ErrorMessage.vue';

const router = useRouter();
const route = useRoute();
const altarStore = useAltarStore();

const loading = ref(true);
const altar = ref<Altar | null>(null);

const altarId = computed(() => route.params.id as string);

onMounted(async () => {
  // Ensure altars are loaded from storage
  if (altarStore.altars.length === 0) {
    await altarStore.loadAltarsFromStorage();
  }

  // Find the altar by ID
  const foundAltar = altarStore.altars.find(a => a.id === altarId.value);
  
  if (foundAltar) {
    altar.value = foundAltar;
    altarStore.setCurrentAltar(foundAltar);
  }

  loading.value = false;
});

const goBack = () => {
  router.push({ name: 'gallery' });
};

const handleDownload = () => {
  // Download is handled by AltarDisplay component
  console.log('Download initiated for altar:', altarId.value);
};
</script>
