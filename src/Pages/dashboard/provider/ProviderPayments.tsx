import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { PoundSterling, Wallet, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { DataTable, PageHeader, StatusBadge } from '../../../Components/ui';
import { Card } from '../../../Components/ui/shared/Card';
import { getProviderBookings, type BookingRecord } from '../../../services/booking.service';

const formatPrice = (pence: number | null) =>
  pence == null ? '—' : `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;

const ProviderPayments: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProviderBookings();
      setBookings(data);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Could not load payments.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const paidBookings = useMemo(() => bookings.filter((b) => b.payment?.status === 'PAID'), [bookings]);
  const totalEarned = useMemo(
    () => paidBookings.reduce((sum, b) => sum + (b.payment?.amountInPence ?? 0), 0),
    [paidBookings]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Provider Panel"
        title="Payments"
        description="Confirmed payments from your customers — track what you've earned."
      />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card hover padding="md" className="h-full">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
              <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-navy-900 dark:text-white">{formatPrice(totalEarned)}</p>
            <p className="text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider mt-1">
              Total earned
            </p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card hover padding="md" className="h-full">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-navy-900 dark:text-white">{paidBookings.length}</p>
            <p className="text-xs font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-wider mt-1">
              Paid bookings
            </p>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <DataTable<BookingRecord>
          isLoading={isLoading}
          loadingText="Loading payments..."
          data={paidBookings}
          rowKey={(b) => b.id}
          emptyTitle="No payments yet"
          emptyDescription="Once a customer pays for an accepted booking, it will appear here."
          emptyIcon={<CreditCard className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
          columns={[
            {
              key: 'booking',
              header: 'Service',
              render: (b) => (
                <div>
                  <p className="font-semibold text-navy-800 dark:text-navy-200 capitalize">{b.trade}</p>
                  <p className="text-[11px] text-navy-400 dark:text-navy-500 font-mono">{b.id.slice(0, 8).toUpperCase()}</p>
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
              key: 'amount',
              header: 'Amount',
              render: (b) => (
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <PoundSterling className="w-3.5 h-3.5" />
                  {formatPrice(b.payment?.amountInPence ?? b.priceInPence)}
                </span>
              ),
            },
            {
              key: 'paidAt',
              header: 'Paid on',
              hideOn: 'md',
              render: (b) => (
                <span className="text-navy-500 dark:text-navy-400">
                  {b.payment?.paidAt ? new Date(b.payment.paidAt).toLocaleDateString('en-GB') : '—'}
                </span>
              ),
            },
            {
              key: 'status',
              header: 'Booking status',
              render: (b) => <StatusBadge status={b.status} />,
            },
          ]}
        />
      </motion.div>
    </div>
  );
};

export default ProviderPayments;
