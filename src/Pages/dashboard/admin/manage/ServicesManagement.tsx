import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Sparkles, Search, Loader2, AlertCircle } from 'lucide-react';
import { RowActions, editAction, deleteAction } from '../../../../Components/dashboard/RowActions';
import {
  DataTable,
  Modal,
  ConfirmDialog,
  ImageUpload,
  PageHeader,
  Input,
  Textarea,
  Select,
} from '../../../../Components/ui';
import { Badge } from '../../../../Components/ui/shared/Badge';
import {
  getFeaturedServices,
  createFeaturedService,
  updateFeaturedService,
  deleteFeaturedService,
  getTradesAdmin,
  type FeaturedServiceInput,
} from '../../../../services/content.service';
import type { FeaturedService, Trade } from '../../../../types';

interface FeaturedServiceFormValues {
  tradeId: string;
  title: string;
  estimatedPrice: string;
  timeEstimate: string;
  popularFor: string;
  description: string;
  imageUrl: string;
  sortOrder: string;
  isActive: boolean;
}

const defaultFormValues: FeaturedServiceFormValues = {
  tradeId: '',
  title: '',
  estimatedPrice: '',
  timeEstimate: '',
  popularFor: '',
  description: '',
  imageUrl: '',
  sortOrder: '0',
  isActive: true,
};

const splitList = (value: string): string[] =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const toFormValues = (service: FeaturedService): FeaturedServiceFormValues => ({
  tradeId: service.tradeId,
  title: service.title ?? '',
  estimatedPrice: service.estimatedPrice ?? '',
  timeEstimate: service.timeEstimate ?? '',
  popularFor: (service.popularFor ?? []).join(', '),
  description: service.description ?? '',
  imageUrl: service.imageUrl ?? '',
  sortOrder: String(service.sortOrder ?? 0),
  isActive: service.isActive,
});

const toPayload = (values: FeaturedServiceFormValues): FeaturedServiceInput => ({
  tradeId: values.tradeId,
  title: values.title.trim(),
  estimatedPrice: values.estimatedPrice.trim() || undefined,
  timeEstimate: values.timeEstimate.trim() || undefined,
  popularFor: splitList(values.popularFor),
  description: values.description.trim(),
  imageUrl: values.imageUrl || null,
  sortOrder: values.sortOrder.trim() ? Number(values.sortOrder) : 0,
  isActive: values.isActive,
});

const ServicesManagement: React.FC = () => {
  const [services, setServices] = useState<FeaturedService[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tradeFilter, setTradeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FeaturedService | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<FeaturedService | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FeaturedServiceFormValues>({
    defaultValues: defaultFormValues,
  });

  const serviceImage = watch('imageUrl');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [data, tradesData] = await Promise.all([
        getFeaturedServices({ limit: 500 }),
        getTradesAdmin(),
      ]);
      setServices(data || []);
      setTrades(tradesData || []);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to load services.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    let list = services;
    if (tradeFilter) {
      list = list.filter((s) => s.tradeId === tradeFilter);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((s) =>
        [s.title, s.description, s.estimatedPrice, s.timeEstimate]
          .filter(Boolean)
          .some((v) => (v as string).toLowerCase().includes(q)),
      );
    }
    return list;
  }, [services, tradeFilter, searchQuery]);

  const openCreate = () => {
    setEditing(null);
    reset(defaultFormValues);
    setModalOpen(true);
  };

  const openEdit = (service: FeaturedService) => {
    setEditing(service);
    reset(toFormValues(service));
    setModalOpen(true);
  };

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true);
    setError(null);
    try {
      const payload = toPayload(values);
      if (editing) {
        await updateFeaturedService(editing.id, payload);
      } else {
        await createFeaturedService(payload);
      }
      setModalOpen(false);
      await load();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteFeaturedService(deleteTarget.id);
      setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to delete service.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const tradeLabel = (tradeId: string) => trades.find((t) => t.id === tradeId)?.category ?? '—';

  const tradeOptions = trades.map((t) => ({ value: t.id, label: t.category }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Panel"
        title="Featured Services"
        description="Create and manage the services shown under each trade."
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Service
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
          {filtered.length} {filtered.length === 1 ? 'service' : 'services'}
        </p>
        <div className="relative sm:ml-auto w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-lh pl-9 h-10 text-sm"
          />
        </div>
        <div className="relative w-full sm:w-56">
          <select
            value={tradeFilter}
            onChange={(e) => setTradeFilter(e.target.value)}
            className="input-lh h-10 text-sm appearance-none pr-8"
          >
            <option value="">All trades</option>
            {trades.map((t) => (
              <option key={t.id} value={t.id}>{t.category}</option>
            ))}
          </select>
        </div>
      </div>

      <DataTable<FeaturedService>
        isLoading={isLoading}
        loadingText="Loading services..."
        data={filtered}
        rowKey={(s) => s.id}
        sortable
        searchable
        searchPlaceholder="Search services..."
        emptyTitle="No services found"
        emptyDescription="Create your first featured service to get started."
        emptyIcon={<Sparkles className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
        columns={[
          {
            key: 'title',
            header: 'Service',
            render: (s) => (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-navy-100 dark:bg-white/5 shrink-0">
                  {s.imageUrl ? (
                    <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-navy-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <p className="font-semibold text-navy-800 dark:text-navy-200">{s.title}</p>
              </div>
            ),
          },
          {
            key: 'trade',
            header: 'Trade',
            render: (s) => <span className="text-navy-600 dark:text-navy-300">{tradeLabel(s.tradeId)}</span>,
          },
          {
            key: 'estimatedPrice',
            header: 'Price',
            hideOn: 'sm',
            render: (s) => <span className="text-navy-600 dark:text-navy-300">{s.estimatedPrice || '—'}</span>,
          },
          {
            key: 'timeEstimate',
            header: 'Time',
            hideOn: 'md',
            render: (s) => <span className="text-navy-600 dark:text-navy-300">{s.timeEstimate || '—'}</span>,
          },
          {
            key: 'isActive',
            header: 'Status',
            hideOn: 'lg',
            render: (s) =>
              s.isActive ? (
                <Badge variant="success">Active</Badge>
              ) : (
                <Badge variant="neutral">Inactive</Badge>
              ),
          },
        ]}
        actions={(service) => (
          <RowActions
            actions={[
              editAction(() => openEdit(service)),
              deleteAction(() => setDeleteTarget(service)),
            ]}
          />
        )}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${editing.title}` : 'New Featured Service'}
        description="Services belong to a trade and are shown to customers."
        size="lg"
        icon={<Sparkles className="w-5 h-5" />}
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
              {editing ? 'Save changes' : 'Create service'}
            </button>
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-700 dark:text-navy-300 mb-1.5">
                Trade *
              </label>
              <Select
                error={errors.tradeId?.message}
                placeholder="Select trade..."
                options={tradeOptions}
                {...register('tradeId', { required: 'Trade is required' })}
              />
            </div>
            <Input
              label="Service title"
              required
              placeholder="e.g. Emergency Plumbing"
              error={errors.title?.message}
              {...register('title', { required: 'Service title is required' })}
            />
            <Input
              label="Estimated price"
              placeholder="e.g. From £90"
              {...register('estimatedPrice')}
            />
            <Input
              label="Time estimate"
              placeholder="e.g. 1–2 hours"
              {...register('timeEstimate')}
            />
            <Input
              label="Popular for"
              hint="Comma separated, e.g. Burst Pipes, Major Leaks"
              placeholder="Burst Pipes, Major Leaks"
              {...register('popularFor')}
            />
            <Input
              label="Sort order"
              type="number"
              placeholder="e.g. 0"
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

          <Textarea
            label="Service description"
            required
            placeholder="Describe this service"
            error={errors.description?.message}
            className="mt-4"
            {...register('description', { required: 'Service description is required' })}
          />

          <div className="mt-4">
            <ImageUpload
              label="Service image"
              value={serviceImage}
              onChange={(v) => {
                const url = Array.isArray(v) ? v[0] ?? '' : v;
                setValue('imageUrl', url, { shouldValidate: true, shouldDirty: true });
              }}
              folder="trades"
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
        title="Delete service?"
        description={`This will permanently remove "${deleteTarget?.title}". This action cannot be undone.`}
        confirmLabel="Delete service"
      />
    </div>
  );
};

export default ServicesManagement;