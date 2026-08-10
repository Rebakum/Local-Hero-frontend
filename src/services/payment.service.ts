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
  paidAt: string | null;
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
