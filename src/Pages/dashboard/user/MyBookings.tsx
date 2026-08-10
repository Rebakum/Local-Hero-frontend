import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Wrench,
  MapPin,
  Search,
  Loader2,
  AlertCircle,
  TrendingUp,
  CreditCard,
  Ban,
} from 'lucide-react';
import { DataTable, PageHeader, StatusBadge } from '../../../Components/ui';
import { getMyBookings, cancelBooking, type BookingRecord } from '../../../services/booking.service';
import { payForBooking } from '../../../services/payment.service';

const STATUS_FILTERS = [
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

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Could not load your bookings.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handlePay = async (bookingId: string) => {
    setPayingId(bookingId);
    try {
      await payForBooking(bookingId); // redirects to Stripe on success
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Could not start payment.');
      setPayingId(null);
    }
  };

  const handleCancel = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      await cancelBooking(bookingId);
      await loadBookings();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Could not cancel this booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return bookings.filter((b) => {
      const matchesFilter = activeFilter === 'ALL' || b.status === activeFilter;
      const matchesSearch =
        !q ||
        b.trade.toLowerCase().includes(q) ||
        (b.professional?.companyName || '').toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [bookings, activeFilter, searchQuery]);

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: bookings.length };
    for (const b of bookings) counts[b.status] = (counts[b.status] ?? 0) + 1;
    return counts;
  }, [bookings]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="My Account"
        title="My Bookings"
        description="Track and manage all your service bookings in one place."
        actions={
          <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-navy-100 dark:bg-white/5 border border-navy-200 dark:border-white/10">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-navy-700 dark:text-navy-300">
              {bookings.length} Total
            </span>
          </div>
        }
      />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                activeFilter === tab.key
                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                  : 'bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-white/10'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 opacity-70">({filterCounts[tab.key] ?? 0})</span>
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
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <DataTable<BookingRecord>
          isLoading={isLoading}
          loadingText="Loading your bookings..."
          data={filtered}
          rowKey={(b) => b.id}
          emptyTitle="No bookings found"
          emptyDescription="Try adjusting your filters — or book a pro from the homepage."
          emptyIcon={<Calendar className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
          columns={[
            {
              key: 'booking',
              header: 'Booking',
              render: (b) => (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy-800 dark:text-navy-200 capitalize">{b.trade}</p>
                    <p className="text-[11px] text-navy-400 dark:text-navy-500 font-mono">
                      {b.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                </div>
              ),
            },
            {
              key: 'provider',
              header: 'Provider',
              hideOn: 'md',
              render: (b) => (
                <span className="text-navy-500 dark:text-navy-400">
                  {b.professional?.companyName || 'Not yet assigned'}
                </span>
              ),
            },
            {
              key: 'schedule',
              header: 'Date & Time',
              hideOn: 'sm',
              render: (b) => (
                <div className="text-navy-500 dark:text-navy-400">
                  <p>
                    {new Date(b.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-navy-400 dark:text-navy-500">{b.timeSlot}</p>
                </div>
              ),
            },
            {
              key: 'location',
              header: 'Location',
              hideOn: 'lg',
              render: (b) => (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400 text-xs">
                  <MapPin className="w-3 h-3" />
                  {b.postcode}
                </span>
              ),
            },
            {
              key: 'price',
              header: 'Price',
              render: (b) => (
                <div>
                  <p className="font-semibold text-navy-800 dark:text-navy-200">{formatPrice(b.priceInPence)}</p>
                  {b.payment?.status === 'PAID' && (
                    <p className="text-[11px] font-semibold text-emerald-500">Paid</p>
                  )}
                </div>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (b) => <StatusBadge status={b.status} />,
            },
          ]}
          actions={(booking) => {
            const canPay =
              booking.priceInPence != null &&
              booking.payment?.status !== 'PAID' &&
              (booking.status === 'ACCEPTED' || booking.status === 'PENDING');
            const canCancel = booking.status === 'PENDING' || booking.status === 'ACCEPTED';
            return (
              <>
                {canPay && (
                  <button
                    onClick={() => handlePay(booking.id)}
                    disabled={payingId === booking.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    {payingId === booking.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CreditCard className="w-3.5 h-3.5" />
                    )}
                    Pay now
                  </button>
                )}
                {canCancel && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    disabled={cancellingId === booking.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400 text-xs font-semibold hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 disabled:opacity-50 transition-colors"
                  >
                    {cancellingId === booking.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Ban className="w-3.5 h-3.5" />
                    )}
                    Cancel
                  </button>
                )}
              </>
            );
          }}
        />
      </motion.div>
    </div>
  );
};

export default MyBookings;
