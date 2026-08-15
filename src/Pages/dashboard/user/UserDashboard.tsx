import React from 'react';
import { motion } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../Context/AuthContext';
import { Card } from '../../../Components/ui/shared/Card';
import { Badge } from '../../../Components/ui/shared/Badge';
import { AnimatedCounter } from '../../../Components/dashboard/AnimatedCounter';
import { DataTable } from '../../../Components/ui/DataTable';
import {
  Calendar,
  ClipboardList,
  MessageSquare,
  Bookmark,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Wrench,
  TrendingUp,
  Bell,
  Star,
  Zap,
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { CreateTestimonialModal } from '../../../Pages/home/Sections/Testimonials/CreateTestimonialModal';
import { getMyBookings } from '../../../services/booking.service';
import type { BookingRecord } from '../../../services/booking.service';

const STATUS_STYLES: Record<string, { badge: 'success' | 'warning' | 'neutral'; icon: React.FC<{ className?: string }>; dot: string }> = {
  ACCEPTED: { badge: 'success', icon: CheckCircle2, dot: 'bg-emerald-500' },
  IN_PROGRESS: { badge: 'success', icon: CheckCircle2, dot: 'bg-blue-500' },
  PENDING: { badge: 'warning', icon: Clock, dot: 'bg-amber-500' },
  COMPLETED: { badge: 'neutral', icon: CheckCircle2, dot: 'bg-navy-400' },
  REJECTED: { badge: 'emergency' as 'warning', icon: XCircle, dot: 'bg-red-500' },
  CANCELLED: { badge: 'warning', icon: XCircle, dot: 'bg-red-400' },
};

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [testimonialOpen, setTestimonialOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState('');

  const loadBookings = useCallback(async () => {
    try {
      setBookingsLoading(true);
      setBookingsError('');
      const data = await getMyBookings();
      setBookings(data);
    } catch {
      setBookingsError('Failed to load your bookings. Please try again.');
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const activeCount = bookings.filter((b) => ['PENDING', 'ACCEPTED', 'IN_PROGRESS'].includes(b.status)).length;
  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-white dark:bg-navy-900 p-6 sm:p-8 text-navy-950 dark:text-white shadow-xl shadow-primary/20"
      >
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-sm pointer-events-none" />
        <div className="absolute -right-4 bottom-0 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute left-1/2 top-0 w-64 h-32 bg-white/5 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-2 mb-2"
            >
            
              <span className="text-sm font-medium text-navy-950">Welcome back,</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold tracking-tight"
            >
              {user?.name || 'User'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-2 text-sm text-navy-950 max-w-md leading-relaxed"
            >
              Manage your bookings, get quotes from trusted professionals, and track your service history all in one place.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20"
          >
            <Bell className="w-4 h-4" />
            <span className="text-sm font-medium">3 new</span>
          </motion.div>
        </div>

        {/* Bottom decorative bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ClipboardList, label: 'Active Bookings', value: String(activeCount), color: 'from-blue-500 to-blue-600', lightColor: 'bg-blue-50 dark:bg-blue-500/10', textColor: 'text-blue-600 dark:text-blue-400', change: 'in progress', trend: 'up' },
          { icon: Bookmark, label: 'Saved Pros', value: '5', color: 'from-primary to-primary/80', lightColor: 'bg-primary/10', textColor: 'text-primary', change: '+2 this month', trend: 'up' },
          { icon: Calendar, label: 'Completed', value: String(completedCount), color: 'from-emerald-500 to-emerald-600', lightColor: 'bg-emerald-50 dark:bg-emerald-500/10', textColor: 'text-emerald-600 dark:text-emerald-400', change: 'All time', trend: 'up' },
          { icon: MessageSquare, label: 'Pending Quotes', value: '3', color: 'from-amber-500 to-orange-500', lightColor: 'bg-amber-50 dark:bg-amber-500/10', textColor: 'text-amber-600 dark:text-amber-400', change: '2 urgent', trend: 'up' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card hover padding="md" className="h-full group relative overflow-hidden">
              {/* Gradient accent top border */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-2xl ${stat.lightColor} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
                <div className="flex items-center gap-1 text-emerald-500">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold">{stat.change}</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-navy-900 dark:text-white tracking-tight">
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="text-[11px] font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-widest mt-1.5">
                {stat.label}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <DataTable<BookingRecord>
          isLoading={bookingsLoading}
          loadingText="Loading your bookings..."
          data={bookings}
          rowKey={(booking) => booking.id}
          searchable
          searchPlaceholder="Search bookings..."
          searchKeys={(b) => [b.trade, b.professional?.name ?? '', b.professional?.companyName ?? '', b.postcode, b.id]}
          sortable
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: [
                { value: 'PENDING', label: 'Pending' },
                { value: 'ACCEPTED', label: 'Accepted' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'REJECTED', label: 'Rejected' },
                { value: 'CANCELLED', label: 'Cancelled' },
              ],
            },
          ]}
          emptyTitle="No bookings yet"
          emptyDescription="Book a professional to get started."
          emptyIcon={<ClipboardList className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
          columns={[
            {
              key: 'trade',
              header: 'Service',
              sortValue: (b) => b.trade,
              render: (booking) => (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Wrench className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-semibold text-navy-800 dark:text-navy-200 capitalize">
                    {booking.trade}
                  </span>
                </div>
              ),
            },
            {
              key: 'provider',
              header: 'Provider',
              hideOn: 'md',
              sortValue: (b) => b.professional?.companyName || b.professional?.name || 'Unassigned',
              render: (booking) => (
                <span className="text-navy-500 dark:text-navy-400">
                  {booking.professional?.companyName || booking.professional?.name || 'Unassigned'}
                </span>
              ),
            },
            {
              key: 'date',
              header: 'Date',
              hideOn: 'sm',
              sortValue: (b) => new Date(b.bookingDate).getTime(),
              render: (booking) => (
                <span className="text-navy-500 dark:text-navy-400 text-sm">
                  {new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              ),
            },
            {
              key: 'location',
              header: 'Location',
              hideOn: 'lg',
              sortValue: (b) => b.postcode,
              render: (booking) => (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400 text-xs">
                  <MapPin className="w-3 h-3" />
                  {booking.postcode}
                </div>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (booking) => {
                const statusConfig = STATUS_STYLES[booking.status] || STATUS_STYLES.PENDING;
                return (
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                    <Badge variant={statusConfig.badge}>{booking.status.replace('_', ' ')}</Badge>
                  </div>
                );
              },
            },
          ]}
        />
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Find a Professional', desc: 'Browse verified local pros', href: '/professionals', icon: Wrench, gradient: 'from-blue-500/10 to-blue-600/10' },
          { label: 'Browse Services', desc: 'Explore all available services', href: '/services', icon: Zap, gradient: 'from-primary/10 to-primary/5' },
          { label: 'Edit Profile', desc: 'Update your information', href: '/dashboard/profile', icon: Star, gradient: 'from-amber-500/10 to-orange-500/10' },
        ].map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <RouterLink
              to={action.href}
              className="flex items-center justify-between p-4 rounded-2xl border border-navy-100 dark:border-white/5 hover:border-primary/30 dark:hover:border-primary/30 bg-white dark:bg-navy-900 transition-all duration-300 group h-full hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy-800 dark:text-navy-200">{action.label}</p>
                  <p className="text-xs text-navy-400 dark:text-navy-500 mt-0.5">{action.desc}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-navy-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white text-navy-400 transition-all duration-300">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </RouterLink>
          </motion.div>
        ))}
      </div>

      {/* Share Your Experience */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card padding="lg" className="relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary/5 blur-2xl" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-navy-900 dark:text-white">
                {submitted ? 'Thank you for your review!' : 'Share your experience'}
              </h2>
              <p className="text-xs text-navy-400 dark:text-navy-500 mt-0.5">
                {submitted
                  ? 'Your testimonial has been submitted and will be reviewed by our team.'
                  : 'Tell us about the professional who helped you — your review helps other homeowners.'}
              </p>
            </div>
            {!submitted && (
              <button
                onClick={() => setTestimonialOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 transition-colors shrink-0"
              >
                <Star className="w-4 h-4" />
                Write a Testimonial
              </button>
            )}
          </div>
        </Card>
      </motion.div>

      <CreateTestimonialModal
        isOpen={testimonialOpen}
        onClose={() => setTestimonialOpen(false)}
        onSuccess={() => setSubmitted(true)}
      />
    </div>
  );
};

export default UserDashboard;
