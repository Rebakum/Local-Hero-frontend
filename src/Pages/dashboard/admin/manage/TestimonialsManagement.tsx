import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  AlertCircle,
  MessageSquareQuote,
  Star,
  Eye,
  EyeOff,
  RotateCcw,
  ShieldCheck,
  MessagesSquare,
  Ban,
  Pin,
} from 'lucide-react';
import {
  DataTable,
  Modal,
  ConfirmDialog,
  ImageUpload,
  PageHeader,
  Input,
  Select,
  Textarea,
} from '../../../../Components/ui';
import { Badge } from '../../../../Components/ui/shared/Badge';
import {
  getTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type TestimonialInput,
} from '../../../../services/content.service';
import {
  UPLOAD_FOLDER_OPTIONS,
  type UploadFolder,
} from '../../../../services/upload.service';
import { useToast } from '../../../../Context/ToastContext';
import type { Testimonial } from '../../../../types';

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

type StatusFilter = 'all' | 'live' | 'hidden' | 'featured';

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All Reviews' },
  { value: 'live', label: 'Live (approved)' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'featured', label: 'Featured' },
];

interface TestimonialFormValues {
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
  source: string;
}

const toFormValues = (testimonial: Testimonial | null): TestimonialFormValues => ({
  author: testimonial?.author ?? '',
  role: testimonial?.role ?? 'Homeowner',
  city: testimonial?.city ?? '',
  trade: testimonial?.trade ?? '',
  rating: testimonial?.rating ?? 5,
  date: testimonial?.date ?? new Date().toLocaleDateString('en-GB'),
  comment: testimonial?.comment ?? '',
  verifiedJob: testimonial?.verifiedJob ?? '',
  avatar: testimonial?.avatar ?? '',
  folder: 'avatars',
  source: testimonial?.source ?? 'PLATFORM',
});

const toPayload = (values: TestimonialFormValues): TestimonialInput => ({
  author: values.author.trim(),
  role: values.role.trim() || undefined,
  city: values.city.trim() || undefined,
  trade: values.trade,
  rating: Number(values.rating) || 5,
  date: values.date.trim() || undefined,
  comment: values.comment.trim() || undefined,
  verifiedJob: values.verifiedJob.trim() || undefined,
  avatar: values.avatar || undefined,
  source: values.source.trim() || 'PLATFORM',
});

const formatDate = (t: Testimonial): string => {
  if (t.createdAt) {
    const d = new Date(t.createdAt);
    if (!Number.isNaN(d.getTime())) return d.toLocaleDateString('en-GB');
  }
  return t.date || '—';
};

const professionalName = (t: Testimonial): string =>
  t.professional?.companyName ?? t.professional?.name ?? '—';

const TestimonialsManagement: React.FC = () => {
  const toast = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [hideTarget, setHideTarget] = useState<Testimonial | null>(null);
  const [hideNote, setHideNote] = useState('');
  const [hiding, setHiding] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TestimonialFormValues>({
    defaultValues: toFormValues(null),
  });

  const avatar = watch('avatar');
  const folder = watch('folder');
  const rating = watch('rating');

  const loadTestimonials = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTestimonialsAdmin({ limit: 1000 });
      setTestimonials(data);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to load testimonials.');
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const stats = useMemo(() => {
    const total = testimonials.length;
    const live = testimonials.filter((t) => t.isApproved !== false).length;
    const hidden = testimonials.filter((t) => t.isApproved === false).length;
    const featured = testimonials.filter((t) => t.isFeatured).length;
    const average =
      total === 0
        ? 0
        : testimonials.reduce((sum, t) => sum + (t.rating ?? 0), 0) / total;
    return { total, live, hidden, featured, average };
  }, [testimonials]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let rows = testimonials;
    if (statusFilter === 'live') rows = rows.filter((t) => t.isApproved !== false);
    else if (statusFilter === 'hidden') rows = rows.filter((t) => t.isApproved === false);
    else if (statusFilter === 'featured') rows = rows.filter((t) => t.isFeatured);
    if (q) {
      rows = rows.filter((t) =>
        [t.author, t.comment, t.city]
          .filter(Boolean)
          .some((v) => (v as string).toLowerCase().includes(q)),
      );
    }
    return rows;
  }, [testimonials, statusFilter, searchQuery]);

  const openCreate = () => {
    setEditing(null);
    reset(toFormValues(null));
    setModalOpen(true);
  };

  const openEdit = (testimonial: Testimonial) => {
    setEditing(testimonial);
    reset(toFormValues(testimonial));
    setModalOpen(true);
  };

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true);
    setError(null);
    try {
      const payload = toPayload(values);
      if (editing) {
        await updateTestimonial(editing.id, payload);
        toast.success('Review updated successfully');
      } else {
        await createTestimonial(payload);
        toast.success('Review created successfully');
      }
      setModalOpen(false);
      await loadTestimonials();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = apiError.response?.data?.message || apiError.message || 'Failed to save testimonial.';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  });

  const handleHide = async () => {
    if (!hideTarget) return;
    setHiding(true);
    setError(null);
    try {
      await updateTestimonial(hideTarget.id, {
        isApproved: false,
        moderationNote: hideNote.trim() || null,
      });
      toast.success(`Review from "${hideTarget.author}" hidden from public view`);
      setHideTarget(null);
      setHideNote('');
      await loadTestimonials();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = apiError.response?.data?.message || apiError.message || 'Failed to hide the review.';
      setError(msg);
      toast.error(msg);
    } finally {
      setHiding(false);
    }
  };

  const handleRestore = async (testimonial: Testimonial) => {
    setBusyId(testimonial.id);
    setError(null);
    try {
      await updateTestimonial(testimonial.id, { isApproved: true });
      toast.success(`Review from "${testimonial.author}" is live again`);
      await loadTestimonials();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = apiError.response?.data?.message || apiError.message || 'Failed to restore the review.';
      setError(msg);
      toast.error(msg);
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleFeatured = async (testimonial: Testimonial) => {
    setBusyId(testimonial.id);
    setError(null);
    try {
      const next = !testimonial.isFeatured;
      await updateTestimonial(testimonial.id, { isFeatured: next });
      toast.success(next ? 'Review marked as featured' : 'Review unfeatured');
      await loadTestimonials();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = apiError.response?.data?.message || apiError.message || 'Failed to update featured status.';
      setError(msg);
      toast.error(msg);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteTestimonial(deleteTarget.id);
      toast.success('Review permanently deleted');
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = apiError.response?.data?.message || apiError.message || 'Failed to delete testimonial.';
      setError(msg);
      toast.error(msg);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const isBusy = (id: string) => busyId === id;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Panel"
        title="Review Moderation"
        description="Reviews go live instantly (post-moderation). Scan, hide or feature problematic reviews and manage customer testimonials from here."
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Testimonial
          </button>
        }
      />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Reviews', value: stats.total, icon: MessagesSquare, color: 'bg-navy-500/10 text-navy-600 dark:text-navy-300', badge: 'all' },
          { label: 'Live', value: stats.live, icon: Eye, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', badge: 'live' },
          { label: 'Hidden', value: stats.hidden, icon: Ban, color: 'bg-red-500/10 text-red-600 dark:text-red-400', badge: 'hidden' },
          { label: 'Featured', value: stats.featured, icon: Pin, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', badge: 'featured' },
          { label: 'Average Rating', value: stats.average.toFixed(1), icon: Star, color: 'bg-primary/10 text-primary', badge: 'rating' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-navy-100 dark:border-white/10 bg-white dark:bg-navy-800/50 p-4 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-navy-900 dark:text-white leading-tight">{stat.value}</p>
              <p className="text-[11px] font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-widest truncate">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="input-lh h-10 text-sm w-auto pr-8"
            aria-label="Filter reviews by status"
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-sm font-semibold text-navy-500 dark:text-navy-400">
            {filtered.length} {filtered.length === 1 ? 'review' : 'reviews'}
          </p>
        </div>
        <div className="relative sm:ml-auto w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search author, review or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-lh pl-9 h-10 text-sm"
          />
        </div>
      </div>

      <DataTable<Testimonial>
        isLoading={isLoading}
        loadingText="Loading reviews..."
        data={filtered}
        rowKey={(t) => t.id}
        sortable
        defaultPageSize={10}
        emptyTitle="No reviews found"
        emptyDescription="Adjust your filters or wait for new customer reviews to arrive."
        emptyIcon={<MessageSquareQuote className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
        columns={[
          {
            key: 'author',
            header: 'Author',
            sortValue: (t) => t.author,
            render: (t) => (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-navy-100 dark:bg-white/5 shrink-0 border border-navy-100 dark:border-white/10">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.author} className="w-full h-full object-cover" />
                  ) : (
                    <img src="/images/avatar-placeholder.svg" alt={t.author} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-navy-800 dark:text-navy-200 truncate max-w-[160px]">{t.author}</p>
                  <p className="text-[11px] text-navy-400 dark:text-navy-500 truncate max-w-[160px]">
                    {t.role} &bull; {t.city}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: 'trade',
            header: 'Trade',
            sortValue: (t) => t.trade,
            render: (t) => <Badge variant={TRADE_TONES[t.trade] ?? 'neutral'}>{t.trade}</Badge>,
          },
          {
            key: 'rating',
            header: 'Rating',
            sortValue: (t) => t.rating,
            render: (t) => (
              <span className="inline-flex items-center gap-1 font-semibold text-navy-800 dark:text-navy-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {t.rating}
              </span>
            ),
          },
          {
            key: 'comment',
            header: 'Review',
            hideOn: 'sm',
            render: (t) => (
              <span
                title={t.comment}
                className="text-navy-500 dark:text-navy-400 block truncate max-w-[240px] cursor-help"
              >
                &ldquo;{t.comment}&rdquo;
              </span>
            ),
          },
          {
            key: 'professional',
            header: 'Professional',
            hideOn: 'md',
            sortValue: (t) => professionalName(t),
            render: (t) => (
              <span className="text-navy-500 dark:text-navy-400 truncate block max-w-[160px]">
                {professionalName(t)}
              </span>
            ),
          },
          {
            key: 'date',
            header: 'Date',
            hideOn: 'lg',
            sortValue: (t) => t.createdAt ?? t.date,
            render: (t) => <span className="text-navy-500 dark:text-navy-400">{formatDate(t)}</span>,
          },
          {
            key: 'status',
            header: 'Status',
            render: (t) => (
              <div className="flex items-center gap-1.5">
                <Badge variant={t.isApproved === false ? 'warning' : 'success'}>
                  {t.isApproved === false ? 'Hidden' : 'Live'}
                </Badge>
                {t.isFeatured && <Badge variant="primary"><Star className="w-3 h-3 fill-current" /> Featured</Badge>}
              </div>
            ),
          },
        ]}
        actions={(t) => (
          <div className="flex items-center justify-end gap-1.5">
            {t.isApproved === false ? (
              <button
                onClick={() => handleRestore(t)}
                disabled={isBusy(t.id)}
                title="Restore (make public again)"
                className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-navy-200 dark:border-white/10 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors disabled:opacity-40"
              >
                {isBusy(t.id) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <button
                onClick={() => {
                  setHideTarget(t);
                  setHideNote(t.moderationNote ?? '');
                }}
                disabled={isBusy(t.id)}
                title="Hide (remove from public view)"
                className="w-8 h-8 rounded-full flex items-center justify-center text-navy-500 dark:text-navy-400 border border-navy-200 dark:border-white/10 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600 transition-colors disabled:opacity-40"
              >
                <EyeOff className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => handleToggleFeatured(t)}
              disabled={isBusy(t.id)}
              title={t.isFeatured ? 'Unfeature' : 'Feature'}
              className={`w-8 h-8 rounded-full flex items-center justify-center border border-navy-200 dark:border-white/10 transition-colors disabled:opacity-40 ${
                t.isFeatured
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20'
                  : 'text-navy-500 dark:text-navy-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-600'
              }`}
            >
              {isBusy(t.id) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Star className={`w-3.5 h-3.5 ${t.isFeatured ? 'fill-current' : ''}`} />}
            </button>

            <button
              onClick={() => openEdit(t)}
              disabled={isBusy(t.id)}
              title="Edit content"
              className="w-8 h-8 rounded-full flex items-center justify-center text-navy-500 dark:text-navy-400 border border-navy-200 dark:border-white/10 hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-40"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setDeleteTarget(t)}
              disabled={isBusy(t.id)}
              title="Delete permanently"
              className="w-8 h-8 rounded-full flex items-center justify-center text-navy-500 dark:text-navy-400 border border-navy-200 dark:border-white/10 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${editing.author}` : 'New Testimonial'}
        description="Customer testimonials shown in the public Testimonials section."
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
              onClick={onSubmit}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? 'Save changes' : 'Create testimonial'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Author name"
            required
            placeholder="e.g. John Doe"
            error={errors.author?.message}
            {...register('author', { required: 'Author name is required' })}
          />
          <Input label="Role" placeholder="e.g. Homeowner / Landlord" {...register('role')} />
          <Input label="City" placeholder="e.g. London" {...register('city')} />
          <Select
            label="Trade"
            required
            options={TRADE_OPTIONS}
            placeholder="Select a trade"
            {...register('trade', { required: 'Trade is required' })}
          />
          <Input label="Verified job" placeholder="e.g. Boiler Repair & Servicing" {...register('verifiedJob')} />
          <Input label="Source" placeholder="PLATFORM" {...register('source')} />
        </div>

        <div className="mt-4">
          <label className="text-xs font-semibold text-navy-700 dark:text-navy-300">Rating</label>
          <div className="flex items-center gap-1 mt-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setValue('rating', star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 ${
                    (rating ?? 5) >= star ? 'fill-amber-400 text-amber-400' : 'text-navy-200 dark:text-navy-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <Textarea label="Comment" placeholder="Share the customer's experience..." className="mt-4" {...register('comment')} />

        <div className="mt-6 pt-5 border-t border-navy-100 dark:border-white/10 space-y-4">
          <Select
            label="Upload folder"
            options={UPLOAD_FOLDER_OPTIONS}
            {...register('folder')}
          />
          <ImageUpload
            label="Avatar"
            value={avatar}
            onChange={(v) => setValue('avatar', Array.isArray(v) ? v[0] ?? '' : v)}
            folder={folder as UploadFolder}
          />
        </div>
      </Modal>

      {/* Hide Review Modal */}
      <Modal
        open={!!hideTarget}
        onClose={() => !hiding && setHideTarget(null)}
        title="Hide this review?"
        description="The review will be removed from public view. The author will be notified by email and in-app."
        size="md"
        icon={<EyeOff className="w-5 h-5" />}
        footer={
          <>
            <button
              onClick={() => setHideTarget(null)}
              disabled={hiding}
              className="px-4 py-2 rounded-full bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 text-sm font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleHide}
              disabled={hiding}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              {hiding && <Loader2 className="w-4 h-4 animate-spin" />}
              Hide review
            </button>
          </>
        }
      >
        <div className="rounded-xl bg-navy-50 dark:bg-white/5 border border-navy-100 dark:border-white/10 p-4 mb-4 text-sm">
          <p className="font-semibold text-navy-800 dark:text-navy-200">{hideTarget?.author}</p>
          <p className="text-navy-500 dark:text-navy-400 line-clamp-3 mt-1">&ldquo;{hideTarget?.comment}&rdquo;</p>
        </div>
        <Textarea
          label="Reason (sent to the reviewer)"
          placeholder="e.g. Offensive language / unrelated content / suspected spam..."
          value={hideNote}
          onChange={(e) => setHideNote(e.target.value)}
        />
        <p className="flex items-center gap-1.5 text-xs text-navy-400 dark:text-navy-500 mt-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          The reason is included in the notification and email sent to the reviewer.
        </p>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete review permanently?"
        description={`This will permanently remove the review from "${deleteTarget?.author}". The review will be erased from the database and this action cannot be undone.`}
        confirmLabel="Delete permanently"
      />
    </div>
  );
};

export default TestimonialsManagement;
