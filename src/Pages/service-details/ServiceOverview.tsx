import React from 'react';
import { Clock, Star, Award } from 'lucide-react';
import { Reveal } from '../../Components/ui/Reveal';

interface ServiceOverviewProps {
  description: string;
  estimatedPrice: string;
  timeEstimate: string;
  popularFor?: string;
}

export const ServiceOverview: React.FC<ServiceOverviewProps> = ({
  description,
  estimatedPrice,
  timeEstimate,
  popularFor,
}) => {
  return (
    <Reveal>
      <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-glow">
            <Award size={20} />
          </div>
          <h2 className="text-xl font-heading font-extrabold text-navy-950 dark:text-white">
            Service Overview
          </h2>
        </div>
        <p className="text-sm sm:text-base text-navy-800 dark:text-navy-300 leading-relaxed">
          {description}
        </p>

        {/* Badges Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-wrap gap-4">
          <div className="flex items-center gap-2.5 rounded-2xl bg-primary/10 border border-primary/20 px-4 py-3">
            <span className="text-xs font-bold text-navy-800 dark:text-navy-300 uppercase tracking-wider">Starting From</span>
            <span className="text-base font-black text-primary">{estimatedPrice}</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-slate-100 dark:bg-navy-800 px-4 py-3">
            <Clock size={16} className="text-primary" />
            <span className="text-sm font-semibold text-navy-800 dark:text-navy-200">{timeEstimate}</span>
          </div>
          {popularFor && (
            <div className="flex items-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-4 py-3">
              <Star size={16} className="text-amber-500 fill-amber-500" />
              <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{popularFor}</span>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
};
