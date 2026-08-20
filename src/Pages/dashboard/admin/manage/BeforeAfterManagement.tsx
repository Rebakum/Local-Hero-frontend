import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Loader2, AlertCircle, Images, Check, X, Star, Eye, Trash2 } from 'lucide-react';
import {
  DataTable,
  Modal,
  ConfirmDialog,
  PageHeader,
  Input,
  StatusBadge,
} from '../../../../Components/ui';
import {
  getBeforeAfterAdmin,
  updateBeforeAfterStatus,
  toggleBeforeAfterFeature,
  deleteBeforeAfter,
} from '../../../../services/content.service';
import { useToast } from '../../../../Context/ToastContext';
import type { BeforeAfterPair } from '../../../../types';

// PENDING should always sort to the top so admins see the work queue first.
const STATUS_RANK: Record<string, number> = { PENDING: 0, APPROVED: 1, REJECTED: 2 };

const relativeTime = (iso?: string): string => {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return new Date(iso).toLocaleDateString('en-GB');
};

const BeforeAfterManagement: React.FC = () => {
  const toast = useToast();
  const [submissions, setSubmissions] = useState<BeforeAfterPair[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [rejectTarget, setRejectTarget] = useState<BeforeAfterPair | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  const [preview, setPreview] = useState<BeforeAfterPair | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<BeforeAfterPair | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getBeforeAfterAdmin({ status: 'ALL', limit: 200 });
      // Default ordering: PENDING first, then newest first.
      const sorted = [...data].sort((a, b) => {
        const rank = (STATUS_RANK[a.status ?? ''] ?? 9) - (STATUS_RANK[b.status ?? ''] ?? 9);
        if (rank !== 0) return rank;
        return (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0);
      });
      setSubmissions(sorted);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to load before/after submissions.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (p: BeforeAfterPair) => {
    setBusyId(p.id);
    setError(null);
    try {
      await updateBeforeAfterStatus(p.id, { status: 'APPROVED' });
      toast.success('Showcase approved and published');
      await load();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(apiError.response?.data?.message || apiError.message || 'Failed to approve submission.');
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    setRejecting(true);
    setError(null);
    try {
      await updateBeforeAfterStatus(rejectTarget.id, {
        status: 'REJECTED',
        rejectionReason: rejectReason.trim(),
      });
      toast.success('Showcase rejected with reason');
      setRejectTarget(null);
      setRejectReason('');
      await load();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(apiError.response?.data?.message || apiError.message || 'Failed to reject submission.');
    } finally {
      setRejecting(false);
    }
  };

  const handleToggleFeature = async (p: BeforeAfterPair) => {
    setBusyId(p.id);
    setError(null);
    try {
      await toggleBeforeAfterFeature(p.id);
      toast.success(p.isFeatured ? 'Showcase removed from homepage' : 'Showcase featured on homepage');
      await load();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(apiError.response?.data?.message || apiError.message || 'Failed to update feature status.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteBeforeAfter(deleteTarget.id);
      toast.success('Showcase permanently deleted');
      setDeleteTarget(null);
      await load();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(apiError.response?.data?.message || apiError.message || 'Failed to delete submission.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Admin Panel"
        title="Before & After Approvals"
        description="Review before/after submissions from professionals. Approve to publish, reject with a reason, or feature the best ones on the homepage."
      />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <DataTable<BeforeAfterPair>
        isLoading={isLoading}
        loadingText="Loading submissions..."
        data={submissions}
        rowKey={(p) => p.id}
        searchable
        searchPlaceholder="Search by title, professional or trade..."
        searchKeys={(p) => [p.title, p.trade, p.professional?.name ?? '', p.professional?.companyName ?? '']}
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: [
              { value: 'PENDING', label: 'Pending' },
              { value: 'APPROVED', label: 'Approved' },
              { value: 'REJECTED', label: 'Rejected' },
              { value: 'featured', label: 'Featured' },
            ],
            filterValue: (row) => (row.isFeatured ? 'featured' : (row.status ?? '')),
          },
          {
            key: 'trade',
            label: 'Trade',
            options: [...new Set(submissions.map((p) => p.trade).filter(Boolean))].map((t) => ({
              value: t,
              label: t,
            })),
            filterValue: (row) => row.trade,
          },
        ]}
        emptyTitle="No before/after submissions found"
        emptyDescription="Professional submissions will appear here for review."
        emptyIcon={<Images className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
        columns={[
          {
            key: 'thumbnail',
            header: 'Thumbnail',
            render: (p) => (
              <button
                type="button"
                onClick={() => setPreview(p)}
                title="View images"
                className="relative w-20 h-14 rounded-lg overflow-hidden bg-navy-100 dark:bg-white/5 shrink-0 border border-navy-100 dark:border-white/10 cursor-zoom-in"
              >
                <img src={p.beforeImage} alt="Before" className="absolute inset-0 w-1/2 h-full object-cover" />
                <img src={p.afterImage} alt="After" className="absolute inset-y-0 right-0 w-1/2 h-full object-cover" />
              </button>
            ),
          },
          {
            key: 'professional',
            header: 'Professional',
            sortValue: (p) => p.professional?.name ?? '',
            render: (p) =>
              p.professionalId ? (
                <RouterLink
                  to={`/professionals/${p.professionalId}`}
                  className="block min-w-0 group"
                >
                  <span className="block font-semibold text-navy-800 dark:text-navy-200 truncate max-w-[180px] group-hover:text-primary transition-colors">
                    {p.professional?.name || 'Professional'}
                  </span>
                  {p.professional?.companyName && (
                    <span className="block text-[11px] text-navy-400 dark:text-navy-500 truncate max-w-[180px]">
                      {p.professional.companyName}
                    </span>
                  )}
                </RouterLink>
              ) : (
                <span className="font-semibold text-navy-800 dark:text-navy-200">
                  {p.professional?.name || 'Professional'}
                </span>
              ),
          },
          {
            key: 'trade',
            header: 'Trade',
            render: (p) => <StatusBadge status={p.trade} tone="neutral" />,
          },
          {
            key: 'createdAt',
            header: 'Submitted',
            hideOn: 'sm',
            sortValue: (p) => (p.createdAt ? new Date(p.createdAt).getTime() : 0),
            render: (p) => (
              <span className="text-xs text-navy-500 dark:text-navy-400" title={p.createdAt ? new Date(p.createdAt).toLocaleString() : undefined}>
                {relativeTime(p.createdAt)}
              </span>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            sortValue: (p) => p.status ?? '',
            render: (p) => (
              <div className="flex items-center gap-1.5">
                <StatusBadge status={p.status ?? 'PENDING'} />
                {p.isFeatured && p.status === 'APPROVED' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500">
                    <Star className="w-3 h-3 fill-current" /> Featured
                  </span>
                )}
              </div>
            ),
          },
        ]}
        actions={(p) => (
          <div className="flex items-center gap-1.5">
            {p.status === 'PENDING' && (
              <>
                <button
                  onClick={() => handleApprove(p)}
                  disabled={busyId === p.id}
                  title="Approve & publish"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-500/10 transition-colors disabled:opacity-50"
                >
                  {busyId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 3" />}
                </button>
                <button
                  onClick={() => {
                    setRejectTarget(p);
                    setRejectReason('');
                  }}
                  title="Reject"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-red-500 border border-red-200 dark:border-red-500/30 hover:bg-red-500/10 transition-colors"
                >
                  <X className="w-3.5 3" />
                </button>
              </>
            )}

            {p.status === 'APPROVED' && (
              <button
                onClick={() => handleToggleFeature(p)}
                disabled={busyId === p.id}
                title={p.isFeatured ? 'Unfeature' : 'Feature on homepage'}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors disabled:opacity-50 ${
                  p.isFeatured
                    ? 'text-amber-500 border-amber-200 dark:border-amber-500/40 bg-amber-500/10'
                    : 'text-navy-500 dark:text-navy-400 border-navy-200 dark:border-white/10 hover:text-amber-500 hover:border-amber-300'
                }`}
              >
                {busyId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Star className="w-3.5 3" />}
              </button>
            )}

            {(p.status === 'APPROVED' || p.status === 'REJECTED') && (
              <button
                onClick={() => setPreview(p)}
                title="View images"
                className="w-8 h-8 rounded-full flex items-center justify-center text-navy-500 dark:text-navy-400 border border-navy-200 dark:border-white/10 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Eye className="w-3.5 3" />
              </button>
            )}

            <button
              onClick={() => setDeleteTarget(p)}
              title="Delete"
              className="w-8 h-8 rounded-full flex items-center justify-center text-navy-500 dark:text-navy-400 border border-navy-200 dark:border-white/10 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 3" />
            </button>
          </div>
        )}
      />

      {/* Reject reason modal */}
      <Modal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        title="Reject showcase"
        description="Add a reason so the professional can fix and resubmit."
        size="sm"
        icon={<X className="w-5 h-5" />}
        footer={
          <>
            <button
              onClick={() => setRejectTarget(null)}
              disabled={rejecting}
              className="px-4 py-2 rounded-full bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 text-sm font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={rejecting || !rejectReason.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {rejecting && <Loader2 className="w-4 h-4 animate-spin" />}
              Reject
            </button>
          </>
        }
      >
        <Input
          label="Rejection reason"
          required
          placeholder="e.g. Photos are blurry — please reshoot and resubmit"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>

      {/* Image lightbox */}
      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        title={preview?.title ?? 'Showcase'}
        description={preview?.description}
        size="xl"
        icon={<Images className="w-5 h-5" />}
        footer={
          <button
            onClick={() => setPreview(null)}
            className="px-4 py-2 rounded-full bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 text-sm font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors"
          >
            Close
          </button>
        }
      >
        {preview && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden border border-navy-100 dark:border-white/10">
              <p className="text-[11px] font-bold uppercase tracking-widest text-navy-400 dark:text-navy-500 px-4 py-2 bg-cream-50 dark:bg-navy-800">Before</p>
              <img src={preview.beforeImage} alt="Before" className="w-full h-72 object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden border border-navy-100 dark:border-white/10">
              <p className="text-[11px] font-bold uppercase tracking-widest text-navy-400 dark:text-navy-500 px-4 py-2 bg-cream-50 dark:bg-navy-800">After</p>
              <img src={preview.afterImage} alt="After" className="w-full h-72 object-cover" />
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete showcase?"
        description={`This will permanently remove "${deleteTarget?.title}". This action cannot be undone.`}
        confirmLabel="Delete showcase"
      />
    </div>
  );
};

export default BeforeAfterManagement;
