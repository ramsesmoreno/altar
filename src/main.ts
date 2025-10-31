import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Amplify } from 'aws-amplify'
import './style.css'
import App from './App.vue'
import router from './router'
import outputs from '../amplify_outputs.json'
import { useAltarStore } from './stores/altarStore'

// Configure AWS Amplify with backend configuration
Amplify.configure(outputs)

// Create Vue app
const app = createApp(App)

// Install Pinia for state management
const pinia = createPinia()
app.use(pinia)

// Install Vue Router
app.use(router)

// Mount app to DOM
app.mount('#app')

// Load altars from localStorage after app is mounted
// This ensures the store is properly initialized
const altarStore = useAltarStore()
altarStore.loadAltarsFromStorage()
