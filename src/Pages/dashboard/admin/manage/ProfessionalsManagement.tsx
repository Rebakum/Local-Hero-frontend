import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, UserRound, Search, Loader2, AlertCircle, Users } from 'lucide-react';
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
import { StatusBadge } from '../../../../Components/ui/StatusBadge';
import {
  createProfessional,
  updateProfessional,
  deleteProfessional,
  type ProfessionalInput,
} from '../../../../services/content.service';
import type { Professional } from '../../../../types';
import { useProfessionals } from '../../../../Context/ProfessionalsContext';

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

const AVAILABILITY_OPTIONS = [
  { value: 'Available Today', label: 'Available Today' },
  { value: 'Available Tomorrow', label: 'Available Tomorrow' },
  { value: 'Booked 2 Days', label: 'Booked 2 Days' },
];

interface ProFormValues {
  name: string;
  trade: string;
  companyName: string;
  hourlyRate: string;
  location: string;
  postcodeArea: string;
  bio: string;
  specialties: string;
  availability: string;
  avatar: string;
  portfolioImages: string[];
}

const toFormValues = (pro: Professional | null): ProFormValues => ({
  name: pro?.name ?? '',
  trade: pro?.trade ?? '',
  companyName: pro?.companyName ?? '',
  hourlyRate: pro?.hourlyRate != null ? String(pro.hourlyRate) : '',
  location: pro?.location ?? '',
  postcodeArea: pro?.postcodeArea ?? '',
  bio: pro?.bio ?? '',
  specialties: (pro?.specialties ?? []).join(', '),
  availability: pro?.availability ?? 'Available Today',
  avatar: pro?.avatar ?? '',
  portfolioImages: pro?.portfolioImages ?? [],
});

const toPayload = (values: ProFormValues): ProfessionalInput => ({
  name: values.name.trim(),
  trade: values.trade,
  companyName: values.companyName.trim() || undefined,
  hourlyRate: values.hourlyRate ? Number(values.hourlyRate) : undefined,
  location: values.location.trim() || undefined,
  postcodeArea: values.postcodeArea.trim() || undefined,
  bio: values.bio.trim() || undefined,
  specialties: values.specialties
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  availability: values.availability || undefined,
  avatar: values.avatar || undefined,
  portfolioImages: values.portfolioImages,
});

const ProfessionalsManagement: React.FC = () => {
  const { professionals, isLoading, refresh, addProfessional } = useProfessionals();
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Professional | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Professional | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProFormValues>({ defaultValues: toFormValues(null) });

  const avatar = watch('avatar');
  const portfolioImages = watch('portfolioImages');

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return professionals;
    return professionals.filter((p) =>
      [p.name, p.companyName, p.trade, p.location, p.postcodeArea]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q)),
    );
  }, [professionals, searchQuery]);

  const openCreate = () => {
    setEditing(null);
    reset(toFormValues(null));
    setModalOpen(true);
  };

  const openEdit = (pro: Professional) => {
    setEditing(pro);
    reset(toFormValues(pro));
    setModalOpen(true);
  };

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true);
    setError(null);
    try {
      const payload = toPayload(values);
      if (editing) {
        await updateProfessional(editing.id, payload);
      } else {
        const created = await createProfessional(payload);
        addProfessional(created);
      }
      setModalOpen(false);
      await refresh();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to save professional.');
    } finally {
      setSaving(false);
    }
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteProfessional(deleteTarget.id);
      setDeleteTarget(null);
      await refresh();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to delete professional.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Panel"
        title="Professionals Management"
        description="Manage the tradespeople listed on the platform."
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Professional
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
          {filtered.length} {filtered.length === 1 ? 'professional' : 'professionals'}
        </p>
        <div className="relative sm:ml-auto w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search professionals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-lh pl-9 h-10 text-sm"
          />
        </div>
      </div>

      <DataTable<Professional>
        isLoading={isLoading}
        loadingText="Loading professionals..."
        data={filtered}
        rowKey={(p) => p.id}
        emptyTitle="No professionals found"
        emptyDescription="Add your first professional to get started."
        emptyIcon={<Users className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
        columns={[
          {
            key: 'name',
            header: 'Professional',
            render: (p) => (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {p.avatar ? (
                    <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserRound className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-navy-800 dark:text-navy-200">{p.name}</p>
                  {p.companyName && (
                    <p className="text-[11px] text-navy-400 dark:text-navy-500 truncate max-w-[180px]">
                      {p.companyName}
                    </p>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: 'trade',
            header: 'Trade',
            render: (p) => <span className="text-navy-600 dark:text-navy-300">{p.trade}</span>,
          },
          {
            key: 'hourlyRate',
            header: 'Rate',
            hideOn: 'sm',
            render: (p) => (
              <span className="font-semibold text-navy-800 dark:text-navy-200">
                £{p.hourlyRate}
                <span className="text-[11px] font-normal text-navy-400">/hr</span>
              </span>
            ),
          },
          {
            key: 'location',
            header: 'Location',
            hideOn: 'md',
            render: (p) => (
              <span className="text-navy-500 dark:text-navy-400">
                {p.location || p.postcodeArea || '—'}
              </span>
            ),
          },
          {
            key: 'availability',
            header: 'Availability',
            hideOn: 'lg',
            render: (p) => (
              <StatusBadge
                status={p.availability}
                tone={p.availability === 'Available Today' ? 'success' : p.availability === 'Available Tomorrow' ? 'info' : 'neutral'}
              />
            ),
          },
        ]}
        actions={(pro) => (
          <>
            <button
              onClick={() => openEdit(pro)}
              title="Edit"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-500 dark:text-navy-400 border border-navy-200 dark:border-white/10 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeleteTarget(pro)}
              title="Delete"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-500 dark:text-navy-400 border border-navy-200 dark:border-white/10 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
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
        title={editing ? `Edit ${editing.name}` : 'New Professional'}
        description="Profiles shown to customers searching for local tradespeople."
        size="lg"
        icon={<UserRound className="w-5 h-5" />}
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 text-sm font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? 'Save changes' : 'Create professional'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full name"
            required
            placeholder="e.g. James Stirling"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
          <Select
            label="Trade"
            required
            options={TRADE_OPTIONS}
            placeholder="Select a trade"
            {...register('trade', { required: 'Trade is required' })}
          />
          <Input label="Company name" placeholder="e.g. Stirling Heating & Gas" {...register('companyName')} />
          <Input
            label="Hourly rate (£)"
            type="number"
            placeholder="e.g. 55"
            {...register('hourlyRate')}
          />
          <Input label="Location" placeholder="e.g. Islington, London" {...register('location')} />
          <Input label="Postcode area" placeholder="e.g. N1" {...register('postcodeArea')} />
        </div>

        <Textarea label="Bio" placeholder="Short biography shown on the profile" className="mt-4" {...register('bio')} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Input
            label="Specialties"
            hint="Comma separated"
            placeholder="Boiler Replacements, Power Flushing"
            {...register('specialties')}
          />
          <Select label="Availability" options={AVAILABILITY_OPTIONS} {...register('availability')} />
        </div>

        <div className="mt-6 pt-5 border-t border-navy-100 dark:border-white/10 space-y-5">
          <ImageUpload
            label="Profile avatar"
            value={avatar}
            onChange={(v) => setValue('avatar', Array.isArray(v) ? v[0] ?? '' : v)}
            folder="avatars"
          />
          <ImageUpload
            label="Portfolio images"
            value={portfolioImages}
            onChange={(v) => setValue('portfolioImages', Array.isArray(v) ? v : v ? [v] : [])}
            folder="portfolios"
            multiple
            maxFiles={10}
          />
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete professional?"
        description={`This will permanently remove "${deleteTarget?.name}" from the platform. This action cannot be undone.`}
        confirmLabel="Delete professional"
      />
    </div>
  );
};

export default ProfessionalsManagement;
