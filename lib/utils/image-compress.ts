/**
 * Client-side image compression utility.
 * Compresses images before upload to reduce bandwidth and speed up uploads.
 *
 * Uses Canvas API — works in all modern browsers.
 */

export interface CompressOptions {
  /** Max width in pixels. Default: 1200 */
  maxWidth?: number;
  /** Max height in pixels. Default: 1200 */
  maxHeight?: number;
  /** Quality 0-1. Default: 0.8 */
  quality?: number;
  /** Output format. Default: 'image/webp' (falls back to jpeg if not supported) */
  format?: 'image/webp' | 'image/jpeg' | 'image/png';
}

const DEFAULT_OPTIONS: Required<CompressOptions> = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.8,
  format: 'image/webp',
};

/**
 * Compress a single image File.
 * Returns a new File with reduced size.
 */
export async function compressImage(
  file: File,
  options: CompressOptions = {},
): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Skip compression for already small files (< 100KB)
  if (file.size < 100 * 1024) {
    return file;
  }

  // Skip non-image files
  if (!file.type.startsWith('image/')) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;

      if (width > opts.maxWidth) {
        height = Math.round((height * opts.maxWidth) / width);
        width = opts.maxWidth;
      }
      if (height > opts.maxHeight) {
        width = Math.round((width * opts.maxHeight) / height);
        height = opts.maxHeight;
      }

      // Draw to canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file); // Fallback: return original
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          // If compressed is larger than original, use original
          if (blob.size >= file.size) {
            resolve(file);
            return;
          }

          // Create new File with same name
          const extension = opts.format === 'image/webp' ? '.webp' : opts.format === 'image/png' ? '.png' : '.jpg';
          const newName = file.name.replace(/\.[^.]+$/, extension);

          const compressedFile = new File([blob], newName, {
            type: opts.format,
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        opts.format,
        opts.quality,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for compression'));
    };

    img.src = url;
  });
}

/**
 * Compress multiple images in parallel.
 */
export async function compressImages(
  files: File[],
  options: CompressOptions = {},
): Promise<File[]> {
  return Promise.all(files.map((file) => compressImage(file, options)));
}

/**
 * Get a human-readable file size string.
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
