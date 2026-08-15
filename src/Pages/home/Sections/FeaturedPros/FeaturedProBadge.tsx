import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const AvailabilityBadge: React.FC<{ availability: string }> = ({ availability }) => {
  return (
    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1 rounded-full border border-white/10">
      {availability}
    </div>
  );
};

export const VerifiedBadge: React.FC = () => {
  return <ShieldCheck className="w-4 h-4 text-primary shrink-0" />;
};
