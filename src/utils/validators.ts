/**
 * File validation utilities for the Altar application
 */

// Magic numbers (file signatures) for supported image formats
const FILE_SIGNATURES = {
  JPEG: [0xff, 0xd8, 0xff],
  PNG: [0x89, 0x50, 0x4e, 0x47],
  WEBP: [0x52, 0x49, 0x46, 0x46], // "RIFF" - need to check bytes 8-11 for "WEBP"
} as const;

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const MIN_DESCRIPTION_LENGTH = 10;
const MAX_DESCRIPTION_LENGTH = 500;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates file type using magic numbers (file signatures)
 * Supports JPEG, PNG, and WEBP formats
 */
export async function validateFileType(file: File): Promise<ValidationResult> {
  try {
    // Validate file exists and has content
    if (!file || file.size === 0) {
      return {
        isValid: false,
        error: 'El archivo está vacío',
      };
    }

    // Check if file size is reasonable for reading header
    if (file.size < 12) {
      return {
        isValid: false,
        error: 'El archivo es demasiado pequeño para ser una imagen válida',
      };
    }

    // Read first 12 bytes to check magic numbers
    const buffer = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Validate we got the bytes
    if (bytes.length < 12) {
      return {
        isValid: false,
        error: 'No se pudo leer el archivo correctamente',
      };
    }

    // Check JPEG signature
    if (
      bytes[0] === FILE_SIGNATURES.JPEG[0] &&
      bytes[1] === FILE_SIGNATURES.JPEG[1] &&
      bytes[2] === FILE_SIGNATURES.JPEG[2]
    ) {
      return { isValid: true };
    }

    // Check PNG signature
    if (
      bytes[0] === FILE_SIGNATURES.PNG[0] &&
      bytes[1] === FILE_SIGNATURES.PNG[1] &&
      bytes[2] === FILE_SIGNATURES.PNG[2] &&
      bytes[3] === FILE_SIGNATURES.PNG[3]
    ) {
      return { isValid: true };
    }

    // Check WEBP signature (RIFF at start, WEBP at bytes 8-11)
    if (
      bytes[0] === FILE_SIGNATURES.WEBP[0] &&
      bytes[1] === FILE_SIGNATURES.WEBP[1] &&
      bytes[2] === FILE_SIGNATURES.WEBP[2] &&
      bytes[3] === FILE_SIGNATURES.WEBP[3] &&
      bytes[8] === 0x57 && // 'W'
      bytes[9] === 0x45 && // 'E'
      bytes[10] === 0x42 && // 'B'
      bytes[11] === 0x50 // 'P'
    ) {
      return { isValid: true };
    }

    return {
      isValid: false,
      error: 'Por favor, sube una imagen JPEG, PNG o WEBP',
    };
  } catch (error) {
    console.error('File type validation error:', error);
    
    if (error instanceof Error) {
      return {
        isValid: false,
        error: `Error al leer el archivo: ${error.message}`,
      };
    }
    
    return {
      isValid: false,
      error: 'No se pudo leer el archivo. Por favor, intenta de nuevo',
    };
  }
}

/**
 * Validates file size (max 10MB)
 */
export function validateFileSize(file: File): ValidationResult {
  if (!file) {
    return {
      isValid: false,
      error: 'No se seleccionó ningún archivo',
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: 'El archivo está vacío',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      isValid: false,
      error: `La imagen es demasiado grande (${fileSizeMB}MB). Debe ser menor a ${MAX_FILE_SIZE_MB}MB`,
    };
  }

  return { isValid: true };
}

/**
 * Validates food description text length (10-500 characters)
 */
export function validateFoodDescription(description: string): ValidationResult {
  if (typeof description !== 'string') {
    return {
      isValid: false,
      error: 'La descripción debe ser texto',
    };
  }

  const trimmed = description.trim();

  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: 'La descripción no puede estar vacía',
    };
  }

  if (trimmed.length < MIN_DESCRIPTION_LENGTH) {
    return {
      isValid: false,
      error: `La descripción debe tener al menos ${MIN_DESCRIPTION_LENGTH} caracteres`,
    };
  }

  if (trimmed.length > MAX_DESCRIPTION_LENGTH) {
    return {
      isValid: false,
      error: `La descripción no debe exceder ${MAX_DESCRIPTION_LENGTH} caracteres`,
    };
  }

  return { isValid: true };
}

/**
 * Sanitizes food description to remove potentially harmful content
 */
export function sanitizeFoodDescription(description: string): string {
  if (typeof description !== 'string') {
    return '';
  }

  return description
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, ''); // Remove vbscript: protocol
}

/**
 * Gets the remaining character count for food description
 */
export function getRemainingCharacters(description: string): number {
  return MAX_DESCRIPTION_LENGTH - description.length;
}

/**
 * Validates a complete file upload (type and size)
 */
export async function validateFile(file: File): Promise<ValidationResult> {
  try {
    // Validate file exists
    if (!file) {
      return {
        isValid: false,
        error: 'No se seleccionó ningún archivo',
      };
    }

    // Check file size first (faster)
    const sizeValidation = validateFileSize(file);
    if (!sizeValidation.isValid) {
      return sizeValidation;
    }

    // Check file type using magic numbers
    const typeValidation = await validateFileType(file);
    if (!typeValidation.isValid) {
      return typeValidation;
    }

    return { isValid: true };
  } catch (error) {
    console.error('File validation error:', error);
    
    return {
      isValid: false,
      error: 'Error al validar el archivo. Por favor, intenta de nuevo',
    };
  }
}
