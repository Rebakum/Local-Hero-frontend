import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Search, Loader2, AlertCircle, Images } from 'lucide-react';
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
  getBeforeAfterAdmin,
  createBeforeAfter,
  updateBeforeAfter,
  deleteBeforeAfter,
  type BeforeAfterInput,
} from '../../../../services/content.service';
import type { BeforeAfterPair } from '../../../../types';

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

interface BeforeAfterFormValues {
  title: string;
  trade: string;
  location: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  cost: string;
  completionDays: string;
}

const toFormValues = (project: BeforeAfterPair | null): BeforeAfterFormValues => ({
  title: project?.title ?? '',
  trade: project?.trade ?? '',
  location: project?.location ?? '',
  beforeImage: project?.beforeImage ?? '',
  afterImage: project?.afterImage ?? '',
  description: project?.description ?? '',
  cost: project?.cost ?? '',
  completionDays: project?.completionDays ?? '',
});

const toPayload = (values: BeforeAfterFormValues): BeforeAfterInput => ({
  title: values.title.trim(),
  trade: values.trade,
  location: values.location.trim() || undefined,
  beforeImage: values.beforeImage || undefined,
  afterImage: values.afterImage || undefined,
  description: values.description.trim() || undefined,
  cost: values.cost.trim() || undefined,
  completionDays: values.completionDays.trim() || undefined,
});

const BeforeAfterManagement: React.FC = () => {
  const [projects, setProjects] = useState<BeforeAfterPair[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BeforeAfterPair | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<BeforeAfterPair | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<BeforeAfterFormValues>({
    defaultValues: toFormValues(null),
  });

  const beforeImage = watch('beforeImage');
  const afterImage = watch('afterImage');

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBeforeAfterAdmin();
      setProjects(data);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to load before/after projects.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) =>
      [p.title, p.trade, p.location, p.description]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q)),
    );
  }, [projects, searchQuery]);

  const openCreate = () => {
    setEditing(null);
    reset(toFormValues(null));
    setModalOpen(true);
  };

  const openEdit = (project: BeforeAfterPair) => {
    setEditing(project);
    reset(toFormValues(project));
    setModalOpen(true);
  };

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true);
    setError(null);
    try {
      const payload = toPayload(values);
      if (editing) {
        await updateBeforeAfter(editing.id, payload);
      } else {
        await createBeforeAfter(payload);
      }
      setModalOpen(false);
      await loadProjects();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteBeforeAfter(deleteTarget.id);
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to delete project.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Panel"
        title="Before & After Management"
        description="Create, edit and remove before/after transformation projects shown across the platform."
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
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
          {filtered.length} {filtered.length === 1 ? 'project' : 'projects'}
        </p>
        <div className="relative sm:ml-auto w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-lh pl-9 h-10 text-sm"
          />
        </div>
      </div>

      <DataTable<BeforeAfterPair>
        isLoading={isLoading}
        loadingText="Loading projects..."
        data={filtered}
        rowKey={(p) => p.id}
        emptyTitle="No before/after projects found"
        emptyDescription="Add your first transformation project to get started."
        emptyIcon={<Images className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
        columns={[
          {
            key: 'title',
            header: 'Project',
            render: (p) => (
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-navy-100 dark:bg-white/5 shrink-0 border border-navy-100 dark:border-white/10">
                  {p.beforeImage && (
                    <img src={p.beforeImage} alt="Before" className="absolute inset-0 w-1/2 h-full object-cover" />
                  )}
                  {p.afterImage && (
                    <img src={p.afterImage} alt="After" className="absolute inset-y-0 right-0 w-1/2 h-full object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-navy-800 dark:text-navy-200 truncate max-w-[220px]">{p.title}</p>
                  <p className="text-[11px] text-navy-400 dark:text-navy-500 truncate max-w-[220px]">{p.location}</p>
                </div>
              </div>
            ),
          },
          {
            key: 'trade',
            header: 'Trade',
            render: (p) => (
              <Badge variant={TRADE_TONES[p.trade] ?? 'neutral'}>{p.trade}</Badge>
            ),
          },
          {
            key: 'cost',
            header: 'Cost',
            hideOn: 'sm',
            render: (p) => (
              <span className="font-semibold text-navy-800 dark:text-navy-200">{p.cost || '—'}</span>
            ),
          },
          {
            key: 'completionDays',
            header: 'Completion',
            hideOn: 'md',
            render: (p) => (
              <span className="text-navy-500 dark:text-navy-400">{p.completionDays || '—'}</span>
            ),
          },
        ]}
        actions={(project) => (
          <>
            <button
              onClick={() => openEdit(project)}
              title="Edit"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-500 dark:text-navy-400 border border-navy-200 dark:border-white/10 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeleteTarget(project)}
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
        title={editing ? `Edit ${editing.title}` : 'New Before/After Project'}
        description="Transformation projects shown in the public Before & After section."
        size="lg"
        icon={<Images className="w-5 h-5" />}
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
              {editing ? 'Save changes' : 'Create project'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Project title"
            required
            placeholder="e.g. Victorian Terraced Kitchen Refit"
            error={errors.title?.message}
            {...register('title', { required: 'Title is required' })}
          />
          <Select
            label="Trade"
            required
            options={TRADE_OPTIONS}
            placeholder="Select a trade"
            {...register('trade', { required: 'Trade is required' })}
          />
          <Input label="Location" placeholder="e.g. Fulham, London" {...register('location')} />
          <Input label="Cost" placeholder="e.g. £1,850" {...register('cost')} />
          <Input label="Completion time" placeholder="e.g. 3 Days" {...register('completionDays')} />
        </div>

        <Textarea label="Description" placeholder="Short description of the transformation" className="mt-4" {...register('description')} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-navy-100 dark:border-white/10">
          <ImageUpload
            label="Before image"
            value={beforeImage}
            onChange={(v) => setValue('beforeImage', Array.isArray(v) ? v[0] ?? '' : v)}
            folder="before-after"
          />
          <ImageUpload
            label="After image"
            value={afterImage}
            onChange={(v) => setValue('afterImage', Array.isArray(v) ? v[0] ?? '' : v)}
            folder="before-after"
          />
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete project?"
        description={`This will permanently remove "${deleteTarget?.title}". This action cannot be undone.`}
        confirmLabel="Delete project"
      />
    </div>
  );
};

export default BeforeAfterManagement;
