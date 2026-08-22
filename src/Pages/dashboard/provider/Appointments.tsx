import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, CalendarCheck, MapPin, PoundSterling, Loader2, AlertCircle, Wrench, Zap, Sparkles, Paintbrush, Trees, Hammer, Key, Home, type LucideIcon } from 'lucide-react';
import { TableCellText } from '../../../Components/ui/DataTable';
import { DataTable, PageHeader, StatusBadge } from '../../../Components/ui';
import { getProviderBookings, type BookingRecord } from '../../../services/booking.service';

const formatPrice = (pence: number | null) =>
  pence == null ? '—' : `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;

const getTradeIcon = (trade: string): { icon: LucideIcon; tint: string } => {
  const normalized = trade.toLowerCase();

  if (normalized.includes('elect')) return { icon: Zap, tint: 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400' };
  if (normalized.includes('clean')) return { icon: Sparkles, tint: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' };
  if (normalized.includes('paint')) return { icon: Paintbrush, tint: 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' };
  if (normalized.includes('garden') || normalized.includes('land')) return { icon: Trees, tint: 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400' };
  if (normalized.includes('carp') || normalized.includes('wood')) return { icon: Hammer, tint: 'bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400' };
  if (normalized.includes('lock')) return { icon: Key, tint: 'bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400' };
  if (normalized.includes('roof')) return { icon: Home, tint: 'bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400' };

  return { icon: Wrench, tint: 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400' };
};

const Appointments: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProviderBookings();
      setBookings(data);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Could not load your appointments.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  // Accepted + scheduled bookings (incl. those already in progress).
  const appointments = useMemo(
    () => bookings.filter((b) => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS'),
    [bookings]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Provider Panel"
        title="Appointments"
        description="Accepted and scheduled bookings — date, time, location and payment at a glance."
        actions={
          <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-navy-100 dark:bg-white/5 border border-navy-200 dark:border-white/10">
            <CalendarCheck className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-navy-700 dark:text-navy-300">
              {appointments.length} Scheduled
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
          loadingText="Loading your appointments..."
          data={appointments}
          rowKey={(b) => b.id}
          searchable
          searchPlaceholder="Search appointments..."
          searchKeys={(b) => [b.trade, b.fullName, b.email, b.address, b.postcode]}
          sortable
          filters={[
            {
              key: 'status',
              label: 'Status',
              options: [
                { value: 'ACCEPTED', label: 'Accepted' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'CANCELLED', label: 'Cancelled' },
              ],
            },
          ]}
          emptyTitle="No appointments yet"
          emptyDescription="Accepted bookings will appear here with their scheduled date and time."
          emptyIcon={<Calendar className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
          columns={[
            {
              key: 'booking',
              header: 'Service',
              render: (b) => {
                const tradeIcon = getTradeIcon(b.trade);
                const TradeIcon = tradeIcon.icon;

                return (
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${tradeIcon.tint}`}>
                      <TradeIcon className="h-4 w-4" />
                    </div>
                    <TableCellText className="font-semibold text-navy-800 dark:text-navy-200 capitalize">{b.trade}</TableCellText>
                  </div>
                );
              },
            },
            {
              key: 'customer',
              header: 'Customer',
              render: (b) => (
                <div>
                  <p className="text-navy-700 dark:text-navy-200">{b.fullName}</p>
                  <p className="text-[11px] text-navy-800 dark:text-navy-300">{b.email}</p>
                </div>
              ),
            },
            {
              key: 'date',
              header: 'Date',
              render: (b) => (
                <div className="text-navy-800 dark:text-navy-300 whitespace-nowrap">
                  {new Date(b.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              ),
            },
            {
              key: 'time',
              header: 'Time',
              render: (b) => (
                <div className="text-navy-800 dark:text-navy-300">
                  <p className="font-medium text-navy-700 dark:text-navy-200 whitespace-nowrap">{b.timeSlot}</p>
                </div>
              ),
            },
            {
              key: 'location',
              header: 'Address',
              hideOn: 'lg',
              render: (b) => (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-navy-100 dark:bg-white/5 text-navy-800 dark:text-navy-300 text-xs">
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
                      : 'bg-navy-100 dark:bg-white/5 text-navy-800 dark:text-navy-300'
                  }`}
                >
                  {b.payment?.status === 'PAID' ? 'Paid' : b.payment?.status || 'Unpaid'}
                </span>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (b) => <StatusBadge status={b.status} />,
            },
          ]}
        />
      </motion.div>
    </div>
  );
};

export default Appointments;
