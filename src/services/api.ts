import axiosInstance from '../lib/axiosInstance';
import type { Professional, Trade, BeforeAfterPair, Testimonial, FAQItem } from '../types';

// The backend's sendResponse() always sends:
//   { success, statusCode, message, data: <payload>, meta? }
// For list endpoints <payload> IS the array (e.g. data: Professional[]),
// and meta (page/limit/total) is a sibling of data — never nested inside it.
interface ApiListResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T[];
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

interface ApiItemResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// Professionals API
export async function getProfessionals(params?: {
  page?: number;
  limit?: number;
  trade?: string;
  featured?: boolean;
  search?: string;
}): Promise<{ professionals: Professional[]; meta?: { page: number; limit: number; total: number } }> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', String(params.page));
  if (params?.limit) queryParams.set('limit', String(params.limit));
  if (params?.trade) queryParams.set('trade', params.trade);
  if (params?.featured) queryParams.set('featured', 'true');
  if (params?.search) queryParams.set('search', params.search);

  const { data } = await axiosInstance.get<ApiListResponse<Professional>>(
    `/professionals?${queryParams.toString()}`,
  );

  return {
    professionals: data.data || [],
    meta: data.meta,
  };
}

export async function getProfessionalById(id: string): Promise<Professional> {
  const { data } = await axiosInstance.get<ApiItemResponse<Professional>>(`/professionals/${id}`);
  return data.data;
}

export async function getFeaturedProfessionals(): Promise<Professional[]> {
  const result = await getProfessionals({ featured: true, limit: 10 });
  return result.professionals;
}

// Trades API
export async function getTrades(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ trades: Trade[]; meta?: { page: number; limit: number; total: number } }> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', String(params.page));
  if (params?.limit) queryParams.set('limit', String(params.limit));
  if (params?.search) queryParams.set('search', params.search);

  const { data } = await axiosInstance.get<ApiListResponse<Trade>>(
    `/trades?${queryParams.toString()}`,
  );

  return {
    trades: data.data || [],
    meta: data.meta,
  };
}

export async function getTradeById(id: string): Promise<Trade> {
  const { data } = await axiosInstance.get<ApiItemResponse<Trade>>(`/trades/${id}`);
  return data.data;
}

export async function getAllTrades(): Promise<Trade[]> {
  const result = await getTrades({ limit: 50 });
  return result.trades;
}

// Before/After Projects API
export async function getBeforeAfterProjects(params?: {
  page?: number;
  limit?: number;
  trade?: string;
  search?: string;
}): Promise<{ projects: BeforeAfterPair[]; meta?: { page: number; limit: number; total: number } }> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', String(params.page));
  if (params?.limit) queryParams.set('limit', String(params.limit));
  if (params?.trade) queryParams.set('trade', params.trade);
  if (params?.search) queryParams.set('search', params.search);

  const { data } = await axiosInstance.get<ApiListResponse<BeforeAfterPair>>(
    `/before-after?${queryParams.toString()}`,
  );

  return {
    projects: data.data || [],
    meta: data.meta,
  };
}

export async function getBeforeAfterProjectById(id: string): Promise<BeforeAfterPair> {
  const { data } = await axiosInstance.get<ApiItemResponse<BeforeAfterPair>>(`/before-after/${id}`);
  return data.data;
}

export async function getAllBeforeAfterProjects(): Promise<BeforeAfterPair[]> {
  const result = await getBeforeAfterProjects({ limit: 50 });
  return result.projects;
}

// Testimonials API
export async function getTestimonials(params?: {
  page?: number;
  limit?: number;
  trade?: string;
  search?: string;
}): Promise<{ testimonials: Testimonial[]; meta?: { page: number; limit: number; total: number } }> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', String(params.page));
  if (params?.limit) queryParams.set('limit', String(params.limit));
  if (params?.trade) queryParams.set('trade', params.trade);
  if (params?.search) queryParams.set('search', params.search);

  const { data } = await axiosInstance.get<ApiListResponse<Testimonial>>(
    `/testimonials?${queryParams.toString()}`,
  );

  return {
    testimonials: data.data || [],
    meta: data.meta,
  };
}

export async function getTestimonialById(id: string): Promise<Testimonial> {
  const { data } = await axiosInstance.get<ApiItemResponse<Testimonial>>(`/testimonials/${id}`);
  return data.data;
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const result = await getTestimonials({ limit: 50 });
  return result.testimonials;
}

// FAQs API
export async function getFAQs(params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}): Promise<{ faqs: FAQItem[]; meta?: { page: number; limit: number; total: number } }> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.set('page', String(params.page));
  if (params?.limit) queryParams.set('limit', String(params.limit));
  if (params?.category) queryParams.set('category', params.category);
  if (params?.search) queryParams.set('search', params.search);

  const { data } = await axiosInstance.get<ApiListResponse<FAQItem>>(
    `/faqs?${queryParams.toString()}`,
  );

  return {
    faqs: data.data || [],
    meta: data.meta,
  };
}

export async function getFAQById(id: string): Promise<FAQItem> {
  const { data } = await axiosInstance.get<ApiItemResponse<FAQItem>>(`/faqs/${id}`);
  return data.data;
}

export async function getAllFAQs(): Promise<FAQItem[]> {
  const result = await getFAQs({ limit: 50 });
  return result.faqs;
}
