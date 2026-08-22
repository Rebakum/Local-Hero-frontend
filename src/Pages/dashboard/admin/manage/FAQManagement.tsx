import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, HelpCircle, Loader2, AlertCircle } from 'lucide-react';
import { RowActions, editAction, deleteAction } from '../../../../Components/dashboard/RowActions';
import {
  DataTable,
  Modal,
  ConfirmDialog,
  PageHeader,
  Input,
  Textarea,
  Select,
} from '../../../../Components/ui';
import { Badge } from '../../../../Components/ui/shared/Badge';
import {
  getFAQsAdmin,
  createFaqApi,
  updateFaqApi,
  deleteFaqApi,
} from '../../../../services/api';
import type { FAQItem } from '../../../../types';

const CATEGORY_OPTIONS = [
  { value: 'General', label: 'General' },
  { value: 'Booking', label: 'Booking' },
  { value: 'Pricing', label: 'Pricing' },
  { value: 'Pros & Vetting', label: 'Pros & Vetting' },
  { value: 'Emergency', label: 'Emergency' },
];

interface FaqFormValues {
  question: string;
  answer: string;
  category: string;
  sortOrder: string;
  isActive: boolean;
}

const defaultFormValues: FaqFormValues = {
  question: '',
  answer: '',
  category: 'General',
  sortOrder: '0',
  isActive: true,
};

const toFormValues = (faq: FAQItem): FaqFormValues => ({
  question: faq.question,
  answer: faq.answer,
  category: faq.category ?? 'General',
  sortOrder: String(faq.sortOrder ?? 0),
  isActive: faq.isActive ?? true,
});

const FAQManagement: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<FAQItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FaqFormValues>({
    defaultValues: defaultFormValues,
  });

  const loadFaqs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getFAQsAdmin({ page: 1, limit: 500 });
      setFaqs(result.faqs || []);
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      setError(apiError.message || 'Failed to load FAQs.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  const openCreate = () => {
    setEditing(null);
    reset(defaultFormValues);
    setModalOpen(true);
  };

  const openEdit = (faq: FAQItem) => {
    setEditing(faq);
    reset(toFormValues(faq));
    setModalOpen(true);
  };

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        question: values.question.trim(),
        answer: values.answer.trim(),
        category: values.category.trim() || null,
        sortOrder: values.sortOrder.trim() ? Number(values.sortOrder) : 0,
        isActive: values.isActive,
      };
      if (editing) {
        await updateFaqApi(editing.id, payload);
      } else {
        await createFaqApi(payload);
      }
      setModalOpen(false);
      await loadFaqs();
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      setError(apiError.message || 'Failed to save FAQ.');
    } finally {
      setSaving(false);
    }
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteFaqApi(deleteTarget.id);
      setFaqs((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      setError(apiError.message || 'Failed to delete FAQ.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (faq: FAQItem) => {
    setError(null);
    try {
      await updateFaqApi(faq.id, { isActive: !(faq.isActive ?? true) });
      setFaqs((prev) =>
        prev.map((f) =>
          f.id === faq.id ? { ...f, isActive: !(f.isActive ?? true) } : f,
        ),
      );
    } catch (err: unknown) {
      const apiError = err as { message?: string };
      setError(apiError.message || 'Failed to update FAQ.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Panel"
        title="FAQ Management"
        description="Create, edit and moderate the questions & answers shown on the public FAQ page."
        actions={
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-sm shadow-primary/25 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New FAQ
          </button>
        }
      />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <DataTable<FAQItem>
        isLoading={isLoading}
        loadingText="Loading FAQs..."
        data={faqs}
        rowKey={(f) => f.id}
        sortable
        searchable
        searchPlaceholder="Search FAQs..."
        searchKeys={(f) => [f.question, f.answer, f.category ?? '']}
        emptyTitle="No FAQs found"
        emptyDescription="Create your first FAQ to get started."
        emptyIcon={<HelpCircle className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
        columns={[
          {
            key: 'question',
            header: 'Question',
            render: (f) => (
              <div>
                <p className="font-semibold text-navy-800 dark:text-navy-200">{f.question}</p>
                <p className="text-[11px] text-navy-800 dark:text-navy-300 mt-0.5 max-w-lg truncate">
                  {f.answer}
                </p>
              </div>
            ),
          },
          {
            key: 'category',
            header: 'Category',
            hideOn: 'sm',
            render: (f) => (
              <span className="text-navy-800 dark:text-navy-300">{f.category || '—'}</span>
            ),
          },
          {
            key: 'sortOrder',
            header: 'Sort',
            hideOn: 'md',
            sortValue: (f) => f.sortOrder ?? 0,
            render: (f) => (
              <span className="text-navy-800 dark:text-navy-300">{f.sortOrder ?? 0}</span>
            ),
          },
          {
            key: 'isActive',
            header: 'Status',
            hideOn: 'md',
            render: (f) => (
              <button
                type="button"
                onClick={() => toggleActive(f)}
                title={f.isActive ?? true ? 'Click to hide from public FAQ' : 'Click to publish'}
              >
                <Badge variant={f.isActive ?? true ? 'success' : 'neutral'}>
                  {(f.isActive ?? true) ? 'Active' : 'Hidden'}
                </Badge>
              </button>
            ),
          },
        ]}
        actions={(faq) => (
          <RowActions
            actions={[
              editAction(() => openEdit(faq)),
              deleteAction(() => setDeleteTarget(faq)),
            ]}
          />
        )}
      />

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit FAQ' : 'New FAQ'}
        description="FAQs are displayed on the public FAQ page, ordered by sort order."
        size="lg"
        icon={<HelpCircle className="w-5 h-5" />}
        footer={
          <>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              disabled={saving}
              className="px-4 py-2 rounded-full bg-navy-100 dark:bg-white/5 text-navy-800 dark:text-navy-300 text-sm font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
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
              {editing ? 'Save changes' : 'Create FAQ'}
            </button>
          </>
        }
      >
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Question"
            required
            placeholder="e.g. How does LocalHero vet tradespeople in the UK?"
            error={errors.question?.message}
            {...register('question', { required: 'Question is required' })}
          />
          <Textarea
            label="Answer"
            required
            placeholder="Write a clear, accurate answer..."
            error={errors.answer?.message}
            {...register('answer', { required: 'Answer is required' })}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              options={CATEGORY_OPTIONS}
              {...register('category')}
            />
            <Input
              label="Sort order"
              type="number"
              placeholder="e.g. 0"
              error={errors.sortOrder?.message}
              {...register('sortOrder')}
            />
          </div>
          <label className="flex items-center gap-2.5 text-sm font-semibold text-navy-700 dark:text-navy-300">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-navy-300 text-primary focus:ring-primary/30"
              {...register('isActive')}
            />
            Active (visible on public FAQ page)
          </label>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete FAQ?"
        description={`This will permanently remove "${deleteTarget?.question}". This action cannot be undone.`}
        confirmLabel="Delete FAQ"
      />
    </div>
  );
};

export default FAQManagement;