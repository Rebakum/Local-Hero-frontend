import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../../../Components/ui/shared/Card';
import { Badge } from '../../../Components/ui/shared/Badge';
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Wrench,
  Search,
  Loader2,
  AlertCircle,
  TrendingUp,
  CreditCard,
  Ban,
} from 'lucide-react';
import { getMyBookings, cancelBooking, type BookingRecord, type BookingStatus } from '../../../services/booking.service';
import { payForBooking } from '../../../services/payment.service';

const STATUS_CONFIG: Record<BookingStatus, { badge: 'success' | 'warning' | 'neutral' | 'emergency' | 'primary'; icon: React.FC<{ className?: string }>; dot: string; label: string }> = {
  PENDING: { badge: 'warning', icon: Clock, dot: 'bg-amber-500', label: 'Pending' },
  ACCEPTED: { badge: 'primary', icon: CheckCircle2, dot: 'bg-blue-500', label: 'Accepted' },
  IN_PROGRESS: { badge: 'primary', icon: Clock, dot: 'bg-blue-500', label: 'In Progress' },
  COMPLETED: { badge: 'success', icon: CheckCircle2, dot: 'bg-emerald-500', label: 'Completed' },
  CANCELLED: { badge: 'emergency', icon: XCircle, dot: 'bg-red-500', label: 'Cancelled' },
  REJECTED: { badge: 'emergency', icon: XCircle, dot: 'bg-red-500', label: 'Rejected' },
};

const STATUS_FILTERS: { key: string; label: string }[] = [
  { key: 'ALL', label: 'All Bookings' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'ACCEPTED', label: 'Accepted' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

const formatPrice = (pence: number | null) =>
  pence == null ? 'Awaiting quote' : `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [payingId, setPayingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not load your bookings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handlePay = async (bookingId: string) => {
    setPayingId(bookingId);
    try {
      await payForBooking(bookingId); // redirects to Stripe on success
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not start payment. Please try again.');
      setPayingId(null);
    }
  };

  const handleCancel = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      await cancelBooking(bookingId);
      await loadBookings();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not cancel this booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesFilter = activeFilter === 'ALL' || b.status === activeFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      b.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.professional?.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterCounts = {
    ALL: bookings.length,
    PENDING: bookings.filter((b) => b.status === 'PENDING').length,
    ACCEPTED: bookings.filter((b) => b.status === 'ACCEPTED').length,
    IN_PROGRESS: bookings.filter((b) => b.status === 'IN_PROGRESS').length,
    COMPLETED: bookings.filter((b) => b.status === 'COMPLETED').length,
    CANCELLED: bookings.filter((b) => b.status === 'CANCELLED').length,
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 sm:p-8 text-white shadow-xl shadow-primary/20"
      >
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-sm" />
        <div className="absolute left-1/3 top-0 w-64 h-32 bg-white/5 blur-3xl rounded-full" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-white/80">Your Bookings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Bookings</h1>
            <p className="mt-2 text-sm text-white/70 max-w-md leading-relaxed">
              Track and manage all your service bookings in one place.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">{bookings.length} Total</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
      </motion.div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Filters + Search */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                activeFilter === tab.key
                  ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20'
                  : 'bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-white/10 border border-transparent'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 opacity-70">({filterCounts[tab.key as keyof typeof filterCounts] ?? 0})</span>
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-lh pl-9 h-10 text-sm"
          />
        </div>
      </motion.div>

      {/* Bookings List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card padding="sm" className="overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <p className="text-sm font-semibold text-navy-500 dark:text-navy-400">Loading your bookings…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Calendar className="w-12 h-12 text-navy-300 dark:text-navy-600" />
              <p className="text-sm font-semibold text-navy-500 dark:text-navy-400">No bookings found</p>
              <p className="text-xs text-navy-400 dark:text-navy-500">Try adjusting your filters or search query — or book a pro from the homepage.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100 dark:border-white/10 bg-navy-50/50 dark:bg-white/[0.02]">
                    <th className="text-left py-3 px-6 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider">Booking</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider hidden md:table-cell">Provider</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider hidden sm:table-cell">Date & Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider hidden lg:table-cell">Location</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider">Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((booking, i) => {
                    const config = STATUS_CONFIG[booking.status];
                    const canPay =
                      booking.priceInPence != null &&
                      booking.payment?.status !== 'PAID' &&
                      (booking.status === 'ACCEPTED' || booking.status === 'PENDING');
                    const canCancel = booking.status === 'PENDING' || booking.status === 'ACCEPTED';
                    return (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.04, duration: 0.4 }}
                        className="border-b border-navy-50 dark:border-white/5 last:border-0 hover:bg-navy-50 dark:hover:bg-white/[0.02] transition-all duration-200 group"
                      >
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                              <Wrench className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-navy-800 dark:text-navy-200 capitalize">{booking.trade}</p>
                              <p className="text-[11px] text-navy-400 dark:text-navy-500 font-mono">{booking.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-navy-500 dark:text-navy-400 hidden md:table-cell">
                          {booking.professional?.companyName || 'Not yet assigned'}
                        </td>
                        <td className="py-3.5 px-4 hidden sm:table-cell">
                          <div className="text-navy-500 dark:text-navy-400 text-sm">
                            <p>{new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            <p className="text-xs text-navy-400 dark:text-navy-500">{booking.timeSlot}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 hidden lg:table-cell">
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400 text-xs">
                            <MapPin className="w-3 h-3" />
                            {booking.postcode}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-sm font-bold text-navy-800 dark:text-navy-200">{formatPrice(booking.priceInPence)}</span>
                          {booking.payment?.status === 'PAID' && (
                            <p className="text-[11px] font-semibold text-emerald-500">Paid</p>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                            <Badge variant={config.badge as any}>{config.label}</Badge>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            {canPay && (
                              <button
                                onClick={() => handlePay(booking.id)}
                                disabled={payingId === booking.id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                              >
                                {payingId === booking.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
                                Pay now
                              </button>
                            )}
                            {canCancel && (
                              <button
                                onClick={() => handleCancel(booking.id)}
                                disabled={cancellingId === booking.id}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400 text-xs font-bold hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 disabled:opacity-50 transition-colors"
                              >
                                {cancellingId === booking.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5" />}
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default MyBookings;
