import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Briefcase,
  CheckCircle2,
  MapPin,
  Calendar,
  PoundSterling,
  Loader2,
  AlertCircle,
  Play,
  Ban,
} from 'lucide-react';
import {
  DataTable,
  ConfirmDialog,
  PageHeader,
  StatusBadge,
} from '../../../Components/ui';
import {
  getProviderBookings,
  updateBookingStatus,
  type BookingRecord,
  type BookingStatus,
} from '../../../services/booking.service';

const NEXT_ACTIONS: Partial<Record<BookingStatus, { next: BookingStatus; label: string; icon: React.FC<{ className?: string }> }>> = {
  ACCEPTED: { next: 'IN_PROGRESS', label: 'Start job', icon: Play },
  IN_PROGRESS: { next: 'COMPLETED', label: 'Complete', icon: CheckCircle2 },
};

const formatPrice = (pence: number | null) =>
  pence == null ? '—' : `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;

const STATUS_TABS = ['ALL', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED'] as const;

const MyJobs: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<string>('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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

  const handleStatusUpdate = async (booking: BookingRecord, status: BookingStatus) => {
    setActionLoading(booking.id);
    setError(null);
    try {
      const updated = await updateBookingStatus(booking.id, { status });
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

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    const ok = await handleStatusUpdate(cancelTarget, 'CANCELLED');
    if (ok) setCancelTarget(null);
    setCancelling(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Provider Panel"
        title="My Jobs"
        description="Accepted and paid bookings — start and complete the work."
      />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((status) => (
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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <DataTable<BookingRecord>
          isLoading={isLoading}
          loadingText="Loading your jobs..."
          data={filtered}
          rowKey={(b) => b.id}
          searchable
          searchPlaceholder="Search jobs..."
          searchKeys={(b) => [b.trade, b.fullName, b.email, b.address, b.postcode, b.id]}
          sortable
          emptyTitle="No active jobs"
          emptyDescription="Accepted bookings appear here so you can start and complete them."
          emptyIcon={<Briefcase className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
          columns={[
            {
              key: 'booking',
              header: 'Service',
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
              key: 'date',
              header: 'Date',
              hideOn: 'md',
              render: (b) => (
                <div className="text-navy-500 dark:text-navy-400 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(b.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              ),
            },
            {
              key: 'time',
              header: 'Time',
              hideOn: 'lg',
              render: (b) => (
                <div className="text-navy-500 dark:text-navy-400">
                  <p className="font-medium text-navy-700 dark:text-navy-200 whitespace-nowrap">{b.timeSlot}</p>
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
                  {b.address}, {b.postcode}
                </span>
              ),
            },
            {
              key: 'price',
              header: 'Price',
              render: (b) => (
                <span className="inline-flex items-center gap-1 font-semibold text-navy-800 dark:text-navy-200">
                  <PoundSterling className="w-3.5 3 text-navy-400" />
                  {formatPrice(b.priceInPence)}
                </span>
              ),
            },
            {
              key: 'payment',
              header: 'Payment',
              render: (b) => (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold ${
                    b.payment?.status === 'PAID'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : b.payment?.status === 'FAILED'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                        : 'bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400'
                  }`}
                >
                  {b.payment?.status === 'PAID'
                    ? 'Paid'
                    : b.payment?.status === 'FAILED'
                      ? 'Failed'
                      : b.payment?.status || 'No payment'}
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
                    onClick={() => handleStatusUpdate(booking, config.next)}
                    disabled={actionLoading === booking.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {actionLoading === booking.id ? (
                      <Loader2 className="w-3.5 3 animate-spin" />
                    ) : (
                      <config.icon className="w-3.5 3" />
                    )}
                    {config.label}
                  </button>
                )}
                {booking.status === 'ACCEPTED' && (
                  <button
                    onClick={() => setCancelTarget(booking)}
                    disabled={actionLoading === booking.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    <Ban className="w-3.5 3" />
                    Cancel
                  </button>
                )}
              </>
            );
          }}
        />
      </motion.div>

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
