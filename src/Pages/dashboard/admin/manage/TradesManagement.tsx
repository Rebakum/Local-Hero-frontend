import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Wrench, Search, Loader2, AlertCircle, Layers } from 'lucide-react';
import { RowActions, editAction, deleteAction } from '../../../../Components/dashboard/RowActions';
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
import {
  defaultTradeFormValues as defaultFormValues,
  parseCsvList,
  tradeFormResolver,
  type TradeFormValues,
} from '../../../../lib/tradeSchema';

const toFormValues = (trade: Trade): TradeFormValues => ({
  category: trade.category ?? trade.id ?? '',
  subtitle: trade.subtitle ?? '',
  iconUrl: trade.iconUrl ?? '',
  description: trade.description ?? '',
  avgHourlyRate: trade.avgHourlyRate ?? '',
  startingPrice: trade.startingPrice ?? '',
  popularTasks: (trade.popularTasks ?? []).join(', '),
  badge: trade.badge ?? '',
  sortOrder: String(trade.sortOrder ?? 0),
  isActive: trade.isActive,
});

const toPayload = (values: TradeFormValues, original: Trade | null): TradeInput => {
  const base: TradeInput = {
    category: values.category.trim(),
    subtitle: values.subtitle.trim() || undefined,
    iconUrl: values.iconUrl || null,
    description: values.description.trim() || undefined,
    avgHourlyRate: values.avgHourlyRate.trim() || undefined,
    startingPrice: values.startingPrice.trim() || undefined,
    popularTasks: parseCsvList(values.popularTasks),
    badge: values.badge.trim() || undefined,
    sortOrder: values.sortOrder.trim() ? Number(values.sortOrder) : (original?.sortOrder ?? 0),
    isActive: values.isActive,
  };

  return base;
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
    resolver: tradeFormResolver,
  });

  const tradeIcon = watch('iconUrl');

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
          <RowActions
            actions={[
              editAction(() => openEdit(trade)),
              deleteAction(() => setDeleteTarget(trade)),
            ]}
          />
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
              label="Avg hourly rate"
              required
              placeholder="e.g. £45 - £75/hr"
              error={errors.avgHourlyRate?.message}
              {...register('avgHourlyRate')}
            />
            <Input
              label="Starting price"
              placeholder="e.g. From £85"
              {...register('startingPrice')}
            />
            <div>
              <span className="block text-xs font-semibold text-navy-700 dark:text-navy-300">
                Active pros count
              </span>
              <div className="mt-1.5 h-10 px-3.5 rounded-xl bg-navy-50 dark:bg-white/5 border border-navy-100 dark:border-white/10 text-sm font-semibold text-navy-500 dark:text-navy-400 flex items-center">
                {editing ? (editing.activeProsCount ?? 0).toLocaleString() : 0}
              </div>
              <p className="text-xs text-navy-400 dark:text-navy-500 mt-1.5">
                Read-only — auto-synced from approved professionals.
              </p>
            </div>
            <Input label="Badge" placeholder="e.g. 24/7 Emergency" {...register('badge')} />
            <Input
              label="Sort order"
              type="number"
              placeholder="e.g. 0"
              error={errors.sortOrder?.message}
              {...register('sortOrder')}
            />
            <label className="flex items-center gap-2.5 text-sm font-semibold text-navy-700 dark:text-navy-300">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-navy-300 text-primary focus:ring-primary/30"
                {...register('isActive')}
              />
              Active
            </label>
          </div>

          <div className="mt-4">
            <ImageUpload
              label="Trade icon / image"
              value={tradeIcon}
              onChange={(v) => {
                const url = Array.isArray(v) ? v[0] ?? '' : v;
                setValue('iconUrl', url, { shouldValidate: true, shouldDirty: true });
              }}
              folder="trades"
            />
          </div>

          <Textarea
            label="Description"
            required
            placeholder="Short description of this trade"
            error={errors.description?.message}
            className="mt-4"
            {...register('description')}
          />

          <Input
            label="Popular tasks"
            required
            hint="Comma separated, e.g. Boiler Servicing, Leak Repair"
            placeholder="Boiler Servicing, Leak Repair"
            error={errors.popularTasks?.message}
            className="mt-4"
            {...register('popularTasks')}
          />
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