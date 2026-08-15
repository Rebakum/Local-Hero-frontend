import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Loader2,
  AlertCircle,
  Inbox,
  Star,
} from 'lucide-react';
import {
  DataTable,
  PageHeader,
  StatusBadge,
} from '../ui';
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type Notification,
} from '../../services/notification.service';
import { useSocket } from '../../Context/SocketContext';

interface NotificationsManagerProps {
  eyebrow: string;
  title: string;
  description: string;
}

export const NotificationsManager: React.FC<NotificationsManagerProps> = ({
  eyebrow,
  title,
  description,
}) => {
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMyNotifications({ limit: 50 });
      setNotifications(result.notifications);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to load notifications.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Real-time: reload when a new notification arrives.
  useEffect(() => {
    if (!socket) return;
    const onNotification = () => {
      void load();
    };
    socket.on('notification:new', onNotification);
    return () => {
      socket.off('notification:new', onNotification);
    };
  }, [socket, load]);

  const unread = notifications.filter((n) => !n.isRead).length;

  const handleMarkRead = async (notification: Notification) => {
    if (notification.isRead) return;
    setUpdating(notification.id);
    try {
      await markNotificationRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
    } catch {
      setError('Failed to mark notification as read.');
    } finally {
      setUpdating(null);
    }
  };

  const handleMarkAll = async () => {
    setUpdating('all');
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      setError('Failed to mark all notifications as read.');
    } finally {
      setUpdating(null);
    }
  };

  // Opening a "your service is complete, leave a review" notification takes
  // the customer to the review page for that booking (and marks it read).
  const handleOpen = async (notification: Notification) => {
    const data = notification.data as { action?: string; bookingId?: string } | null;

    if (data?.action === 'LEAVE_REVIEW' && data.bookingId) {
      if (!notification.isRead) await handleMarkRead(notification);
      navigate(`/dashboard/user/reviews?bookingId=${encodeURIComponent(data.bookingId)}`);
      return;
    }

    if (!notification.isRead) await handleMarkRead(notification);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <button
            onClick={handleMarkAll}
            disabled={updating === 'all' || unread === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 text-sm font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {updating === 'all' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCheck className="w-4 h-4" />
            )}
            Mark all read
          </button>
        }
      />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <DataTable<Notification>
        isLoading={isLoading}
        loadingText="Loading notifications..."
        data={notifications}
        rowKey={(n) => n.id}
        searchable
        searchPlaceholder="Search notifications..."
        searchKeys={(n) => [n.title, n.body ?? '', n.type]}
        sortable
        filters={[
          {
            key: 'isRead',
            label: 'Status',
            options: [
              { value: 'false', label: 'Unread' },
              { value: 'true', label: 'Read' },
            ],
          },
        ]}
        emptyTitle="No notifications"
        emptyDescription="You're all caught up."
        emptyIcon={<Inbox className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
        columns={[
          {
            key: 'type',
            header: 'Type',
            render: (n) => <StatusBadge status={n.type} />,
          },
          {
            key: 'title',
            header: 'Notification',
            render: (n) => (
              <div className={n.isRead ? '' : 'font-semibold text-navy-900 dark:text-white'}>
                <p>{n.title}</p>
                {n.body && (
                  <p className="text-xs text-navy-400 dark:text-navy-500 font-normal mt-0.5">
                    {n.body}
                  </p>
                )}
              </div>
            ),
          },
          {
            key: 'date',
            header: 'Received',
            hideOn: 'md',
            render: (n) => (
              <span className="text-xs text-navy-400 dark:text-navy-500">
                {new Date(n.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                })}{' '}
                {new Date(n.createdAt).toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            ),
          },
        ]}
        actions={(notification) => {
          const data = notification.data as { action?: string; bookingId?: string } | null;
          const isReviewCta = data?.action === 'LEAVE_REVIEW' && !!data.bookingId;
          return (
            <>
              {isReviewCta && (
                <button
                  onClick={() => void handleOpen(notification)}
                  title="Leave a review for this completed service"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold hover:bg-amber-200 dark:hover:bg-amber-500/20 transition-colors"
                >
                  <Star className="w-3.5 h-3.5" />
                  Leave a review
                </button>
              )}
              {!notification.isRead && (
                <button
                  onClick={() => handleMarkRead(notification)}
                  disabled={updating === notification.id}
                  title="Mark as read"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors disabled:opacity-50"
                >
                  {updating === notification.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCheck className="w-3.5 h-3.5" />
                  )}
                  Mark read
                </button>
              )}
            </>
          );
        }}
      />

      {!isLoading && unread > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-primary/5 border border-primary/20 text-xs font-semibold text-primary">
          <Bell className="w-4 h-4 shrink-0" />
          {unread} unread notification{unread === 1 ? '' : 's'}
        </div>
      )}
    </div>
  );
};

export default NotificationsManager;
