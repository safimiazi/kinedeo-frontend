/**
 * Upload API functions — handles image uploads to the backend.
 * The backend then uploads to Cloudinary and returns the URL.
 */

import { getAccessToken, ApiError } from './client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.kinedeo.com/api';

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Upload a single image file.
 * Sends as multipart/form-data (NOT JSON).
 */
export async function uploadImage(file: File, endpoint = '/upload/image'): Promise<UploadResult> {
  const token = getAccessToken();
  if (!token) {
    throw new ApiError('Authentication required', 401);
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Don't set Content-Type — browser sets it with boundary for multipart
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      (errorData as { message?: string }).message || 'Upload failed',
      response.status,
      errorData,
    );
  }

  return response.json();
}

/**
 * Upload multiple image files (max 10).
 */
export async function uploadImages(files: File[]): Promise<UploadResult[]> {
  const token = getAccessToken();
  if (!token) {
    throw new ApiError('Authentication required', 401);
  }

  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await fetch(`${API_BASE}/upload/images`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      (errorData as { message?: string }).message || 'Upload failed',
      response.status,
      errorData,
    );
  }

  return response.json();
}

/**
 * Upload a category image.
 */
export async function uploadCategoryImage(file: File): Promise<UploadResult> {
  return uploadImage(file, '/upload/category-image');
}

/**
 * Delete an image by public ID.
 */
export async function deleteImage(publicId: string): Promise<void> {
  const token = getAccessToken();
  if (!token) {
    throw new ApiError('Authentication required', 401);
  }

  const response = await fetch(`${API_BASE}/upload/${encodeURIComponent(publicId)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      (errorData as { message?: string }).message || 'Delete failed',
      response.status,
      errorData,
    );
  }
}

export const uploadApi = {
  uploadImage,
  uploadImages,
  uploadCategoryImage,
  deleteImage,
};
