import axiosInstance from '../lib/axiosInstance';

interface ApiEnvelope<T> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
}

export type NotificationType =
  | 'NEW_QUOTE'
  | 'QUOTE_RESPONSE'
  | 'BOOKING_REQUEST'
  | 'BOOKING_CONFIRMATION'
  | 'BOOKING_REMINDER'
  | 'BOOKING_CANCELLED'
  | 'BOOKING_REJECTED'
  | 'BOOKING_IN_PROGRESS'
  | 'BOOKING_COMPLETED'
  | 'NEW_REVIEW'
  | 'REVIEW_REQUESTED'
  | 'NEW_MESSAGE'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'PAYMENT_REFUNDED'
  | 'PROVIDER_APPLICATION_SUBMITTED'
  | 'PROVIDER_APPLICATION_APPROVED'
  | 'PROVIDER_APPLICATION_REJECTED'
  | 'LEAD_ACCEPTED'
  | 'WELCOME'
  | 'ACCOUNT_UPDATED'
  | 'ANNOUNCEMENT'
  | 'PASSWORD_CHANGED'
  | 'GENERAL';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string | null;
  data: Record<string, unknown> | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationQuery {
  page?: number;
  limit?: number;
  unread?: boolean;
}

export interface NotificationListResult {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
}

export const getMyNotifications = async (
  query: NotificationQuery = {}
): Promise<NotificationListResult> => {
  const { data } = await axiosInstance.get<
    ApiEnvelope<Notification[]> & { meta?: { page: number; limit: number; total: number } }
  >('/notifications/me', {
    params: {
      page: query.page,
      limit: query.limit,
      unread: query.unread ? 'true' : undefined,
    },
  });
  const meta = data.meta ?? { page: 1, limit: 20, total: (data.data ?? []).length };
  return {
    notifications: data.data ?? [],
    page: meta.page,
    limit: meta.limit,
    total: meta.total,
  };
};

export const getUnreadNotificationCount = async (): Promise<number> => {
  const { data } = await axiosInstance.get<
    ApiEnvelope<{ count: number }>
  >('/notifications/unread-count');
  return data.data?.count ?? 0;
};

export const markNotificationRead = async (id: string): Promise<Notification> => {
  const { data } = await axiosInstance.patch<ApiEnvelope<Notification>>(`/notifications/${id}/read`);
  return data.data;
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await axiosInstance.patch('/notifications/read-all');
};
