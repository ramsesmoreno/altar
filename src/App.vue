<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'

const route = useRoute()
const mobileMenuOpen = ref(false)
const isOffline = ref(!navigator.onLine)

const isActive = (routeName: string) => {
  return route.name === routeName
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleOnline = () => {
  isOffline.value = false
}

const handleOffline = () => {
  isOffline.value = true
}

onMounted(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>

<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-deep-purple-900 via-vibrant-pink-800 to-altar-orange-700">
    <!-- Decorative papel picado pattern overlay -->
    <div class="fixed inset-0 opacity-10 pointer-events-none papel-picado-pattern"></div>
    
    <!-- Marigold flower accents -->
    <div class="fixed top-20 left-4 text-4xl opacity-20 pointer-events-none hidden sm:block">🌼</div>
    <div class="fixed top-32 right-8 text-5xl opacity-15 pointer-events-none hidden md:block">🌼</div>
    <div class="fixed bottom-20 left-12 text-3xl opacity-20 pointer-events-none hidden lg:block">🌼</div>
    <div class="fixed bottom-32 right-16 text-4xl opacity-15 pointer-events-none hidden xl:block">🌼</div>
    
    <!-- Network Status Banner -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 -translate-y-full"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-full"
    >
      <div
        v-if="isOffline"
        class="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-3 shadow-lg"
        role="alert"
      >
        <div class="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm sm:text-base font-medium">
          <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span>Sin conexión a internet. Algunas funciones no estarán disponibles.</span>
        </div>
      </div>
    </transition>

    <!-- Navigation Header -->
    <header class="relative bg-gradient-to-r from-altar-orange-600 to-vibrant-pink-600 shadow-lg border-b-4 border-marigold-400" :class="{ 'mt-12': isOffline }">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="flex items-center space-x-3">
            <div class="text-3xl">🕯️</div>
            <h1 class="text-2xl font-bold text-white tracking-wide">
              Altar Digital
            </h1>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-1">
            <router-link
              to="/"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-all duration-200 min-h-[44px] flex items-center',
                isActive('create')
                  ? 'bg-white text-altar-orange-600 shadow-md'
                  : 'text-white hover:bg-white/20'
              ]"
            >
              ✨ Crear Altar
            </router-link>
            <router-link
              to="/gallery"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-all duration-200 min-h-[44px] flex items-center',
                isActive('gallery')
                  ? 'bg-white text-vibrant-pink-600 shadow-md'
                  : 'text-white hover:bg-white/20'
              ]"
            >
              🖼️ Galería
            </router-link>
          </div>

          <!-- Mobile menu button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-3 rounded-lg text-white hover:bg-white/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Abrir menú"
          >
            <svg
              v-if="!mobileMenuOpen"
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              v-else
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Mobile Navigation Menu -->
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="mobileMenuOpen" class="md:hidden pb-4 space-y-2">
            <router-link
              to="/"
              @click="closeMobileMenu"
              :class="[
                'block px-4 py-3 rounded-lg font-medium transition-all duration-200 min-h-[44px] flex items-center text-base',
                isActive('create')
                  ? 'bg-white text-altar-orange-600 shadow-md'
                  : 'text-white hover:bg-white/20'
              ]"
            >
              ✨ Crear Altar
            </router-link>
            <router-link
              to="/gallery"
              @click="closeMobileMenu"
              :class="[
                'block px-4 py-3 rounded-lg font-medium transition-all duration-200 min-h-[44px] flex items-center text-base',
                isActive('gallery')
                  ? 'bg-white text-vibrant-pink-600 shadow-md'
                  : 'text-white hover:bg-white/20'
              ]"
            >
              🖼️ Galería
            </router-link>
          </div>
        </transition>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="relative">
      <RouterView />
    </main>

    <!-- Footer with decorative elements -->
    <footer class="relative mt-8 sm:mt-12 py-4 sm:py-6 text-center text-white/80 px-4 safe-bottom">
      <div class="flex justify-center items-center space-x-3 sm:space-x-4 mb-2">
        <span class="text-xl sm:text-2xl">🌼</span>
        <span class="text-xl sm:text-2xl">💀</span>
        <span class="text-xl sm:text-2xl">🌼</span>
      </div>
      <p class="text-xs sm:text-sm px-4">
        Honrando a nuestros seres queridos con amor y memoria
      </p>
    </footer>
  </div>
</template>

<style scoped>
/* Additional custom styles for Día de Muertos theme */
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Marigold glow effect for active links */
.router-link-active {
  position: relative;
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
