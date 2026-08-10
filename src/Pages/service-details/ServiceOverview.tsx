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
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Award size={20} />
          </div>
          <h2 className="text-xl font-heading font-extrabold text-navy-950 dark:text-white">
            Service Overview
          </h2>
        </div>
        <p className="text-sm sm:text-base text-navy-600 dark:text-navy-300 leading-relaxed">
          {description}
        </p>

        {/* Badges Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex flex-wrap gap-4">
          <div className="flex items-center gap-2.5 rounded-2xl bg-primary/10 border border-primary/20 px-4 py-3">
            <span className="text-xs font-bold text-navy-400 uppercase tracking-wider">Starting From</span>
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
