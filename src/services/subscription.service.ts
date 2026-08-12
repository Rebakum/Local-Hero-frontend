import axiosInstance from '../lib/axiosInstance';

interface ApiEnvelope<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPage?: number };
}

export type SubscriptionPlan = 'FREE' | 'PREMIUM' | 'FEATURED';
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

export interface ProviderSubscription {
  id: string;
  professionalId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  priceInPence: number;
  startedAt: string;
  expiresAt: string | null;
  isFeatured: boolean;
  featureStartAt: string | null;
  featureEndAt: string | null;
  createdAt: string;
  updatedAt: string;
  professional?: {
    id: string;
    name: string;
    companyName: string;
    trade: string;
    avatar: string | null;
    isVerified: boolean;
  };
}

export interface SubscriptionInput {
  professionalId: string;
  plan: SubscriptionPlan;
  priceInPence?: number;
  expiresAt?: string;
  isFeatured?: boolean;
  featureStartAt?: string;
  featureEndAt?: string;
}

export interface SubscriptionUpdateInput {
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
  priceInPence?: number;
  expiresAt?: string | null;
  isFeatured?: boolean;
  featureStartAt?: string | null;
  featureEndAt?: string | null;
}

export interface SubscriptionListParams {
  page?: number;
  limit?: number;
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
}

export const getMySubscription = async (): Promise<ProviderSubscription | null> => {
  const { data } = await axiosInstance.get<ApiEnvelope<ProviderSubscription | null>>(
    '/subscriptions/me'
  );
  return data.data;
};

export const getAllSubscriptions = async (
  params?: SubscriptionListParams
): Promise<{ subscriptions: ProviderSubscription[]; meta?: ApiEnvelope<ProviderSubscription[]>['meta'] }> => {
  const { data } = await axiosInstance.get<ApiEnvelope<ProviderSubscription[]>>('/subscriptions', {
    params,
  });
  return { subscriptions: data.data ?? [], meta: data.meta };
};

export const createSubscription = async (payload: SubscriptionInput): Promise<ProviderSubscription> => {
  const { data } = await axiosInstance.post<ApiEnvelope<ProviderSubscription>>('/subscriptions', payload);
  return data.data;
};

export const updateSubscription = async (
  id: string,
  payload: SubscriptionUpdateInput
): Promise<ProviderSubscription> => {
  const { data } = await axiosInstance.patch<ApiEnvelope<ProviderSubscription>>(
    `/subscriptions/${id}`,
    payload
  );
  return data.data;
};
