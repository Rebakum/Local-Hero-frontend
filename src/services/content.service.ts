import axiosInstance from '../lib/axiosInstance';
import type { Professional, Trade, Profession, BeforeAfterPair, Testimonial, TradeCategory, FeaturedService } from '../types';


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
    isFeatured: Boolean(raw.isFeatured ?? false),
    sortOrder: Number(raw.sortOrder ?? 0),
    isVerified: Boolean(raw.isVerified ?? false),
    isEmergency: Boolean(raw.isEmergency ?? false),
    workingHours: raw.workingHours as Record<string, unknown> | undefined,
    certifications: Array.isArray(raw.certifications) ? (raw.certifications as string[]) : undefined,
    insuranceInfo: raw.insuranceInfo as string | undefined,
    serviceAreas: Array.isArray(raw.serviceAreas) ? (raw.serviceAreas as string[]) : undefined,
    yearsOfExperience:
      raw.yearsOfExperience != null ? Number(raw.yearsOfExperience) : undefined,
  };
}

export interface TradeInput {
  category: string;
  subtitle?: string | null;
  iconUrl?: string | null;
  description?: string;
  avgHourlyRate?: string;
  startingPrice?: string | null;
  popularTasks?: string[];
  badge?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface FeaturedServiceInput {
  tradeId: string;
  title: string;
  estimatedPrice?: string | null;
  timeEstimate?: string | null;
  popularFor?: string[];
  description: string;
  imageUrl?: string | null;
  sortOrder?: number;
  isActive?: boolean;
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
  badgeText?: string;
  isFeatured?: boolean;
  sortOrder?: number;
  isVerified?: boolean;
  isEmergency?: boolean;
  workingHours?: Record<string, unknown>;
  certifications?: string[];
  insuranceInfo?: string;
  serviceAreas?: string[];
  yearsOfExperience?: number;
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

export interface BeforeAfterSubmissionInput {
  bookingId: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  cost: string;
  completionDays: string;
}

// Fields a professional may edit on their own submission. `trade` is
// auto-derived from the booking server-side and is never editable.
export interface BeforeAfterUpdateInput {
  title?: string;
  location?: string;
  beforeImage?: string;
  afterImage?: string;
  description?: string;
  cost?: string;
  completionDays?: string;
}

export interface EligibleBeforeAfterBooking {
  id: string;
  trade: string;
  postcode: string;
  address: string;
  bookingDate: string;
  fullName: string;
  createdAt: string;
}

export interface BeforeAfterAdminQuery {
  page?: number;
  limit?: number;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL';
  search?: string;
  trade?: string;
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
  professionalId?: string;
  bookingId?: string;
  isApproved?: boolean;
  isFeatured?: boolean;
  moderationNote?: string | null;
}

export interface TestimonialQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isApproved?: 'true' | 'false';
  isFeatured?: 'true' | 'false';
  trade?: string;
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

// ---------- Featured Services ----------

export async function getFeaturedServices(params?: {
  page?: number;
  limit?: number;
  tradeId?: string;
  search?: string;
  isActive?: string;
}): Promise<FeaturedService[]> {
  const { data } = await axiosInstance.get<ApiEnvelope<FeaturedService[]>>('/featured-services', { params });
  return data.data ?? [];
}

export async function getFeaturedServiceById(id: string): Promise<FeaturedService> {
  const { data } = await axiosInstance.get<ApiEnvelope<FeaturedService>>(`/featured-services/${id}`);
  return data.data;
}

export async function createFeaturedService(payload: FeaturedServiceInput): Promise<FeaturedService> {
  const { data } = await axiosInstance.post<ApiEnvelope<FeaturedService>>('/featured-services', payload);
  return data.data;
}

export async function updateFeaturedService(id: string, payload: FeaturedServiceInput): Promise<FeaturedService> {
  const { data } = await axiosInstance.patch<ApiEnvelope<FeaturedService>>(`/featured-services/${id}`, payload);
  return data.data;
}

export async function deleteFeaturedService(id: string): Promise<void> {
  await axiosInstance.delete(`/featured-services/${id}`);
}

// ---------- Professions (Trade -> Profession) ----------

export interface ProfessionInput {
  tradeId?: string;
  trade?: string;
  name: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export async function getProfessionsAdmin(params?: {
  page?: number;
  limit?: number;
  tradeId?: string;
  search?: string;
}): Promise<Profession[]> {
  const { data } = await axiosInstance.get<ApiEnvelope<Profession[]>>('/professions', { params });
  return data.data ?? [];
}

export async function createProfession(payload: ProfessionInput): Promise<Profession> {
  const { data } = await axiosInstance.post<ApiEnvelope<Profession>>('/professions', payload);
  return data.data;
}

export async function updateProfession(id: string, payload: ProfessionInput): Promise<Profession> {
  const { data } = await axiosInstance.patch<ApiEnvelope<Profession>>(`/professions/${id}`, payload);
  return data.data;
}

export async function deleteProfession(id: string): Promise<void> {
  await axiosInstance.delete(`/professions/${id}`);
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

export async function getProfessionalsByTrade(trade: string): Promise<Professional[]> {
  const res = await axiosInstance.get<unknown>('/professionals', {
    params: { trade, limit: 100 },
  });
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

export async function getBeforeAfterAdmin(
  params?: BeforeAfterAdminQuery,
): Promise<BeforeAfterPair[]> {
  const { data } = await axiosInstance.get<ApiEnvelope<BeforeAfterPair[]>>('/before-after/admin', {
    params,
  });
  return data.data ?? [];
}

// Public: approved showcases for a specific professional (profile page).
export async function getBeforeAfterByProfessional(
  professionalId: string,
): Promise<BeforeAfterPair[]> {
  const { data } = await axiosInstance.get<ApiEnvelope<BeforeAfterPair[]>>('/before-after', {
    params: { professionalId, limit: 50 },
  });
  return data.data ?? [];
}

// Admin: approve/reject a submission.
export async function updateBeforeAfterStatus(
  id: string,
  payload: { status: 'APPROVED' | 'REJECTED'; rejectionReason?: string },
): Promise<BeforeAfterPair> {
  const { data } = await axiosInstance.patch<ApiEnvelope<BeforeAfterPair>>(
    `/before-after/${id}/status`,
    payload,
  );
  return data.data;
}

// Admin: toggle homepage feature (approved only).
export async function toggleBeforeAfterFeature(id: string): Promise<BeforeAfterPair> {
  const { data } = await axiosInstance.patch<ApiEnvelope<BeforeAfterPair>>(
    `/before-after/${id}/feature`,
  );
  return data.data;
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

// ---------- Provider: Before / After submissions ----------

export async function getEligibleBeforeAfterBookings(): Promise<EligibleBeforeAfterBooking[]> {
  const { data } = await axiosInstance.get<ApiEnvelope<EligibleBeforeAfterBooking[]>>(
    '/before-after/my/eligible-bookings',
  );
  return data.data ?? [];
}

export async function getMyBeforeAfterSubmissions(): Promise<BeforeAfterPair[]> {
  const { data } = await axiosInstance.get<ApiEnvelope<BeforeAfterPair[]>>(
    '/before-after/my/submissions',
  );
  return data.data ?? [];
}

export async function createBeforeAfterSubmission(
  payload: BeforeAfterSubmissionInput,
): Promise<BeforeAfterPair> {
  const { data } = await axiosInstance.post<ApiEnvelope<BeforeAfterPair>>('/before-after', payload);
  return data.data;
}

// Provider edits/resubmits one of their own submissions (PENDING/REJECTED).
export async function updateBeforeAfterSubmission(
  id: string,
  payload: BeforeAfterUpdateInput,
): Promise<BeforeAfterPair> {
  const { data } = await axiosInstance.patch<ApiEnvelope<BeforeAfterPair>>(`/before-after/${id}`, payload);
  return data.data;
}

// ---------- Testimonials ----------

export async function getTestimonialsAdmin(params?: TestimonialQueryParams): Promise<Testimonial[]> {
  const { data } = await axiosInstance.get<ApiEnvelope<Testimonial[]>>('/testimonials', { params });
  return data.data ?? [];
}

export async function getMyTestimonials(): Promise<Testimonial[]> {
  const { data } = await axiosInstance.get<ApiEnvelope<Testimonial[]>>('/testimonials/me');
  return data.data ?? [];
}

export async function createTestimonial(payload: TestimonialInput): Promise<Testimonial> {
  const { data } = await axiosInstance.post<ApiEnvelope<Testimonial>>('/testimonials', payload);
  return data.data;
}

export async function updateTestimonial(id: string, payload: Partial<TestimonialInput>): Promise<Testimonial> {
  const { data } = await axiosInstance.patch<ApiEnvelope<Testimonial>>(`/testimonials/${id}`, payload);
  return data.data;
}

export async function deleteTestimonial(id: string): Promise<void> {
  await axiosInstance.delete(`/testimonials/${id}`);
}
