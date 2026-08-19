import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Loader2, AlertCircle, MessageSquareQuote, Star, EyeOff } from 'lucide-react';
import {
  DataTable,
  Modal,
  ConfirmDialog,
  PageHeader,
  Input,
  Select,
  Textarea,
  ImageUpload,
} from '@/src/Components/ui';
import { Badge } from '@/src/Components/ui/shared/Badge';
import {
  getMyTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type TestimonialInput,
} from '@/src/services/content.service';
import type { Testimonial } from '@/src/types';
import {
  USER_UPLOAD_FOLDER_OPTIONS,
  type UploadFolder,
} from '@/src/services/upload.service';
import { useAuth } from '@/src/Context/AuthContext';

const TRADE_OPTIONS = [
  { value: 'Plumber', label: 'Plumber' },
  { value: 'Electrician', label: 'Electrician' },
  { value: 'Cleaner', label: 'Cleaner' },
  { value: 'Painter', label: 'Painter' },
  { value: 'Gardener', label: 'Gardener' },
  { value: 'Carpenter', label: 'Carpenter' },
  { value: 'Locksmith', label: 'Locksmith' },
  { value: 'Roofer', label: 'Roofer' },
];

const TRADE_TONES: Record<string, 'primary' | 'success' | 'warning' | 'neutral'> = {
  Plumber: 'primary',
  Electrician: 'warning',
  Cleaner: 'success',
  Gardener: 'success',
  Carpenter: 'neutral',
  Locksmith: 'warning',
  Painter: 'primary',
  Roofer: 'neutral',
};

interface ReviewFormValues {
  author: string;
  role: string;
  city: string;
  trade: string;
  rating: number;
  date: string;
  comment: string;
  verifiedJob: string;
  avatar: string;
  folder: string;
}

const emptyForm = (authorName: string): ReviewFormValues => ({
  author: authorName || '',
  role: 'Homeowner',
  city: '',
  trade: '',
  rating: 5,
  date: new Date().toLocaleDateString('en-GB'),
  comment: '',
  verifiedJob: '',
  avatar: '',
  folder: 'avatars',
});

const toFormValues = (t: Testimonial | null, authorName: string): ReviewFormValues =>
  t
    ? {
        author: t.author || authorName,
        role: t.role || 'Homeowner',
        city: t.city || '',
        trade: t.trade || '',
        rating: t.rating ?? 5,
        date: t.date || new Date().toLocaleDateString('en-GB'),
        comment: t.comment || '',
        verifiedJob: t.verifiedJob || '',
        avatar: t.avatar ?? '',
        folder: 'avatars',
      }
    : emptyForm(authorName);

const toPayload = (v: ReviewFormValues, bookingId?: string): TestimonialInput => ({
  author: v.author.trim(),
  role: v.role.trim() || undefined,
  city: v.city.trim() || undefined,
  trade: v.trade,
  rating: v.rating,
  date: v.date.trim() || undefined,
  comment: v.comment.trim() || undefined,
  verifiedJob: v.verifiedJob.trim() || undefined,
  avatar: v.avatar.trim() || undefined,
  source: 'PLATFORM',
  bookingId,
});

interface MyTestimonialsManagerProps {
  eyebrow: string;
  title: string;
  description: string;
  /**
   * Booking that prompted this review (from a notification/email CTA). When
   * set, the write-review form opens automatically and the created review is
   * linked to the booking.
   */
  prefillBookingId?: string;
}

export const MyTestimonialsManager: React.FC<MyTestimonialsManagerProps> = ({
  eyebrow,
  title,
  description,
  prefillBookingId,
}) => {
  const { user } = useAuth();
  const authorName = user?.name ?? '';

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ReviewFormValues>(() => emptyForm(authorName));

  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadTestimonials = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMyTestimonials();
      setTestimonials(data);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to load your reviews.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  // When arriving from a booking completion CTA (notification/email), open
  // the write-review form right away so the customer lands straight in it.
  const autoOpenedRef = React.useRef(false);
  useEffect(() => {
    if (prefillBookingId && !autoOpenedRef.current && !isLoading) {
      autoOpenedRef.current = true;
      openCreate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillBookingId, isLoading]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return testimonials;
    return testimonials.filter((t) =>
      [t.comment, t.trade, t.verifiedJob, t.city, t.author]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q)),
    );
  }, [testimonials, searchQuery]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm(authorName));
    setModalOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm(toFormValues(t, authorName));
    setModalOpen(true);
  };

  const handleChange = (field: keyof ReviewFormValues, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = toPayload(form, prefillBookingId);
      if (editing) {
        await updateTestimonial(editing.id, payload);
      } else {
        await createTestimonial(payload);
      }
      setModalOpen(false);
      await loadTestimonials();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to save your review.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteTestimonial(deleteTarget.id);
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to delete your review.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Write a Review
          </button>
        }
      />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {!isLoading && testimonials.some((t) => t.isApproved === false) && (
        <div className="flex items-start gap-2 px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-sm text-amber-800 dark:text-amber-400">
          <EyeOff className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            Some of your reviews are currently hidden by our moderation team. They will not be visible to
            other users. If you have any questions, please{' '}
            <a href="/contact" className="font-semibold underline underline-offset-2">contact support</a>.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-sm font-semibold text-navy-500 dark:text-navy-400">
          {filtered.length} {filtered.length === 1 ? 'review' : 'reviews'}
        </p>
        <div className="relative sm:ml-auto w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search your reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-lh pl-9 h-10 text-sm"
          />
        </div>
      </div>

      <DataTable<Testimonial>
        isLoading={isLoading}
        loadingText="Loading your reviews..."
        data={filtered}
        rowKey={(t) => t.id}
        sortable
        filters={[
          {
            key: 'trade',
            label: 'Trade',
            options: [
              { value: 'Plumber', label: 'Plumber' },
              { value: 'Electrician', label: 'Electrician' },
              { value: 'Cleaner', label: 'Cleaner' },
              { value: 'Painter', label: 'Painter' },
              { value: 'Gardener', label: 'Gardener' },
              { value: 'Carpenter', label: 'Carpenter' },
              { value: 'Locksmith', label: 'Locksmith' },
              { value: 'Roofer', label: 'Roofer' },
            ],
          },
        ]}
        emptyTitle="No reviews yet"
        emptyDescription="Share your experience by writing your first review."
        emptyIcon={<MessageSquareQuote className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
        columns={[
          {
            key: 'trade',
            header: 'Trade',
            render: (t) => <Badge variant={TRADE_TONES[t.trade] ?? 'neutral'}>{t.trade}</Badge>,
          },
          {
            key: 'rating',
            header: 'Rating',
            render: (t) => (
              <span className="inline-flex items-center gap-1 font-semibold text-navy-800 dark:text-navy-200">
                <Star className="w-3.5 3 fill-amber-400 text-amber-400" />
                {t.rating}
              </span>
            ),
          },
          {
            key: 'comment',
            header: 'Review',
            hideOn: 'sm',
            render: (t) => (
              <span className="text-navy-500 dark:text-navy-400 truncate block max-w-[260px]">
                &ldquo;{t.comment}&rdquo;
              </span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            hideOn: 'md',
            render: (t) =>
              t.isApproved === false ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-[11px] font-semibold">
                  <EyeOff className="w-3 h-3" />
                  Hidden by moderation
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Live</span>
              ),
          },
          {
            key: 'verifiedJob',
            header: 'Verified Job',
            hideOn: 'md',
            render: (t) => (
              <span className="text-navy-500 dark:text-navy-400">{t.verifiedJob || '—'}</span>
            ),
          },
        ]}
        actions={(testimonial) => (
          <>
            <button
              onClick={() => openEdit(testimonial)}
              title="Edit"
              className="w-8 h-8 rounded-full flex items-center justify-center text-navy-500 dark:text-navy-400 border border-navy-200 dark:border-white/10 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Pencil className="w-3.5 3" />
            </button>
            <button
              onClick={() => setDeleteTarget(testimonial)}
              title="Delete"
              className="w-8 h-8 rounded-full flex items-center justify-center text-navy-500 dark:text-navy-400 border border-navy-200 dark:border-white/10 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 3" />
            </button>
          </>
        )}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Review' : 'Write a Review'}
        description="Share your experience to help other customers choose the right professional."
        size="lg"
        icon={<MessageSquareQuote className="w-5 h-5" />}
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              disabled={saving}
              className="px-4 py-2 rounded-full bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 text-sm font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? 'Save changes' : 'Submit review'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Author name"
            required
            placeholder="e.g. John Doe"
            value={form.author}
            onChange={(e) => handleChange('author', e.target.value)}
          />
          <Input
            label="Role"
            required
            placeholder="e.g. Homeowner / Landlord"
            value={form.role}
            onChange={(e) => handleChange('role', e.target.value)}
          />
          <Input
            label="City"
            required
            placeholder="e.g. London"
            value={form.city}
            onChange={(e) => handleChange('city', e.target.value)}
          />
          <Select
            label="Trade"
            required
            options={TRADE_OPTIONS}
            placeholder="Select a trade"
            value={form.trade}
            onChange={(e) => handleChange('trade', e.target.value)}
          />
          <Input
            label="Verified job"
            required
            placeholder="e.g. Boiler Repair & Servicing"
            value={form.verifiedJob}
            onChange={(e) => handleChange('verifiedJob', e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold text-navy-700 dark:text-navy-300">Rating</label>
          <div className="flex items-center gap-1 mt-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => handleChange('rating', star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 ${
                    form.rating >= star ? 'fill-amber-400 text-amber-400' : 'text-navy-200 dark:text-navy-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-navy-100 dark:border-white/10 space-y-4">
          <Select
            label="Upload folder"
            options={USER_UPLOAD_FOLDER_OPTIONS}
            value={form.folder}
            onChange={(e) => handleChange('folder', e.target.value)}
          />
          <ImageUpload
            label="Avatar"
            value={form.avatar}
            onChange={(v) => handleChange('avatar', Array.isArray(v) ? v[0] ?? '' : v)}
            folder={form.folder as UploadFolder}
          />
        </div>

        <Textarea
          label="Comment"
          required
          placeholder="Share your experience..."
          className="mt-4"
          value={form.comment}
          onChange={(e) => handleChange('comment', e.target.value)}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete review?"
        description={`This will permanently remove your review about "${deleteTarget?.trade}". This action cannot be undone.`}
        confirmLabel="Delete review"
      />
    </div>
  );
};

export default MyTestimonialsManager;
