import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  MapPin,
  Calendar,
  Clock,
  PoundSterling,
  Check,
  XCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  DataTable,
  Modal,
  ConfirmDialog,
  PageHeader,
  Input,
} from '../../../Components/ui';
import {
  getProviderBookings,
  updateBookingStatus,
  type BookingRecord,
  type BookingStatus,
} from '../../../services/booking.service';

const Leads: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [quoteBooking, setQuoteBooking] = useState<BookingRecord | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [accepting, setAccepting] = useState(false);

  const [rejectTarget, setRejectTarget] = useState<BookingRecord | null>(null);
  const [rejecting, setRejecting] = useState(false);

  const [rescheduleTarget, setRescheduleTarget] = useState<BookingRecord | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduling, setRescheduling] = useState(false);

  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProviderBookings();
      setBookings(data);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Could not load booking requests.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // Leads = new booking / quote requests that are still pending.
  const pending = useMemo(() => bookings.filter((b) => b.status === 'PENDING'), [bookings]);

  const applyUpdate = (updated: BookingRecord) => {
    setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const handleStatusUpdate = async (booking: BookingRecord, status: BookingStatus, priceInPence?: number) => {
    setActionLoading(booking.id);
    setError(null);
    try {
      const updated = await updateBookingStatus(booking.id, {
        status,
        ...(priceInPence != null ? { priceInPence } : {}),
      });
      applyUpdate(updated);
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

  const handleReject = async () => {
    if (!rejectTarget) return;
    setRejecting(true);
    const ok = await handleStatusUpdate(rejectTarget, 'REJECTED');
    if (ok) setRejectTarget(null);
    setRejecting(false);
  };

  const openReschedule = (booking: BookingRecord) => {
    setRescheduleTarget(booking);
    setRescheduleDate(new Date(booking.bookingDate).toISOString().split('T')[0]);
    setRescheduleTime(booking.timeSlot);
  };

  const handleReschedule = async () => {
    if (!rescheduleTarget) return;
    if (!rescheduleDate || !rescheduleTime.trim()) return;
    setRescheduling(true);
    setError(null);
    try {
      const updated = await updateBookingStatus(rescheduleTarget.id, {
        status: 'PENDING',
        bookingDate: rescheduleDate,
        timeSlot: rescheduleTime.trim(),
      });
      applyUpdate(updated);
      setRescheduleTarget(null);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Reschedule failed.');
    } finally {
      setRescheduling(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Provider Panel"
        title="Leads"
        description="New booking / quote requests waiting for your response."
        actions={
          <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-navy-100 dark:bg-white/5 border border-navy-200 dark:border-white/10">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-navy-700 dark:text-navy-300">
              {pending.length} Pending
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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <DataTable<BookingRecord>
          isLoading={isLoading}
          loadingText="Loading booking requests..."
          data={pending}
          rowKey={(b) => b.id}
          searchable
          searchPlaceholder="Search leads..."
          searchKeys={(b) => [b.trade, b.fullName, b.email, b.description, b.address, b.postcode]}
          sortable
          filters={[
            {
              key: 'urgency',
              label: 'Urgency',
              options: [
                { value: 'Standard', label: 'Standard' },
                { value: 'Urgent (Same Day)', label: 'Urgent (Same Day)' },
                { value: 'Emergency 24/7 (45 Mins)', label: 'Emergency' },
              ],
            },
          ]}
          emptyTitle="No pending requests"
          emptyDescription="New booking / quote requests will appear here."
          emptyIcon={<Zap className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
          columns={[
            {
              key: 'booking',
              header: 'Service',
              render: (b) => (
                <div>
                  <p className="font-semibold text-navy-800 dark:text-navy-200 capitalize">{b.trade}</p>
                  <p className="text-[11px] text-navy-400 dark:text-navy-500">{b.description.slice(0, 60)}</p>
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
              header: 'Preferred date & time',
              render: (b) => (
                <div className="text-navy-500 dark:text-navy-400">
                  <p className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(b.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-navy-400 dark:text-navy-500 mt-0.5 inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {b.timeSlot}
                  </p>
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
              key: 'urgency',
              header: 'Urgency',
              hideOn: 'md',
              render: (b) => (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                  <Clock className="w-3 h-3" />
                  {b.urgency}
                </span>
              ),
            },
          ]}
          actions={(booking) => (
            <>
              <button
                onClick={() => {
                  setQuoteBooking(booking);
                  setQuotePrice('');
                }}
                disabled={actionLoading === booking.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                Accept
              </button>
              <button
                onClick={() => setRejectTarget(booking)}
                disabled={actionLoading === booking.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </button>
              <button
                onClick={() => openReschedule(booking)}
                disabled={actionLoading === booking.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400 text-xs font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <Calendar className="w-3.5 h-3.5" />
                Reschedule
              </button>
            </>
          )}
        />
      </motion.div>

      {/* Accept & quote modal */}
      <Modal
        open={!!quoteBooking}
        onClose={() => setQuoteBooking(null)}
        title="Accept booking & quote"
        description={`Confirm your price for the ${quoteBooking?.trade.toLowerCase()} job at ${quoteBooking?.postcode}.`}
        size="sm"
        icon={<PoundSterling className="w-5 h-5" />}
        footer={
          <>
            <button
              onClick={() => setQuoteBooking(null)}
              disabled={accepting}
              className="px-4 py-2 rounded-full bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 text-sm font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAcceptWithQuote}
              disabled={accepting || !Number(quotePrice)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
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

      {/* Reject confirm */}
      <ConfirmDialog
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleReject}
        loading={rejecting}
        title="Reject this request?"
        description={`The ${rejectTarget?.trade.toLowerCase()} booking request from ${rejectTarget?.fullName} will be marked as rejected.`}
        confirmLabel="Reject booking"
      />

      {/* Reschedule modal */}
      <Modal
        open={!!rescheduleTarget}
        onClose={() => setRescheduleTarget(null)}
        title="Reschedule booking"
        description={`Pick a new preferred date and time for the ${rescheduleTarget?.trade.toLowerCase()} job at ${rescheduleTarget?.postcode}.`}
        size="sm"
        icon={<Calendar className="w-5 h-5" />}
        footer={
          <>
            <button
              onClick={() => setRescheduleTarget(null)}
              disabled={rescheduling}
              className="px-4 py-2 rounded-full bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 text-sm font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleReschedule}
              disabled={rescheduling || !rescheduleDate || !rescheduleTime.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {rescheduling && <Loader2 className="w-4 h-4 animate-spin" />}
              Save new date & time
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
              New date
            </label>
            <input
              type="date"
              value={rescheduleDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setRescheduleDate(e.target.value)}
              className="input-lh w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
              New time slot
            </label>
            <select
              value={rescheduleTime}
              onChange={(e) => setRescheduleTime(e.target.value)}
              className="input-lh w-full"
            >
              <option>Morning (8am - 12pm)</option>
              <option>Afternoon (12pm - 4pm)</option>
              <option>Evening (4pm - 8pm)</option>
              <option>As Soon As Possible</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Leads;
