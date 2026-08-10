import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Reveal } from '../../Components/ui/Reveal';

export const ServiceGuarantee: React.FC = () => {
  return (
    <Reveal delay={0.1}>
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-navy-800 dark:to-navy-900 border border-primary/20 rounded-3xl p-6 relative overflow-hidden">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-navy-950 dark:text-white text-base mb-1">
              LocalHero Guarantee
            </h3>
            <p className="text-xs text-navy-600 dark:text-navy-300 leading-relaxed">
              Every booking is backed by our £2M public liability insurance and 100% satisfaction promise.
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
};
