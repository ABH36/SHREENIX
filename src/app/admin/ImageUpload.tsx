// src/components/admin/ImageUpload.tsx
'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  folder?: string;
  maxFiles?: number;
  currentImages?: string[];
  onUploadComplete?: (urls: string[]) => void;
  onRemove?: (url: string) => void;
}

export default function ImageUpload({
  folder = 'shreenix',
  maxFiles = 5,
  currentImages = [],
  onUploadComplete,
  onRemove,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(currentImages);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Check max files limit
    if (previews.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} images allowed`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      if (files.length === 1) {
        // Single file upload
        formData.append('file', files[0]);
        formData.append('folder', folder);

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          const newPreviews = [...previews, result.data.url];
          setPreviews(newPreviews);
          onUploadComplete?.(newPreviews);
          setUploadProgress(100);
        } else {
          alert(result.error || 'Upload failed');
        }
      } else {
        // Multiple files upload
        files.forEach((file) => formData.append('files', file));
        formData.append('folder', folder);

        const response = await fetch('/api/admin/upload', {
          method: 'PUT',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          const newUrls = result.data.uploaded.map((img: any) => img.url);
          const newPreviews = [...previews, ...newUrls];
          setPreviews(newPreviews);
          onUploadComplete?.(newPreviews);
          setUploadProgress(100);

          if (result.data.failed > 0) {
            alert(`${result.data.failed} files failed to upload`);
          }
        } else {
          alert(result.error || 'Upload failed');
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (url: string) => {
    if (confirm('Are you sure you want to remove this image?')) {
      const newPreviews = previews.filter((img) => img !== url);
      setPreviews(newPreviews);
      onRemove?.(url);
      onUploadComplete?.(newPreviews);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || previews.length >= maxFiles}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={20} />
              Upload Image{maxFiles > 1 ? 's' : ''}
            </>
          )}
        </button>

        <span className="text-sm text-gray-600">
          {previews.length} / {maxFiles} images
        </span>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple={maxFiles > 1}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {uploading && uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Image Previews */}
      {previews.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {previews.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-emerald-500 transition-all"
            >
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X size={16} />
              </button>

              {/* Image Index */}
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <ImageIcon className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600 mb-2">No images uploaded yet</p>
          <p className="text-sm text-gray-400">
            Click upload button to select images from your device
          </p>
        </div>
      )}

      {/* File Size Info */}
      <p className="text-xs text-gray-500">
        Maximum file size: 5MB per image. Supported formats: JPG, PNG, WebP
      </p>
    </div>
  );
}