import type { Altar } from '../types/altar';

const STORAGE_KEY = 'altar_app_altars';
const MAX_ALTARS = 50;

/**
 * Custom error class for localStorage operations
 */
export class LocalStorageError extends Error {
  constructor(
    message: string,
    public code: 'QUOTA_EXCEEDED' | 'ACCESS_DENIED' | 'PARSE_ERROR' | 'UNKNOWN'
  ) {
    super(message);
    this.name = 'LocalStorageError';
  }
}

/**
 * Save an altar to localStorage
 * Automatically handles cleanup if storage limit is reached
 */
export function saveAltar(altar: Altar): void {
  try {
    const altars = getAllAltars();
    
    // Check if altar already exists and update it
    const existingIndex = altars.findIndex(a => a.id === altar.id);
    if (existingIndex !== -1) {
      altars[existingIndex] = altar;
    } else {
      altars.push(altar);
    }
    
    // Cleanup if we exceed the limit
    const sortedAltars = sortAltarsByDate(altars);
    const limitedAltars = sortedAltars.slice(0, MAX_ALTARS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedAltars));
  } catch (error) {
    handleStorageError(error);
  }
}

/**
 * Retrieve a specific altar by ID
 */
export function getAltar(id: string): Altar | null {
  try {
    const altars = getAllAltars();
    return altars.find(altar => altar.id === id) || null;
  } catch (error) {
    handleStorageError(error);
    return null;
  }
}

/**
 * Retrieve all altars sorted by creation date (most recent first)
 */
export function getAllAltars(): Altar[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return [];
    }
    
    const altars = JSON.parse(data) as Altar[];
    return sortAltarsByDate(altars);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new LocalStorageError(
        'Failed to parse altar data from storage',
        'PARSE_ERROR'
      );
    }
    handleStorageError(error);
    return [];
  }
}

/**
 * Delete a specific altar by ID
 */
export function deleteAltar(id: string): void {
  try {
    const altars = getAllAltars();
    const filteredAltars = altars.filter(altar => altar.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredAltars));
  } catch (error) {
    handleStorageError(error);
  }
}

/**
 * Delete all altars from storage
 */
export function clearAllAltars(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    handleStorageError(error);
  }
}

/**
 * Get the count of stored altars
 */
export function getAltarCount(): number {
  try {
    const altars = getAllAltars();
    return altars.length;
  } catch (error) {
    handleStorageError(error);
    return 0;
  }
}

/**
 * Sort altars by creation date (most recent first)
 */
function sortAltarsByDate(altars: Altar[]): Altar[] {
  return [...altars].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA; // Descending order (newest first)
  });
}

/**
 * Handle localStorage errors and throw appropriate custom errors
 */
function handleStorageError(error: unknown): never {
  if (error instanceof LocalStorageError) {
    throw error;
  }
  
  if (error instanceof DOMException) {
    if (error.name === 'QuotaExceededError') {
      throw new LocalStorageError(
        'Storage quota exceeded. Please delete some altars to free up space.',
        'QUOTA_EXCEEDED'
      );
    }
    
    if (error.name === 'SecurityError') {
      throw new LocalStorageError(
        'Access to localStorage is denied. Please check your browser settings.',
        'ACCESS_DENIED'
      );
    }
  }
  
  throw new LocalStorageError(
    'An unexpected error occurred while accessing storage.',
    'UNKNOWN'
  );
}
