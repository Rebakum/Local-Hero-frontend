import React from 'react';
import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../Context/AuthContext';
import { Card } from '../../../Components/ui/shared/Card';
import { Badge } from '../../../Components/ui/shared/Badge';
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
  Sparkles,
  TrendingUp,
  Bell,
  Star,
  Zap,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { CreateTestimonialModal } from '../../../Components/Sections/Testimonials/CreateTestimonialModal';
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

const AnimatedCounter: React.FC<{ value: string }> = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {value}
    </motion.span>
  );
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

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl  p-6 sm:p-8 text-navy-950 shadow-xl shadow-primary/20"
      >
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-sm" />
        <div className="absolute -right-4 bottom-0 w-28 h-28 rounded-full bg-white/5" />
        <div className="absolute left-1/2 top-0 w-64 h-32 bg-white/5 blur-3xl rounded-full" />

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
            transition={{ delay: 0.5, duration: 0.5, type: 'spring', stiffness: 200 }}
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
        <Card padding="sm" className="overflow-hidden">
          <div className="px-6 py-4 border-b border-navy-100 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <ClipboardList className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900 dark:text-white">Recent Bookings</h2>
                <p className="text-xs text-navy-400 dark:text-navy-500 mt-0.5">Your latest service requests</p>
              </div>
            </div>
            <Badge variant="primary">{recentBookings.length} Recent</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100 dark:border-white/10 bg-navy-50/50 dark:bg-white/[0.02]">
                  <th className="text-left py-3 px-6 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider">Service</th>
                  <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider hidden md:table-cell">Provider</th>
                  <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider hidden lg:table-cell">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookingsLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-7 h-7 text-primary animate-spin" />
                        <p className="text-sm text-navy-400 dark:text-navy-500">Loading your bookings...</p>
                      </div>
                    </td>
                  </tr>
                ) : bookingsError ? (
                  <tr>
                    <td colSpan={5} className="py-12">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="w-7 h-7 text-red-400" />
                        <p className="text-sm text-navy-400 dark:text-navy-500">{bookingsError}</p>
                        <button onClick={loadBookings} className="text-xs font-semibold text-primary hover:underline mt-1">
                          Retry
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ClipboardList className="w-7 h-7 text-navy-300 dark:text-navy-600" />
                        <p className="text-sm font-semibold text-navy-500 dark:text-navy-400">No bookings yet</p>
                        <p className="text-xs text-navy-400 dark:text-navy-500">Book a professional to get started.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((booking, i) => {
                  const statusConfig = STATUS_STYLES[booking.status] || STATUS_STYLES.PENDING;
                  return (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
                      className="border-b border-navy-50 dark:border-white/5 last:border-0 hover:bg-navy-50 dark:hover:bg-white/[0.02] transition-all duration-200 group"
                    >
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                            <Wrench className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-semibold text-navy-800 dark:text-navy-200 capitalize">{booking.trade}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-navy-500 dark:text-navy-400 hidden md:table-cell">{booking.professional?.companyName || booking.professional?.name || 'Unassigned'}</td>
                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        <span className="text-navy-500 dark:text-navy-400 text-sm">
                          {new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 hidden lg:table-cell">
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400 text-xs">
                          <MapPin className="w-3 h-3" />
                          {booking.postcode}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                          <Badge variant={statusConfig.badge}>
                            {booking.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
              </tbody>
            </table>
          </div>
        </Card>
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 transition-colors shrink-0"
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
