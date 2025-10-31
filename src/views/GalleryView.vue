<template>
  <div class="min-h-screen bg-gradient-to-br from-marigold-50 via-vibrant-pink-50 to-deep-purple-50 py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8 papel-picado-pattern">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-6 sm:mb-8 md:mb-10">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
          Galería de Altares
        </h1>
        <p class="text-base sm:text-lg text-gray-600 px-4 leading-relaxed">
          Tus altares digitales guardados
        </p>
      </div>

      <!-- Navigation to Create -->
      <div class="mb-6 sm:mb-8 flex justify-center">
        <router-link
          to="/"
          class="inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:py-4 bg-gradient-to-r from-altar-orange-500 to-vibrant-pink-500 hover:from-altar-orange-600 hover:to-vibrant-pink-600 text-white font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-altar-orange-500 focus:ring-offset-2 min-h-[44px] text-base sm:text-lg shadow-md hover:shadow-lg touch-target"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Crear Nuevo Altar</span>
        </router-link>
      </div>

      <!-- Empty State -->
      <div
        v-if="!altarStore.hasAltars"
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
            No hay altares todavía
          </h2>
          
          <p class="text-base sm:text-lg text-gray-600 px-4 leading-relaxed">
            Crea tu primer altar digital para honrar a tus seres queridos
          </p>
          
          <router-link
            to="/"
            class="inline-flex items-center gap-2 sm:gap-3 px-6 py-3 sm:py-4 bg-gradient-to-r from-altar-orange-500 to-vibrant-pink-500 hover:from-altar-orange-600 hover:to-vibrant-pink-600 text-white font-bold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-altar-orange-500 focus:ring-offset-2 min-h-[44px] text-base sm:text-lg shadow-md hover:shadow-lg touch-target"
          >
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Crear Mi Primer Altar</span>
          </router-link>
        </div>
      </div>

      <!-- Gallery Grid -->
      <div
        v-else
        class="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6"
      >
        <AltarCard
          v-for="altar in altarStore.sortedAltars"
          :key="altar.id"
          :altar="altar"
          @click="navigateToDetail(altar.id)"
          @delete="handleDelete(altar.id)"
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
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAltarStore } from '../stores/altarStore';
import AltarCard from '../components/AltarCard.vue';
import ErrorMessage from '../components/ErrorMessage.vue';

const router = useRouter();
const altarStore = useAltarStore();

onMounted(async () => {
  // Load altars from localStorage when component mounts
  await altarStore.loadAltarsFromStorage();
});

const navigateToDetail = (altarId: string) => {
  router.push({ name: 'altar-detail', params: { id: altarId } });
};

const handleDelete = async (altarId: string) => {
  try {
    await altarStore.deleteAltar(altarId);
  } catch (error) {
    // Error is already set in the store
    console.error('Failed to delete altar:', error);
  }
};
</script>
