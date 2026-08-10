import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../../Context/AuthContext';
import { Card } from '../../../Components/ui/shared/Card';
import { Badge } from '../../../Components/ui/shared/Badge';
import { EmptyState } from '../../../Components/ui/shared/EmptyState';
import {
  PoundSterling,
  Shield,
  Activity,
  Users,
  Briefcase,
  Loader2,
  Mail,
  Calendar,
  Check,
  X,
  Server,
  Cpu,
  HardDrive,
  ArrowUpRight,
  Settings,
  BarChart3,
  AlertCircle,
  Zap,
  Globe,
} from 'lucide-react';
import { getPendingAdmins, approveAdmin, rejectAdmin } from '../../../services/auth.service';
import type { PendingUser } from '../../../types/auth';

const MOCK_SYSTEM = {
  uptime: '99.98%',
  responseTime: '142ms',
  errorRate: '0.02%',
  activeConnections: '1,847',
};

const SuperAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pendingAdmins, setPendingAdmins] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const admins = await getPendingAdmins();
      setPendingAdmins(admins);
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
      await approveAdmin(userId);
      setPendingAdmins((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      // silently handle
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      setActionLoading(userId);
      await rejectAdmin(userId);
      setPendingAdmins((prev) => prev.filter((u) => u.id !== userId));
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
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-rose-500 to-pink-500 p-6 sm:p-8 text-white shadow-xl shadow-rose-500/20"
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
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-white/80">Super Admin Panel</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold tracking-tight"
            >
              Welcome, {user?.name || 'Super Admin'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-2 text-sm text-white/70 max-w-md leading-relaxed"
            >
              Full platform control. Manage admins, providers, and system health.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, type: 'spring', stiffness: 200 }}
            className="hidden sm:flex flex-col items-end gap-2"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
              <Activity className="w-4 h-4 text-emerald-300" />
              <span className="text-sm font-medium">All Systems Operational</span>
            </div>
            {pendingAdmins.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
                <AlertCircle className="w-4 h-4 text-amber-300" />
                <span className="text-sm font-medium">{pendingAdmins.length} pending admin</span>
              </div>
            )}
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: PoundSterling, label: 'Platform Revenue', value: '£48,250', change: '+8.3% this month', color: 'from-emerald-500 to-emerald-600', lightColor: 'bg-emerald-50 dark:bg-emerald-500/10', textColor: 'text-emerald-600 dark:text-emerald-400' },
          { icon: Shield, label: 'Active Admins', value: '6', change: '2 pending approval', color: 'from-blue-500 to-blue-600', lightColor: 'bg-blue-50 dark:bg-blue-500/10', textColor: 'text-blue-600 dark:text-blue-400' },
          { icon: Users, label: 'Total Users', value: '1,284', change: '+47 this week', color: 'from-primary to-primary/80', lightColor: 'bg-primary/10', textColor: 'text-primary' },
          { icon: Activity, label: 'System Health', value: MOCK_SYSTEM.uptime, change: 'All systems operational', color: 'from-amber-500 to-orange-500', lightColor: 'bg-amber-50 dark:bg-amber-500/10', textColor: 'text-amber-600 dark:text-amber-400' },
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
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold">{stat.change}</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-navy-900 dark:text-white tracking-tight">{stat.value}</p>
              <p className="text-[11px] font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-widest mt-1.5">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admin Management Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2"
        >
          <Card padding="sm" className="overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-navy-100 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy-900 dark:text-white">Admin Management</h2>
                  <p className="text-xs text-navy-400 dark:text-navy-500 mt-0.5">Pending admin account approvals</p>
                </div>
              </div>
              <Badge variant="warning">{pendingAdmins.length} Pending</Badge>
            </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-navy-400 dark:text-navy-500">Loading admins...</p>
              </div>
            ) : pendingAdmins.length === 0 ? (
              <EmptyState
                title="No pending admin approvals"
                description="All admin accounts have been reviewed."
                icon={<Shield className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
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
                    {pendingAdmins.map((a, i) => (
                      <motion.tr
                        key={a.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
                        className="border-b border-navy-50 dark:border-white/5 last:border-0 hover:bg-navy-50 dark:hover:bg-white/[0.02] transition-all duration-200"
                      >
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                              {a.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <span className="font-semibold text-navy-800 dark:text-navy-200">{a.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-navy-500 dark:text-navy-400">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[180px]">{a.email}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 hidden sm:table-cell">
                          <div className="flex items-center gap-1.5 text-navy-400 dark:text-navy-500 text-xs">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(a.createdAt).toLocaleDateString('en-GB')}
                          </div>
                        </td>
                        <td className="py-3.5 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(a.id)}
                              disabled={actionLoading === a.id}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all duration-200 disabled:opacity-50 shadow-sm shadow-emerald-500/25"
                            >
                              {actionLoading === a.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(a.id)}
                              disabled={actionLoading === a.id}
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

        {/* System Health + Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <Card padding="lg">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Activity className="w-4 h-4 text-emerald-500" />
              </div>
              <h2 className="text-lg font-bold text-navy-900 dark:text-white">System Health</h2>
            </div>
            <div className="space-y-3">
              {[
                { icon: Server, label: 'Uptime', value: MOCK_SYSTEM.uptime, status: 'success' as const, bar: '99.98%' },
                { icon: Cpu, label: 'Response Time', value: MOCK_SYSTEM.responseTime, status: 'success' as const, bar: '85%' },
                { icon: HardDrive, label: 'Error Rate', value: MOCK_SYSTEM.errorRate, status: 'success' as const, bar: '2%' },
                { icon: Users, label: 'Active Connections', value: MOCK_SYSTEM.activeConnections, status: 'primary' as const, bar: '72%' },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl bg-cream-50 dark:bg-navy-800/50 border border-navy-100 dark:border-white/5 hover:border-primary/20 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-navy-100 dark:bg-white/5 flex items-center justify-center">
                        <item.icon className="w-3.5 h-3.5 text-navy-500 dark:text-navy-400" />
                      </div>
                      <span className="text-xs font-semibold text-navy-600 dark:text-navy-300">{item.label}</span>
                    </div>
                    <Badge variant={item.status}>{item.value}</Badge>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-navy-100 dark:bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: item.bar }}
                      transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className={`h-full rounded-full ${item.status === 'success' ? 'bg-emerald-500' : 'bg-primary'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-navy-900 dark:text-white">Quick Actions</h2>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Admin Approvals', href: '/dashboard/super-admin/admin-approvals', icon: Shield, color: 'text-blue-500' },
                { label: 'Provider Approvals', href: '/dashboard/super-admin/user-approvals', icon: Users, color: 'text-emerald-500' },
                { label: 'User Management', href: '/dashboard/super-admin/users', icon: Settings, color: 'text-primary' },
                { label: 'Edit Profile', href: '/dashboard/profile', icon: Settings, color: 'text-navy-500' },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-navy-600 dark:text-navy-400 hover:bg-navy-100 dark:hover:bg-white/5 hover:text-navy-900 dark:hover:text-white transition-all duration-200 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-navy-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <action.icon className={`w-4 h-4 ${action.color}`} />
                  </div>
                  {action.label}
                </a>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Platform Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy-900 dark:text-white">Platform Analytics</h2>
              <p className="text-xs text-navy-400 dark:text-navy-500">Key performance metrics</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Bookings Today', value: '34', change: '+12%', color: 'from-blue-500/10 to-blue-600/10' },
              { label: 'Revenue This Week', value: '£8,420', change: '+8.3%', color: 'from-emerald-500/10 to-emerald-600/10' },
              { label: 'New Signups', value: '47', change: '+23%', color: 'from-primary/10 to-primary/5' },
              { label: 'Conversion Rate', value: '12.4%', change: '+2.1%', color: 'from-amber-500/10 to-orange-500/10' },
            ].map((item) => (
              <div key={item.label} className="text-center p-4 rounded-2xl bg-gradient-to-br border border-navy-100 dark:border-white/5 hover:border-primary/20 transition-all duration-300 group" style={{}}>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative">
                  <p className="text-2xl font-bold text-navy-900 dark:text-white">{item.value}</p>
                  <p className="text-[11px] font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-widest mt-1">{item.label}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 mt-2">
                    <ArrowUpRight className="w-3 h-3" />
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SuperAdminDashboard;
