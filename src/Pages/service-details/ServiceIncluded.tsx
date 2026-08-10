import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Reveal } from '../../Components/ui/Reveal';

interface ServiceIncludedProps {
  included: string[];
}

export const ServiceIncluded: React.FC<ServiceIncludedProps> = ({ included }) => {
  return (
    <Reveal delay={0.1}>
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm">
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
