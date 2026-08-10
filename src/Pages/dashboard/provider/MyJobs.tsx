import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../../../Components/ui/shared/Card';
import { Badge } from '../../../Components/ui/shared/Badge';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  PoundSterling,
  MapPin,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  Star,
  Phone,
  MessageSquare,
  Wrench,
} from 'lucide-react';

type TabKey = 'ongoing' | 'completed' | 'earnings';

interface OngoingJob {
  id: string;
  service: string;
  customer: string;
  postcode: string;
  date: string;
  time: string;
  status: 'Accepted' | 'In Progress';
  value: string;
}

interface CompletedJob {
  id: string;
  service: string;
  customer: string;
  postcode: string;
  completedDate: string;
  value: string;
  rating: number;
  review: string;
}

const MOCK_ONGOING: OngoingJob[] = [
  { id: 'J-101', service: 'Bathroom Renovation', customer: 'James Wilson', postcode: 'SW1A 1AA', date: '2026-08-12', time: '09:00', status: 'In Progress', value: '£2,500' },
  { id: 'J-102', service: 'Boiler Service', customer: 'Daniel Brown', postcode: 'SE1 2DU', date: '2026-08-14', time: '14:00', status: 'Accepted', value: '£180' },
  { id: 'J-103', service: 'Garden Fencing', customer: 'Tom Bradley', postcode: 'W1D 3AL', date: '2026-08-18', time: '10:00', status: 'Accepted', value: '£1,200' },
];

const MOCK_COMPLETED: CompletedJob[] = [
  { id: 'J-098', service: 'Emergency Leak Repair', customer: 'Sarah Mitchell', postcode: 'E1 6AN', completedDate: '2026-08-05', value: '£350', rating: 5, review: 'Fantastic work, arrived within the hour!' },
  { id: 'J-095', service: 'Full House Clean', customer: 'Emma Davies', postcode: 'N1 9GU', completedDate: '2026-07-28', value: '£220', rating: 4, review: 'Very thorough, will book again.' },
  { id: 'J-091', service: 'Electrical Inspection', customer: 'Olivia Chen', postcode: 'WC2B 4RG', completedDate: '2026-07-15', value: '£150', rating: 5, review: 'Professional and efficient. Highly recommended.' },
  { id: 'J-088', service: 'Lock Replacement', customer: 'Tom Bradley', postcode: 'W1D 3AL', completedDate: '2026-07-10', value: '£95', rating: 5, review: 'Quick response, job done perfectly.' },
];

const MOCK_EARNINGS = {
  thisMonth: '£3,420',
  lastMonth: '£3,050',
  change: '+12%',
  total: '£28,740',
  averageJob: '£245',
  jobsThisMonth: 14,
  monthlyHistory: [
    { month: 'Mar', amount: 2100 },
    { month: 'Apr', amount: 2800 },
    { month: 'May', amount: 3200 },
    { month: 'Jun', amount: 2950 },
    { month: 'Jul', amount: 3050 },
    { month: 'Aug', amount: 3420 },
  ],
};

const MyJobs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('ongoing');

  const tabs: { key: TabKey; label: string; icon: React.FC<{ className?: string }>; count: number }[] = [
    { key: 'ongoing', label: 'Ongoing Jobs', icon: Briefcase, count: MOCK_ONGOING.length },
    { key: 'completed', label: 'Completed Jobs', icon: CheckCircle2, count: MOCK_COMPLETED.length },
    { key: 'earnings', label: 'Earnings', icon: PoundSterling, count: 0 },
  ];

  const maxEarning = Math.max(...MOCK_EARNINGS.monthlyHistory.map((m) => m.amount));

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-6 sm:p-8 text-white shadow-xl shadow-emerald-500/20"
      >
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-sm" />
        <div className="absolute left-1/3 top-0 w-64 h-32 bg-white/5 blur-3xl rounded-full" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-white/80">My Jobs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Job Management</h1>
            <p className="mt-2 text-sm text-white/70 max-w-md leading-relaxed">
              Track your ongoing work, review completed jobs, and monitor your earnings.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
            <PoundSterling className="w-4 h-4" />
            <span className="text-sm font-medium">{MOCK_EARNINGS.thisMonth} this month</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex gap-2"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20'
                : 'bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-white/10 border border-transparent'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {tab.count > 0 && <span className="opacity-70">({tab.count})</span>}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'ongoing' && (
        <motion.div
          key="ongoing"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card padding="sm" className="overflow-hidden">
            {MOCK_ONGOING.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Briefcase className="w-12 h-12 text-navy-300 dark:text-navy-600" />
                <p className="text-sm font-semibold text-navy-500 dark:text-navy-400">No ongoing jobs</p>
              </div>
            ) : (
              <div className="divide-y divide-navy-50 dark:divide-white/5">
                {MOCK_ONGOING.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.4 }}
                    className="px-6 py-5 hover:bg-navy-50 dark:hover:bg-white/[0.02] transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="text-sm font-bold text-navy-900 dark:text-white">{job.service}</h3>
                          <Badge variant={job.status === 'In Progress' ? 'primary' : 'warning'}>{job.status}</Badge>
                        </div>
                        <p className="text-xs text-navy-400 dark:text-navy-500 mb-3">Customer: {job.customer}</p>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400 text-xs">
                            <MapPin className="w-3 h-3" /> {job.postcode}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400 text-xs">
                            <Calendar className="w-3 h-3" /> {new Date(job.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} at {job.time}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold">
                            <PoundSterling className="w-3 h-3" /> {job.value}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button className="w-9 h-9 rounded-xl bg-navy-100 dark:bg-white/5 flex items-center justify-center text-navy-500 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-white/10 transition-all" title="Call">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 rounded-xl bg-navy-100 dark:bg-white/5 flex items-center justify-center text-navy-500 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-white/10 transition-all" title="Message">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {activeTab === 'completed' && (
        <motion.div
          key="completed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card padding="sm" className="overflow-hidden">
            <div className="divide-y divide-navy-50 dark:divide-white/5">
              {MOCK_COMPLETED.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.4 }}
                  className="px-6 py-5 hover:bg-navy-50 dark:hover:bg-white/[0.02] transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-sm font-bold text-navy-900 dark:text-white">{job.service}</h3>
                        <Badge variant="success">Completed</Badge>
                      </div>
                      <p className="text-xs text-navy-400 dark:text-navy-500 mb-2">Customer: {job.customer}</p>
                      <div className="flex items-center gap-2 mb-2">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} className={`w-3 h-3 ${s < job.rating ? 'text-amber-400 fill-amber-400' : 'text-navy-200 dark:text-navy-700'}`} />
                        ))}
                        <span className="text-xs text-navy-400 dark:text-navy-500">"{job.review}"</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400 text-xs">
                          <MapPin className="w-3 h-3" /> {job.postcode}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400 text-xs">
                          <Calendar className="w-3 h-3" /> {new Date(job.completedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold">
                          <PoundSterling className="w-3 h-3" /> {job.value}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {activeTab === 'earnings' && (
        <motion.div
          key="earnings"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Earnings Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'This Month', value: MOCK_EARNINGS.thisMonth, change: MOCK_EARNINGS.change, color: 'from-emerald-500 to-emerald-600', lightColor: 'bg-emerald-50 dark:bg-emerald-500/10', textColor: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'Last Month', value: MOCK_EARNINGS.lastMonth, change: '', color: 'from-blue-500 to-blue-600', lightColor: 'bg-blue-50 dark:bg-blue-500/10', textColor: 'text-blue-600 dark:text-blue-400' },
              { label: 'Total Earned', value: MOCK_EARNINGS.total, change: '', color: 'from-primary to-primary/80', lightColor: 'bg-primary/10', textColor: 'text-primary' },
              { label: 'Avg. Job Value', value: MOCK_EARNINGS.averageJob, change: `${MOCK_EARNINGS.jobsThisMonth} jobs`, color: 'from-amber-500 to-orange-500', lightColor: 'bg-amber-50 dark:bg-amber-500/10', textColor: 'text-amber-600 dark:text-amber-400' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
              >
                <Card hover padding="md" className="h-full group relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className={`w-10 h-10 rounded-2xl ${stat.lightColor} flex items-center justify-center mb-3`}>
                    <PoundSterling className={`w-5 h-5 ${stat.textColor}`} />
                  </div>
                  <p className="text-2xl font-bold text-navy-900 dark:text-white">{stat.value}</p>
                  <p className="text-[11px] font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-widest mt-1">{stat.label}</p>
                  {stat.change && <p className="text-xs text-emerald-500 mt-1 font-semibold">{stat.change}</p>}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Chart */}
          <Card padding="lg">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-navy-900 dark:text-white">Monthly Earnings</h2>
            </div>
            <div className="flex items-end gap-3 h-48">
              {MOCK_EARNINGS.monthlyHistory.map((item, i) => (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-navy-700 dark:text-navy-300">£{(item.amount / 1000).toFixed(1)}k</span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.amount / maxEarning) * 100}%` }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full rounded-t-xl bg-gradient-to-t from-primary to-primary/70 min-h-[4px]"
                  />
                  <span className="text-[10px] font-semibold text-navy-500 dark:text-navy-400">{item.month}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default MyJobs;
