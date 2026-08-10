import React from 'react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { useAuth } from '../../../Context/AuthContext';
import { Card } from '../../../Components/ui/shared/Card';
import { Badge } from '../../../Components/ui/shared/Badge';
import {
  Calendar,
  ClipboardList,
  MessageSquare,
  Bookmark,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Wrench,
  Sparkles,
  TrendingUp,
  Bell,
  Star,
  Zap,
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const MOCK_BOOKINGS = [
  { id: '1', service: 'Emergency Plumbing', provider: "Mike's Plumbing Co.", date: '2026-08-12', status: 'Accepted' as const, postcode: 'SW1A 1AA' },
  { id: '2', service: 'Full House Clean', provider: 'SparkleClean UK', date: '2026-08-15', status: 'Pending' as const, postcode: 'E1 6AN' },
  { id: '3', service: 'Garden Landscaping', provider: 'GreenThumb Pros', date: '2026-08-20', status: 'Completed' as const, postcode: 'W1D 3AL' },
  { id: '4', service: 'Electrical Inspection', provider: 'VoltFix Electricians', date: '2026-08-22', status: 'Pending' as const, postcode: 'N1 9GU' },
];

const STATUS_STYLES: Record<string, { badge: 'success' | 'warning' | 'neutral'; icon: React.FC<{ className?: string }>; dot: string }> = {
  Accepted: { badge: 'success', icon: CheckCircle2, dot: 'bg-emerald-500' },
  Pending: { badge: 'warning', icon: Clock, dot: 'bg-amber-500' },
  Completed: { badge: 'neutral', icon: CheckCircle2, dot: 'bg-navy-400' },
  Rejected: { badge: 'emergency' as 'warning', icon: XCircle, dot: 'bg-red-500' },
};

const AnimatedCounter: React.FC<{ value: string }> = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {value}
    </motion.span>
  );
};

const UserDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 sm:p-8 text-white shadow-xl shadow-primary/20"
      >
        {/* Decorative elements */}
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-sm" />
        <div className="absolute -right-4 bottom-0 w-28 h-28 rounded-full bg-white/5" />
        <div className="absolute left-1/2 top-0 w-64 h-32 bg-white/5 blur-3xl rounded-full" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-2 mb-2"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-white/80">Welcome back,</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold tracking-tight"
            >
              {user?.name || 'User'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-2 text-sm text-white/70 max-w-md leading-relaxed"
            >
              Manage your bookings, get quotes from trusted professionals, and track your service history all in one place.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, type: 'spring', stiffness: 200 }}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20"
          >
            <Bell className="w-4 h-4" />
            <span className="text-sm font-medium">3 new</span>
          </motion.div>
        </div>

        {/* Bottom decorative bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ClipboardList, label: 'Active Bookings', value: '2', color: 'from-blue-500 to-blue-600', lightColor: 'bg-blue-50 dark:bg-blue-500/10', textColor: 'text-blue-600 dark:text-blue-400', change: '+1 this week', trend: 'up' },
          { icon: MessageSquare, label: 'Pending Quotes', value: '3', color: 'from-amber-500 to-orange-500', lightColor: 'bg-amber-50 dark:bg-amber-500/10', textColor: 'text-amber-600 dark:text-amber-400', change: '2 urgent', trend: 'up' },
          { icon: Bookmark, label: 'Saved Pros', value: '5', color: 'from-primary to-primary/80', lightColor: 'bg-primary/10', textColor: 'text-primary', change: '+2 this month', trend: 'up' },
          { icon: Calendar, label: 'Completed', value: '12', color: 'from-emerald-500 to-emerald-600', lightColor: 'bg-emerald-50 dark:bg-emerald-500/10', textColor: 'text-emerald-600 dark:text-emerald-400', change: 'All time', trend: 'up' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card hover padding="md" className="h-full group relative overflow-hidden">
              {/* Gradient accent top border */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-2xl ${stat.lightColor} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                  <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
                <div className="flex items-center gap-1 text-emerald-500">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold">{stat.change}</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-navy-900 dark:text-white tracking-tight">
                <AnimatedCounter value={stat.value} />
              </p>
              <p className="text-[11px] font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-widest mt-1.5">
                {stat.label}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card padding="sm" className="overflow-hidden">
          <div className="px-6 py-4 border-b border-navy-100 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <ClipboardList className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900 dark:text-white">Recent Bookings</h2>
                <p className="text-xs text-navy-400 dark:text-navy-500 mt-0.5">Your latest service requests</p>
              </div>
            </div>
            <Badge variant="primary">{MOCK_BOOKINGS.length} Active</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-100 dark:border-white/10 bg-navy-50/50 dark:bg-white/[0.02]">
                  <th className="text-left py-3 px-6 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider">Service</th>
                  <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider hidden md:table-cell">Provider</th>
                  <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider hidden sm:table-cell">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider hidden lg:table-cell">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_BOOKINGS.map((booking, i) => {
                  const statusConfig = STATUS_STYLES[booking.status] || STATUS_STYLES.Pending;
                  return (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
                      className="border-b border-navy-50 dark:border-white/5 last:border-0 hover:bg-navy-50 dark:hover:bg-white/[0.02] transition-all duration-200 group"
                    >
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                            <Wrench className="w-4 h-4 text-primary" />
                          </div>
                          <span className="font-semibold text-navy-800 dark:text-navy-200">{booking.service}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-navy-500 dark:text-navy-400 hidden md:table-cell">{booking.provider}</td>
                      <td className="py-3.5 px-4 hidden sm:table-cell">
                        <span className="text-navy-500 dark:text-navy-400 text-sm">
                          {new Date(booking.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 hidden lg:table-cell">
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400 text-xs">
                          <MapPin className="w-3 h-3" />
                          {booking.postcode}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                          <Badge variant={statusConfig.badge}>
                            {booking.status}
                          </Badge>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Find a Professional', desc: 'Browse verified local pros', href: '/professionals', icon: Wrench, gradient: 'from-blue-500/10 to-blue-600/10' },
          { label: 'Browse Services', desc: 'Explore all available services', href: '/services', icon: Zap, gradient: 'from-primary/10 to-primary/5' },
          { label: 'Edit Profile', desc: 'Update your information', href: '/dashboard/profile', icon: Star, gradient: 'from-amber-500/10 to-orange-500/10' },
        ].map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <RouterLink
              to={action.href}
              className="flex items-center justify-between p-4 rounded-2xl border border-navy-100 dark:border-white/5 hover:border-primary/30 dark:hover:border-primary/30 bg-white dark:bg-navy-900 transition-all duration-300 group h-full hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy-800 dark:text-navy-200">{action.label}</p>
                  <p className="text-xs text-navy-400 dark:text-navy-500 mt-0.5">{action.desc}</p>
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

export default UserDashboard;
