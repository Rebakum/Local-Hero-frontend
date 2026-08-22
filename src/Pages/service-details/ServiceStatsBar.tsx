import React from 'react';
import { Reveal } from '../../Components/ui/Reveal';

const stats = [
  { value: '25,000+', label: 'Jobs Completed' },
  { value: '4.9/5', label: 'Average Rating' },
  { value: '45 min', label: 'Emergency Response' },
  { value: '£2M', label: 'Insurance Cover' },
];

export const ServiceStatsBar: React.FC = () => {
  return (
    <Reveal delay={0.15}>
      <div className="mt-16 group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-8 sm:p-10 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x-0 lg:divide-x divide-slate-100 dark:divide-white/5">
          {stats.map((stat) => (
            <div key={stat.label} className="p-2">
              <div className="font-heading text-3xl sm:text-4xl font-black text-primary">{stat.value}</div>
              <div className="mt-1 text-xs font-semibold text-navy-800 dark:text-navy-300 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
};
