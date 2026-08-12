import axiosInstance from '../lib/axiosInstance';

interface ApiEnvelope<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
}

export interface FavouriteProfessional {
  id: string;
  name: string;
  companyName: string;
  trade: string;
  avatar: string | null;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  location: string;
  postcodeArea: string;
  isVerified: boolean;
  isFeatured: boolean;
}

export interface Favourite {
  id: string;
  userId: string;
  professionalId: string;
  createdAt: string;
  professional: FavouriteProfessional;
}

export const getMyFavourites = async (): Promise<Favourite[]> => {
  const { data } = await axiosInstance.get<ApiEnvelope<Favourite[]>>('/favourites/me');
  return data.data ?? [];
};

export const addFavourite = async (professionalId: string): Promise<Favourite> => {
  const { data } = await axiosInstance.post<ApiEnvelope<Favourite>>(
    `/favourites/${professionalId}`
  );
  return data.data;
};

export const removeFavourite = async (professionalId: string): Promise<void> => {
  await axiosInstance.delete(`/favourites/${professionalId}`);
};

export const isFavourite = async (professionalId: string): Promise<boolean> => {
  const { data } = await axiosInstance.get<ApiEnvelope<{ isFavourite: boolean }>>(
    `/favourites/check/${professionalId}`
  );
  return data.data.isFavourite;
};
