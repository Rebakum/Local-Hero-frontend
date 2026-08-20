import axiosInstance from '../lib/axiosInstance';

interface ApiEnvelope<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPage?: number };
}

export type SupportTicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface SupportTicket {
  id: string;
  userId: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  assignedTo: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupportTicketInput {
  name?: string;
  email?: string;
  phone?: string;
  subject: string;
  message: string;
}

export const createSupportTicket = async (
  payload: CreateSupportTicketInput
): Promise<SupportTicket> => {
  const { data } = await axiosInstance.post<ApiEnvelope<SupportTicket>>('/support-tickets', payload);
  return data.data;
};

export const getMySupportTickets = async (): Promise<SupportTicket[]> => {
  const { data } = await axiosInstance.get<ApiEnvelope<SupportTicket[]>>('/support-tickets/me');
  return data.data ?? [];
};

export const getAllSupportTickets = async (
  params?: { page?: number; limit?: number; status?: SupportTicketStatus }
): Promise<{ tickets: SupportTicket[]; meta?: ApiEnvelope<SupportTicket[]>['meta'] }> => {
  const { data } = await axiosInstance.get<ApiEnvelope<SupportTicket[]>>('/support-tickets', {
    params,
  });
  return { tickets: data.data ?? [], meta: data.meta };
};

export const updateSupportTicket = async (
  id: string,
  payload: { status?: SupportTicketStatus; assignedTo?: string | null }
): Promise<SupportTicket> => {
  const { data } = await axiosInstance.patch<ApiEnvelope<SupportTicket>>(`/support-tickets/${id}`, payload);
  return data.data;
};
