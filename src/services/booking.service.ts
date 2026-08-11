import axiosInstance from '../lib/axiosInstance';
import type { BookingFormData } from '../types';

export type BookingStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export interface BookingRecord {
  id: string;
  customerId: string;
  professionalId: string | null;
  trade: string;
  postcode: string;
  address: string;
  bookingDate: string;
  timeSlot: string;
  urgency: string;
  description: string;
  fullName: string;
  email: string;
  phone: string;
  notes: string | null;
  status: BookingStatus;
  priceInPence: number | null;
  createdAt: string;
  updatedAt: string;
  professional?: {
    id: string;
    name: string;
    companyName: string;
    trade: string;
    avatar: string | null;
    hourlyRate: number;
  } | null;
  payment?: {
    id: string;
    bookingId: string;
    status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
    amountInPence: number;
    currency: string;
    paidAt?: string | null;
  } | null;
}

interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface BookingQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  trade?: string;
}

export interface BookingListResult {
  bookings: BookingRecord[];
  total: number;
  page: number;
  limit: number;
}

// The booking wizard collects `date` + `timeSlot` as separate strings; the
// backend wants a single `bookingDate` (ISO date/datetime string).
export async function createBooking(
  form: Partial<BookingFormData>,
  professionalId?: string
): Promise<BookingRecord> {
  const payload = {
    trade: form.trade,
    professionalId,
    postcode: form.postcode,
    address: form.address || form.postcode,
    bookingDate: form.date,
    timeSlot: form.timeSlot,
    urgency: form.urgency || 'Standard',
    description: form.description || `${form.trade} job near ${form.postcode}`,
    fullName: form.fullName,
    email: form.email,
    phone: form.phone,
    notes: form.notes,
  };

  const { data } = await axiosInstance.post<ApiEnvelope<BookingRecord>>('/bookings', payload);
  return data.data;
}

export async function getMyBookings(): Promise<BookingRecord[]> {
  const { data } = await axiosInstance.get<ApiEnvelope<BookingRecord[]>>('/bookings/me');
  return data.data;
}

export async function getProviderBookings(): Promise<BookingRecord[]> {
  const { data } = await axiosInstance.get<ApiEnvelope<BookingRecord[]>>('/bookings/provider/me');
  return data.data;
}

export async function getBookingById(id: string): Promise<BookingRecord> {
  const { data } = await axiosInstance.get<ApiEnvelope<BookingRecord>>(`/bookings/${id}`);
  return data.data;
}

export async function updateBookingStatus(
  id: string,
  update: {
    status: BookingStatus;
    priceInPence?: number;
    professionalId?: string;
    bookingDate?: string;
    timeSlot?: string;
  }
): Promise<BookingRecord> {
  const { data } = await axiosInstance.patch<ApiEnvelope<BookingRecord>>(
    `/bookings/${id}/status`,
    update
  );
  return data.data;
}

export async function cancelBooking(id: string): Promise<BookingRecord> {
  return updateBookingStatus(id, { status: 'CANCELLED' });
}

export async function getAllBookings(): Promise<BookingRecord[]> {
  const { data } = await axiosInstance.get<ApiEnvelope<BookingRecord[]>>('/bookings');
  return data.data;
}

export async function getAdminBookings(query: BookingQuery = {}): Promise<BookingListResult> {
  const { data } = await axiosInstance.get<ApiEnvelope<BookingRecord[]> & { meta?: { page: number; limit: number; total: number } }>('/bookings', {
    params: {
      page: query.page,
      limit: query.limit,
      search: query.search || undefined,
      status: query.status || undefined,
      trade: query.trade || undefined,
    },
  });
  const meta = data.meta ?? { page: 1, limit: 10, total: data.data.length };
  return {
    bookings: data.data,
    total: meta.total,
    page: meta.page,
    limit: meta.limit,
  };
}

export async function assignBooking(
  id: string,
  professionalId: string
): Promise<BookingRecord> {
  const { data } = await axiosInstance.patch<ApiEnvelope<BookingRecord>>(
    `/bookings/${id}/assign`,
    { professionalId }
  );
  return data.data;
}
