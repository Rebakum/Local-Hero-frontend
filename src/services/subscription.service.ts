import axiosInstance from '../lib/axiosInstance';

interface ApiEnvelope<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPage?: number };
}

export type SubscriptionInterval = 'MONTHLY' | 'YEARLY';
export type SubscriptionStatus = 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'INCOMPLETE' | 'CANCELLED' | 'EXPIRED';
// Legacy per-professional plan marker used by the admin management page.
export type LegacyPlan = 'FREE' | 'PREMIUM' | 'FEATURED';

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceInPence: number;
  currency: string;
  interval: SubscriptionInterval;
  features: string[];
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderSubscription {
  id: string;
  professionalId: string;
  plan: string;
  planId: string | null;
  status: SubscriptionStatus;
  priceInPence: number;
  startedAt: string;
  expiresAt: string | null;
  isFeatured: boolean;
  featureStartAt: string | null;
  featureEndAt: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  createdAt: string;
  updatedAt: string;
  planDetail?: SubscriptionPlan | null;
  professional?: {
    id: string;
    name: string;
    companyName: string;
    trade: string;
    avatar: string | null;
    isVerified: boolean;
  };
}

export interface CheckoutResult {
  url: string | null;
  sessionId: string;
}

export interface FeaturedAddon {
  id: string;
  durationDays: number;
  priceInPence: number;
  active: boolean;
  sortOrder: number;
}

export interface SubscriptionInput {
  professionalId: string;
  plan: string;
  priceInPence?: number;
  expiresAt?: string;
  isFeatured?: boolean;
  featureStartAt?: string;
  featureEndAt?: string;
}

export interface SubscriptionUpdateInput {
  plan?: string;
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
  plan?: string;
  status?: SubscriptionStatus;
}

export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const { data } = await axiosInstance.get<ApiEnvelope<SubscriptionPlan[]>>('/subscriptions/plans');
  return data.data ?? [];
};

export const getMySubscription = async (): Promise<ProviderSubscription | null> => {
  const { data } = await axiosInstance.get<ApiEnvelope<ProviderSubscription | null>>(
    '/subscriptions/me'
  );
  return data.data;
};

export const createSubscriptionCheckout = async (planId: string): Promise<CheckoutResult> => {
  const { data } = await axiosInstance.post<ApiEnvelope<CheckoutResult>>('/subscriptions/checkout', {
    planId,
  });
  return data.data;
};

export const getFeaturedAddons = async (): Promise<FeaturedAddon[]> => {
  const { data } = await axiosInstance.get<ApiEnvelope<FeaturedAddon[]>>('/subscriptions/featured-addons');
  return data.data ?? [];
};

export const createFeatureCheckout = async (addonId: string): Promise<CheckoutResult> => {
  const { data } = await axiosInstance.post<ApiEnvelope<CheckoutResult>>('/subscriptions/feature-checkout', {
    addonId,
  });
  return data.data;
};

export const changeSubscriptionPlan = async (planId: string): Promise<{ message?: string }> => {
  const { data } = await axiosInstance.post<ApiEnvelope<{ message?: string }>>(
    '/subscriptions/change-plan',
    { planId }
  );
  return data.data ?? {};
};

export const cancelSubscription = async (): Promise<{ message?: string }> => {
  const { data } = await axiosInstance.post<ApiEnvelope<{ message?: string }>>('/subscriptions/cancel');
  return data.data ?? {};
};

export const resumeSubscription = async (): Promise<{ message?: string }> => {
  const { data } = await axiosInstance.post<ApiEnvelope<{ message?: string }>>('/subscriptions/resume');
  return data.data ?? {};
};

export const getBillingPortalUrl = async (): Promise<{ url?: string }> => {
  const { data } = await axiosInstance.post<ApiEnvelope<{ url?: string }>>('/subscriptions/billing-portal');
  return data.data ?? {};
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
