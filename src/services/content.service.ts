import axiosInstance from '../lib/axiosInstance';
import type { Professional, Trade, BeforeAfterPair, Testimonial, TradeCategory } from '../types';


interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}


function extractArray<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  const envelope = res as { data?: unknown };
  const data = envelope?.data;
  if (Array.isArray(data)) return data as T[];
  if (Array.isArray((data as { data?: unknown } | undefined)?.data)) {
    return ((data as { data: T[] }).data) as T[];
  }
  return [];
}


export function normalizeProfessional(raw: Record<string, unknown>): Professional {
  const verifiedStatus = (raw.verifiedStatus ?? {}) as Record<string, unknown>;
  return {
    id: (raw.id as string) ?? '',
    name: (raw.name as string) ?? '',
    trade: ((raw.trade as TradeCategory) ?? 'Plumber') as TradeCategory,
    companyName: (raw.companyName as string) ?? '',
    avatar: (raw.avatar as string) ?? '',
    rating: Number(raw.rating ?? 5),
    reviewCount: Number(raw.reviewCount ?? 0),
    jobsCompleted: Number(raw.jobsCompleted ?? 0),
    hourlyRate: Number(raw.hourlyRate ?? 0),
    location: (raw.location as string) ?? '',
    postcodeArea: (raw.postcodeArea as string) ?? '',
    responseMinutes: Number(raw.responseMinutes ?? 30),
    verifiedStatus: {
      dbsChecked: Boolean(verifiedStatus.dbsChecked ?? false),
      gasSafe: verifiedStatus.gasSafe as boolean | undefined,
      niceic: verifiedStatus.niceic as boolean | undefined,
      insured: Boolean(verifiedStatus.insured ?? true),
      insuranceAmount: (verifiedStatus.insuranceAmount as string) ?? '£2,000,000',
    },
    bio: (raw.bio as string) ?? '',
    specialties: Array.isArray(raw.specialties) ? (raw.specialties as string[]) : [],
    availability: ((raw.availability as Professional['availability']) ?? 'Available Today'),
    portfolioImages: Array.isArray(raw.portfolioImages) ? (raw.portfolioImages as string[]) : [],
    badgeText: raw.badgeText as string | undefined,
  };
}

export interface TradeInput {
  category: string;
  subtitle?: string;
  iconName?: string;
  description?: string;
  avgHourlyRate?: string;
  startingPrice?: string;
  activeProsCount?: number;
  popularTasks?: string[];
  badge?: string;
  featuredService?: {
    title: string;
    estimatedPrice?: string;
    timeEstimate?: string;
    popularFor?: string;
    description?: string;
    included?: string[];
    icon?: string;
    image?: string;
    isEmergency?: boolean;
  };
}

export interface ProfessionalInput {
  name: string;
  trade: string;
  companyName?: string;
  avatar?: string;
  hourlyRate?: number;
  location?: string;
  postcodeArea?: string;
  bio?: string;
  specialties?: string[];
  availability?: string;
  portfolioImages?: string[];
}

export interface BeforeAfterInput {
  title: string;
  trade: string;
  location?: string;
  beforeImage?: string;
  afterImage?: string;
  description?: string;
  cost?: string;
  completionDays?: string;
}

export interface TestimonialInput {
  author: string;
  role?: string;
  city?: string;
  trade: string;
  rating?: number;
  date?: string;
  comment?: string;
  verifiedJob?: string;
  avatar?: string;
  source?: string;
}

// ---------- Trades ----------

export async function getTradesAdmin(): Promise<Trade[]> {
  const { data } = await axiosInstance.get<ApiEnvelope<Trade[]>>('/trades');
  return data.data ?? [];
}

export async function createTrade(payload: TradeInput): Promise<Trade> {
  const { data } = await axiosInstance.post<ApiEnvelope<Trade>>('/trades', payload);
  return data.data;
}

export async function updateTrade(id: string, payload: TradeInput): Promise<Trade> {
  const { data } = await axiosInstance.patch<ApiEnvelope<Trade>>(`/trades/${id}`, payload);
  return data.data;
}

export async function deleteTrade(id: string): Promise<void> {
  await axiosInstance.delete(`/trades/${id}`);
}

// ---------- Professionals ----------

export async function getProfessionalsAdmin(): Promise<Professional[]> {
  const res = await axiosInstance.get<unknown>('/professionals');
  return extractArray<Record<string, unknown>>(res.data).map(normalizeProfessional);
}


export async function getProfessionalsPublic(): Promise<Professional[]> {
  const res = await axiosInstance.get<unknown>('/professionals');
  return extractArray<Record<string, unknown>>(res.data).map(normalizeProfessional);
}

export const getProfessionalById = async (id: string) => {
  const response = await axiosInstance.get(`/professionals/${id}`);
  // response.data.data দিন যেন সরাসরি Professional Object-টি পাওয়া যায়
  return response.data.data; 
};

export async function createProfessional(payload: ProfessionalInput): Promise<Professional> {
  const { data } = await axiosInstance.post<ApiEnvelope<Professional>>('/professionals', payload);
  return normalizeProfessional(data.data as unknown as Record<string, unknown>);
}

export async function updateProfessional(id: string, payload: ProfessionalInput): Promise<Professional> {
  const { data } = await axiosInstance.patch<ApiEnvelope<Professional>>(`/professionals/${id}`, payload);
  return data.data;
}

export async function deleteProfessional(id: string): Promise<void> {
  await axiosInstance.delete(`/professionals/${id}`);
}

// ---------- Before / After ----------

export async function getBeforeAfterAdmin(): Promise<BeforeAfterPair[]> {
  const { data } = await axiosInstance.get<ApiEnvelope<BeforeAfterPair[]>>('/before-after');
  return data.data ?? [];
}

export async function createBeforeAfter(payload: BeforeAfterInput): Promise<BeforeAfterPair> {
  const { data } = await axiosInstance.post<ApiEnvelope<BeforeAfterPair>>('/before-after', payload);
  return data.data;
}

export async function updateBeforeAfter(id: string, payload: BeforeAfterInput): Promise<BeforeAfterPair> {
  const { data } = await axiosInstance.patch<ApiEnvelope<BeforeAfterPair>>(`/before-after/${id}`, payload);
  return data.data;
}

export async function deleteBeforeAfter(id: string): Promise<void> {
  await axiosInstance.delete(`/before-after/${id}`);
}

// ---------- Testimonials ----------

export async function getTestimonialsAdmin(): Promise<Testimonial[]> {
  const { data } = await axiosInstance.get<ApiEnvelope<Testimonial[]>>('/testimonials');
  return data.data ?? [];
}

export async function createTestimonial(payload: TestimonialInput): Promise<Testimonial> {
  const { data } = await axiosInstance.post<ApiEnvelope<Testimonial>>('/testimonials', payload);
  return data.data;
}

export async function updateTestimonial(id: string, payload: TestimonialInput): Promise<Testimonial> {
  const { data } = await axiosInstance.patch<ApiEnvelope<Testimonial>>(`/testimonials/${id}`, payload);
  return data.data;
}

export async function deleteTestimonial(id: string): Promise<void> {
  await axiosInstance.delete(`/testimonials/${id}`);
}
