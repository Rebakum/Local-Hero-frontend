import React from 'react';
import { Eye, Ban, Pin, Star, MessagesSquare } from 'lucide-react';

export interface TestimonialStats {
  total: number;
  live: number;
  hidden: number;
  featured: number;
  average: number;
}

const STAT_CARDS: {
  key: keyof TestimonialStats;
  label: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  format: (v: TestimonialStats) => string;
}[] = [
  {
    key: 'total',
    label: 'Total Reviews',
    icon: MessagesSquare,
    color: 'bg-navy-500/10 text-navy-600 dark:text-navy-300',
    format: (s) => String(s.total),
  },
  {
    key: 'live',
    label: 'Live',
    icon: Eye,
    color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    format: (s) => String(s.live),
  },
  {
    key: 'hidden',
    label: 'Hidden',
    icon: Ban,
    color: 'bg-red-500/10 text-red-600 dark:text-red-400',
    format: (s) => String(s.hidden),
  },
  {
    key: 'featured',
    label: 'Featured',
    icon: Pin,
    color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    format: (s) => String(s.featured),
  },
  {
    key: 'average',
    label: 'Average Rating',
    icon: Star,
    color: 'bg-primary/10 text-primary',
    format: (s) => s.average.toFixed(1),
  },
];

export const TestimonialStats: React.FC<{ stats: TestimonialStats }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {STAT_CARDS.map((stat) => (
        <div
          key={stat.key}
          className="rounded-2xl border border-navy-100 dark:border-white/10 bg-white dark:bg-navy-800/50 p-4 flex items-center gap-3"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
            <stat.icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-navy-900 dark:text-white leading-tight">{stat.format(stats)}</p>
            <p className="text-[11px] font-semibold text-navy-500 dark:text-navy-400 uppercase tracking-widest truncate">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestimonialStats;