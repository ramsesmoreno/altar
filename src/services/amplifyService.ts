import { post } from 'aws-amplify/api';
import type {
  UploadPhotoResponse,
  GenerateAltarRequest,
  GenerateAltarResponse,
  ErrorResponse,
} from '../types/altar';

/**
 * Timeout duration for API requests (35 seconds to allow for 30s backend timeout)
 */
const REQUEST_TIMEOUT = 35000;

/**
 * Maximum number of retry attempts for failed requests
 */
const MAX_RETRIES = 3;

/**
 * Delay between retry attempts in milliseconds
 */
const RETRY_DELAY = 1000;

/**
 * Custom error class for Amplify service errors
 */
export class AmplifyServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'AmplifyServiceError';
  }
}

/**
 * Creates a timeout promise that rejects after the specified duration
 */
function createTimeoutPromise(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new AmplifyServiceError(
          'La solicitud tardó demasiado tiempo. Por favor, intenta de nuevo.',
          'TIMEOUT',
          408,
          true
        )
      );
    }, ms);
  });
}

/**
 * Checks if the user is online
 */
function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Delays execution for the specified duration
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Determines if an error is retryable
 */
function isRetryableError(error: AmplifyServiceError): boolean {
  // Network errors are retryable
  if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
    return true;
  }
  
  // 5xx server errors are retryable
  if (error.statusCode && error.statusCode >= 500 && error.statusCode < 600) {
    return true;
  }
  
  // 429 Too Many Requests is retryable
  if (error.statusCode === 429) {
    return true;
  }
  
  return error.isRetryable;
}

/**
 * Parses error response from API
 */
function parseErrorResponse(error: any): AmplifyServiceError {
  // Check if it's already our custom error
  if (error instanceof AmplifyServiceError) {
    return error;
  }

  // Check for network connectivity
  if (!isOnline()) {
    return new AmplifyServiceError(
      'No hay conexión a internet. Por favor, verifica tu conexión.',
      'NO_INTERNET',
      0,
      true
    );
  }

  // Try to extract error details from response
  if (error.response?.body) {
    try {
      const errorBody: ErrorResponse = JSON.parse(error.response.body);
      const statusCode = error.response.statusCode;
      const isRetryable = statusCode >= 500 || statusCode === 429;
      
      return new AmplifyServiceError(
        errorBody.message || 'Ocurrió un error',
        errorBody.code || 'UNKNOWN_ERROR',
        statusCode,
        isRetryable
      );
    } catch {
      // Failed to parse error body
    }
  }

  // Network or other errors
  if (error.message) {
    const isNetworkError = error.message.toLowerCase().includes('network') ||
                          error.message.toLowerCase().includes('fetch') ||
                          error.message.toLowerCase().includes('connection');
    
    return new AmplifyServiceError(
      isNetworkError 
        ? 'Error de conexión. Por favor, verifica tu internet e intenta de nuevo.'
        : error.message,
      'NETWORK_ERROR',
      undefined,
      true
    );
  }

  return new AmplifyServiceError(
    'Ocurrió un error inesperado',
    'UNKNOWN_ERROR',
    undefined,
    false
  );
}

/**
 * Uploads a photo to the backend with retry logic
 * 
 * @param photoFile - The image file to upload
 * @param retryCount - Current retry attempt (internal use)
 * @returns Promise resolving to photo URL and S3 key
 * @throws AmplifyServiceError if upload fails after all retries
 */
export async function uploadPhoto(
  photoFile: File,
  retryCount: number = 0
): Promise<UploadPhotoResponse> {
  try {
    // Check network connectivity before attempting
    if (!isOnline()) {
      throw new AmplifyServiceError(
        'No hay conexión a internet. Por favor, verifica tu conexión.',
        'NO_INTERNET',
        0,
        true
      );
    }

    // Create FormData for multipart upload
    const formData = new FormData();
    formData.append('file', photoFile);

    // Make API call with timeout
    const uploadPromise = post({
      apiName: 'default',
      path: '/api/upload-photo',
      options: {
        body: formData,
      },
    }).response;

    const response = await Promise.race([
      uploadPromise,
      createTimeoutPromise(REQUEST_TIMEOUT),
    ]);

    // Parse response body
    const responseBody = await response.body.json() as unknown;
    
    // Validate response structure
    if (!responseBody || typeof responseBody !== 'object') {
      throw new AmplifyServiceError(
        'Formato de respuesta inválido',
        'INVALID_RESPONSE',
        undefined,
        false
      );
    }

    const uploadResponse = responseBody as UploadPhotoResponse;

    if (!uploadResponse.photoUrl || !uploadResponse.s3Key) {
      throw new AmplifyServiceError(
        'Respuesta incompleta del servidor',
        'INVALID_RESPONSE',
        undefined,
        false
      );
    }

    return uploadResponse;
  } catch (error) {
    const parsedError = parseErrorResponse(error);
    
    // Retry logic
    if (isRetryableError(parsedError) && retryCount < MAX_RETRIES) {
      console.warn(`Upload attempt ${retryCount + 1} failed, retrying...`, parsedError);
      await delay(RETRY_DELAY * (retryCount + 1)); // Exponential backoff
      return uploadPhoto(photoFile, retryCount + 1);
    }
    
    // Add retry information to error message if retries were attempted
    if (retryCount > 0) {
      parsedError.message = `${parsedError.message} (intentos: ${retryCount + 1})`;
    }
    
    throw parsedError;
  }
}

/**
 * Generates an altar image using AI with retry logic
 * 
 * @param request - Request containing photo S3 key and food description
 * @param retryCount - Current retry attempt (internal use)
 * @returns Promise resolving to altar image URL and S3 key
 * @throws AmplifyServiceError if generation fails after all retries
 */
export async function generateAltar(
  request: GenerateAltarRequest,
  retryCount: number = 0
): Promise<GenerateAltarResponse> {
  try {
    // Validate request
    if (!request.photoS3Key || !request.foodDescription) {
      throw new AmplifyServiceError(
        'Se requiere la foto y la descripción de comidas',
        'INVALID_REQUEST',
        400,
        false
      );
    }

    if (request.foodDescription.length < 10 || request.foodDescription.length > 500) {
      throw new AmplifyServiceError(
        'La descripción debe tener entre 10 y 500 caracteres',
        'INVALID_DESCRIPTION_LENGTH',
        400,
        false
      );
    }

    // Check network connectivity before attempting
    if (!isOnline()) {
      throw new AmplifyServiceError(
        'No hay conexión a internet. Por favor, verifica tu conexión.',
        'NO_INTERNET',
        0,
        true
      );
    }

    // Make API call with timeout
    const generatePromise = post({
      apiName: 'default',
      path: '/api/generate-altar',
      options: {
        body: JSON.stringify(request),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    }).response;

    const response = await Promise.race([
      generatePromise,
      createTimeoutPromise(REQUEST_TIMEOUT),
    ]);

    // Parse response body
    const responseBody = await response.body.json() as unknown;

    // Validate response structure
    if (!responseBody || typeof responseBody !== 'object') {
      throw new AmplifyServiceError(
        'Formato de respuesta inválido',
        'INVALID_RESPONSE',
        undefined,
        false
      );
    }

    const generateResponse = responseBody as GenerateAltarResponse;

    if (!generateResponse.altarImageUrl || !generateResponse.altarImageS3Key) {
      throw new AmplifyServiceError(
        'Respuesta incompleta del servidor',
        'INVALID_RESPONSE',
        undefined,
        false
      );
    }

    return generateResponse;
  } catch (error) {
    const parsedError = parseErrorResponse(error);
    
    // Retry logic - be more conservative with generation retries due to longer processing time
    if (isRetryableError(parsedError) && retryCount < MAX_RETRIES) {
      console.warn(`Generation attempt ${retryCount + 1} failed, retrying...`, parsedError);
      await delay(RETRY_DELAY * (retryCount + 1) * 2); // Longer delay for generation
      return generateAltar(request, retryCount + 1);
    }
    
    // Add retry information to error message if retries were attempted
    if (retryCount > 0) {
      parsedError.message = `${parsedError.message} (intentos: ${retryCount + 1})`;
    }
    
    throw parsedError;
  }
}
