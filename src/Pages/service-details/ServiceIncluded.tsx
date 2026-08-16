import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Reveal } from '../../Components/ui/Reveal';

interface ServiceIncludedProps {
  included: string[];
}

export const ServiceIncluded: React.FC<ServiceIncludedProps> = ({ included }) => {
  return (
    <Reveal delay={0.1}>
      <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <h2 className="text-xl font-heading font-extrabold text-navy-950 dark:text-white mb-6">
          What's Included in This Service
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {included.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-navy-800/60 border border-slate-100 dark:border-white/5 p-4 transition hover:border-primary/30">
              <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <span className="text-sm font-semibold text-navy-800 dark:text-navy-100">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
};
