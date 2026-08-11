import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Phone,
  Mail,
  PoundSterling,
  User,
  Wrench,
  Edit3,
  X,
} from "lucide-react";
import {
  getProviderBookings,
  updateBookingStatus,
  type BookingRecord,
  type BookingStatus,
} from "../../../services/booking.service";

export const ProviderBookingDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Selected booking for updating status
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [priceInPounds, setPriceInPounds] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);

  // Fetch Provider Bookings
  const fetchProviderBookings = async () => {
    setLoading(true);
    try {
      const data = await getProviderBookings();
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch provider bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderBookings();
  }, []);

  // Update Booking Status
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !newStatus) return;

    setUpdating(true);
    try {
      const payload: { status: BookingStatus; priceInPence?: number } = {
        status: newStatus as BookingStatus,
      };

      if (priceInPounds) {
        payload.priceInPence = Math.round(parseFloat(priceInPounds) * 100);
      }

      await updateBookingStatus(selectedBooking.id, payload);
      setIsModalOpen(false);
      fetchProviderBookings();
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === "ALL") return true;
    return b.status === statusFilter;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Assigned / Scheduled
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> In Progress
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-indigo-600" /> Service Jobs Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your assigned service jobs, communicate with clients, and update progress.
          </p>
        </div>

        <button
          onClick={fetchProviderBookings}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl transition"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
        {["ALL", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              statusFilter === status
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
            }`}
          >
            {status.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Booking Cards Grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading your assigned jobs...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
          <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No assigned jobs found in this section.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-gray-200 transition"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {booking.trade}
                  </span>
                  <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900 inline-block ml-2">
                    Urgency: {booking.urgency}
                  </p>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">
                    {booking.description}
                  </h3>
                </div>
                {getStatusBadge(booking.status)}
              </div>

              {/* Customer Info Box */}
              <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 p-3.5 rounded-xl space-y-1">
                <p className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" /> Customer: {booking.fullName}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-300 pt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-400" /> {booking.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-gray-400" /> {booking.email}
                  </span>
                </div>
              </div>

              {/* Schedule & Location */}
              <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span>
                    <strong>Scheduled:</strong>{" "}
                    {new Date(booking.bookingDate).toLocaleDateString("en-GB")} ({booking.timeSlot})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <span>
                    <strong>Address:</strong> {booking.address}, {booking.postcode}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <PoundSterling className="w-4 h-4 text-indigo-500" />
                  <span>
                    <strong>Job Price:</strong>{" "}
                    {booking.priceInPence ? (
                      <span className="font-bold text-gray-900 dark:text-white">
                        £{(booking.priceInPence / 100).toFixed(2)}
                      </span>
                    ) : (
                      <span className="italic text-amber-600">Quote Pending</span>
                    )}
                  </span>
                </div>
                {booking.notes && (
                  <p className="text-[11px] text-gray-500 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg mt-1">
                    <strong>Notes:</strong> {booking.notes}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedBooking(booking);
                    setNewStatus(booking.status);
                    setPriceInPounds(
                      booking.priceInPence ? (booking.priceInPence / 100).toString() : ""
                    );
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Update Status & Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Update Status */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Update Job Status
            </h3>
            <p className="text-xs text-gray-500">
              Update status for job #{selectedBooking.id.slice(-6)} ({selectedBooking.trade})
            </p>

            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Status Transition
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ACCEPTED">ACCEPTED (Scheduled)</option>
                  <option value="IN_PROGRESS">IN_PROGRESS (Started Work)</option>
                  <option value="COMPLETED">COMPLETED (Finished Work)</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Set/Update Price Quote (£ GBP)
                </label>
                <div className="relative">
                  <PoundSterling className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 120.00"
                    value={priceInPounds}
                    onChange={(e) => setPriceInPounds(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Update Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};