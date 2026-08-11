// src/pages/dashboard/AdminDashboard.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../../Context/AuthContext';
import { Card } from '../../../Components/ui/shared/Card';
import { Badge } from '../../../Components/ui/shared/Badge';
import { EmptyState } from '../../../Components/ui/shared/EmptyState';
import { ActionButton } from '../../../Components/dashboard/ActionButton';
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
  AlertCircle,
  Wrench,
  UserRound,
  Images,
  ArrowRight,
  CreditCard,
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import {
  getProviderApplications,
  approveProviderApplication,
  rejectProviderApplication,
} from '../../../services/auth.service';
import type { ProviderApplicationRecord } from '../../../types/auth';

const MOCK_REVIEWS = [
  { id: '1', author: 'John D.', service: 'Plumbing', rating: 5, comment: 'Excellent work, very professional.', flagged: false },
  { id: '2', author: 'Lisa M.', service: 'Cleaning', rating: 2, comment: 'Late arrival and missed spots.', flagged: true },
  { id: '3', author: 'Peter K.', service: 'Electrical', rating: 5, comment: 'Fast and reliable service.', flagged: false },
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pendingApplications, setPendingApplications] = useState<ProviderApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleReviewAction = (id: string, action: 'approve' | 'remove') => {
    setReviews((prev) =>
      action === 'remove' ? prev.filter((r) => r.id !== id) : prev.map((r) => (r.id === id ? { ...r, flagged: false } : r))
    );
  };

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const applications = await getProviderApplications('PENDING');
      setPendingApplications(applications);
    } catch (err) {
      setErrorMsg('Data Load please check your internet connection');
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
    } catch (err) {
      setErrorMsg('ব্যবহারকারী অনুমোদন করা যায়নি।');
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
    } catch (err) {
      setErrorMsg('ব্যবহারকারী প্রত্যাখ্যান করা যায়নি।');
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
            <span className="text-sm font-medium text-white/80">Admin Control Panel</span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">
              Welcome, {user?.name || 'Admin'}
            </h1>
            <p className="mt-2 text-sm text-white/70 max-w-md leading-relaxed">
              Review pending provider applications and manage flagged content.
            </p>
          </div>
          {pendingApplications.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
              <AlertCircle className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium">{pendingApplications.length} Pending Providers</span>
            </div>
          )}
        </div>
      </motion.div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Pending Provider Section */}
      <Card padding="sm" className="overflow-hidden">
        <div className="px-6 py-4 border-b border-navy-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserCheck className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy-900 dark:text-white">Provider Approvals</h2>
              <p className="text-xs text-navy-400 dark:text-navy-500">Applications waiting for review</p>
            </div>
          </div>
          <Badge variant="warning">{pendingApplications.length} Pending</Badge>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-navy-400 dark:text-navy-500">Loading requests...</p>
          </div>
        ) : pendingApplications.length === 0 ? (
          <EmptyState
            title="No pending providers"
            description="All service provider requests have been processed."
            icon={<UserCheck className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100 dark:border-white/10 bg-navy-50/50 dark:bg-white/[0.02]">
                  <th className="text-left py-3 px-6 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase">Email</th>
                  <th className="text-right py-3 px-6 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingApplications.map((p) => (
                  <tr key={p.id} className="border-b border-navy-50 dark:border-white/5 last:border-0 hover:bg-navy-50 dark:hover:bg-white/[0.02]">
                    <td className="py-3.5 px-6 font-semibold text-navy-800 dark:text-navy-200">{p.user?.name}</td>
                    <td className="py-3.5 px-4 text-navy-500 dark:text-navy-400">{p.user?.email}</td>
                    <td className="py-3.5 px-6 text-right space-x-2">
                      <ActionButton
                        variant="approve"
                        size="sm"
                        icon={Check}
                        isLoading={actionLoading === p.id}
                        onClick={() => handleApprove(p.id)}
                      >
                        Approve
                      </ActionButton>
                      <ActionButton
                        variant="reject"
                        size="sm"
                        icon={X}
                        disabled={actionLoading === p.id}
                        onClick={() => handleReject(p.id)}
                      >
                        Reject
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Content Management Quick Links */}
      <Card padding="lg">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Images className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-navy-900 dark:text-white">Content Management</h2>
            <p className="text-xs text-navy-400 dark:text-navy-500 mt-0.5">Manage platform content</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Bookings', desc: 'Booking requests', href: '/dashboard/admin/manage/bookings', icon: Calendar, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
            { label: 'Payments', desc: 'Payment history', href: '/dashboard/admin/manage/payments', icon: CreditCard, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
            { label: 'Trades', desc: 'Service categories', href: '/dashboard/admin/manage/trades', icon: Wrench, color: 'bg-primary/10 text-primary' },
            { label: 'Professionals', desc: 'Tradesperson directory', href: '/dashboard/admin/manage/professionals', icon: UserRound, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
            { label: 'Before & After', desc: 'Transformation projects', href: '/dashboard/admin/manage/before-after', icon: Images, color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
            { label: 'Testimonials', desc: 'Customer reviews', href: '/dashboard/admin/manage/testimonials', icon: MessageSquare, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
          ].map((action) => (
            <RouterLink
              key={action.href}
              to={action.href}
              className="group flex items-center justify-between gap-2 p-4 rounded-2xl border border-navy-100 dark:border-white/10 bg-cream-50 dark:bg-navy-800/50 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${action.color}`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy-800 dark:text-navy-200">{action.label}</p>
                  <p className="text-xs text-navy-400 dark:text-navy-500 truncate">{action.desc}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-navy-300 dark:text-navy-600 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 shrink-0" />
            </RouterLink>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;