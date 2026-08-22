import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../../Context/AuthContext';
import { Card } from '../../../Components/ui/shared/Card';
import {
  Users,
  AlertTriangle,
  Clock,
  MapPin,
  ArrowRight,
  XCircle,
  Zap,
  CheckCircle2,
  BarChart3,
  Wallet,
  CalendarCheck,
  Loader2,
  TrendingUp,
} from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getProviderBookings, type BookingRecord } from '../../../services/booking.service';
import { AnimatedCounter } from '../../../Components/dashboard/AnimatedCounter';
import { DataTable } from '../../../Components/ui/DataTable';

const formatPrice = (pence: number | null) =>
  pence == null ? '—' : `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;

const ProviderDashboard: React.FC = () => {
  const { user, isApproved } = useAuth();
  const navigate = useNavigate();
  const approvalStatus = user?.approvalStatus;

  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    try {
      const data = await getProviderBookings();
      setBookings(data);
    } catch {
      // Dashboard stays usable even if the fetch fails.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const pendingCount = useMemo(() => bookings.filter((b) => b.status === 'PENDING').length, [bookings]);
  const appointmentsCount = useMemo(
    () => bookings.filter((b) => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS').length,
    [bookings]
  );
  const completedCount = useMemo(() => bookings.filter((b) => b.status === 'COMPLETED').length, [bookings]);
  const totalEarned = useMemo(
    () => bookings.reduce((sum, b) => sum + (b.payment?.status === 'PAID' ? (b.payment.amountInPence ?? 0) : 0), 0),
    [bookings]
  );

  const isPending = approvalStatus === 'PENDING';
  const isRejected = approvalStatus === 'REJECTED';

  const stats = [
    { icon: Zap, label: 'Pending Requests', value: String(pendingCount), change: 'needs reply', color: 'from-amber-500 to-orange-500', lightColor: 'bg-amber-50 dark:bg-amber-500/10', textColor: 'text-amber-600 dark:text-amber-400' },
    { icon: CalendarCheck, label: 'Appointments', value: String(appointmentsCount), change: 'upcoming', color: 'from-blue-500 to-blue-600', lightColor: 'bg-blue-50 dark:bg-blue-500/10', textColor: 'text-blue-600 dark:text-blue-400' },
    { icon: CheckCircle2, label: 'Completed', value: String(completedCount), change: 'all time', color: 'from-emerald-500 to-emerald-600', lightColor: 'bg-emerald-50 dark:bg-emerald-500/10', textColor: 'text-emerald-600 dark:text-emerald-400' },
    { icon: Wallet, label: 'Total Earned', value: formatPrice(totalEarned), change: 'from paid jobs', color: 'from-primary to-primary/80', lightColor: 'bg-primary/10', textColor: 'text-primary' },
  ];

  return (
    <div className="space-y-8">
      {/* Approval Status Banner */}
      {!isApproved && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-2xl border p-5 ${
            isRejected
              ? 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-500/10 dark:to-rose-500/10 border-red-200 dark:border-red-500/20'
              : 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border-amber-200 dark:border-amber-500/20'
          }`}
        >
          <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${isRejected ? 'bg-red-200/30 dark:bg-red-500/10' : 'bg-amber-200/30 dark:bg-amber-500/10'}`} />
          <div className="relative flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isRejected ? 'bg-red-100 dark:bg-red-500/20' : 'bg-amber-100 dark:bg-amber-500/20'}`}>
              {isRejected ? (
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              {isRejected ? (
                <>
                  <p className="text-sm font-bold text-red-700 dark:text-red-300">Your application was rejected</p>
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1 leading-relaxed">
                    Your service provider application didn't pass the review. You can contact support or re-apply with corrected information.
                  </p>
                </>
              ) : isPending ? (
                <>
                  <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Application submitted - under review</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 leading-relaxed">
                    Status: Submitted. Your application is pending review by Super Admin. You'll get full access once approved.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Your account is pending verification by Admin</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 leading-relaxed">
                    You have limited access until your account is approved. Once verified, you can start receiving and responding to leads.
                  </p>
                </>
              )}
            </div>
            {isPending && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-500/20 shrink-0">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300">Submitted</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

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
              {user?.name || 'Provider'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-2 text-sm text-navy-950/70 dark:text-white/70 max-w-md leading-relaxed"
            >
              Manage your leads, appointments and earnings with LocalHero.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-navy-100/60 dark:bg-white/10 backdrop-blur-sm border border-navy-100 dark:border-white/20"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">{pendingCount} Pending</span>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </motion.div>

      {/* Stats */}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-7 h-7 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
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
                  <div className="flex items-center gap-1 text-emerald-500">
                    <TrendingUp className="w-3.5 3" />
                    <span className="text-[10px] font-semibold">{stat.change}</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-navy-900 dark:text-white tracking-tight">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="text-[11px] font-semibold text-navy-800 dark:text-navy-300 uppercase tracking-widest mt-1.5">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Recent Lead Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <DataTable<BookingRecord>
          isLoading={loading}
          loadingText="Loading booking requests..."
          data={bookings.filter((b) => b.status === 'PENDING')}
          rowKey={(b) => b.id}
          searchable
          searchPlaceholder="Search requests..."
          searchKeys={(b) => [b.trade, b.description, b.postcode, b.address, b.fullName]}
          sortable
          filters={[
            {
              key: 'urgency',
              label: 'Urgency',
              options: [
                { value: 'Standard', label: 'Standard' },
                { value: 'Urgent (Same Day)', label: 'Urgent (Same Day)' },
                { value: 'Emergency 24/7 (45 Mins)', label: 'Emergency' },
              ],
            },
          ]}
          emptyTitle="No pending requests"
          emptyDescription="New booking requests will appear here."
          emptyIcon={<Zap className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
          columns={[
            {
              key: 'trade',
              header: 'Service',
              sortValue: (b) => b.trade,
              render: (lead) => (
                <div>
                  <p className="text-sm font-bold text-navy-900 dark:text-white capitalize">{lead.trade}</p>
                  <p className="text-xs text-navy-800 dark:text-navy-300 line-clamp-1 max-w-[220px]">
                    {lead.description}
                  </p>
                </div>
              ),
            },
            {
              key: 'customer',
              header: 'Customer',
              sortValue: (b) => b.fullName,
              render: (lead) => (
                <span className="text-sm text-navy-800 dark:text-navy-300">{lead.fullName}</span>
              ),
            },
            {
              key: 'date',
              header: 'Date',
              hideOn: 'md',
              sortValue: (b) => new Date(b.bookingDate).getTime(),
              render: (lead) => (
                <div className="text-xs text-navy-800 dark:text-navy-300 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {new Date(lead.bookingDate).toLocaleDateString('en-GB')}
                  </span>
                </div>
              ),
            },
            {
              key: 'time',
              header: 'Time',
              hideOn: 'lg',
              render: (lead) => (
                <div className="text-xs text-navy-800 dark:text-navy-300 whitespace-nowrap">
                  {lead.timeSlot}
                </div>
              ),
            },
            {
              key: 'location',
              header: 'Location',
              hideOn: 'lg',
              sortValue: (b) => b.postcode,
              render: (lead) => (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-navy-100 dark:bg-white/5 text-navy-800 dark:text-navy-300 text-xs">
                  <MapPin className="w-3 h-3" />
                  {lead.postcode}
                </span>
              ),
            },
            {
              key: 'urgency',
              header: 'Urgency',
              hideOn: 'sm',
              render: (lead) => (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  {lead.urgency}
                </span>
              ),
            },
          ]}
          actions={(lead) => (
            <button
              onClick={() => navigate('/dashboard/provider/leads')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all duration-200 shadow-sm shadow-primary/25"
            >
              Respond
              <ArrowRight className="w-3.5 3" />
            </button>
          )}
        />
      </motion.div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Edit Profile', desc: 'Update your business info', href: '/dashboard/profile', icon: Users, gradient: 'from-blue-500/10 to-blue-600/10' },
          { label: 'View Services', desc: 'See available service categories', href: '/services', icon: BarChart3, gradient: 'from-emerald-500/10 to-emerald-600/10' },
        ].map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <RouterLink
              to={action.href}
              className="flex items-center justify-between p-4 rounded-2xl border border-navy-100 dark:border-white/5 hover:border-primary/30 bg-white dark:bg-navy-900 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy-800 dark:text-navy-200">{action.label}</p>
                  <p className="text-xs text-navy-800 dark:text-navy-300 mt-0.5">{action.desc}</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-navy-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white text-navy-400 transition-all duration-300">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </RouterLink>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProviderDashboard;
