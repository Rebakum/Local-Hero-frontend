import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../../Context/AuthContext';
import { Card } from '../../../Components/ui/shared/Card';
import { Badge } from '../../../Components/ui/shared/Badge';
import {
  Zap,
  MapPin,
  Clock,
  PoundSterling,
  Search,
  Filter,
  Check,
  X,
  Flame,
  AlertTriangle,
  Send,
  Phone,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';

interface Lead {
  id: string;
  customer: string;
  service: string;
  postcode: string;
  budget: string;
  posted: string;
  urgent: boolean;
  description: string;
  distance: string;
}

const MOCK_LEADS: Lead[] = [
  { id: 'L-401', customer: 'Sarah Mitchell', service: 'Emergency Leak Repair', postcode: 'E1 6AN', budget: '£350', posted: '30 mins ago', urgent: true, description: 'Burst pipe in kitchen, water everywhere! Need someone ASAP.', distance: '0.8 mi' },
  { id: 'L-402', customer: 'James Wilson', service: 'Bathroom Renovation', postcode: 'SW1A 1AA', budget: '£2,500', posted: '2 hours ago', urgent: false, description: 'Full bathroom refit including tiling and plumbing.', distance: '2.1 mi' },
  { id: 'L-403', customer: 'Tom Bradley', service: 'Garden Fencing', postcode: 'W1D 3AL', budget: '£1,200', posted: '5 hours ago', urgent: false, description: 'Replace 15m of rear garden fencing with pressure-treated panels.', distance: '3.4 mi' },
  { id: 'L-404', customer: 'Emma Davies', service: 'Electrical Rewire', postcode: 'N1 9GU', budget: '£4,800', posted: '1 day ago', urgent: false, description: 'Full house rewire for 3-bed Victorian terrace. EICR included.', distance: '4.2 mi' },
  { id: 'L-405', customer: 'Olivia Chen', service: 'Emergency Lockout', postcode: 'WC2B 4RG', budget: '£120', posted: '15 mins ago', urgent: true, description: 'Locked out of flat, key snapped in lock. Need urgent help.', distance: '1.5 mi' },
  { id: 'L-406', customer: 'Daniel Brown', service: 'Boiler Service', postcode: 'SE1 2DU', budget: '£180', posted: '3 hours ago', urgent: false, description: 'Annual boiler service and safety check. Gas Safe registered required.', distance: '2.8 mi' },
];

const Leads: React.FC = () => {
  const { isApproved } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUrgent, setFilterUrgent] = useState(false);
  const [acceptedIds, setAcceptedIds] = useState<string[]>([]);
  const [declinedIds, setDeclinedIds] = useState<string[]>([]);

  const visibleLeads = MOCK_LEADS.filter(
    (l) =>
      !acceptedIds.includes(l.id) &&
      !declinedIds.includes(l.id) &&
      (!filterUrgent || l.urgent) &&
      (!searchQuery.trim() ||
        l.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.postcode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAccept = (id: string) => {
    setAcceptedIds((prev) => [...prev, id]);
  };

  const handleDecline = (id: string) => {
    setDeclinedIds((prev) => [...prev, id]);
  };

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
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-white/80">Available Leads</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Job Requests Nearby</h1>
            <p className="mt-2 text-sm text-white/70 max-w-md leading-relaxed">
              Accept or decline customer requests. The sooner you respond, the higher your chance of winning the job.
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
              <Flame className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium">{MOCK_LEADS.filter((l) => l.urgent).length} Urgent</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">{visibleLeads.length} Available</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/30 to-white/0" />
      </motion.div>

      {!isApproved && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Account pending verification</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">You can view leads but cannot send quotes until approved.</p>
          </div>
        </motion.div>
      )}

      {/* Filters + Search */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <button
          onClick={() => setFilterUrgent(!filterUrgent)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200 ${
            filterUrgent
              ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20'
              : 'bg-navy-100 dark:bg-white/5 text-navy-600 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-white/10 border border-transparent'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          Urgent Only
        </button>
        <div className="relative sm:ml-auto w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-lh pl-9 h-10 text-sm"
          />
        </div>
      </motion.div>

      {/* Leads List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <Card padding="sm" className="overflow-hidden">
          {visibleLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Zap className="w-12 h-12 text-navy-300 dark:text-navy-600" />
              <p className="text-sm font-semibold text-navy-500 dark:text-navy-400">No leads available</p>
              <p className="text-xs text-navy-400 dark:text-navy-500">Check back soon for new job requests in your area.</p>
            </div>
          ) : (
            <div className="divide-y divide-navy-50 dark:divide-white/5">
              {visibleLeads.map((lead, i) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.06, duration: 0.4 }}
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
                          {lead.postcode} ({lead.distance})
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400 text-xs">
                          <Clock className="w-3 h-3" />
                          {lead.posted}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold">
                          <PoundSterling className="w-3 h-3" />
                          {lead.budget}
                        </span>
                        <span className="text-xs text-navy-400 dark:text-navy-500">by {lead.customer}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDecline(lead.id)}
                        className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all duration-200"
                        title="Decline"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAccept(lead.id)}
                        disabled={!isApproved}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-emerald-500/25"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Accept
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default Leads;
