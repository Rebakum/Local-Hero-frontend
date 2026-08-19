// src/pages/dashboard/AdminDashboard.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../../Context/AuthContext';
import { Card } from '../../../Components/ui/shared/Card';
import { Badge } from '../../../Components/ui/shared/Badge';
import { ActionButton } from '../../../Components/dashboard/ActionButton';
import { DataTable } from '../../../Components/ui/DataTable';
import {
  Users,
  Briefcase,
  UserCheck,
  Mail,
  Calendar,
  Check,
  X,
  Shield,
  MessageSquare,
  AlertCircle,
  Wrench,
  UserRound,
  Images,
  ArrowRight,
  CreditCard,
  Activity,
  Sparkles,
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import {
  getProviderApplications,
  approveProviderApplication,
  rejectProviderApplication,
} from '../../../services/auth.service';
import type { ProviderApplicationRecord } from '../../../types/auth';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pendingApplications, setPendingApplications] = useState<ProviderApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        className="relative overflow-hidden rounded-3xl bg-white dark:bg-navy-900 p-6 sm:p-8 text-navy-950 dark:text-white shadow-xl shadow-primary/20"
      >
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-primary/5 blur-sm pointer-events-none" />
        <div className="absolute -right-4 bottom-0 w-28 h-28 rounded-full bg-primary/5 pointer-events-none" />
        <div className="absolute left-1/3 top-0 w-64 h-32 bg-primary/5 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-2 mb-2"
            >
              <span className="text-sm font-medium">Welcome back,</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold tracking-tight"
            >
              {user?.name || 'Admin'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-2 text-sm text-navy-950/70 dark:text-white/70 max-w-md leading-relaxed"
            >
              Review pending provider applications and manage flagged content.
            </motion.p>
          </div>

          {pendingApplications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-navy-100/60 dark:bg-white/10 backdrop-blur-sm border border-navy-100 dark:border-white/20"
            >
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium">{pendingApplications.length} Pending Providers</span>
            </motion.div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </motion.div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          {errorMsg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: UserCheck, label: 'Pending Providers', value: String(pendingApplications.length), color: 'from-amber-500 to-orange-500', lightColor: 'bg-amber-50 dark:bg-amber-500/10', textColor: 'text-amber-600 dark:text-amber-400', change: 'awaiting review' },
          { icon: MessageSquare, label: 'Review Moderation', value: 'Open', color: 'from-violet-500 to-purple-500', lightColor: 'bg-violet-50 dark:bg-violet-500/10', textColor: 'text-violet-600 dark:text-violet-400', change: 'manage reviews' },
          { icon: Images, label: 'Content Modules', value: '6', color: 'from-blue-500 to-blue-600', lightColor: 'bg-blue-50 dark:bg-blue-500/10', textColor: 'text-blue-600 dark:text-blue-400', change: 'fully managed' },
          { icon: Activity, label: 'Platform Status', value: 'Live', color: 'from-emerald-500 to-emerald-600', lightColor: 'bg-emerald-50 dark:bg-emerald-500/10', textColor: 'text-emerald-600 dark:text-emerald-400', change: 'all systems ok' },
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
                <div className={`w-11 h-11 rounded-2xl ${stat.lightColor} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
                <span className="text-[10px] font-semibold text-navy-400 dark:text-navy-500">{stat.change}</span>
              </div>
              <p className="text-3xl font-bold text-navy-900 dark:text-white tracking-tight">{stat.value}</p>
              <p className="text-[11px] font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-widest mt-1.5">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

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

        <DataTable<ProviderApplicationRecord>
          isLoading={loading}
          loadingText="Loading requests..."
          data={pendingApplications}
          rowKey={(p) => p.id}
          searchable
          searchPlaceholder="Search pending providers..."
          searchKeys={(p) => [p.user?.name ?? '', p.user?.email ?? '']}
          sortable
          emptyTitle="No pending providers"
          emptyDescription="All service provider requests have been processed."
          emptyIcon={<UserCheck className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
          columns={[
            {
              key: 'name',
              header: 'Name',
              sortValue: (p) => p.user?.name ?? '',
              render: (p) => <span className="font-semibold text-navy-800 dark:text-navy-200">{p.user?.name}</span>,
            },
            {
              key: 'email',
              header: 'Email',
              sortValue: (p) => p.user?.email ?? '',
              render: (p) => <span className="text-navy-500 dark:text-navy-400">{p.user?.email}</span>,
            },
          ]}
          actions={(p) => (
            <>
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
            </>
          )}
        />
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
            { label: 'Services', desc: 'Featured services', href: '/dashboard/admin/manage/services', icon: Sparkles, color: 'bg-pink-500/10 text-pink-600 dark:text-pink-400' },
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