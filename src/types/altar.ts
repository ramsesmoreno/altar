/**
 * Core data model for a saved altar
 */
export interface Altar {
  id: string;
  photoUrl: string;
  photoS3Key: string;
  foodDescription: string;
  altarImageUrl: string;
  altarImageS3Key: string;
  createdAt: string; // ISO 8601 timestamp
}

/**
 * Request payload for creating a new altar
 */
export interface CreateAltarRequest {
  photoFile: File;
  foodDescription: string;
}

/**
 * Response from the complete altar creation process
 */
export interface CreateAltarResponse {
  altarId: string;
  photoUrl: string;
  altarImageUrl: string;
}

/**
 * Response from photo upload endpoint
 */
export interface UploadPhotoResponse {
  photoUrl: string;
  s3Key: string;
}

/**
 * Request payload for altar generation
 */
export interface GenerateAltarRequest {
  photoS3Key: string;
  foodDescription: string;
}

/**
 * Response from altar generation endpoint
 */
export interface GenerateAltarResponse {
  altarImageUrl: string;
  altarImageS3Key: string;
}

/**
 * Standard error response format
 */
export interface ErrorResponse {
  error: string;
  message: string;
  code: string;
}
