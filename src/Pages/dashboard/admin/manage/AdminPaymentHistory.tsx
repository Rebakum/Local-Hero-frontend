import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Search,
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
import { Pagination } from "../../../../Components/ui/Pagination";

export const AdminPaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // 1. Fetch Payments History from Backend API
  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getPaymentHistory({
        page,
        limit: 10,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
      });
      setPayments(result.payments);
      setTotalPages(Math.max(1, Math.ceil(result.total / result.limit)));
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
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPayments();
  };

  // Helper function to format GBP Currency
  const formatGBP = (amountInPence: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amountInPence / 100);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
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
              <p className="text-xs font-semibold uppercase text-gray-500">Total Revenue</p>
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
              <p className="text-xs font-semibold uppercase text-gray-500">Successful Payments</p>
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
              <p className="text-xs font-semibold uppercase text-gray-500">Pending</p>
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
              <p className="text-xs font-semibold uppercase text-gray-500">Failed / Expired</p>
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

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name, email or session ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-44 py-2 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="PAID">PAID</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100 dark:border-gray-800">
              <tr>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Service Trade</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Stripe Ref</th>
                <th className="py-3.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Loading payment records...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No payment history records found.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {payment.booking?.fullName || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-400">{payment.booking?.email || "—"}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {payment.booking?.trade || "—"}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatGBP(payment.amountInPence)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {payment.status === "PAID" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Paid
                        </span>
                      )}
                      {payment.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                      {payment.status === "FAILED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                          <XCircle className="w-3 h-3" /> Failed
                        </span>
                      )}
                      {payment.status === "REFUNDED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                          <RefreshCw className="w-3 h-3" /> Refunded
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs font-mono text-gray-500">
                      {payment.stripePaymentIntentId ? (
                        <span className="truncate max-w-[120px] block" title={payment.stripePaymentIntentId}>
                          {payment.stripePaymentIntentId}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {payment.createdAt
                        ? new Date(payment.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            page={page}
            pageSize={10}
            total={totalPages * 10}
            onPageChange={(p) => setPage(p)}
            showRange={false}
          />
        )}
      </div>
    </div>
  );
};

export default AdminPaymentHistory;
