import React from 'react';
import { Reveal } from '../../Components/ui/Reveal';

export const ServiceWhyChoose: React.FC = () => {
  return (
    <Reveal delay={0.15}>
      <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <h2 className="text-xl font-heading font-extrabold text-navy-950 dark:text-white mb-6">
          Why Choose LocalHero?
        </h2>
        <div className="space-y-4">
          {[
            'DBS-checked & background verified professionals',
            'Public liability insurance up to £2M included',
            'Same-day emergency & scheduled appointments',
            'No upfront payment — pay only after completion',
            'Transparent fixed pricing with free instant quotes',
          ].map((feat, idx) => (
            <div key={idx} className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-navy-800/40 transition">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-sm">
                ✓
              </div>
              <span className="text-sm font-medium text-navy-700 dark:text-navy-200">{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
};
