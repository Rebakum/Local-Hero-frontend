import React, { useCallback, useEffect, useState } from 'react';
import {
  ImageUpload,
  PageHeader,
  Input,
  Textarea,
  Modal,
} from '../../../Components/ui';
import { Badge } from '../../../Components/ui/shared/Badge';
import {
  getEligibleBeforeAfterBookings,
  getMyBeforeAfterSubmissions,
  createBeforeAfterSubmission,
  updateBeforeAfterSubmission,
  type EligibleBeforeAfterBooking,
} from '../../../services/content.service';
import type { BeforeAfterPair } from '../../../types';
import { CheckCircle2, Clock, Loader2, Send, Star, XCircle, AlertCircle, Images, RefreshCw } from 'lucide-react';

const STATUS_TONE: Record<string, 'warning' | 'success' | 'neutral' | 'primary'> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'neutral',
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pending review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

const BeforeAfterSubmissions: React.FC = () => {
  const [eligible, setEligible] = useState<EligibleBeforeAfterBooking[]>([]);
  const [submissions, setSubmissions] = useState<BeforeAfterPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const [completionDays, setCompletionDays] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [editing, setEditing] = useState<BeforeAfterPair | null>(null);
  const [editBefore, setEditBefore] = useState('');
  const [editAfter, setEditAfter] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCost, setEditCost] = useState('');
  const [editCompletionDays, setEditCompletionDays] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [eligibleData, submissionsData] = await Promise.all([
        getEligibleBeforeAfterBookings(),
        getMyBeforeAfterSubmissions(),
      ]);
      setEligible(eligibleData);
      setSubmissions(submissionsData);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to load your submissions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selectedBooking = eligible.find((b) => b.id === selectedBookingId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || !beforeImage || !afterImage) return;

    setSubmitting(true);
    setError(null);
    try {
      await createBeforeAfterSubmission({
        bookingId: selectedBookingId,
        beforeImage,
        afterImage,
        description: description.trim(),
        cost: cost.trim(),
        completionDays: completionDays.trim(),
      });
      setSelectedBookingId('');
      setBeforeImage('');
      setAfterImage('');
      setDescription('');
      setCost('');
      setCompletionDays('');
      await load();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to submit your showcase.');
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (p: BeforeAfterPair) => {
    setEditing(p);
    setEditBefore(p.beforeImage);
    setEditAfter(p.afterImage);
    setEditDescription(p.description);
    setEditCost(p.cost);
    setEditCompletionDays(p.completionDays);
  };

  const handleEditSave = async () => {
    if (!editing) return;
    setEditSaving(true);
    setError(null);
    try {
      await updateBeforeAfterSubmission(editing.id, {
        beforeImage: editBefore,
        afterImage: editAfter,
        description: editDescription,
        cost: editCost,
        completionDays: editCompletionDays,
      });
      setEditing(null);
      await load();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to update your showcase.');
    } finally {
      setEditSaving(false);
    }
  };

  const formDisabled = submitting || !selectedBookingId;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Provider Dashboard"
        title="Before & After"
        description="Showcase verified work from your completed bookings. An admin reviews each submission before it goes live."
      />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Submit form */}
      <div className="rounded-3xl border border-navy-100 dark:border-white/10 bg-white dark:bg-navy-900 shadow-soft p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Images className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy-900 dark:text-white">New showcase</h2>
            <p className="text-xs text-navy-400 dark:text-navy-500">Pick one of your completed bookings</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
              Completed booking <span className="text-primary">*</span>
            </label>
            {loading ? (
              <div className="flex items-center gap-2 text-xs text-navy-400">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading bookings…
              </div>
            ) : eligible.length === 0 ? (
              <p className="text-sm text-navy-500 dark:text-navy-400">
                No completed bookings available for a before/after showcase yet.
              </p>
            ) : (
              <select
                value={selectedBookingId}
                onChange={(e) => setSelectedBookingId(e.target.value)}
                className="input-lh"
              >
                <option value="">Select a completed booking…</option>
                {eligible.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.trade} — {b.postcode} ({b.fullName})
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedBooking && (
            <div className="flex items-center gap-2 text-xs text-navy-500 dark:text-navy-400 bg-navy-50 dark:bg-white/5 rounded-xl px-3 py-2.5 border border-navy-100 dark:border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              Booking for {selectedBooking.fullName} · {selectedBooking.trade} · completed on{' '}
              {new Date(selectedBooking.bookingDate).toLocaleDateString('en-GB')}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUpload
              label="Before image"
              value={beforeImage}
              onChange={(v) => setBeforeImage(Array.isArray(v) ? v[0] ?? '' : v)}
              folder="before-after"
              disabled={!selectedBookingId}
            />
            <ImageUpload
              label="After image"
              value={afterImage}
              onChange={(v) => setAfterImage(Array.isArray(v) ? v[0] ?? '' : v)}
              folder="before-after"
              disabled={!selectedBookingId}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Project cost" placeholder="e.g. £1,850" value={cost} onChange={(e) => setCost(e.target.value)} required />
            <Input label="Completion time" placeholder="e.g. 3 Days" value={completionDays} onChange={(e) => setCompletionDays(e.target.value)} required />
          </div>

          <Textarea
            label="Description"
            placeholder="Short description of the transformation"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={formDisabled || submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit for review
          </button>
        </form>
      </div>

      {/* My submissions */}
      <div className="rounded-3xl border border-navy-100 dark:border-white/10 bg-white dark:bg-navy-900 shadow-soft p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Star className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy-900 dark:text-white">My submissions</h2>
            <p className="text-xs text-navy-400 dark:text-navy-500">Track the status of every showcase you've submitted</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-navy-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : submissions.length === 0 ? (
          <p className="text-sm text-navy-500 dark:text-navy-400 py-8 text-center">
            You haven't submitted any before/after showcases yet.
          </p>
        ) : (
          <div className="space-y-3">
            {submissions.map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border border-navy-100 dark:border-white/10 bg-cream-50 dark:bg-navy-800/50"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-navy-100 dark:bg-white/5 shrink-0 border border-navy-100 dark:border-white/10">
                    <img src={p.beforeImage} alt="Before" className="absolute inset-0 w-1/2 h-full object-cover" />
                    <img src={p.afterImage} alt="After" className="absolute inset-y-0 right-0 w-1/2 h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-navy-800 dark:text-navy-200 truncate">{p.title}</p>
                    <p className="text-[11px] text-navy-400 dark:text-navy-500 truncate">
                      {p.location} · {p.cost} · {p.completionDays}
                    </p>
                    {p.status === 'REJECTED' && p.rejectionReason && (
                      <p className="text-[11px] text-red-500 mt-1">Reason: {p.rejectionReason}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={STATUS_TONE[p.status ?? 'PENDING']}>
                    {STATUS_LABEL[p.status ?? 'PENDING']}
                  </Badge>
                  {p.status === 'APPROVED' ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                      {p.isFeatured ? <Star className="w-3 h-3 fill-current" /> : null}
                      {p.isFeatured ? 'Featured' : 'Live'}
                    </span>
                  ) : (
                    <button
                      onClick={() => openEdit(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-navy-200 dark:border-white/10 text-xs font-semibold text-navy-600 dark:text-navy-300 hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {p.status === 'REJECTED' ? <RefreshCw className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {p.status === 'REJECTED' ? 'Resubmit' : 'Edit'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / Resubmit Modal */}
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.status === 'REJECTED' ? 'Resubmit showcase' : 'Edit showcase'}
        description="Update the photos and details. Rejected submissions go back to the review queue."
        size="lg"
        icon={<Images className="w-5 h-5" />}
        footer={
          <>
            <button
              onClick={() => setEditing(null)}
              disabled={editSaving}
              className="px-4 py-2 rounded-full bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 text-sm font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleEditSave}
              disabled={editSaving || !editBefore || !editAfter}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {editSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing?.status === 'REJECTED' ? 'Resubmit' : 'Save changes'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImageUpload label="Before image" value={editBefore} onChange={(v) => setEditBefore(Array.isArray(v) ? v[0] ?? '' : v)} folder="before-after" />
          <ImageUpload label="After image" value={editAfter} onChange={(v) => setEditAfter(Array.isArray(v) ? v[0] ?? '' : v)} folder="before-after" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Input label="Project cost" placeholder="e.g. £1,850" value={editCost} onChange={(e) => setEditCost(e.target.value)} />
          <Input label="Completion time" placeholder="e.g. 3 Days" value={editCompletionDays} onChange={(e) => setEditCompletionDays(e.target.value)} />
        </div>
        <Textarea label="Description" placeholder="Short description of the transformation" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="mt-4" />
      </Modal>
    </div>
  );
};

export default BeforeAfterSubmissions;
