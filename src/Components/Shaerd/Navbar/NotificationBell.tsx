import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Bell, CheckCheck, Inbox, Loader2 } from 'lucide-react';
import { useAuth } from '../../../Context/AuthContext';
import { useSocket } from '../../../Context/SocketContext';
import { useClickOutside, useEscapeKey } from '../../../hooks';
import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type Notification,
} from '../../../services/notification.service';

interface NotificationBellProps {
  atTop: boolean;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ atTop }) => {
  const { isAuthenticated, user } = useAuth();
  const { socket } = useSocket();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setOpen(false), open);
  useEscapeKey(() => setOpen(false), open);

  const load = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await getMyNotifications({ limit: 8 });
      setNotifications(res.notifications);
    } catch {
      // Ignore transient errors.
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

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

  if (!isAuthenticated || !user) return null;

  const unread = notifications.filter((n) => !n.isRead).length;
  const dashboardPath =
    user.role === 'serviceProvider'
      ? '/dashboard/provider/notifications'
      : '/dashboard/user/notifications';

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) void load();
  };

  const handleMarkRead = async (notification: Notification) => {
    if (notification.isRead) return;
    try {
      await markNotificationRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
    } catch {
      // Ignore.
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // Ignore.
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        className={`relative p-2 rounded-xl transition-colors ${
          open ? 'bg-primary/10 text-primary' : atTop
            ? 'text-navy-800 hover:bg-navy-100 dark:text-white dark:hover:bg-white/10'
            : 'text-navy-800 hover:bg-navy-100 dark:text-white dark:hover:bg-white/10'
        }`}
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="notif-menu"
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-3 w-80 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 shadow-xl shadow-navy-950/10 dark:shadow-black/40 overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-navy-100 dark:border-white/10">
              <p className="font-heading text-sm font-bold text-navy-950 dark:text-white">
                Notifications
              </p>
              {unread > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto py-1">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-10 text-center px-6">
                  <Inbox className="w-10 h-10 text-navy-300 dark:text-navy-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-navy-500 dark:text-navy-300">
                    No notifications
                  </p>
                  <p className="text-xs text-navy-400 dark:text-navy-500 mt-1">You're all caught up.</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleMarkRead(notification)}
                    className={`w-full text-left px-5 py-3 flex items-start gap-3 transition-colors hover:bg-navy-50 dark:hover:bg-white/5 ${
                      notification.isRead ? '' : 'bg-primary/5'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        notification.isRead ? 'bg-navy-200 dark:bg-white/10' : 'bg-primary'
                      }`}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-navy-800 dark:text-navy-100 truncate">
                        {notification.title}
                      </span>
                      {notification.body && (
                        <span className="block text-xs text-navy-400 dark:text-navy-500 mt-0.5 line-clamp-2">
                          {notification.body}
                        </span>
                      )}
                      <span className="block text-[10px] text-navy-300 dark:text-navy-600 mt-1">
                        {new Date(notification.createdAt).toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="border-t border-navy-100 dark:border-white/10 p-2">
              <Link
                to={dashboardPath}
                onClick={() => setOpen(false)}
                className="block text-center py-2 rounded-xl text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
              >
                View all notifications
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
