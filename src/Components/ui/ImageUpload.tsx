import React, { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2, UploadCloud } from 'lucide-react';
import { uploadImage, uploadImages, type UploadFolder } from '../../services/upload.service';

export interface ImageUploadProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  folder?: UploadFolder;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  hint?: string;
  disabled?: boolean;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  folder = 'portfolios',
  multiple = false,
  maxFiles = 10,
  label = 'Upload images',
  hint,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const urls = Array.isArray(value) ? value : value ? [value] : [];

  const handleFiles = async (files: FileList | File[]) => {
    if (disabled) return;
    const accepted = Array.from(files).filter((f) => ACCEPTED_TYPES.includes(f.type));
    if (accepted.length === 0) return;

    const remaining = multiple ? Math.max(0, maxFiles - urls.length) : 1;
    const toUpload = accepted.slice(0, remaining);

    setUploading(true);
    try {
      if (multiple) {
        const uploaded = await uploadImages(toUpload, folder);
        const next = [...urls, ...uploaded.map((img) => img.url)].slice(0, maxFiles);
        onChange(next);
      } else {
        const uploaded = await uploadImage(toUpload[0], folder);
        onChange(uploaded.url);
      }
    } catch {
      // Upload failed — let the caller surface errors if needed.
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeUrl = (url: string) => {
    if (multiple) {
      onChange(urls.filter((u) => u !== url));
    } else {
      onChange('');
    }
  };

  const showDropzone = urls.length === 0 || (multiple && urls.length < maxFiles);

  return (
    <div className="space-y-3">
      {label && (
        <p className="text-xs font-semibold text-navy-700 dark:text-navy-300">
          {label}
          {multiple && (
            <span className="font-normal text-navy-800 dark:text-navy-300 ml-1">
              ({urls.length}/{maxFiles})
            </span>
          )}
        </p>
      )}

      {/* Previews */}
      {urls.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {urls.map((url) => (
            <div
              key={url}
              className="relative group w-24 h-24 rounded-2xl overflow-hidden border border-navy-200 dark:border-white/10 bg-navy-50 dark:bg-white/5"
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeUrl(url)}
                disabled={disabled}
                aria-label="Remove image"
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              >
                <Trash2 className="w-3.5 3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
      {showDropzone && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => !uploading && !disabled && inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`flex flex-col items-center justify-center gap-2.5 px-6 py-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-primary bg-primary/5 scale-[0.99]'
              : 'border-navy-200 dark:border-white/15 hover:border-primary/60 hover:bg-navy-50 dark:hover:bg-white/[0.03]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <UploadCloud className="w-6 h-6" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-navy-700 dark:text-navy-300">
              {uploading ? 'Uploading…' : isDragging ? 'Drop to upload' : 'Drag & drop or click to upload'}
            </p>
            <p className="text-xs text-navy-800 dark:text-navy-300 mt-1">
              {hint ?? 'JPG, PNG, WEBP — max 10 images'}
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            multiple={multiple}
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>
      )}

      {urls.length > 0 && showDropzone && !disabled && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <ImagePlus className="w-3.5 3" />
          Add more
        </button>
      )}
    </div>
  );
};
