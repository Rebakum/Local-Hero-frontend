import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Card } from '../../../Components/ui/shared/Card';
import { Badge } from '../../../Components/ui/shared/Badge';
import { EmptyState } from '../../../Components/ui/shared/EmptyState';
import { Loader2, Shield, Mail, Calendar, Check, X } from 'lucide-react';
import { getPendingAdmins, approveAdmin, rejectAdmin } from '../../../services/auth.service';
import type { PendingUser } from '../../../types/auth';
import { DataTable } from '../../../Components/ui/DataTable';

const SuperAdminApprovals: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const users = await getPendingAdmins();
      setPendingUsers(users);
    } catch {
      setError('Failed to load pending admin accounts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleApprove = async (userId: string) => {
    try {
      setActionLoading(userId);
      await approveAdmin(userId);
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      setError('Failed to approve admin.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      setActionLoading(userId);
      await rejectAdmin(userId);
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      setError('Failed to reject admin.');
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
          Pending Admin Approvals
        </h1>
<p className="mt-2 text-sm text-navy-800 dark:text-navy-300">
          Review and approve admin account requests.
        </p>
      </motion.div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {pendingUsers.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            title="No pending admin approvals"
            description="All admin accounts have been reviewed."
            icon={<Shield className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
          />
        </Card>
      ) : (
        <DataTable<PendingUser>
          data={pendingUsers}
          rowKey={(u) => u.id}
          searchable
          searchPlaceholder="Search pending admins..."
          searchKeys={(u) => [u.name, u.email, u.role]}
          sortable
          emptyTitle="No pending admin approvals"
          emptyDescription="All admin accounts have been reviewed."
          emptyIcon={<Shield className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
          columns={[
            {
              key: 'name',
              header: 'Name',
              sortValue: (u) => u.name,
              render: (u) => <p className="font-medium text-navy-800 dark:text-navy-200">{u.name}</p>,
            },
            {
              key: 'email',
              header: 'Email',
              sortValue: (u) => u.email,
              render: (u) => (
                <div className="flex items-center gap-1.5 text-navy-800 dark:text-navy-300">
                  <Mail className="w-3.5 3" />
                  <span className="truncate max-w-[200px]">{u.email}</span>
                </div>
              ),
            },
            {
              key: 'role',
              header: 'Role',
              hideOn: 'sm',
              render: (u) => <Badge variant="primary">{u.role}</Badge>,
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

export default SuperAdminApprovals;
