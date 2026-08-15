import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Search, Loader2, AlertCircle, MessageSquareQuote, Star } from 'lucide-react';
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

const TestimonialsManagement: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

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
      const data = await getTestimonialsAdmin();
      setTestimonials(data);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to load testimonials.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return testimonials;
    return testimonials.filter((t) =>
      [t.author, t.comment, t.verifiedJob, t.city, t.trade, t.role]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q)),
    );
  }, [testimonials, searchQuery]);

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
      } else {
        await createTestimonial(payload);
      }
      setModalOpen(false);
      await loadTestimonials();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to save testimonial.');
    } finally {
      setSaving(false);
    }
  });

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
      setError(apiError.response?.data?.message || apiError.message || 'Failed to delete testimonial.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Panel"
        title="Testimonials Management"
        description="Create, edit and remove customer testimonials and reviews shown across the platform."
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

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-sm font-semibold text-navy-500 dark:text-navy-400">
          {filtered.length} {filtered.length === 1 ? 'testimonial' : 'testimonials'}
        </p>
        <div className="relative sm:ml-auto w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search testimonials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-lh pl-9 h-10 text-sm"
          />
        </div>
      </div>

      <DataTable<Testimonial>
        isLoading={isLoading}
        loadingText="Loading testimonials..."
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
        emptyTitle="No testimonials found"
        emptyDescription="Add your first customer testimonial to get started."
        emptyIcon={<MessageSquareQuote className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
        columns={[
          {
            key: 'author',
            header: 'Author',
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
                  <p className="font-semibold text-navy-800 dark:text-navy-200 truncate max-w-[200px]">{t.author}</p>
                  <p className="text-[11px] text-navy-400 dark:text-navy-500 truncate max-w-[200px]">
                    {t.role} &bull; {t.city}
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: 'trade',
            header: 'Trade',
            render: (t) => (
              <Badge variant={TRADE_TONES[t.trade] ?? 'neutral'}>{t.trade}</Badge>
            ),
          },
          {
            key: 'rating',
            header: 'Rating',
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
              <span className="text-navy-500 dark:text-navy-400 truncate block max-w-[260px]">
                &ldquo;{t.comment}&rdquo;
              </span>
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
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeleteTarget(testimonial)}
              title="Delete"
              className="w-8 h-8 rounded-full flex items-center justify-center text-navy-500 dark:text-navy-400 border border-navy-200 dark:border-white/10 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </>
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

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete testimonial?"
        description={`This will permanently remove the testimonial from "${deleteTarget?.author}". This action cannot be undone.`}
        confirmLabel="Delete testimonial"
      />
    </div>
  );
};

export default TestimonialsManagement;
