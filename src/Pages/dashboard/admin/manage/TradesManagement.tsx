import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Wrench, Search, Loader2, AlertCircle, Layers } from 'lucide-react';
import {
  DataTable,
  Modal,
  ConfirmDialog,
  ImageUpload,
  PageHeader,
  Input,
  Textarea,
} from '../../../../Components/ui';
import { Badge } from '../../../../Components/ui/shared/Badge';
import {
  getTradesAdmin,
  createTrade,
  updateTrade,
  deleteTrade,
  type TradeInput,
} from '../../../../services/content.service';
import type { Trade } from '../../../../types';

interface TradeFormValues {
  category: string;
  subtitle: string;
  iconName: string;
  description: string;
  avgHourlyRate: string;
  startingPrice: string;
  activeProsCount: string;
  popularTasks: string;
  badge: string;
  featuredTitle: string;
  featuredPrice: string;
  featuredTime: string;
  featuredDescription: string;
  featuredImage: string;
}

const defaultFormValues: TradeFormValues = {
  category: '',
  subtitle: '',
  iconName: '',
  description: '',
  avgHourlyRate: '',
  startingPrice: '',
  activeProsCount: '',
  popularTasks: '',
  badge: '',
  featuredTitle: '',
  featuredPrice: '',
  featuredTime: '',
  featuredDescription: '',
  featuredImage: '',
};

const toFormValues = (trade: Trade): TradeFormValues => ({
  category: trade.category ?? trade.id ?? '',
  subtitle: trade.subtitle ?? '',
  iconName: trade.iconName ?? '',
  description: trade.description ?? '',
  avgHourlyRate: trade.avgHourlyRate ?? '',
  startingPrice: trade.startingPrice ?? '',
  activeProsCount: trade.activeProsCount != null ? String(trade.activeProsCount) : '',
  popularTasks: (trade.popularTasks ?? []).join(', '),
  badge: trade.badge ?? '',
  featuredTitle: trade.featuredService?.title ?? '',
  featuredPrice: trade.featuredService?.estimatedPrice ?? '',
  featuredTime: trade.featuredService?.timeEstimate ?? '',
  featuredDescription: trade.featuredService?.description ?? '',
  featuredImage: trade.featuredService?.image ?? '',
});

const toPayload = (values: TradeFormValues, original: Trade | null): TradeInput => {
  const featuredTitle = values.featuredTitle.trim() || original?.featuredService?.title || values.category.trim();

  return {
    category: values.category.trim(),
    subtitle: values.subtitle.trim() || undefined,
    iconName: values.iconName.trim() || undefined,
    description: values.description.trim() || undefined,
    avgHourlyRate: values.avgHourlyRate.trim() || undefined,
    startingPrice: values.startingPrice.trim() || undefined,
    activeProsCount: values.activeProsCount ? Number(values.activeProsCount) : undefined,
    popularTasks: values.popularTasks
      ? values.popularTasks
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    badge: values.badge.trim() || undefined,
    featuredService: {
      title: featuredTitle,
      estimatedPrice: values.featuredPrice.trim() || undefined,
      timeEstimate: values.featuredTime.trim() || undefined,
      description: values.featuredDescription.trim() || undefined,
      included: original?.featuredService?.included ?? [],
      icon: original?.featuredService?.icon ?? undefined,
      image: values.featuredImage || original?.featuredService?.image || undefined,
      isEmergency: original?.featuredService?.isEmergency ?? false,
    },
  };
};

const TradesManagement: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Trade | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Trade | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TradeFormValues>({
    defaultValues: defaultFormValues,
  });

  const featuredImage = watch('featuredImage');

  const loadTrades = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTradesAdmin();
      setTrades(data || []);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to load trades.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrades();
  }, [loadTrades]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return trades;
    return trades.filter((t) =>
      [t.category, t.subtitle, t.description, t.id]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q)),
    );
  }, [trades, searchQuery]);

  const openCreate = () => {
    setEditing(null);
    reset(defaultFormValues);
    setModalOpen(true);
  };

  const openEdit = (trade: Trade) => {
    setEditing(trade);
    reset(toFormValues(trade));
    setModalOpen(true);
  };

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true);
    setError(null);
    try {
      const payload = toPayload(values, editing);
      if (editing) {
        await updateTrade(editing.id, payload);
      } else {
        await createTrade(payload);
      }
      setModalOpen(false);
      await loadTrades();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to save trade.');
    } finally {
      setSaving(false);
    }
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteTrade(deleteTarget.id);
      setTrades((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to delete trade.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Panel"
        title="Trades Management"
        description="Create, edit and remove service trades shown across the platform."
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Trade
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
          {filtered.length} {filtered.length === 1 ? 'trade' : 'trades'}
        </p>
        <div className="relative sm:ml-auto w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search trades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-lh pl-9 h-10 text-sm"
          />
        </div>
      </div>

      <DataTable<Trade>
        isLoading={isLoading}
        loadingText="Loading trades..."
        data={filtered}
        rowKey={(t) => t.id}
        sortable
        searchable
        searchPlaceholder="Search trades..."
        emptyTitle="No trades found"
        emptyDescription="Create your first trade to get started."
        emptyIcon={<Layers className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
        columns={[
          {
            key: 'category',
            header: 'Trade',
            render: (t) => (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-navy-800 dark:text-navy-200">
                    {t.category ?? t.id}
                  </p>
                  {t.subtitle && (
                    <p className="text-[11px] text-navy-400 dark:text-navy-500">{t.subtitle}</p>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: 'avgHourlyRate',
            header: 'Rate',
            hideOn: 'sm',
            render: (t) => (
              <span className="text-navy-600 dark:text-navy-300">{t.avgHourlyRate || '—'}</span>
            ),
          },
          {
            key: 'popularTasks',
            header: 'Popular Tasks',
            hideOn: 'md',
            render: (t) => (
              <div className="flex flex-wrap gap-1.5 max-w-xs">
                {(t.popularTasks ?? []).slice(0, 3).map((task) => (
                  <span
                    key={task}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400"
                  >
                    {task}
                  </span>
                ))}
                {(t.popularTasks ?? []).length > 3 && (
                  <span className="text-[11px] text-navy-400">+{(t.popularTasks ?? []).length - 3}</span>
                )}
              </div>
            ),
          },
          {
            key: 'activeProsCount',
            header: 'Active Pros',
            hideOn: 'md',
            render: (t) => (
              <span className="text-navy-600 dark:text-navy-300">
                {t.activeProsCount != null ? t.activeProsCount.toLocaleString() : '—'}
              </span>
            ),
          },
          {
            key: 'badge',
            header: 'Badge',
            hideOn: 'lg',
            render: (t) =>
              t.badge ? (
                <Badge variant="warning">{t.badge}</Badge>
              ) : (
                <span className="text-xs text-navy-300 dark:text-navy-600">—</span>
              ),
          },
        ]}
        actions={(trade) => (
          <>
            <button
              onClick={() => openEdit(trade)}
              title="Edit"
              className="w-8 h-8 rounded-full flex items-center justify-center text-navy-500 dark:text-navy-400 border border-navy-200 dark:border-white/10 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Pencil className="w-3.5 3" />
            </button>
            <button
              onClick={() => setDeleteTarget(trade)}
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
        title={editing ? `Edit ${editing.category ?? 'Trade'}` : 'New Trade'}
        description="Trades are the service categories customers can book."
        size="lg"
        icon={<Wrench className="w-5 h-5" />}
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
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? 'Save changes' : 'Create trade'}
            </button>
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Category name"
              required
              placeholder="e.g. Plumber"
              error={errors.category?.message}
              {...register('category', { required: 'Category is required' })}
            />
            <Input
              label="Subtitle"
              placeholder="e.g. Expert Plumbing & Heating"
              {...register('subtitle')}
            />
            <Input
              label="Icon name"
              hint="lucide icon name, e.g. Wrench"
              {...register('iconName')}
            />
            <Input
              label="Avg hourly rate"
              placeholder="e.g. £45 - £75/hr"
              {...register('avgHourlyRate')}
            />
            <Input
              label="Starting price"
              placeholder="e.g. From £85"
              {...register('startingPrice')}
            />
            <Input
              label="Active pros count"
              type="number"
              placeholder="e.g. 1420"
              {...register('activeProsCount')}
            />
            <Input label="Badge" placeholder="e.g. 24/7 Emergency" {...register('badge')} />
          </div>

          <Textarea
            label="Description"
            placeholder="Short description of this trade"
            className="mt-4"
            {...register('description')}
          />

          <Input
            label="Popular tasks"
            hint="Comma separated, e.g. Boiler Servicing, Leak Repair"
            placeholder="Boiler Servicing, Leak Repair"
            className="mt-4"
            {...register('popularTasks')}
          />

          <div className="mt-6 pt-5 border-t border-navy-100 dark:border-white/10">
            <p className="text-xs font-semibold text-navy-700 dark:text-navy-300 uppercase tracking-wider mb-3">
              Featured service
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Service title"
                placeholder="e.g. Emergency Boiler Repair"
                {...register('featuredTitle')}
              />
              <Input
                label="Estimated price"
                placeholder="e.g. From £85"
                {...register('featuredPrice')}
              />
              <Input
                label="Time estimate"
                placeholder="e.g. 1 - 2 Hours"
                {...register('featuredTime')}
              />
            </div>
            <Textarea
              label="Service description"
              placeholder="Describe this featured service"
              className="mt-4"
              {...register('featuredDescription')}
            />
            <div className="mt-4">
              <ImageUpload
                label="Service image"
                value={featuredImage}
                onChange={(v) => {
                  const url = Array.isArray(v) ? v[0] ?? '' : v;
                  setValue('featuredImage', url, { shouldValidate: true, shouldDirty: true });
                }}
                folder="trades"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete trade?"
        description={`This will permanently remove "${deleteTarget?.category ?? deleteTarget?.id}". This action cannot be undone.`}
        confirmLabel="Delete trade"
      />
    </div>
  );
};

export default TradesManagement;