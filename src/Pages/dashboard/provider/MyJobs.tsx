import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Calendar,
  PoundSterling,
  Loader2,
  AlertCircle,
  Check,
  Ban,
  Play,
} from 'lucide-react';
import {
  DataTable,
  Modal,
  ConfirmDialog,
  PageHeader,
  StatusBadge,
  Input,
} from '../../../Components/ui';
import { Card } from '../../../Components/ui/shared/Card';
import {
  getProviderBookings,
  updateBookingStatus,
  type BookingRecord,
  type BookingStatus,
} from '../../../services/booking.service';

const NEXT_ACTIONS: Partial<Record<BookingStatus, { next: BookingStatus; label: string; icon: React.FC<{ className?: string }>; needsPrice: boolean }>> = {
  PENDING: { next: 'ACCEPTED', label: 'Accept', icon: Check, needsPrice: true },
  ACCEPTED: { next: 'IN_PROGRESS', label: 'Start job', icon: Play, needsPrice: false },
  IN_PROGRESS: { next: 'COMPLETED', label: 'Complete', icon: CheckCircle2, needsPrice: false },
};

const formatPrice = (pence: number | null) =>
  pence == null ? '—' : `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;

const MyJobs: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<string>('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [quoteBooking, setQuoteBooking] = useState<BookingRecord | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [accepting, setAccepting] = useState(false);

  const [cancelTarget, setCancelTarget] = useState<BookingRecord | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProviderBookings();
      setBookings(data);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Could not load your jobs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const filtered = useMemo(() => {
    if (activeStatus === 'ALL') return bookings;
    return bookings.filter((b) => b.status === activeStatus);
  }, [bookings, activeStatus]);

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: bookings.length };
    for (const b of bookings) counts[b.status] = (counts[b.status] ?? 0) + 1;
    return counts;
  }, [bookings]);

  const handleStatusUpdate = async (booking: BookingRecord, status: BookingStatus, priceInPence?: number) => {
    setActionLoading(booking.id);
    setError(null);
    try {
      const updated = await updateBookingStatus(booking.id, {
        status,
        ...(priceInPence != null ? { priceInPence } : {}),
      });
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? updated : b)));
      return true;
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Action failed.');
      return false;
    } finally {
      setActionLoading(null);
    }
  };

  const handleAcceptWithQuote = async () => {
    if (!quoteBooking) return;
    const price = Number(quotePrice);
    if (!price || price <= 0) return;
    setAccepting(true);
    const ok = await handleStatusUpdate(quoteBooking, 'ACCEPTED', Math.round(price * 100));
    if (ok) setQuoteBooking(null);
    setAccepting(false);
    setQuotePrice('');
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    const ok = await handleStatusUpdate(cancelTarget, 'CANCELLED');
    if (ok) setCancelTarget(null);
    setCancelling(false);
  };

  const stats = useMemo(
    () => [
      { label: 'Assigned Jobs', value: bookings.length, icon: Briefcase, color: 'bg-primary/10 text-primary' },
      { label: 'Pending Quotes', value: bookings.filter((b) => b.status === 'PENDING').length, icon: Clock, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
      { label: 'Active', value: bookings.filter((b) => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS').length, icon: Play, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
      { label: 'Completed', value: bookings.filter((b) => b.status === 'COMPLETED').length, icon: CheckCircle2, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
    ],
    [bookings],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Provider Panel"
        title="My Jobs"
        description="Bookings assigned to you — accept, quote, start and complete jobs."
      />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card hover padding="md" className="h-full">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-navy-900 dark:text-white">{stat.value}</p>
              <p className="text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              activeStatus === status
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-white/10'
            }`}
          >
            {status === 'ALL' ? 'All Jobs' : status.replace('_', ' ').toLowerCase()}
            <span className="ml-1.5 opacity-70">({filterCounts[status] ?? 0})</span>
          </button>
        ))}
      </div>

      <DataTable<BookingRecord>
        isLoading={isLoading}
        loadingText="Loading your jobs..."
        data={filtered}
        rowKey={(b) => b.id}
        emptyTitle="No jobs found"
        emptyDescription="Bookings assigned to you will appear here."
        emptyIcon={<Briefcase className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
        columns={[
          {
            key: 'booking',
            header: 'Booking',
            render: (b) => (
              <div>
                <p className="font-semibold text-navy-800 dark:text-navy-200 capitalize">{b.trade}</p>
                <p className="text-[11px] text-navy-400 dark:text-navy-500 font-mono">
                  {b.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            ),
          },
          {
            key: 'customer',
            header: 'Customer',
            render: (b) => (
              <div>
                <p className="text-navy-700 dark:text-navy-200">{b.fullName}</p>
                <p className="text-[11px] text-navy-400 dark:text-navy-500">{b.email}</p>
              </div>
            ),
          },
          {
            key: 'schedule',
            header: 'Schedule',
            hideOn: 'md',
            render: (b) => (
              <div className="text-navy-500 dark:text-navy-400">
                <p className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(b.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <p className="text-xs text-navy-400 dark:text-navy-500 mt-0.5">{b.timeSlot}</p>
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
              <span className="inline-flex items-center gap-1 font-semibold text-navy-800 dark:text-navy-200">
                <PoundSterling className="w-3.5 h-3.5 text-navy-400" />
                {formatPrice(b.priceInPence)}
              </span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            render: (b) => <StatusBadge status={b.status} />,
          },
        ]}
        actions={(booking) => {
          const config = NEXT_ACTIONS[booking.status];
          return (
            <>
              {config && (
                <button
                  onClick={() =>
                    config.needsPrice ? setQuoteBooking(booking) : handleStatusUpdate(booking, config.next)
                  }
                  disabled={actionLoading === booking.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {actionLoading === booking.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <config.icon className="w-3.5 h-3.5" />
                  )}
                  {config.label}
                </button>
              )}
              {(booking.status === 'PENDING' || booking.status === 'ACCEPTED') && (
                <button
                  onClick={() => setCancelTarget(booking)}
                  disabled={actionLoading === booking.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  <Ban className="w-3.5 h-3.5" />
                  Cancel
                </button>
              )}
            </>
          );
        }}
      />

      {/* Quote modal */}
      <Modal
        open={!!quoteBooking}
        onClose={() => setQuoteBooking(null)}
        title="Accept job & quote"
        description={`Quote your price for the ${quoteBooking?.trade.toLowerCase()} job at ${quoteBooking?.postcode}.`}
        size="sm"
        icon={<PoundSterling className="w-5 h-5" />}
        footer={
          <>
            <button
              onClick={() => setQuoteBooking(null)}
              disabled={accepting}
              className="px-4 py-2 rounded-xl bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 text-sm font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAcceptWithQuote}
              disabled={accepting || !Number(quotePrice)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {accepting && <Loader2 className="w-4 h-4 animate-spin" />}
              Accept & set price
            </button>
          </>
        }
      >
        <Input
          label="Your price (£)"
          required
          type="number"
          min="1"
          step="0.01"
          placeholder="e.g. 120"
          value={quotePrice}
          onChange={(e) => setQuotePrice(e.target.value)}
          autoFocus
        />
      </Modal>

      {/* Cancel confirm */}
      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        loading={cancelling}
        title="Cancel this job?"
        description={`This will cancel the ${cancelTarget?.trade.toLowerCase()} booking for ${cancelTarget?.fullName}.`}
        confirmLabel="Cancel job"
      />
    </div>
  );
};

export default MyJobs;
