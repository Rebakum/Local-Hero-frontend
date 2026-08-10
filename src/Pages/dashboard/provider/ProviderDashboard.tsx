import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../../Context/AuthContext';
import { Card } from '../../../Components/ui/shared/Card';
import { Badge } from '../../../Components/ui/shared/Badge';
import {
  Users,
  Briefcase,
  PoundSterling,
  TrendingUp,
  AlertTriangle,
  Send,
  Clock,
  MapPin,
  Star,
  ArrowRight,
  Phone,
  MessageSquare,
  Flame,
  Zap,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const MOCK_LEADS = [
  { id: '1', customer: 'James Wilson', service: 'Bathroom Renovation', postcode: 'SW1A 1AA', budget: '£2,500', posted: '2 hours ago', urgent: false, description: 'Full bathroom refit including tiling and plumbing.' },
  { id: '2', customer: 'Sarah Mitchell', service: 'Emergency Leak Repair', postcode: 'E1 6AN', budget: '£350', posted: '30 mins ago', urgent: true, description: 'Burst pipe in kitchen, water everywhere!' },
  { id: '3', customer: 'Tom Bradley', service: 'Garden Fencing', postcode: 'W1D 3AL', budget: '£1,200', posted: '5 hours ago', urgent: false, description: 'Replace 15m of rear garden fencing.' },
  { id: '4', customer: 'Emma Davies', service: 'Electrical Rewire', postcode: 'N1 9GU', budget: '£4,800', posted: '1 day ago', urgent: false, description: 'Full house rewire for 3-bed Victorian terrace.' },
];

const ProviderDashboard: React.FC = () => {
  const { user, isApproved } = useAuth();
  const navigate = useNavigate();

  const goToLeads = () => navigate('/dashboard/provider/leads');

  return (
    <div className="space-y-8">
      {/* Approval Warning Banner */}
      {!isApproved && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-200 dark:border-amber-500/20 p-5"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-amber-200/30 dark:bg-amber-500/10" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                Your account is pending verification by Admin
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 leading-relaxed">
                You have limited access until your account is approved. Once verified, you can start receiving and responding to leads.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-6 sm:p-8 text-white shadow-xl shadow-emerald-500/20"
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
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-white/80">Service Provider Dashboard</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl sm:text-3xl font-bold tracking-tight"
            >
              Welcome, {user?.name || 'Provider'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-2 text-sm text-white/70 max-w-md leading-relaxed"
            >
              Manage your leads, track earnings, and grow your business with LocalHero.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, type: 'spring', stiffness: 200 }}
            className="hidden sm:flex flex-col items-end gap-2"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
              <Flame className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium">{MOCK_LEADS.filter(l => l.urgent).length} Urgent Leads</span>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Leads', value: '24', change: '+6 this week', color: 'from-blue-500 to-blue-600', lightColor: 'bg-blue-50 dark:bg-blue-500/10', textColor: 'text-blue-600 dark:text-blue-400' },
          { icon: Briefcase, label: 'Accepted Jobs', value: '8', change: '2 in progress', color: 'from-emerald-500 to-emerald-600', lightColor: 'bg-emerald-50 dark:bg-emerald-500/10', textColor: 'text-emerald-600 dark:text-emerald-400' },
          { icon: PoundSterling, label: 'Monthly Earnings', value: '£3,420', change: '+12% vs last month', color: 'from-primary to-primary/80', lightColor: 'bg-primary/10', textColor: 'text-primary' },
          { icon: Star, label: 'Average Rating', value: '4.9', change: '47 reviews', color: 'from-amber-500 to-orange-500', lightColor: 'bg-amber-50 dark:bg-amber-500/10', textColor: 'text-amber-600 dark:text-amber-400' },
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

      {/* Lead Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card padding="sm" className="overflow-hidden">
          <div className="px-6 py-4 border-b border-navy-100 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-4.5 h-4.5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900 dark:text-white">New Leads</h2>
                <p className="text-xs text-navy-400 dark:text-navy-500 mt-0.5">Customer quote requests in your area</p>
              </div>
            </div>
            <Badge variant="primary">{MOCK_LEADS.length} New</Badge>
          </div>
          <div className="divide-y divide-navy-50 dark:divide-white/5">
            {MOCK_LEADS.map((lead, i) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.06, duration: 0.4 }}
                className="px-6 py-5 hover:bg-navy-50 dark:hover:bg-white/[0.02] transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h3 className="text-sm font-bold text-navy-900 dark:text-white">{lead.service}</h3>
                      {lead.urgent && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider">
                          <Flame className="w-3 h-3" />
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-navy-400 dark:text-navy-500 line-clamp-1 mb-3">{lead.description}</p>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400 text-xs">
                        <MapPin className="w-3 h-3" />
                        {lead.postcode}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400 text-xs">
                        <Clock className="w-3 h-3" />
                        {lead.posted}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold">
                        <PoundSterling className="w-3 h-3" />
                        {lead.budget}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={goToLeads}
                      className="w-9 h-9 rounded-xl bg-navy-100 dark:bg-white/5 flex items-center justify-center text-navy-500 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-white/10 hover:text-navy-700 dark:hover:text-navy-200 transition-all duration-200"
                      title="Call"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={goToLeads}
                      className="w-9 h-9 rounded-xl bg-navy-100 dark:bg-white/5 flex items-center justify-center text-navy-500 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-white/10 hover:text-navy-700 dark:hover:text-navy-200 transition-all duration-200"
                      title="Message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={goToLeads}
                      disabled={!isApproved}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-primary/25"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send Quote
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
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

export default ProviderDashboard;
