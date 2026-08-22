import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  UserPlus,
  Edit3,
  X,
  Phone,
  Mail,
  MapPin,
  PoundSterling,
} from "lucide-react";
import {
  getAdminBookings,
  assignBooking,
  updateBookingStatus,
  type BookingRecord,
  type BookingStatus,
} from "../../../../services/booking.service";
import { DataTable, StatusBadge } from "../../../../Components/ui";

export const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Modals state
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);

  // Form states for modals
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string>("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [quotedPriceInPounds, setQuotedPriceInPounds] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);

  // Fetch all bookings (client-side search / filter / sort / pagination)
  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getAdminBookings({ limit: 500 });
      setBookings(result.bookings || []);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle Assign Professional Submission
  const handleAssignProfessional = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !selectedProfessionalId) return;

    setUpdating(true);
    setError("");
    try {
      await assignBooking(selectedBooking.id, selectedProfessionalId);
      setIsAssignModalOpen(false);
      fetchBookings();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || "Failed to assign professional");
    } finally {
      setUpdating(false);
    }
  };

  // Handle Update Status & Price Quote Submission
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !newStatus) return;

    setUpdating(true);
    setError("");
    try {
      const payload: { status: BookingStatus; priceInPence?: number } = {
        status: newStatus as BookingStatus,
      };

      if (quotedPriceInPounds) {
        payload.priceInPence = Math.round(parseFloat(quotedPriceInPounds) * 100);
      }

      await updateBookingStatus(selectedBooking.id, payload);
      setIsStatusModalOpen(false);
      fetchBookings();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Top Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span>Admin Panel</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Booking Requests Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage customer service bookings, assign professionals, and set price quotes.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-full transition"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-900">
          {error}
        </div>
      )}

      {/* Bookings Table — search / filter / sort / pagination built in */}
      <DataTable<BookingRecord>
        isLoading={loading}
        loadingText="Loading bookings..."
        data={bookings}
        rowKey={(b) => b.id}
        searchable
        searchPlaceholder="Search customer, email, phone, trade, postcode..."
        searchKeys={(b) => [
          b.fullName,
          b.email,
          b.phone,
          b.trade,
          b.postcode,
          b.address,
          b.professional?.name ?? '',
        ]}
        sortable
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { value: 'PENDING', label: 'Pending' },
              { value: 'ACCEPTED', label: 'Accepted' },
              { value: 'IN_PROGRESS', label: 'In Progress' },
              { value: 'COMPLETED', label: 'Completed' },
              { value: 'CANCELLED', label: 'Cancelled' },
              { value: 'REJECTED', label: 'Rejected' },
            ],
          },
        ]}
        emptyTitle="No bookings found"
        emptyDescription="Try a different search or filter."
        columns={[
          {
            key: 'customer',
            header: 'Customer Details',
            sortValue: (b) => b.fullName,
            render: (b) => (
              <div className="space-y-0.5">
                <p className="font-semibold text-gray-900 dark:text-white">{b.fullName}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 dark:text-navy-300">
                  <Mail className="w-3 h-3" /> {b.email}
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-1 dark:text-navy-300">
                  <Phone className="w-3 h-3" /> {b.phone}
                </p>
              </div>
            ),
          },
          {
            key: 'service',
            header: 'Service Required',
            sortValue: (b) => b.trade,
            render: (b) => (
              <div>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 block">
                  {b.trade}
                </span>
                <span className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900 inline-block mt-1">
                  Urgency: {b.urgency}
                </span>
              </div>
            ),
          },
          {
            key: 'date',
            header: 'Date & Location',
            sortValue: (b) => new Date(b.bookingDate).getTime(),
            render: (b) => (
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                  <Calendar className="w-3.5 3 text-gray-400 dark:text-navy-400" />
                  {new Date(b.bookingDate).toLocaleDateString("en-GB")} ({b.timeSlot})
                </div>
                <div className="flex items-center gap-1 text-gray-500 dark:text-navy-300">
                  <MapPin className="w-3.5 3 text-gray-400 dark:text-navy-400" />
                  {b.postcode}, {b.address}
                </div>
              </div>
            ),
          },
          {
            key: 'professional',
            header: 'Assigned Professional',
            sortValue: (b) => b.professional?.name ?? '',
            render: (b) =>
              b.professional ? (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    {b.professional.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-xs text-gray-900 dark:text-white">
                      {b.professional.name}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-navy-300">
                      {b.professional.companyName || "Freelance"}
                    </p>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-gray-400 italic dark:text-navy-300">Unassigned</span>
              ),
          },
          {
            key: 'price',
            header: 'Quote Price',
            sortValue: (b) => b.priceInPence ?? 0,
            render: (b) =>
              b.priceInPence ? (
                <span className="font-bold text-gray-900 dark:text-white">
                  £{(b.priceInPence / 100).toFixed(2)}
                </span>
              ) : (
                <span className="text-xs text-amber-600 font-normal">Not quoted</span>
              ),
          },
          {
            key: 'status',
            header: 'Status',
            sortValue: (b) => b.status,
            render: (b) => <StatusBadge status={b.status} />,
          },
        ]}
        actions={(b) => (
          <>
            <button
              title="Assign Professional"
              onClick={() => {
                setSelectedBooking(b);
                setSelectedProfessionalId(b.professionalId || "");
                setIsAssignModalOpen(true);
              }}
              className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-full dark:text-navy-300 dark:hover:bg-gray-800"
            >
              <UserPlus className="w-4 h-4" />
            </button>

            <button
              title="Update Status / Quote Price"
              onClick={() => {
                setSelectedBooking(b);
                setNewStatus(b.status);
                setQuotedPriceInPounds(
                  b.priceInPence ? (b.priceInPence / 100).toString() : ""
                );
                setIsStatusModalOpen(true);
              }}
              className="p-1.5 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-full dark:text-navy-300 dark:hover:bg-gray-800"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </>
        )}
      />

      {/* MODAL 1: Assign Professional */}
      {isAssignModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 relative">
            <button
              onClick={() => setIsAssignModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-navy-400 dark:hover:text-navy-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Assign Professional
            </h3>
            <p className="text-xs text-gray-500 dark:text-navy-300">
              Assign a provider to booking #{selectedBooking.id.slice(-6)} ({selectedBooking.trade})
            </p>

            <form onSubmit={handleAssignProfessional} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Professional ID / UUID
                </label>
                <input
                  type="text"
                  required
                  placeholder="Paste Professional ID"
                  value={selectedProfessionalId}
                  onChange={(e) => setSelectedProfessionalId(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 dark:text-navy-300 dark:bg-navy-800 dark:hover:bg-navy-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 disabled:opacity-50"
                >
                  {updating ? "Assigning..." : "Assign & Accept"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Update Status & Set Quoted Price */}
      {isStatusModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 relative">
            <button
              onClick={() => setIsStatusModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-navy-400 dark:hover:text-navy-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Update Booking & Quote Price
            </h3>

            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Booking Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full py-2 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="ACCEPTED">ACCEPTED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Price Quote (£ GBP)
                </label>
                <div className="relative">
                  <PoundSterling className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-navy-400" />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 150.00"
                    value={quotedPriceInPounds}
                    onChange={(e) => setQuotedPriceInPounds(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1 dark:text-navy-300">
                  Setting a price allows customer to proceed with Stripe checkout.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 dark:text-navy-300 dark:bg-navy-800 dark:hover:bg-navy-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
