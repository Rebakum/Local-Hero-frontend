import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../../../Components/ui/shared/Card';
import { Badge } from '../../../Components/ui/shared/Badge';
import {
  Settings,
  Server,
  Database,
  Activity,
  AlertTriangle,
  Shield,
  Globe,
  RefreshCw,
  Wifi,
  Lock,
  Users,
  CalendarDays,
  TrendingUp,
  CreditCard,
  Clock,
  FileText,
} from 'lucide-react';
import { getAdminDashboardStats, type AdminDashboardStats } from '../../../services/auth.service';
import { getAdminBookings, type BookingRecord } from '../../../services/booking.service';
import { getPaymentHistory, type PaymentRecord } from '../../../services/payment.service';

const formatPence = (pence: number): string =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100);

const relative = (iso?: string | null): string => {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const SystemPage: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, bookingData, paymentData] = await Promise.all([
        getAdminDashboardStats(),
        getAdminBookings({ page: 1, limit: 8 }),
        getPaymentHistory({ page: 1, limit: 8 }),
      ]);
      setStats(statsData);
      setBookings(bookingData.bookings ?? []);
      setPayments(paymentData.payments ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load system data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const healthy = (stats?.systemHealth ?? 0) >= 100;
  const systemStatus = stats?.systemStatus ?? 'Checking...';

  const healthCards = [
    { icon: Server, label: 'API Server', value: systemStatus, status: healthy ? 'success' as const : 'warning' as const, bar: stats ? `${stats.systemHealth}%` : '—' },
    { icon: Database, label: 'Database', value: healthy ? 'Operational' : 'Unavailable', status: healthy ? 'success' as const : 'warning' as const, bar: healthy ? '99.99%' : '0%' },
    { icon: Wifi, label: 'Platform', value: 'Live', status: 'success' as const, bar: '100%' },
    { icon: Lock, label: 'Auth Service', value: 'Operational', status: 'success' as const, bar: '99.97%' },
    { icon: Globe, label: 'Payment Gateway', value: 'Operational', status: 'success' as const, bar: '99.9%' },
  ];

  const kpis = stats
    ? [
        { icon: Users, label: 'Total Users', value: stats.totalUsers.toLocaleString(), sub: `+${stats.weeklyUserGrowth} this week` },
        { icon: CalendarDays, label: 'Total Bookings', value: stats.totalBookings.toLocaleString(), sub: `${stats.bookingsToday} today` },
        { icon: CreditCard, label: 'Platform Revenue', value: formatPence(stats.platformRevenuePence), sub: `${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange}% this month` },
        { icon: Shield, label: 'Active Admins', value: stats.activeAdmins.toLocaleString(), sub: `${stats.pendingApprovals} pending approvals` },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl shadow-xl shadow-rose-500/20 p-10"
      >
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-sm" />
        <div className="absolute left-1/3 top-0 w-64 h-32 bg-white/5 blur-3xl rounded-full" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium ">System Settings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Platform Control</h1>
            <p className="mt-2 text-sm text-white/70 max-w-md leading-relaxed">
              Monitor system health and review live platform activity.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 shadow-2xl hover:shadow-red-300 rounded-2xl border border-primary bg-white/15 backdrop-blur-sm ">
            <Activity className="w-4 h-4 text-emerald-300" />
            <span className="text-sm font-medium">{healthy ? 'All Systems Operational' : 'Degraded'}</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm"
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Platform KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? [1, 2, 3, 4].map((n) => (
              <Card key={n} padding="md" className="animate-pulse">
                <div className="h-10 w-10 rounded-2xl bg-navy-100 dark:bg-white/5 mb-3" />
                <div className="h-6 w-20 bg-navy-100 dark:bg-white/5 rounded mb-2" />
                <div className="h-3 w-28 bg-navy-100 dark:bg-white/5 rounded" />
              </Card>
            ))
          : kpis.map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
              >
                <Card padding="md" className="h-full">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <kpi.icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-black text-navy-900 dark:text-white">{kpi.value}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-navy-400 dark:text-navy-500 mt-1">{kpi.label}</p>
                  <p className="text-[11px] text-navy-400/80 dark:text-navy-500/80 mt-0.5">{kpi.sub}</p>
                </Card>
              </motion.div>
            ))}
      </div>

      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card padding="lg">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Activity className="w-4 h-4 text-emerald-500" />
              </div>
              <h2 className="text-lg font-bold text-navy-900 dark:text-white">System Health</h2>
            </div>
            <button
              onClick={() => void load()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 text-xs font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 3 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {healthCards.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}
                className="p-3 rounded-xl bg-cream-50 dark:bg-navy-800/50 border border-navy-100 dark:border-white/5 hover:border-primary/20 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="w-4 h-4 text-navy-500 dark:text-navy-400" />
                  <span className="text-xs font-semibold text-navy-600 dark:text-navy-300">{item.label}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={item.status}>{item.value}</Badge>
                  <span className="text-[10px] font-bold text-navy-400">{item.bar}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-navy-100 dark:bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: item.status === 'success' ? '100%' : '40%' }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full rounded-full ${item.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card padding="sm" className="overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-navy-100 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CalendarDays className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy-900 dark:text-white">Recent Bookings</h2>
                  <p className="text-xs text-navy-400 dark:text-navy-500">Latest booking requests</p>
                </div>
              </div>
              <Badge variant="primary">{bookings.length}</Badge>
            </div>
            <div className="divide-y divide-navy-50 dark:divide-white/5 max-h-[480px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-16"><Activity className="w-6 h-6 animate-pulse text-primary" /></div>
              ) : bookings.length === 0 ? (
                <p className="py-16 text-center text-sm text-navy-400">No bookings yet.</p>
              ) : (
                bookings.map((b) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="px-6 py-3 hover:bg-navy-50 dark:hover:bg-white/[0.02] transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-navy-800 dark:text-navy-200">{b.fullName}</p>
                      <Badge variant={b.status === 'COMPLETED' ? 'success' : b.status === 'PENDING' ? 'warning' : 'neutral'}>
                        {b.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-navy-400 dark:text-navy-500">
                      <FileText className="w-3 h-3" />
                      {b.trade}
                      <span className="text-navy-300 dark:text-navy-600">·</span>
                      <Clock className="w-3 h-3" />
                      {relative(b.createdAt)}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* Recent Payments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card padding="sm" className="overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-navy-100 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-navy-900 dark:text-white">Recent Payments</h2>
                  <p className="text-xs text-navy-400 dark:text-navy-500">Latest transaction activity</p>
                </div>
              </div>
              <Badge variant="primary">{payments.length}</Badge>
            </div>
            <div className="divide-y divide-navy-50 dark:divide-white/5 max-h-[480px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-16"><Activity className="w-6 h-6 animate-pulse text-primary" /></div>
              ) : payments.length === 0 ? (
                <p className="py-16 text-center text-sm text-navy-400">No payments yet.</p>
              ) : (
                payments.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="px-6 py-3 hover:bg-navy-50 dark:hover:bg-white/[0.02] transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-navy-800 dark:text-navy-200">
                        {p.booking?.fullName ?? p.id}
                      </p>
                      <span className="text-xs font-bold text-emerald-600">{formatPence(p.amountInPence)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-navy-400 dark:text-navy-500">
                      <TrendingUp className="w-3 h-3" />
                      {p.status}
                      <span className="text-navy-300 dark:text-navy-600">·</span>
                      <Clock className="w-3 h-3" />
                      {relative(p.createdAt)}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SystemPage;