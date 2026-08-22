import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Card } from '../../../Components/ui/shared/Card';
import { Badge } from '../../../Components/ui/shared/Badge';
import { EmptyState } from '../../../Components/ui/shared/EmptyState';
import { Loader2, Users, Mail, Calendar, Check, X } from 'lucide-react';
import { getProviderApplications, approveProviderApplication, rejectProviderApplication } from '../../../services/auth.service';
import type { ProviderApplicationRecord } from '../../../types/auth';
import { DataTable } from '../../../Components/ui/DataTable';

const SuperAdminProviderApprovals: React.FC = () => {
  const [pendingApplications, setPendingApplications] = useState<ProviderApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const applications = await getProviderApplications('PENDING');
      setPendingApplications(applications);
    } catch {
      setError('Failed to load pending providers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleApprove = async (applicationId: string) => {
    try {
      setActionLoading(applicationId);
      await approveProviderApplication(applicationId);
      setPendingApplications((prev) => prev.filter((a) => a.id !== applicationId));
    } catch {
      setError('Failed to approve application.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (applicationId: string) => {
    const rejectionReason = window.prompt('Rejection reason (sent to the applicant):');
    if (!rejectionReason || !rejectionReason.trim()) return;

    try {
      setActionLoading(applicationId);
      await rejectProviderApplication(applicationId, rejectionReason.trim());
      setPendingApplications((prev) => prev.filter((a) => a.id !== applicationId));
    } catch {
      setError('Failed to reject application.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white">
          Pending Provider Approvals
        </h1>
        <p className="mt-2 text-sm text-navy-800 dark:text-navy-300">
          Review and approve service provider registration requests.
        </p>
      </motion.div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {pendingApplications.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            title="No pending providers"
            description="All service provider accounts have been reviewed."
            icon={<Users className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
          />
        </Card>
      ) : (
        <DataTable<ProviderApplicationRecord>
          data={pendingApplications}
          rowKey={(u) => u.id}
          searchable
          searchPlaceholder="Search pending providers..."
          searchKeys={(u) => [u.user?.name ?? '', u.user?.email ?? '']}
          sortable
          emptyTitle="No pending providers"
          emptyDescription="All service provider accounts have been reviewed."
          emptyIcon={<Users className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
          columns={[
            {
              key: 'name',
              header: 'Name',
              sortValue: (u) => u.user?.name ?? '',
              render: (u) => (
                <p className="font-medium text-navy-800 dark:text-navy-200">{u.user?.name}</p>
              ),
            },
            {
              key: 'email',
              header: 'Email',
              sortValue: (u) => u.user?.email ?? '',
              render: (u) => (
                <div className="flex items-center gap-1.5 text-navy-800 dark:text-navy-300">
                  <Mail className="w-3.5 3" />
                  <span className="truncate max-w-[200px]">{u.user?.email}</span>
                </div>
              ),
            },
            {
              key: 'role',
              header: 'Role',
              hideOn: 'sm',
              render: () => <Badge variant="primary">Service Provider</Badge>,
            },
            {
              key: 'joined',
              header: 'Joined',
              hideOn: 'md',
              sortValue: (u) => new Date(u.createdAt).getTime(),
              render: (u) => (
                <div className="flex items-center gap-1.5 text-navy-800 dark:text-navy-300 text-xs">
                  <Calendar className="w-3.5 3" />
                  {new Date(u.createdAt).toLocaleDateString('en-GB')}
                </div>
              ),
            },
          ]}
          actions={(user) => (
            <>
              <button
                onClick={() => handleApprove(user.id)}
                disabled={actionLoading === user.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                {actionLoading === user.id ? (
                  <Loader2 className="w-3.5 3 animate-spin" />
                ) : (
                  <Check className="w-3.5 3" />
                )}
                Approve
              </button>
              <button
                onClick={() => handleReject(user.id)}
                disabled={actionLoading === user.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
              >
                <X className="w-3.5 3" />
                Reject
              </button>
            </>
          )}
        />
      )}
    </div>
  );
};

export default SuperAdminProviderApprovals;
