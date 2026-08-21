import React from 'react';
import { Plus, AlertCircle, MessageSquareQuote } from 'lucide-react';
import { PageHeader, ConfirmDialog } from '../../../../Components/ui';
import { useTestimonialsManagement } from '../../../../Components/dashboard/testimonials/useTestimonialsManagement';
import { TestimonialStats } from '../../../../Components/dashboard/testimonials/TestimonialStats';
import { TestimonialFilterBar } from '../../../../Components/dashboard/testimonials/TestimonialFilterBar';
import { TestimonialTable } from '../../../../Components/dashboard/testimonials/TestimonialTable';
import { TestimonialFormModal } from '../../../../Components/dashboard/testimonials/TestimonialFormModal';
import { HideReviewModal } from '../../../../Components/dashboard/testimonials/HideReviewModal';

const TestimonialsManagement: React.FC = () => {
  const state = useTestimonialsManagement();
  const { error, openCreate, openEdit, setDeleteTarget } = state;

  const openHide = (t: (typeof state.testimonials)[number]) => {
    state.setHideTarget(t);
    state.setHideNote(t.moderationNote ?? '');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Panel"
        title="Review Moderation"
        description="Reviews go live instantly (post-moderation). Scan, hide or feature problematic reviews and manage customer testimonials from here."
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

      <TestimonialStats stats={state.stats} />

      <TestimonialFilterBar
        statusFilter={state.statusFilter}
        onStatusChange={state.setStatusFilter}
        searchQuery={state.searchQuery}
        onSearchChange={state.setSearchQuery}
        count={state.filtered.length}
      />

      <TestimonialTable
        isLoading={state.isLoading}
        data={state.filtered}
        isBusy={state.isBusy}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onHide={openHide}
        onRestore={state.handleRestore}
        onToggleFeatured={state.handleToggleFeatured}
      />

      <TestimonialFormModal
        open={state.modalOpen}
        editing={state.editing}
        saving={state.saving}
        onClose={() => state.setModalOpen(false)}
        onSubmit={state.onSubmit}
        register={state.register}
        errors={state.errors}
        setValue={state.setValue}
        avatar={state.watch('avatar')}
        folder={state.watch('folder')}
        rating={state.watch('rating')}
      />

      <HideReviewModal
        target={state.hideTarget}
        hiding={state.hiding}
        note={state.hideNote}
        onNoteChange={state.setHideNote}
        onClose={() => state.setHideTarget(null)}
        onConfirm={state.handleHide}
      />

      <ConfirmDialog
        open={!!state.deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={state.handleDelete}
        loading={state.deleting}
        title="Delete review permanently?"
        description={`This will permanently remove the review from "${state.deleteTarget?.author}". The review will be erased from the database and this action cannot be undone.`}
        confirmLabel="Delete permanently"
      />
    </div>
  );
};

export default TestimonialsManagement;