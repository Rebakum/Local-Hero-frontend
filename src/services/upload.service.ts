import axiosInstance from '../lib/axiosInstance';

export type UploadFolder = 'avatars' | 'portfolios' | 'before-after' | 'trades';

export const UPLOAD_FOLDER_OPTIONS: { value: UploadFolder; label: string }[] = [
  { value: 'avatars', label: 'Avatars' },
  { value: 'portfolios', label: 'Portfolios' },
  { value: 'before-after', label: 'Before / After' },
  { value: 'trades', label: 'Trades' },
];

// "before-after" and "trades" are admin-only on the backend, so customer /
// provider forms only offer the shared folders.
export const USER_UPLOAD_FOLDER_OPTIONS = UPLOAD_FOLDER_OPTIONS.filter(
  (option) => option.value === 'avatars' || option.value === 'portfolios'
);

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export async function uploadImage(file: File, folder: UploadFolder): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  const { data } = await axiosInstance.post<ApiEnvelope<UploadedImage>>('/uploads/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.data;
}

export async function uploadImages(files: File[], folder: UploadFolder): Promise<UploadedImage[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  formData.append('folder', folder);

  const { data } = await axiosInstance.post<ApiEnvelope<UploadedImage[]>>('/uploads/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.data;
}

export async function deleteImage(publicId: string): Promise<void> {
  await axiosInstance.delete('/uploads', { data: { publicId } });
}
