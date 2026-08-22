import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Calendar,
  MessageSquare,
  Trash2,
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card } from "../../../../Components/ui/shared/Card";
import { ActionButton } from "../../../../Components/dashboard/ActionButton";
import { StatCard } from "../../StatCard";
import { getAllPayments } from "../../../../services/payment.service";
import { getAdminBookings } from "../../../../services/booking.service";
import {
  getTestimonialsAdmin,
  deleteTestimonial,
} from "../../../../services/content.service";
import type { PaymentRecord } from "../../../../services/payment.service";
import type { BookingRecord } from "../../../../services/booking.service";
import type { Testimonial } from "../../../../types";

type TabType = "payments" | "bookings" | "testimonials";

const PAYMENT_TONE: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-600",
  PENDING: "bg-amber-100 text-amber-600",
  FAILED: "bg-red-100 text-red-600",
  REFUNDED: "bg-slate-100 text-slate-600 dark:bg-navy-800 dark:text-navy-300",
};

const BOOKING_TONE: Record<string, string> = {
  COMPLETED: "bg-emerald-100 text-emerald-600",
  ACCEPTED: "bg-sky-100 text-sky-600",
  IN_PROGRESS: "bg-blue-100 text-blue-600",
  PENDING: "bg-amber-100 text-amber-600",
  CANCELLED: "bg-red-100 text-red-600",
  REJECTED: "bg-red-100 text-red-600",
};

const formatPence = (pence: number | null | undefined): string =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format((pence ?? 0) / 100);

const formatDate = (iso?: string | null): string =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

export const AdminManagementDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("payments");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [paymentData, bookingData, testimonialData] = await Promise.all([
        getAllPayments(),
        getAdminBookings({ page: 1, limit: 100 }),
        getTestimonialsAdmin({ page: 1, limit: 100 }),
      ]);
      setPayments(paymentData ?? []);
      setBookings(bookingData.bookings ?? []);
      setTestimonials(testimonialData ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial/review?")) return;
    setActionLoading(id);
    setError(null);
    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete testimonial");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredPayments = payments.filter(
    (p) =>
      !searchTerm.trim() ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.booking?.fullName ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const filteredBookings = bookings.filter(
    (b) =>
      !searchTerm.trim() ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.professional?.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 p-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Payments"
          value={payments.length}
          icon={CreditCard}
          badge={{ text: "All History", variant: "blue" }}
          iconBgColor="bg-blue-500/10"
          iconTextColor="text-blue-600"
        />
        <StatCard
          title="Total Bookings"
          value={bookings.length}
          icon={Calendar}
          badge={{ text: "Active", variant: "emerald" }}
          iconBgColor="bg-emerald-500/10"
          iconTextColor="text-emerald-600"
        />
        <StatCard
          title="Total Testimonials"
          value={testimonials.length}
          icon={MessageSquare}
          badge={{ text: "Reviews", variant: "purple" }}
          iconBgColor="bg-purple-500/10"
          iconTextColor="text-purple-600"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-3">
        {(
          [
            { key: "payments", label: "Payment History", icon: CreditCard },
            { key: "bookings", label: "Booking History", icon: Calendar },
            { key: "testimonials", label: "Manage Testimonials & Reviews", icon: MessageSquare },
          ] as { key: TabType; label: string; icon: React.FC<{ className?: string }> }[]
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-xl transition-all ${
              activeTab === tab.key
                ? "bg-primary text-white"
                : "text-gray-500 hover:bg-gray-100 dark:text-navy-300 dark:hover:bg-white/5"
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* Global search */}
      <div className="relative w-full lg:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-lh pl-10 h-11 text-sm rounded-2xl"
        />
      </div>

      {/* Tab 1: Payment History */}
      {activeTab === "payments" && (
        <Card padding="md">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" /> All Payment Logs
          </h2>
          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="animate-spin w-6 h-6 text-primary" /></div>
          ) : filteredPayments.length === 0 ? (
            <p className="py-12 text-center text-sm text-navy-800 dark:text-navy-300">No payments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-navy-300 uppercase text-xs">
                  <tr>
                    <th className="p-3">Payment ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100 dark:border-white/5 bg-white odd:bg-gray-50/60 dark:bg-gray-800/20 dark:odd:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors">
                      <td className="p-3 font-semibold">{p.id}</td>
                      <td className="p-3">{p.booking?.fullName ?? "—"}</td>
                      <td className="p-3 font-bold text-emerald-600">{formatPence(p.amountInPence)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${PAYMENT_TONE[p.status] ?? "bg-gray-100 text-gray-600 dark:bg-navy-800 dark:text-navy-300"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-400 dark:text-navy-300">{formatDate(p.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Tab 2: Booking History */}
      {activeTab === "bookings" && (
        <Card padding="md">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> All Bookings History
          </h2>
          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="animate-spin w-6 h-6 text-primary" /></div>
          ) : filteredBookings.length === 0 ? (
            <p className="py-12 text-center text-sm text-navy-800 dark:text-navy-300">No bookings found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-navy-300 uppercase text-xs">
                  <tr>
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Assigned Provider</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="border-b border-gray-100 dark:border-white/5 bg-white odd:bg-gray-50/60 dark:bg-gray-800/20 dark:odd:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-colors">
                      <td className="p-3 font-semibold">{b.id}</td>
                      <td className="p-3">{b.fullName}</td>
                      <td className="p-3">{b.professional?.name ?? "Unassigned"}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${BOOKING_TONE[b.status] ?? "bg-gray-100 text-gray-600 dark:bg-navy-800 dark:text-navy-300"}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-400 dark:text-navy-300">{formatDate(b.bookingDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Tab 3: Testimonial & Review Management */}
      {activeTab === "testimonials" && (
        <Card padding="md">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Manage User Testimonials & Reviews
          </h2>
          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="animate-spin w-6 h-6 text-primary" /></div>
          ) : testimonials.length === 0 ? (
            <p className="py-12 text-center text-sm text-navy-800 dark:text-navy-300">No testimonials found.</p>
          ) : (
            <div className="space-y-4">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl border border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm">{t.author}</h4>
                      <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                        {t.trade}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">"{t.comment}"</p>
                  </div>

                  <ActionButton
                    variant="reject"
                    icon={Trash2}
                    isLoading={actionLoading === t.id}
                    onClick={() => handleDeleteTestimonial(t.id)}
                  >
                    Delete Review
                  </ActionButton>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};