import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../../../Components/ui/shared/Card';
import { Badge } from '../../../Components/ui/shared/Badge';
import {
  Shield,
  Flag,
  Star,
  AlertTriangle,
  Check,
  X,
  Search,
  Filter,
  Loader2,
  TrendingUp,
  UserX,
  MessageSquare,
} from 'lucide-react';

type ModerationType = 'review' | 'account';

interface FlaggedItem {
  id: string;
  type: ModerationType;
  title: string;
  description: string;
  author: string;
  service?: string;
  rating?: number;
  reason: string;
  reportedAt: string;
  status: 'pending' | 'resolved';
}

const MOCK_ITEMS: FlaggedItem[] = [
  { id: 'M-001', type: 'review', title: 'Inappropriate language in review', description: 'Review contains offensive language and personal attacks against the provider.', author: 'Anonymous', service: 'Plumbing', rating: 1, reason: 'Offensive content', reportedAt: '2 hours ago', status: 'pending' },
  { id: 'M-002', type: 'account', title: 'Fake business credentials', description: 'Account claims Gas Safe registration but documentation appears forged.', author: 'QuickFix Services', reason: 'Fraudulent credentials', reportedAt: '5 hours ago', status: 'pending' },
  { id: 'M-003', type: 'review', title: 'Competitor spam review', description: 'Review appears to be from a competing business promoting their own services.', author: 'HomeServices Ltd', service: 'Cleaning', rating: 1, reason: 'Spam / Competitor', reportedAt: '1 day ago', status: 'pending' },
  { id: 'M-004', type: 'account', title: 'Multiple account abuse', description: 'Same user operating multiple accounts to artificially boost ratings.', author: 'user_2847', reason: 'Multi-account abuse', reportedAt: '2 days ago', status: 'resolved' },
  { id: 'M-005', type: 'review', title: 'Fake positive review', description: 'Review appears self-generated with generic language and no specific details.', author: 'John Smith', service: 'Electrical', rating: 5, reason: 'Fake review', reportedAt: '3 days ago', status: 'pending' },
  { id: 'M-006', type: 'account', title: 'Spam messaging', description: 'Account sending unsolicited promotional messages to multiple customers.', author: 'DiscountPlumbing', reason: 'Spam behaviour', reportedAt: '4 days ago', status: 'resolved' },
];

const TYPE_CONFIG: Record<ModerationType, { badge: 'warning' | 'emergency'; icon: React.FC<{ className?: string }>; label: string }> = {
  review: { badge: 'warning', icon: Star, label: 'Review' },
  account: { badge: 'emergency', icon: UserX, label: 'Account' },
};

const Moderation: React.FC = () => {
  const [items, setItems] = useState<FlaggedItem[]>(MOCK_ITEMS);
  const [activeFilter, setActiveFilter] = useState<'ALL' | ModerationType>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'pending' | 'resolved'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filtered = items.filter((item) => {
    const matchesType = activeFilter === 'ALL' || item.type === activeFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const counts = {
    ALL: items.length,
    review: items.filter((i) => i.type === 'review').length,
    account: items.filter((i) => i.type === 'account').length,
    pending: items.filter((i) => i.status === 'pending').length,
  };

  const handleAction = async (id: string, action: 'approve' | 'remove') => {
    setActionLoading(id);
    await new Promise((r) => setTimeout(r, 600));
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'resolved' } : item))
    );
    setActionLoading(null);
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-500 to-purple-500 p-6 sm:p-8 text-white shadow-xl shadow-violet-500/20"
      >
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-sm" />
        <div className="absolute left-1/3 top-0 w-64 h-32 bg-white/5 blur-3xl rounded-full" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-white/80">Content Moderation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Moderation Queue</h1>
            <p className="mt-2 text-sm text-white/70 max-w-md leading-relaxed">
              Review flagged content and reported accounts to maintain platform quality.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
            <AlertTriangle className="w-4 h-4 text-amber-300" />
            <span className="text-sm font-medium">{counts.pending} Pending</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Flagged', value: counts.ALL, color: 'from-red-500 to-red-600', lightColor: 'bg-red-50 dark:bg-red-500/10', textColor: 'text-red-600 dark:text-red-400', icon: Flag },
          { label: 'Pending Review', value: counts.pending, color: 'from-amber-500 to-orange-500', lightColor: 'bg-amber-50 dark:bg-amber-500/10', textColor: 'text-amber-600 dark:text-amber-400', icon: AlertTriangle },
          { label: 'Review Flags', value: counts.review, color: 'from-blue-500 to-blue-600', lightColor: 'bg-blue-50 dark:bg-blue-500/10', textColor: 'text-blue-600 dark:text-blue-400', icon: Star },
          { label: 'Account Flags', value: counts.account, color: 'from-violet-500 to-violet-600', lightColor: 'bg-violet-50 dark:bg-violet-500/10', textColor: 'text-violet-600 dark:text-violet-400', icon: UserX },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
          >
            <Card hover padding="md" className="h-full group relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className={`w-10 h-10 rounded-2xl ${stat.lightColor} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
              </div>
              <p className="text-2xl font-bold text-navy-900 dark:text-white">{stat.value}</p>
              <p className="text-[11px] font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-widest mt-1">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <div className="flex flex-wrap gap-2">
          {([
            { key: 'ALL', label: 'All' },
            { key: 'review', label: 'Reviews' },
            { key: 'account', label: 'Accounts' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                activeFilter === tab.key
                  ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20'
                  : 'bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-white/10 border border-transparent'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 opacity-70">({counts[tab.key]})</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(['ALL', 'pending', 'resolved'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 ${
                statusFilter === s
                  ? 'bg-navy-800 dark:bg-white/10 text-white'
                  : 'bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-white/10'
              }`}
            >
              {s === 'ALL' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search flagged items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-lh pl-9 h-10 text-sm"
          />
        </div>
      </motion.div>

      {/* Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card padding="sm" className="overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Shield className="w-12 h-12 text-navy-300 dark:text-navy-600" />
              <p className="text-sm font-semibold text-navy-500 dark:text-navy-400">No flagged items found</p>
            </div>
          ) : (
            <div className="divide-y divide-navy-50 dark:divide-white/5">
              {filtered.map((item, i) => {
                const config = TYPE_CONFIG[item.type];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.04, duration: 0.4 }}
                    className="px-6 py-5 hover:bg-navy-50 dark:hover:bg-white/[0.02] transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge variant={config.badge}>{config.label}</Badge>
                          <h3 className="text-sm font-bold text-navy-900 dark:text-white">{item.title}</h3>
                          {item.status === 'resolved' && (
                            <Badge variant="success">Resolved</Badge>
                          )}
                        </div>
                        <p className="text-xs text-navy-400 dark:text-navy-500 mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-navy-500 dark:text-navy-400">
                          <span>By: <span className="font-semibold text-navy-700 dark:text-navy-300">{item.author}</span></span>
                          {item.service && <span>Service: {item.service}</span>}
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-navy-100 dark:bg-white/5">
                            <Flag className="w-3 h-3" /> {item.reason}
                          </span>
                          <span>{item.reportedAt}</span>
                        </div>
                      </div>

                      {item.status === 'pending' && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleAction(item.id, 'approve')}
                            disabled={actionLoading === item.id}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all duration-200 disabled:opacity-50 shadow-sm shadow-emerald-500/25"
                          >
                            {actionLoading === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(item.id, 'remove')}
                            disabled={actionLoading === item.id}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all duration-200 disabled:opacity-50"
                          >
                            <X className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default Moderation;
