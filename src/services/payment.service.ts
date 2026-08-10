import axiosInstance from '../lib/axiosInstance';

interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  amountInPence: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  stripeSessionId: string | null;
  stripePaymentIntentId?: string | null;
  createdAt?: string;
  paidAt: string | null;
  booking?: {
    id: string;
    fullName: string;
    email: string;
    trade: string;
    status: string;
  } | null;
}

export interface PaymentStats {
  totalRevenueInPence: number;
  paidCount: number;
  pendingCount: number;
  failedCount: number;
}

export interface PaymentQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface PaymentListResult {
  payments: PaymentRecord[];
  total: number;
  page: number;
  limit: number;
}

export async function getPaymentHistory(query: PaymentQuery = {}): Promise<PaymentListResult> {
  const { data } = await axiosInstance.get<ApiEnvelope<PaymentRecord[]> & { meta?: { page: number; limit: number; total: number } }>('/payments/history', {
    params: {
      page: query.page,
      limit: query.limit,
      search: query.search || undefined,
      status: query.status || undefined,
    },
  });
  const meta = data.meta ?? { page: 1, limit: 10, total: data.data.length };
  return {
    payments: data.data,
    total: meta.total,
    page: meta.page,
    limit: meta.limit,
  };
}

export async function getPaymentStats(): Promise<PaymentStats> {
  const { data } = await axiosInstance.get<ApiEnvelope<PaymentStats>>('/payments/stats');
  return data.data;
}

interface CheckoutSessionResponse {
  checkoutUrl: string | null;
  payment: PaymentRecord;
}

// Creates a Stripe Checkout Session for a booking that already has a quoted
// price, then redirects the browser to Stripe's hosted payment page.
export async function payForBooking(bookingId: string): Promise<void> {
  const { data } = await axiosInstance.post<ApiEnvelope<CheckoutSessionResponse>>(
    `/payments/checkout/${bookingId}`
  );

  if (data.data.checkoutUrl) {
    window.location.href = data.data.checkoutUrl;
  }
}

export async function getPaymentForBooking(bookingId: string): Promise<PaymentRecord | null> {
  const { data } = await axiosInstance.get<ApiEnvelope<PaymentRecord | null>>(
    `/payments/${bookingId}`
  );
  return data.data;
}
