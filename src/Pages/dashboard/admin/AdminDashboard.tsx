import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../../Context/AuthContext';
import { Card } from '../../../Components/ui/shared/Card';
import { Badge } from '../../../Components/ui/shared/Badge';
import { EmptyState } from '../../../Components/ui/shared/EmptyState';
import {
  Users,
  Briefcase,
  UserCheck,
  Loader2,
  Mail,
  Calendar,
  Check,
  X,
  Shield,
  MessageSquare,
  Flag,
  Star,
  TrendingUp,
  AlertCircle,
  Eye,
  BarChart3,
} from 'lucide-react';
import { getPendingProviders, approveUser, rejectUser } from '../../../services/auth.service';
import type { PendingUser } from '../../../types/auth';

const MOCK_REVIEWS = [
  { id: '1', author: 'John D.', service: 'Plumbing', rating: 5, comment: 'Excellent work, very professional.', flagged: false },
  { id: '2', author: 'Lisa M.', service: 'Cleaning', rating: 2, comment: 'Late arrival and missed spots.', flagged: true },
  { id: '3', author: 'Peter K.', service: 'Electrical', rating: 5, comment: 'Fast and reliable service.', flagged: false },
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const users = await getPendingProviders();
      setPendingUsers(users);
    } catch {
      // silently handle
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
      await approveUser(userId);
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      // silently handle
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      setActionLoading(userId);
      await rejectUser(userId);
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      // silently handle
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-500 to-purple-500 p-6 sm:p-8 text-white shadow-xl shadow-violet-500/20"
      >
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-sm" />
        <div className="absolute -right-4 bottom-0 w-28 h-28 rounded-full bg-white/5" />
        <div className="absolute left-1/3 top-0 w-64 h-32 bg-white/5 blur-3xl rounded-full" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-2 mb-2"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-white/80">Admin Panel</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold tracking-tight"
            >
              Welcome, {user?.name || 'Admin'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-2 text-sm text-white/70 max-w-md leading-relaxed"
            >
              Manage providers, moderate content, and keep the platform running smoothly.
            </motion.p>
          </div>

          {pendingUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5, type: 'spring', stiffness: 200 }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20"
            >
              <AlertCircle className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium">{pendingUsers.length} pending</span>
            </motion.div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Users', value: '1,284', change: '+47 this week', color: 'from-blue-500 to-blue-600', lightColor: 'bg-blue-50 dark:bg-blue-500/10', textColor: 'text-blue-600 dark:text-blue-400' },
          { icon: Briefcase, label: 'Service Providers', value: '342', change: '+12 this month', color: 'from-emerald-500 to-emerald-600', lightColor: 'bg-emerald-50 dark:bg-emerald-500/10', textColor: 'text-emerald-600 dark:text-emerald-400' },
          { icon: UserCheck, label: 'Pending Approvals', value: String(pendingUsers.length), change: 'Needs action', color: 'from-amber-500 to-orange-500', lightColor: 'bg-amber-50 dark:bg-amber-500/10', textColor: 'text-amber-600 dark:text-amber-400' },
          { icon: MessageSquare, label: 'Reviews Today', value: '18', change: '+5 flagged', color: 'from-primary to-primary/80', lightColor: 'bg-primary/10', textColor: 'text-primary' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card hover padding="md" className="h-full group relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-2xl ${stat.lightColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
                <div className="flex items-center gap-1 text-emerald-500">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold">{stat.change}</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-navy-900 dark:text-white tracking-tight">{stat.value}</p>
              <p className="text-[11px] font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-widest mt-1.5">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Approval Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card padding="sm" className="overflow-hidden">
          <div className="px-6 py-4 border-b border-navy-100 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <UserCheck className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900 dark:text-white">Pending Provider Approvals</h2>
                <p className="text-xs text-navy-400 dark:text-navy-500 mt-0.5">Review and approve service provider registrations</p>
              </div>
            </div>
            <Badge variant="warning">{pendingUsers.length} Pending</Badge>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-navy-400 dark:text-navy-500">Loading approvals...</p>
            </div>
          ) : pendingUsers.length === 0 ? (
            <EmptyState
              title="No pending approvals"
              description="All service provider accounts have been reviewed."
              icon={<UserCheck className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-100 dark:border-white/10 bg-navy-50/50 dark:bg-white/[0.02]">
                    <th className="text-left py-3 px-6 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider hidden sm:table-cell">Joined</th>
                    <th className="text-right py-3 px-6 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((u, i) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
                      className="border-b border-navy-50 dark:border-white/5 last:border-0 hover:bg-navy-50 dark:hover:bg-white/[0.02] transition-all duration-200"
                    >
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                            {u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <span className="font-semibold text-navy-800 dark:text-navy-200">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-navy-500 dark:text-navy-400">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[180px]">{u.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-navy-400 dark:text-navy-500 text-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(u.createdAt).toLocaleDateString('en-GB')}
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(u.id)}
                            disabled={actionLoading === u.id}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all duration-200 disabled:opacity-50 shadow-sm shadow-emerald-500/25"
                          >
                            {actionLoading === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(u.id)}
                            disabled={actionLoading === u.id}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all duration-200 disabled:opacity-50"
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
          )}
        </Card>
      </motion.div>

      {/* Content Moderation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card padding="sm" className="overflow-hidden">
          <div className="px-6 py-4 border-b border-navy-100 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Eye className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900 dark:text-white">Content Moderation</h2>
                <p className="text-xs text-navy-400 dark:text-navy-500 mt-0.5">Flagged reviews requiring attention</p>
              </div>
            </div>
            <Badge variant="warning">{MOCK_REVIEWS.filter(r => r.flagged).length} Flagged</Badge>
          </div>
          <div className="divide-y divide-navy-50 dark:divide-white/5">
            {MOCK_REVIEWS.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.06, duration: 0.4 }}
                className="px-6 py-5 hover:bg-navy-50 dark:hover:bg-white/[0.02] transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-bold text-navy-800 dark:text-navy-200">{review.author}</span>
                      <span className="text-xs text-navy-400 dark:text-navy-500">on</span>
                      <span className="text-xs font-semibold text-primary">{review.service}</span>
                      <div className="flex items-center gap-0.5 ml-1">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} className={`w-3 h-3 ${s < review.rating ? 'text-amber-400 fill-amber-400' : 'text-navy-200 dark:text-navy-700'}`} />
                        ))}
                      </div>
                      {review.flagged && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                          <Flag className="w-3 h-3" />
                          Flagged
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-navy-500 dark:text-navy-400 leading-relaxed">{review.comment}</p>
                  </div>
                  {review.flagged && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all duration-200 shadow-sm shadow-emerald-500/25">
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all duration-200">
                        <X className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
