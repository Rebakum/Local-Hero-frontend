import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  DollarSign,
  User,
  Briefcase,
} from "lucide-react";
import {
  getPaymentHistory,
  getPaymentStats,
  type PaymentRecord,
  type PaymentStats,
} from "../../../../services/payment.service";
import { PageHeader } from "../../../../Components/ui";
import { DataTable } from "../../../../Components/ui/DataTable";

export const AdminPaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // 1. Fetch Payments History from Backend API
  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getPaymentHistory({ limit: 500 });
      setPayments(result.payments || []);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Overall Payment Stats
  const fetchStats = async () => {
    try {
      const data = await getPaymentStats();
      setStats(data);
    } catch {
      // Stats are optional — keep the page usable without them.
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  // Helper function to format GBP Currency
  const formatGBP = (amountInPence: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amountInPence / 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3" /> Paid
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
            <XCircle className="w-3 h-3" /> Failed
          </span>
        );
      case "REFUNDED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
            <RefreshCw className="w-3 h-3" /> Refunded
          </span>
        );
      default:
        return <span className="text-xs text-gray-400 dark:text-navy-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          eyebrow="Admin Panel"
          title="Payment History"
          description="Monitor all transaction logs, payment statuses, and revenue details."
        />

        <button
          onClick={() => {
            fetchPayments();
            fetchStats();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-full transition"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-900">
          {error}
        </div>
      )}

      {/* Stats Summary Section */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-navy-400">Total Revenue</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                {formatGBP(stats.totalRevenueInPence)}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-navy-400">Successful Payments</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.paidCount}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-navy-400">Pending</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">
                {stats.pendingCount}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-navy-400">Failed / Expired</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">
                {stats.failedCount}
              </h3>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl text-red-600">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      )}

      {/* Payments Table — search / filter / sort / pagination built in */}
      <DataTable<PaymentRecord>
        isLoading={loading}
        loadingText="Loading payment records..."
        data={payments}
        rowKey={(p) => p.id}
        searchable
        searchPlaceholder="Search by customer name, email, trade or Stripe ref..."
        searchKeys={(p) => [
          p.booking?.fullName ?? '',
          p.booking?.email ?? '',
          p.booking?.trade ?? '',
          p.stripePaymentIntentId ?? '',
        ]}
        sortable
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { value: 'PAID', label: 'Paid' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'FAILED', label: 'Failed' },
              { value: 'REFUNDED', label: 'Refunded' },
            ],
          },
        ]}
        emptyTitle="No payment history records found"
        emptyDescription="Try a different search or filter."
        columns={[
          {
            key: 'customer',
            header: 'Customer Details',
            sortValue: (p) => p.booking?.fullName ?? '',
            render: (p) => (
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {p.booking?.fullName || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-navy-400">{p.booking?.email || "—"}</p>
                </div>
              </div>
            ),
          },
          {
            key: 'trade',
            header: 'Service Trade',
            sortValue: (p) => p.booking?.trade ?? '',
            render: (p) => (
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 3 text-indigo-500" />
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {p.booking?.trade || "—"}
                </span>
              </div>
            ),
          },
          {
            key: 'amount',
            header: 'Amount',
            sortValue: (p) => p.amountInPence,
            render: (p) => (
              <span className="font-bold text-gray-900 dark:text-white">
                {formatGBP(p.amountInPence)}
              </span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            sortValue: (p) => p.status,
            render: (p) => getStatusBadge(p.status),
          },
          {
            key: 'stripeRef',
            header: 'Stripe Ref',
            hideOn: 'md',
            sortValue: (p) => p.stripePaymentIntentId ?? '',
            render: (p) =>
              p.stripePaymentIntentId ? (
                <span className="text-xs font-mono text-gray-500 dark:text-navy-400 truncate max-w-[120px] block" title={p.stripePaymentIntentId}>
                  {p.stripePaymentIntentId}
                </span>
              ) : (
                <span className="text-xs text-gray-400 dark:text-navy-400">N/A</span>
              ),
          },
          {
            key: 'date',
            header: 'Date',
            sortValue: (p) => new Date(p.createdAt).getTime(),
            render: (p) => (
              <span className="text-xs text-gray-500 dark:text-navy-400">
                {p.createdAt
                  ? new Date(p.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
};

export default AdminPaymentHistory;
