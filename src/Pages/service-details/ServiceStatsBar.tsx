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
      <div className="mt-16 bg-white dark:bg-navy-800 border border-neutral-200 dark:border-white/10 rounded-3xl p-8 sm:p-10 shadow-lg">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x-0 lg:divide-x divide-slate-100 dark:divide-white/5">
          {stats.map((stat) => (
            <div key={stat.label} className="p-2">
              <div className="font-heading text-3xl sm:text-4xl font-black text-primary">{stat.value}</div>
              <div className="mt-1 text-xs font-semibold text-navy-500 dark:text-navy-300 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
};
