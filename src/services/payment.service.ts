import axiosInstance from "../lib/axiosInstance";

/* =========================================================
   TYPES
========================================================= */

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export interface PaymentRecord {
  id: string;
  bookingId: string;
  amountInPence: number;
  currency: string;
  status: PaymentStatus;
  stripeSessionId: string | null;
  stripePaymentIntentId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  booking?: {
    id: string;
    fullName: string;
    email: string;
    trade: string;
    status: string;
    customer?: {
      id: string;
      name: string;
      email: string;
    } | null;
    professional?: {
      id: string;
      name: string;
      trade: string;
    } | null;
  } | null;
}

export interface CheckoutResponse {
  checkoutUrl: string;
  sessionId?: string;
  payment: PaymentRecord;
}

export interface PaymentApiResponse<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface PaymentHistoryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface PaymentHistoryResponse {
  payments: PaymentRecord[];
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  total: number;
  limit: number;
}

export interface PaymentStats {
  totalRevenueInPence: number;
  paidCount: number;
  pendingCount: number;
  failedCount: number;
  refundedCount: number;
}

/* =========================================================
   HTTP CLIENT
========================================================= */

/*
 * IMPORTANT: This service must use lib/axiosInstance.ts (the same client as
 * booking.service.ts), NOT services/api.ts.
 *
 * Backend auth is httpOnly cookie-based: axiosInstance sends the JWT cookies
 * automatically (withCredentials) and transparently refreshes + retries a
 * request once when the access token has expired. The old services/api.ts
 * client reads a token from localStorage (dead code for cookie auth) and does
 * no 401 refresh/retry, so a payment call made with it would silently fail
 * with 401 the moment the access token expires.
 */

/* =========================================================
   1. CREATE STRIPE CHECKOUT SESSION
========================================================= */

export const payForBooking = async (
  bookingId: string,
): Promise<void> => {
  if (!bookingId) {
    throw new Error("Booking ID is required.");
  }

  const response = await axiosInstance.post<
    PaymentApiResponse<CheckoutResponse>
  >(`/payments/checkout/${bookingId}`);

  const checkoutData = response.data.data;

  if (!checkoutData?.checkoutUrl) {
    console.error(
      "Stripe checkout URL missing:",
      response.data,
    );

    throw new Error(
      "Stripe checkout URL was not returned by the server.",
    );
  }

  /*
   * Redirect customer to Stripe Checkout.
   */
  window.location.assign(
    checkoutData.checkoutUrl,
  );
};

/* =========================================================
   2. GET PAYMENT BY BOOKING ID
========================================================= */

export const getPaymentByBooking = async (
  bookingId: string,
): Promise<PaymentRecord | null> => {
  if (!bookingId) {
    throw new Error("Booking ID is required.");
  }

  const response = await axiosInstance.get<
    PaymentApiResponse<PaymentRecord | null>
  >(`/payments/${bookingId}`);

  return response.data.data;
};

/* =========================================================
   3. GET PAYMENT HISTORY
   Admin / Super Admin
========================================================= */

export const getPaymentHistory = async (
  params?: PaymentHistoryParams,
): Promise<PaymentHistoryResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page !== undefined) {
    queryParams.set(
      "page",
      String(params.page),
    );
  }

  if (params?.limit !== undefined) {
    queryParams.set(
      "limit",
      String(params.limit),
    );
  }

  if (params?.status) {
    queryParams.set(
      "status",
      params.status,
    );
  }

  if (params?.search?.trim()) {
    queryParams.set(
      "search",
      params.search.trim(),
    );
  }

  const query = queryParams.toString();

  const response = await axiosInstance.get<
    PaymentApiResponse<PaymentRecord[]>
  >(`/payments/history${query ? `?${query}` : ""}`);

  const total =
    response.data.meta?.total ?? response.data.data?.length ?? 0;

  const limit =
    response.data.meta?.limit ??
    (Number(queryParams.get("limit")) || 10);

  return {
    payments: response.data.data ?? [],
    meta: response.data.meta,
    total,
    limit,
  };
};

/* =========================================================
   4. GET ALL PAYMENTS
========================================================= */

export const getAllPayments = async (): Promise<
  PaymentRecord[]
> => {
  const result = await getPaymentHistory({
    page: 1,
    limit: 100,
  });

  return result.payments;
};

/* =========================================================
   5. GET PAYMENT STATISTICS
   Admin / Super Admin
========================================================= */

export const getPaymentStats = async (): Promise<
  PaymentStats
> => {
  const response = await axiosInstance.get<
    PaymentApiResponse<PaymentStats>
  >("/payments/stats");

  return response.data.data;
};
