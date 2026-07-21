'use client';

import { useState, useRef, useCallback, type DragEvent } from 'react';
import { compressImage, formatFileSize } from '@/lib/utils/image-compress';
import { uploadImage, uploadImages, type UploadResult } from '@/lib/api/upload';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface UploadedImage {
  url: string;
  publicId: string;
}

interface BaseProps {
  /** Label above the uploader */
  label?: string;
  /** Max file size in MB before compression. Default: 10 */
  maxSizeMB?: number;
  /** Accepted file types. Default: image/jpeg, image/png, image/webp */
  accept?: string;
  /** Whether the uploader is disabled */
  disabled?: boolean;
  /** Custom class */
  className?: string;
  /** Compression quality 0-1. Default: 0.8 */
  quality?: number;
  /** Max width after compression. Default: 1200 */
  maxWidth?: number;
  /** Custom upload endpoint (for category images etc.) */
  endpoint?: '/upload/image' | '/upload/category-image';
  /** Error message */
  error?: string;
}

interface SingleUploadProps extends BaseProps {
  /** Single image mode */
  multiple?: false;
  /** Current image URL */
  value: string | null;
  /** Callback with uploaded image URL */
  onChange: (value: string | null) => void;
}

interface MultiUploadProps extends BaseProps {
  /** Multiple images mode */
  multiple: true;
  /** Current image URLs */
  value: string[];
  /** Callback with uploaded image URLs */
  onChange: (value: string[]) => void;
  /** Max number of images. Default: 10 */
  maxImages?: number;
}

type ImageUploaderProps = SingleUploadProps | MultiUploadProps;

// ─── Upload State ───────────────────────────────────────────────────────────────

interface UploadingFile {
  id: string;
  name: string;
  originalSize: number;
  compressedSize?: number;
  progress: 'compressing' | 'uploading' | 'done' | 'error';
  error?: string;
  previewUrl?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────────

export function ImageUploader(props: ImageUploaderProps) {
  const {
    label,
    maxSizeMB = 10,
    accept = 'image/jpeg,image/png,image/webp',
    disabled = false,
    className = '',
    quality = 0.8,
    maxWidth = 1200,
    endpoint = '/upload/image',
    error: externalError,
  } = props;

  const isMultiple = props.multiple === true;
  const maxImages = isMultiple ? (props as MultiUploadProps).maxImages || 10 : 1;

  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentImages = isMultiple
    ? (props as MultiUploadProps).value
    : (props as SingleUploadProps).value
      ? [(props as SingleUploadProps).value!]
      : [];

  const canUploadMore = currentImages.length + uploading.filter(f => f.progress !== 'error').length < maxImages;

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    // Filter valid images
    const validFiles = fileArray.filter((file) => {
      if (!file.type.startsWith('image/')) return false;
      if (file.size > maxSizeMB * 1024 * 1024) return false;
      return true;
    });

    if (validFiles.length === 0) return;

    // Limit to remaining slots
    const slotsAvailable = maxImages - currentImages.length;
    const filesToProcess = validFiles.slice(0, slotsAvailable);

    // Create upload state entries
    const uploadEntries: UploadingFile[] = filesToProcess.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: file.name,
      originalSize: file.size,
      progress: 'compressing' as const,
      previewUrl: URL.createObjectURL(file),
    }));

    setUploading((prev) => [...prev, ...uploadEntries]);

    // Process each file: compress → upload
    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      const entry = uploadEntries[i];

      try {
        // Step 1: Compress
        const compressed = await compressImage(file, {
          maxWidth,
          quality,
          format: 'image/webp',
        });

        setUploading((prev) =>
          prev.map((u) =>
            u.id === entry.id
              ? { ...u, compressedSize: compressed.size, progress: 'uploading' }
              : u,
          ),
        );

        // Step 2: Upload to backend → Cloudinary
        const result = await uploadImage(compressed, endpoint);

        // Step 3: Update parent state
        if (isMultiple) {
          const onChange = (props as MultiUploadProps).onChange;
          const currentVal = (props as MultiUploadProps).value;
          onChange([...currentVal, result.url]);
        } else {
          (props as SingleUploadProps).onChange(result.url);
        }

        // Mark as done
        setUploading((prev) =>
          prev.map((u) =>
            u.id === entry.id ? { ...u, progress: 'done' } : u,
          ),
        );

        // Remove from uploading list after a short delay
        setTimeout(() => {
          setUploading((prev) => prev.filter((u) => u.id !== entry.id));
          if (entry.previewUrl) URL.revokeObjectURL(entry.previewUrl);
        }, 1000);
      } catch (err: unknown) {
        setUploading((prev) =>
          prev.map((u) =>
            u.id === entry.id
              ? { ...u, progress: 'error', error: err instanceof Error ? err.message : 'Upload failed' }
              : u,
          ),
        );
      }
    }
  }, [currentImages.length, maxImages, maxWidth, quality, endpoint, isMultiple, props]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
      // Reset input so same file can be selected again
      e.target.value = '';
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (url: string) => {
    if (isMultiple) {
      const onChange = (props as MultiUploadProps).onChange;
      const currentVal = (props as MultiUploadProps).value;
      onChange(currentVal.filter((u) => u !== url));
    } else {
      (props as SingleUploadProps).onChange(null);
    }
  };

  const removeUploadingFile = (id: string) => {
    setUploading((prev) => {
      const entry = prev.find((u) => u.id === id);
      if (entry?.previewUrl) URL.revokeObjectURL(entry.previewUrl);
      return prev.filter((u) => u.id !== id);
    });
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">
          {label}
        </label>
      )}

      {/* Uploaded images preview */}
      {currentImages.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {currentImages.map((url, index) => (
            <div
              key={url}
              className="relative w-20 h-20 rounded-xl overflow-hidden border border-pink-200 group"
            >
              <img
                src={url}
                alt={`Uploaded ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <span className="text-white text-lg">×</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Uploading files progress */}
      {uploading.length > 0 && (
        <div className="space-y-2 mb-3">
          {uploading.map((file) => (
            <div
              key={file.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl border text-sm ${
                file.progress === 'error'
                  ? 'border-red-200 bg-red-50'
                  : 'border-pink-100 bg-pink-50/50'
              }`}
            >
              {/* Preview thumbnail */}
              {file.previewUrl && (
                <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={file.previewUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#2d1a24] truncate">{file.name}</p>
                <p className="text-[10px] text-[#6d1b3b]/50">
                  {formatFileSize(file.originalSize)}
                  {file.compressedSize && file.compressedSize < file.originalSize && (
                    <span className="text-green-600"> → {formatFileSize(file.compressedSize)}</span>
                  )}
                </p>
              </div>

              {/* Status */}
              {file.progress === 'compressing' && (
                <span className="text-xs text-[#ad1457] animate-pulse">Compressing...</span>
              )}
              {file.progress === 'uploading' && (
                <span className="text-xs text-[#e91e8c] animate-pulse">Uploading...</span>
              )}
              {file.progress === 'done' && (
                <span className="text-xs text-green-600">✓</span>
              )}
              {file.progress === 'error' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-500">{file.error}</span>
                  <button
                    type="button"
                    onClick={() => removeUploadingFile(file.id)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      {canUploadMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
            ${disabled ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50' : ''}
            ${isDragging ? 'border-[#e91e8c] bg-pink-50/50 scale-[1.01]' : 'border-pink-200 hover:border-[#e91e8c] hover:bg-pink-50/30'}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={isMultiple}
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
          />

          <div className="text-3xl mb-2">📷</div>
          <p className="text-sm text-[#2d1a24] font-medium">
            {isDragging ? 'Drop here' : 'Click or drag images'}
          </p>
          <p className="text-xs text-[#6d1b3b]/50 mt-1">
            JPEG, PNG, WebP • Max {maxSizeMB}MB • Auto-compressed
          </p>
          {isMultiple && (
            <p className="text-xs text-[#6d1b3b]/40 mt-0.5">
              {currentImages.length}/{maxImages} images
            </p>
          )}
        </div>
      )}

      {/* External error */}
      {externalError && (
        <p className="text-xs text-red-500 mt-1">{externalError}</p>
      )}
    </div>
  );
}
