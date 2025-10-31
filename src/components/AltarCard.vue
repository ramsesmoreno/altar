<template>
  <div
    class="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
    tabindex="0"
    role="button"
    :aria-label="`Ver altar creado el ${formattedDate}`"
  >
    <!-- Thumbnail Image -->
    <div class="relative aspect-square bg-gray-100 overflow-hidden">
      <img
        :src="altar.altarImageUrl"
        :alt="`Altar creado el ${formattedDate}`"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        @error="handleImageError"
      />
      
      <!-- Overlay on hover -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p class="text-sm font-medium line-clamp-2">
            {{ altar.foodDescription }}
          </p>
        </div>
      </div>
      
      <!-- Delete button -->
      <button
        @click.stop="handleDeleteClick"
        type="button"
        class="absolute top-2 right-2 p-2.5 sm:p-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 min-w-[44px] min-h-[44px] flex items-center justify-center shadow-lg touch-target z-10"
        aria-label="Eliminar altar"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
    
    <!-- Card Footer -->
    <div class="p-3 sm:p-4 md:p-5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 text-sm sm:text-base text-gray-600">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
          <time :datetime="altar.createdAt" class="truncate font-medium">{{ formattedDate }}</time>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Dialog -->
    <Teleport to="body">
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="cancelDelete"
      >
        <div
          class="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 space-y-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div class="flex items-start gap-3 sm:gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="flex-1">
              <h3 id="delete-dialog-title" class="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                ¿Eliminar altar?
              </h3>
              <p class="text-sm text-gray-600">
                Esta acción no se puede deshacer. El altar será eliminado permanentemente.
              </p>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              @click="cancelDelete"
              type="button"
              class="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 min-h-[44px] text-base font-medium order-2 sm:order-1 touch-target"
            >
              Cancelar
            </button>
            <button
              @click="confirmDelete"
              type="button"
              class="px-6 py-3 text-white bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 min-h-[44px] text-base font-medium order-1 sm:order-2 touch-target"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Altar } from '../types/altar';

interface Props {
  altar: Altar;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  click: [];
  delete: [];
}>();

const showDeleteConfirm = ref(false);
const imageError = ref(false);

const formattedDate = computed(() => {
  const date = new Date(props.altar.createdAt);
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

const handleClick = () => {
  emit('click');
};

const handleDeleteClick = () => {
  showDeleteConfirm.value = true;
};

const confirmDelete = () => {
  showDeleteConfirm.value = false;
  emit('delete');
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
};

const handleImageError = () => {
  imageError.value = true;
};
</script>
