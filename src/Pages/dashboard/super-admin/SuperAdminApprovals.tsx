import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Card } from '../../../Components/ui/shared/Card';
import { Badge } from '../../../Components/ui/shared/Badge';
import { EmptyState } from '../../../Components/ui/shared/EmptyState';
import { Loader2, Shield, Mail, Calendar, Check, X } from 'lucide-react';
import { getPendingAdmins, approveAdmin, rejectAdmin } from '../../../services/auth.service';
import type { PendingUser } from '../../../types/auth';

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
        <p className="mt-2 text-sm text-navy-500 dark:text-navy-400">
          Review and approve admin account registration requests.
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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card padding="sm" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100 dark:border-white/10">
                    <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300 hidden sm:table-cell">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300 hidden md:table-cell">Joined</th>
                    <th className="text-right py-3 px-4 font-semibold text-navy-600 dark:text-navy-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-navy-50 dark:border-white/5 last:border-0 hover:bg-navy-50 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-4">
                        <p className="font-medium text-navy-800 dark:text-navy-200">{user.name}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-navy-500 dark:text-navy-400">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[200px]">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <Badge variant="primary">{user.role}</Badge>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-navy-400 dark:text-navy-500 text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(user.createdAt).toLocaleDateString('en-GB')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(user.id)}
                            disabled={actionLoading === user.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === user.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(user.id)}
                            disabled={actionLoading === user.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default SuperAdminApprovals;
