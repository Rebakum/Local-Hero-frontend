import React from 'react';
import { Reveal } from '../../Components/ui/Reveal';

export const ServiceWhyChoose: React.FC = () => {
  return (
    <Reveal delay={0.15}>
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm">
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
