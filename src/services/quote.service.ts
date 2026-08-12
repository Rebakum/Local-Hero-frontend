import axiosInstance from '../lib/axiosInstance';

interface ApiEnvelope<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
}

export type QuoteStatus = 'PENDING' | 'QUOTED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface QuoteProfessional {
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
}

export interface QuoteResponse {
  id: string;
  quoteId: string;
  professionalId: string;
  amountInPence: number;
  message: string | null;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
  professional?: QuoteProfessional;
}

export interface QuoteRecord {
  id: string;
  customerId: string;
  trade: string;
  postcode: string;
  city: string;
  description: string;
  budgetInPence: number | null;
  preferredDate: string | null;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
  responses: QuoteResponse[];
}

export interface QuoteInput {
  trade: string;
  professionId?: string;
  postcode: string;
  city: string;
  description: string;
  budgetInPence?: number;
  preferredDate?: string;
}

export const createQuote = async (payload: QuoteInput): Promise<QuoteRecord> => {
  const { data } = await axiosInstance.post<ApiEnvelope<QuoteRecord>>('/quotes', payload);
  return data.data;
};

export const getMyQuotes = async (): Promise<QuoteRecord[]> => {
  const { data } = await axiosInstance.get<ApiEnvelope<QuoteRecord[]>>('/quotes/me');
  return data.data ?? [];
};

export const getAvailableQuotes = async (): Promise<QuoteRecord[]> => {
  const { data } = await axiosInstance.get<ApiEnvelope<QuoteRecord[]>>('/quotes/available');
  return data.data ?? [];
};

export const getProviderQuotes = async (): Promise<QuoteRecord[]> => {
  const { data } = await axiosInstance.get<ApiEnvelope<QuoteRecord[]>>('/quotes/provider');
  return data.data ?? [];
};

export const respondToQuote = async (
  quoteId: string,
  payload: { amountInPence: number; message?: string }
): Promise<QuoteResponse> => {
  const { data } = await axiosInstance.post<ApiEnvelope<QuoteResponse>>(
    `/quotes/${quoteId}/responses`,
    payload
  );
  return data.data;
};

export const setQuoteResponseStatus = async (
  quoteId: string,
  responseId: string,
  status: 'ACCEPTED' | 'REJECTED'
): Promise<QuoteResponse> => {
  const { data } = await axiosInstance.patch<ApiEnvelope<QuoteResponse>>(
    `/quotes/${quoteId}/responses/${responseId}`,
    { status }
  );
  return data.data;
};
