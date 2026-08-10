import axiosInstance from '../lib/axiosInstance';

export type UploadFolder = 'avatars' | 'portfolios' | 'before-after' | 'trades';

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
