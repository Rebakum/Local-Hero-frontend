import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Search, Loader2, AlertCircle, CreditCard } from 'lucide-react';
import {
  DataTable,
  Modal,
  PageHeader,
  Input,
  Select,
} from '../../../../Components/ui';
import { Badge } from '../../../../Components/ui/shared/Badge';
import {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  type ProviderSubscription,
  type SubscriptionPlan,
  type SubscriptionStatus,
} from '../../../../services/subscription.service';
import { getProfessionalsAdmin } from '../../../../services/content.service';
import type { Professional } from '../../../../types';

interface SubscriptionFormValues {
  professionalId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  price: string;
  expiresAt: string;
  isFeatured: string;
  featureStartAt: string;
  featureEndAt: string;
}

const PLAN_OPTIONS: { value: SubscriptionPlan; label: string }[] = [
  { value: 'FREE', label: 'Free' },
  { value: 'PREMIUM', label: 'Premium' },
  { value: 'FEATURED', label: 'Featured' },
];

const STATUS_OPTIONS: { value: SubscriptionStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const toDateInput = (value?: string | null) =>
  value ? value.slice(0, 10) : '';

const formatGBP = (pence: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100);

const SubscriptionsManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<ProviderSubscription[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProviderSubscription | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SubscriptionFormValues>();

  const professionalOptions = professionals.map((p) => ({
    value: p.id || '',
    label: `${p.name}${p.companyName ? ` — ${p.companyName}` : ''} (${p.trade})`,
  }));

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [res, pros] = await Promise.all([
        getAllSubscriptions({ page: 1, limit: 100 }),
        getProfessionalsAdmin(),
      ]);
      setSubscriptions(res.subscriptions || []);
      setProfessionals(pros || []);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to load subscriptions.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return subscriptions;
    return subscriptions.filter((s) =>
      [s.professional?.name, s.professional?.companyName, s.professional?.trade, s.plan, s.status]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q)),
    );
  }, [subscriptions, searchQuery]);

  const openCreate = () => {
    setEditing(null);
    reset({
      professionalId: '',
      plan: 'FREE',
      status: 'ACTIVE',
      price: '',
      expiresAt: '',
      isFeatured: 'false',
      featureStartAt: '',
      featureEndAt: '',
    });
    setModalOpen(true);
  };

  const openEdit = (sub: ProviderSubscription) => {
    setEditing(sub);
    reset({
      professionalId: sub.professionalId,
      plan: sub.plan,
      status: sub.status,
      price: sub.priceInPence ? String(sub.priceInPence / 100) : '',
      expiresAt: toDateInput(sub.expiresAt),
      isFeatured: sub.isFeatured ? 'true' : 'false',
      featureStartAt: toDateInput(sub.featureStartAt),
      featureEndAt: toDateInput(sub.featureEndAt),
    });
    setModalOpen(true);
  };

  const isFeatured = watch('isFeatured');

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true);
    setError(null);
    try {
      const priceInPence = values.price ? Math.round(parseFloat(values.price) * 100) : 0;
      const dateToPayload = (val: string) => (val ? new Date(val).toISOString() : undefined);

      if (editing) {
        await updateSubscription(editing.id, {
          plan: values.plan,
          status: values.status,
          priceInPence,
          expiresAt: dateToPayload(values.expiresAt) ?? null,
          isFeatured: values.isFeatured === 'true',
          featureStartAt: dateToPayload(values.featureStartAt) ?? null,
          featureEndAt: dateToPayload(values.featureEndAt) ?? null,
        });
      } else {
        await createSubscription({
          professionalId: values.professionalId,
          plan: values.plan,
          priceInPence,
          expiresAt: dateToPayload(values.expiresAt),
          isFeatured: values.isFeatured === 'true',
          featureStartAt: dateToPayload(values.featureStartAt),
          featureEndAt: dateToPayload(values.featureEndAt),
        });
      }
      setModalOpen(false);
      await load();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to save subscription.');
    } finally {
      setSaving(false);
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Panel"
        title="Subscriptions Management"
        description="Create, upgrade and manage provider subscription plans."
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Subscription
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
          {filtered.length} {filtered.length === 1 ? 'subscription' : 'subscriptions'}
        </p>
        <div className="relative sm:ml-auto w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-lh pl-9 h-10 text-sm"
          />
        </div>
      </div>

      <DataTable<ProviderSubscription>
        isLoading={isLoading}
        loadingText="Loading subscriptions..."
        data={filtered}
        rowKey={(s) => s.id}
        sortable
        filters={[
          {
            key: 'plan',
            label: 'Plan',
            options: [
              { value: 'BASIC', label: 'Basic' },
              { value: 'PREMIUM', label: 'Premium' },
              { value: 'FEATURED', label: 'Featured' },
            ],
          },
          {
            key: 'status',
            label: 'Status',
            options: [
              { value: 'ACTIVE', label: 'Active' },
              { value: 'EXPIRED', label: 'Expired' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ],
          },
        ]}
        emptyTitle="No subscriptions found"
        emptyDescription="Create your first subscription to get started."
        emptyIcon={<CreditCard className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
        columns={[
          {
            key: 'professional',
            header: 'Professional',
            render: (s) => (
              <div>
                <p className="font-semibold text-navy-800 dark:text-navy-200">
                  {s.professional?.name ?? '—'}
                </p>
                <p className="text-[11px] text-navy-400 dark:text-navy-500 truncate max-w-[180px]">
                  {s.professional?.companyName || s.professional?.trade || '—'}
                </p>
              </div>
            ),
          },
          {
            key: 'plan',
            header: 'Plan',
            render: (s) => (
              <Badge variant={s.plan === 'FEATURED' ? 'warning' : s.plan === 'PREMIUM' ? 'success' : 'neutral'}>
                {s.plan}
              </Badge>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            hideOn: 'sm',
            render: (s) => (
              <Badge variant={s.status === 'ACTIVE' ? 'success' : s.status === 'EXPIRED' ? 'warning' : 'neutral'}>
                {s.status}
              </Badge>
            ),
          },
          {
            key: 'priceInPence',
            header: 'Price',
            hideOn: 'sm',
            render: (s) => (
              <span className="font-semibold text-navy-700 dark:text-navy-200">
                {formatGBP(s.priceInPence)}
              </span>
            ),
          },
          {
            key: 'expiresAt',
            header: 'Expires',
            hideOn: 'md',
            render: (s) => (
              <span className="text-navy-500 dark:text-navy-400">
                {s.expiresAt
                  ? new Date(s.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '—'}
              </span>
            ),
          },
        ]}
        actions={(sub) => (
          <button
            onClick={() => openEdit(sub)}
            title="Edit"
            className="w-8 h-8 rounded-full flex items-center justify-center text-navy-500 dark:text-navy-400 border border-navy-200 dark:border-white/10 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Pencil className="w-3.5 3" />
          </button>
        )}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${editing.professional?.name ?? 'Subscription'}` : 'New Subscription'}
        description="Assign a plan to a professional or update an existing one."
        size="lg"
        icon={<CreditCard className="w-5 h-5" />}
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
              {editing ? 'Save changes' : 'Create subscription'}
            </button>
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Professional"
              required
              disabled={!!editing}
              options={professionalOptions}
              placeholder="Select a professional"
              error={errors.professionalId?.message}
              {...register('professionalId', { required: 'Professional is required' })}
            />
            <Select
              label="Plan"
              required
              options={PLAN_OPTIONS}
              {...register('plan', { required: 'Plan is required' })}
            />
            <Select
              label="Status"
              required
              options={STATUS_OPTIONS}
              {...register('status', { required: 'Status is required' })}
            />
            <Input
              label="Price (£/month)"
              type="number"
              step="0.01"
              placeholder="e.g. 29.99"
              {...register('price')}
            />
            <Input label="Expires" type="date" {...register('expiresAt')} />
            <Select
              label="Featured"
              options={[
                { value: 'false', label: 'No' },
                { value: 'true', label: 'Yes' },
              ]}
              {...register('isFeatured')}
            />
            {isFeatured === 'true' && (
              <>
                <Input label="Featured from" type="date" {...register('featureStartAt')} />
                <Input label="Featured until" type="date" {...register('featureEndAt')} />
              </>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubscriptionsManagement;
