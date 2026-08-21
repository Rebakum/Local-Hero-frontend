import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import {
  UserRound,
  Search,
  Loader2,
  AlertCircle,
  Users,
  Droplets,
  Zap,
  Sparkles,
  Paintbrush,
  Leaf,
  Hammer,
  KeyRound,
  Home,
  MapPin,
  Star,
  BadgeCheck,
  Clock,
  TrendingUp,
  Command,
  ArrowUpRight,
  Check,
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
import { StatusBadge } from '../../../../Components/ui/StatusBadge';
import { RowActions, editAction, deleteAction } from '../../../../Components/dashboard/RowActions';
import {
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

interface TradeMeta {
  icon: React.FC<{ className?: string }>;
  pill: string;
  ring: string;
}

const TRADE_META: Record<string, TradeMeta> = {
  Plumber: { icon: Droplets, pill: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20', ring: 'from-sky-400 to-blue-600' },
  Electrician: { icon: Zap, pill: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', ring: 'from-amber-400 to-orange-500' },
  Cleaner: { icon: Sparkles, pill: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', ring: 'from-emerald-400 to-teal-600' },
  Painter: { icon: Paintbrush, pill: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20', ring: 'from-pink-400 to-rose-600' },
  Gardener: { icon: Leaf, pill: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20', ring: 'from-green-400 to-emerald-600' },
  Carpenter: { icon: Hammer, pill: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20', ring: 'from-orange-400 to-amber-600' },
  Locksmith: { icon: KeyRound, pill: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20', ring: 'from-violet-400 to-purple-600' },
  Roofer: { icon: Home, pill: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20', ring: 'from-cyan-400 to-sky-600' },
};

const DEFAULT_TRADE_META: TradeMeta = {
  icon: UserRound,
  pill: 'bg-navy-100 text-navy-600 dark:bg-white/10 dark:text-navy-300',
  ring: 'from-navy-400 to-navy-600',
};

const tradeMeta = (trade?: string): TradeMeta => (trade ? TRADE_META[trade] ?? DEFAULT_TRADE_META : DEFAULT_TRADE_META);

const STAT_GRADIENTS: Record<string, string> = {
  total: 'from-sky-400 via-blue-500 to-indigo-600',
  available: 'from-emerald-400 via-teal-500 to-cyan-600',
  rating: 'from-amber-400 via-orange-500 to-red-500',
  rate: 'from-violet-400 via-purple-500 to-fuchsia-500',
};

const initials = (name?: string): string =>
  (name ?? '')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

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
    ? values.specialties
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [],
  availability: values.availability || undefined,
  avatar: values.avatar || undefined,
  portfolioImages: values.portfolioImages ?? [],
});

const ProfessionalsManagement: React.FC = () => {
  const { professionals, isLoading, refresh } = useProfessionals();
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tradeFilter, setTradeFilter] = useState('');

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
    let list = professionals;
    if (tradeFilter) {
      list = list.filter((p) => p.trade === tradeFilter);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        [p.name, p.companyName, p.trade, p.location, p.postcodeArea]
          .filter(Boolean)
          .some((v) => (v as string).toLowerCase().includes(q)),
      );
    }
    return list;
  }, [professionals, searchQuery, tradeFilter]);

  const stats = useMemo(() => {
    const rated = professionals.filter((p) => p.rating != null);
    const avgRating = rated.length
      ? rated.reduce((s, p) => s + Number(p.rating), 0) / rated.length
      : 0;
    const withRate = professionals.filter((p) => p.hourlyRate != null);
    const avgRate = withRate.length
      ? withRate.reduce((s, p) => s + (Number(p.hourlyRate) || 0), 0) / withRate.length
      : 0;
    return {
      total: professionals.length,
      availableToday: professionals.filter((p) => p.availability === 'Available Today').length,
      avgRating,
      avgRate,
    };
  }, [professionals]);

  const statCards = [
    { key: 'total', label: 'Total Professionals', value: stats.total.toLocaleString(), icon: Users, sub: 'Listed on the platform' },
    { key: 'available', label: 'Available Today', value: stats.availableToday.toLocaleString(), icon: Clock, sub: 'Ready to take jobs' },
    { key: 'rating', label: 'Average Rating', value: stats.avgRating ? stats.avgRating.toFixed(1) : '—', icon: Star, sub: 'Across all reviews' },
    { key: 'rate', label: 'Average Rate', value: stats.avgRate ? `£${Math.round(stats.avgRate)}` : '—', icon: TrendingUp, sub: 'Per hour, on average' },
  ];

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
      if (!editing?.id) {
        throw new Error('No professional selected for editing.');
      }
      await updateProfessional(editing.id, payload);
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
    const deleteId = deleteTarget?.id;
    if (!deleteId) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteProfessional(deleteId);
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
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-navy-800 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
          >
            <div
              className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${STAT_GRADIENTS[stat.key]} opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20`}
            />
            <div className="relative flex items-start justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${STAT_GRADIENTS[stat.key]} text-white shadow-md`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="w-3 h-3" />
                live
              </span>
            </div>
            <p className="relative mt-4 text-3xl font-black tracking-tight text-navy-900 dark:text-white">
              {stat.value}
            </p>
            <p className="relative mt-1 text-xs font-bold uppercase tracking-wider text-navy-400 dark:text-navy-500">
              {stat.label}
            </p>
            <p className="relative mt-0.5 text-[11px] text-navy-400/80 dark:text-navy-500/80">
              {stat.sub}
            </p>
          </motion.div>
        ))}
      </div>

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

      {/* Filters + Search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search name, company, trade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-lh pl-10 pr-16 h-11 text-sm rounded-2xl"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-md border border-neutral-200 dark:border-white/10 bg-navy-50 dark:bg-navy-900 px-1.5 py-0.5 text-[10px] font-semibold text-navy-400">
            <Command className="w-2.5 h-2.5" /> K
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
          <button
            onClick={() => setTradeFilter('')}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
              tradeFilter === ''
                ? 'bg-gradient-to-r from-primary to-rose-500 text-white shadow-md shadow-primary/30'
                : 'bg-white dark:bg-navy-800 border border-neutral-200 dark:border-white/10 text-navy-600 dark:text-navy-400 hover:border-primary/40 hover:text-primary'
            }`}
          >
            All trades
            <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${tradeFilter === '' ? 'bg-white/20 text-white' : 'bg-navy-100 text-navy-500 dark:bg-white/10 dark:text-navy-300'}`}>
              {professionals.length}
            </span>
          </button>
          {TRADE_OPTIONS.map((opt) => {
            const active = tradeFilter === opt.value;
            const count = professionals.filter((p) => p.trade === opt.value).length;
            if (count === 0) return null;
            return (
              <button
                key={opt.value}
                onClick={() => setTradeFilter(active ? '' : opt.value)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-primary to-rose-500 text-white shadow-md shadow-primary/30'
                    : 'bg-white dark:bg-navy-800 border border-neutral-200 dark:border-white/10 text-navy-600 dark:text-navy-400 hover:border-primary/40 hover:text-primary'
                }`}
              >
                {opt.label}
                <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${active ? 'bg-white/20 text-white' : 'bg-navy-100 text-navy-500 dark:bg-white/10 dark:text-navy-300'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <DataTable<Professional>
        isLoading={isLoading}
        loadingText="Loading professionals..."
        data={filtered}
        rowKey={(p) => String(p.id ?? '')}
        sortable
        emptyTitle="No professionals found"
        emptyDescription="Add your first professional to get started."
        emptyIcon={<Users className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
        columns={[
          {
            key: 'name',
            header: 'Professional',
            sortValue: (p) => p.name.toLowerCase(),
            render: (p) => {
              const meta = tradeMeta(p.trade);
              return (
                <div className="flex items-center gap-3">
                  <div className={`relative shrink-0 rounded-full bg-gradient-to-br ${meta.ring} p-[2px]`}>
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white dark:bg-navy-800">
                      {p.avatar ? (
                        <img src={p.avatar} alt={p.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-xs font-black text-navy-800 dark:text-white">
                          {initials(p.name)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 truncate font-semibold text-navy-800 dark:text-navy-100">
                      <span className="truncate">{p.name}</span>
                      {p.isVerified && (
                        <BadgeCheck className="w-4 h-4 shrink-0 text-sky-500" />
                      )}
                    </p>
                    {p.companyName && (
                      <p className="truncate text-xs text-navy-400 dark:text-navy-500">
                        {p.companyName}
                      </p>
                    )}
                  </div>
                </div>
              );
            },
          },
          {
            key: 'trade',
            header: 'Trade',
            sortValue: (p) => p.trade ?? '',
            render: (p) => {
              const meta = tradeMeta(p.trade);
              const Icon = meta.icon;
              return (
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.pill}`}>
                  <Icon className="w-3 h-3" />
                  {p.trade || '—'}
                </span>
              );
            },
          },
          {
            key: 'hourlyRate',
            header: 'Rate',
            hideOn: 'sm',
            sortValue: (p) => Number(p.hourlyRate ?? 0),
            render: (p) => (
              <span className="font-bold text-navy-800 dark:text-navy-100">
                £{p.hourlyRate ?? 0}
                <span className="text-[11px] font-medium text-navy-400">/hr</span>
              </span>
            ),
          },
          {
            key: 'location',
            header: 'Location',
            hideOn: 'md',
            render: (p) => (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-navy-500 dark:text-navy-400">
                <MapPin className="w-3 h-3 shrink-0 text-navy-400" />
                {p.location || p.postcodeArea || '—'}
              </span>
            ),
          },
          {
            key: 'availability',
            header: 'Availability',
            hideOn: 'lg',
            sortValue: (p) => p.availability ?? '',
            render: (p) => (
              <StatusBadge
                status={p.availability ?? 'N/A'}
                tone={p.availability === 'Available Today' ? 'success' : p.availability === 'Available Tomorrow' ? 'info' : 'neutral'}
                pulse={p.availability === 'Available Today'}
              />
            ),
          },
          {
            key: 'rating',
            header: 'Rating',
            hideOn: 'lg',
            sortValue: (p) => Number(p.rating ?? 0),
            render: (p) =>
              p.rating != null ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-700 dark:text-navy-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {Number(p.rating).toFixed(1)}
                  <span className="font-normal text-navy-400">
                    ({p.reviewCount ?? 0})
                  </span>
                </span>
              ) : (
                <span className="text-xs text-navy-400 dark:text-navy-500">—</span>
              ),
          },
        ]}
        actions={(pro) => (
          <RowActions
            actions={[
              editAction(() => openEdit(pro)),
              deleteAction(() => setDeleteTarget(pro)),
            ]}
          />
        )}
      />

      {/* Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${editing.name}` : 'Edit Professional'}
        description="Profiles shown to customers searching for local tradespeople."
        size="lg"
        icon={<UserRound className="w-5 h-5" />}
        footer={
          <>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              disabled={saving}
              className="px-4 py-2 rounded-full bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 text-sm font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={saving}
              aria-label="Save changes"
              title="Save changes"
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> :  <Check className="w-4 h-4" />}
              save changes
            </button>
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-4">
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
              error={errors.trade?.message}
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
              onChange={(v) => {
                const val = Array.isArray(v) ? v[0] ?? '' : v;
                setValue('avatar', val, { shouldValidate: true, shouldDirty: true });
              }}
              folder="avatars"
            />
            <ImageUpload
              label="Portfolio images"
              value={portfolioImages}
              onChange={(v) => {
                const val = Array.isArray(v) ? v : v ? [v] : [];
                setValue('portfolioImages', val, { shouldValidate: true, shouldDirty: true });
              }}
              folder="portfolios"
              multiple
              maxFiles={10}
            />
          </div>
        </form>
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