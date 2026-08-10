import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Calendar,
  MessageSquare,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card } from "../../../../Components/ui/shared/Card";
import { ActionButton } from "../../../../Components/dashboard/ActionButton";
import { StatCard } from "../../StatCard";

type TabType = "payments" | "bookings" | "testimonials";

export const AdminManagementDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("payments");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Mock / Fetched States
  const [payments, setPayments] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Demo Fetching Functions
  const fetchData = async () => {
    setLoading(true);
    try {
      // In production, connect with your Axios / Fetch API endpoints:
      // const resPayments = await api.get('/payments');
      // const resBookings = await api.get('/bookings');
      // const resTestimonials = await api.get('/testimonials');
      
      // Mock Fallbacks for UI testing
      setPayments([
        { id: "PAY-101", user: "Rahim Ali", amount: "৳2,500", status: "COMPLETED", date: "2026-08-01" },
        { id: "PAY-102", user: "Karim Hassan", amount: "৳1,800", status: "PENDING", date: "2026-08-05" },
      ]);
      setBookings([
        { id: "BK-901", customer: "Suhana Ahmed", provider: "Kamal Hossain", status: "CONFIRMED", date: "2026-08-10" },
        { id: "BK-902", customer: "Tanvir Hossain", provider: "Unassigned", status: "PENDING", date: "2026-08-12" },
      ]);
      setTestimonials([
        { id: "TM-1", author: "Anisur Rahman", comment: "Great plumbing service!", trade: "Plumbing", rating: 5 },
        { id: "TM-2", author: "Sadia Islam", comment: "Late arrival, work was ok.", trade: "Cleaning", rating: 3 },
      ]);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete Testimonial Handler (Admin Action)
  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial/review?")) return;
    try {
      setActionLoading(id);
      // await api.delete(`/testimonials/${id}`);
      setTestimonials((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("Failed to delete testimonial");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8 p-6">
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
        <button
          onClick={() => setActiveTab("payments")}
          className={`flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-xl transition-all ${
            activeTab === "payments"
              ? "bg-primary text-white"
              : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
          }`}
        >
          <CreditCard className="w-4 h-4" /> Payment History
        </button>
        <button
          onClick={() => setActiveTab("bookings")}
          className={`flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-xl transition-all ${
            activeTab === "bookings"
              ? "bg-primary text-white"
              : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
          }`}
        >
          <Calendar className="w-4 h-4" /> Booking History
        </button>
        <button
          onClick={() => setActiveTab("testimonials")}
          className={`flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-xl transition-all ${
            activeTab === "testimonials"
              ? "bg-primary text-white"
              : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Manage Testimonials & Reviews
        </button>
      </div>

      {/* Tab 1: Payment History */}
      {activeTab === "payments" && (
        <Card padding="md">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" /> All Payment Logs
          </h2>
          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="animate-spin w-6 h-6 text-primary" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="p-3">Payment ID</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100 dark:border-white/5">
                      <td className="p-3 font-semibold">{p.id}</td>
                      <td className="p-3">{p.user}</td>
                      <td className="p-3 font-bold text-emerald-600">{p.amount}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                          p.status === "COMPLETED" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-400">{p.date}</td>
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
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-white/5 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="p-3">Booking ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Assigned Provider</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-gray-100 dark:border-white/5">
                      <td className="p-3 font-semibold">{b.id}</td>
                      <td className="p-3">{b.customer}</td>
                      <td className="p-3">{b.provider}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                          b.status === "CONFIRMED" ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-400">{b.date}</td>
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