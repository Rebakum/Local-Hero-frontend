import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Layers, Search, Loader2, AlertCircle } from 'lucide-react';
import {
  DataTable,
  Modal,
  ConfirmDialog,
  PageHeader,
  Input,
  Select,
  Textarea,
} from '../../../../Components/ui';
import { Badge } from '../../../../Components/ui/shared/Badge';
import {
  getProfessionsAdmin,
  createProfession,
  updateProfession,
  deleteProfession,
  getTradesAdmin,
  type ProfessionInput,
} from '../../../../services/content.service';
import type { Profession, Trade } from '../../../../types';

interface ProfessionFormValues {
  name: string;
  trade: string;
  description: string;
  sortOrder: string;
  isActive: string;
}

const defaultFormValues: ProfessionFormValues = {
  name: '',
  trade: '',
  description: '',
  sortOrder: '',
  isActive: 'true',
};

const toFormValues = (profession: Profession | null): ProfessionFormValues => ({
  name: profession?.name ?? '',
  trade: profession?.trade?.category ?? '',
  description: profession?.description ?? '',
  sortOrder: profession?.sortOrder != null ? String(profession.sortOrder) : '',
  isActive: profession?.isActive == null || profession.isActive ? 'true' : 'false',
});

const toPayload = (values: ProfessionFormValues): ProfessionInput => ({
  name: values.name.trim(),
  trade: values.trade,
  description: values.description.trim() || undefined,
  sortOrder: values.sortOrder ? Number(values.sortOrder) : undefined,
  isActive: values.isActive === 'true',
});

const ProfessionsManagement: React.FC = () => {
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Profession | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Profession | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfessionFormValues>({ defaultValues: defaultFormValues });

  const tradeOptions = trades.map((t) => ({ value: t.category, label: t.category }));

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [pros, trs] = await Promise.all([
        getProfessionsAdmin({ page: 1, limit: 100 }),
        getTradesAdmin(),
      ]);
      setProfessions(pros || []);
      setTrades(trs || []);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to load professions.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return professions;
    return professions.filter((p) =>
      [p.name, p.description, p.trade?.category]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q)),
    );
  }, [professions, searchQuery]);

  const openCreate = () => {
    setEditing(null);
    reset(defaultFormValues);
    setModalOpen(true);
  };

  const openEdit = (profession: Profession) => {
    setEditing(profession);
    reset(toFormValues(profession));
    setModalOpen(true);
  };

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true);
    setError(null);
    try {
      const payload = toPayload(values);
      if (editing) {
        await updateProfession(editing.id, payload);
      } else {
        await createProfession(payload);
      }
      setModalOpen(false);
      await load();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to save profession.');
    } finally {
      setSaving(false);
    }
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteProfession(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to delete profession.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Panel"
        title="Professions Management"
        description="Manage the sub-professions under each trade (e.g. Boiler Installer under Plumber)."
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Profession
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
          {filtered.length} {filtered.length === 1 ? 'profession' : 'professions'}
        </p>
        <div className="relative sm:ml-auto w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search professions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-lh pl-9 h-10 text-sm"
          />
        </div>
      </div>

      <DataTable<Profession>
        isLoading={isLoading}
        loadingText="Loading professions..."
        data={filtered}
        rowKey={(p) => p.id}
        emptyTitle="No professions found"
        emptyDescription="Add your first profession to get started."
        emptyIcon={<Layers className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
        columns={[
          {
            key: 'name',
            header: 'Profession',
            render: (p) => (
              <div>
                <p className="font-semibold text-navy-800 dark:text-navy-200">{p.name}</p>
                {p.description && (
                  <p className="text-[11px] text-navy-400 dark:text-navy-500 truncate max-w-[220px]">
                    {p.description}
                  </p>
                )}
              </div>
            ),
          },
          {
            key: 'trade',
            header: 'Trade',
            render: (p) => (
              <span className="text-navy-600 dark:text-navy-300">{p.trade?.category ?? '—'}</span>
            ),
          },
          {
            key: 'isActive',
            header: 'Status',
            hideOn: 'sm',
            render: (p) => (
              <Badge variant={p.isActive === false ? 'neutral' : 'success'}>
                {p.isActive === false ? 'Inactive' : 'Active'}
              </Badge>
            ),
          },
          {
            key: 'sortOrder',
            header: 'Sort',
            hideOn: 'md',
            render: (p) => <span className="text-navy-600 dark:text-navy-300">{p.sortOrder ?? 0}</span>,
          },
        ]}
        actions={(profession) => (
          <>
            <button
              onClick={() => openEdit(profession)}
              title="Edit"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-500 dark:text-navy-400 border border-navy-200 dark:border-white/10 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeleteTarget(profession)}
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
        title={editing ? `Edit ${editing.name}` : 'New Profession'}
        description="A profession is a specific trade skill under a category."
        size="lg"
        icon={<Layers className="w-5 h-5" />}
        footer={
          <>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 text-sm font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? 'Save changes' : 'Create profession'}
            </button>
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Profession name"
              required
              placeholder="e.g. Boiler Installer"
              error={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
            />
            <Select
              label="Trade"
              required
              options={tradeOptions}
              placeholder="Select a trade"
              error={errors.trade?.message}
              {...register('trade', { required: 'Trade is required' })}
            />
            <Select
              label="Status"
              options={[
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
              ]}
              {...register('isActive')}
            />
            <Input
              label="Sort order"
              type="number"
              placeholder="e.g. 0"
              {...register('sortOrder')}
            />
          </div>
          <Textarea
            label="Description"
            placeholder="Short description of this profession"
            className="mt-4"
            {...register('description')}
          />
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete profession?"
        description={`This will permanently remove "${deleteTarget?.name}". This action cannot be undone.`}
        confirmLabel="Delete profession"
      />
    </div>
  );
};

export default ProfessionsManagement;
