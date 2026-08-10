import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const FooterBottom: React.FC = () => {
  return (
    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-[12px] text-white/40 font-normal">
        © 2026 LocalHero Ltd. All Rights Reserved.
      </p>

      <div className="flex items-center gap-4 text-[11px] text-white/50">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" /> TrustMark Accredited
        </span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Which? Trusted Trader
        </span>
      </div>
    </div>
  );
};