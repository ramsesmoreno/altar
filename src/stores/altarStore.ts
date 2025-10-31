import { defineStore } from 'pinia';
import type { Altar, CreateAltarRequest } from '../types/altar';
import { uploadPhoto, generateAltar, AmplifyServiceError } from '../services/amplifyService';
import {
  saveAltar as saveAltarToStorage,
  getAllAltars,
  deleteAltar as deleteAltarFromStorage,
  LocalStorageError,
} from '../services/localStorageService';

/**
 * State interface for the altar store
 */
export interface AltarState {
  altars: Altar[];
  currentAltar: Altar | null;
  isLoading: boolean;
  error: string | null;
  uploadProgress: number;
}

/**
 * Pinia store for managing altar state and operations
 */
export const useAltarStore = defineStore('altar', {
  state: (): AltarState => ({
    altars: [],
    currentAltar: null,
    isLoading: false,
    error: null,
    uploadProgress: 0,
  }),

  getters: {
    /**
     * Returns altars sorted by creation date (most recent first)
     */
    sortedAltars: (state): Altar[] => {
      return [...state.altars].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
    },

    /**
     * Returns true if there are any altars stored
     */
    hasAltars: (state): boolean => {
      return state.altars.length > 0;
    },
  },

  actions: {
    /**
     * Creates a new altar by uploading photo, generating altar image, and saving to localStorage
     * 
     * @param request - Contains photo file and food description
     * @returns Promise resolving to the created Altar
     * @throws Error if creation fails at any step
     */
    async createAltar(request: CreateAltarRequest): Promise<Altar> {
      this.isLoading = true;
      this.error = null;
      this.uploadProgress = 0;

      try {
        // Step 1: Upload photo
        this.uploadProgress = 25;
        let uploadResponse;
        try {
          uploadResponse = await uploadPhoto(request.photoFile);
        } catch (error) {
          if (error instanceof AmplifyServiceError) {
            throw new Error(`Error al subir la foto: ${error.message}`);
          }
          throw new Error('Error al subir la foto. Por favor, intenta de nuevo.');
        }

        // Step 2: Generate altar image
        this.uploadProgress = 50;
        let generateResponse;
        try {
          generateResponse = await generateAltar({
            photoS3Key: uploadResponse.s3Key,
            foodDescription: request.foodDescription,
          });
        } catch (error) {
          if (error instanceof AmplifyServiceError) {
            throw new Error(`Error al generar el altar: ${error.message}`);
          }
          throw new Error('Error al generar el altar. Por favor, intenta de nuevo.');
        }

        // Step 3: Create altar object
        this.uploadProgress = 75;
        const altar: Altar = {
          id: crypto.randomUUID(),
          photoUrl: uploadResponse.photoUrl,
          photoS3Key: uploadResponse.s3Key,
          foodDescription: request.foodDescription,
          altarImageUrl: generateResponse.altarImageUrl,
          altarImageS3Key: generateResponse.altarImageS3Key,
          createdAt: new Date().toISOString(),
        };

        // Step 4: Save to localStorage
        try {
          saveAltarToStorage(altar);
        } catch (error) {
          if (error instanceof LocalStorageError) {
            // Altar was created successfully but couldn't be saved locally
            // Still add to state so user can see it in current session
            this.altars.push(altar);
            this.currentAltar = altar;
            this.uploadProgress = 100;
            
            // Show warning but don't fail the operation
            this.error = `Altar creado exitosamente, pero no se pudo guardar localmente: ${error.message}`;
            return altar;
          }
          throw new Error('Error al guardar el altar localmente.');
        }

        // Step 5: Update state
        this.altars.push(altar);
        this.currentAltar = altar;
        this.uploadProgress = 100;

        return altar;
      } catch (error) {
        // Handle different error types with user-friendly messages
        if (error instanceof AmplifyServiceError) {
          this.error = error.message;
        } else if (error instanceof LocalStorageError) {
          this.error = error.message;
        } else if (error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = 'Ocurrió un error inesperado al crear el altar. Por favor, intenta de nuevo.';
        }
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Loads all altars from localStorage into the store
     */
    async loadAltarsFromStorage(): Promise<void> {
      try {
        const altars = getAllAltars();
        this.altars = altars;
        this.error = null; // Clear any previous errors on successful load
      } catch (error) {
        if (error instanceof LocalStorageError) {
          this.error = `Error al cargar altares: ${error.message}`;
        } else if (error instanceof Error) {
          this.error = `Error al cargar altares: ${error.message}`;
        } else {
          this.error = 'No se pudieron cargar los altares guardados';
        }
        // Don't throw - allow app to continue with empty state
        console.error('Failed to load altars:', error);
        this.altars = []; // Ensure we have an empty array
      }
    },

    /**
     * Deletes an altar from localStorage and removes it from state
     * 
     * @param altarId - ID of the altar to delete
     */
    async deleteAltar(altarId: string): Promise<void> {
      try {
        // Remove from localStorage
        deleteAltarFromStorage(altarId);

        // Update state
        this.altars = this.altars.filter(altar => altar.id !== altarId);

        // Clear current altar if it was deleted
        if (this.currentAltar?.id === altarId) {
          this.currentAltar = null;
        }
        
        // Clear any previous errors on successful deletion
        this.error = null;
      } catch (error) {
        if (error instanceof LocalStorageError) {
          this.error = `Error al eliminar el altar: ${error.message}`;
        } else if (error instanceof Error) {
          this.error = `Error al eliminar el altar: ${error.message}`;
        } else {
          this.error = 'No se pudo eliminar el altar';
        }
        throw error;
      }
    },

    /**
     * Sets the current altar being viewed
     * 
     * @param altar - The altar to set as current
     */
    setCurrentAltar(altar: Altar): void {
      this.currentAltar = altar;
    },

    /**
     * Clears any error message
     */
    clearError(): void {
      this.error = null;
    },
  },
});
