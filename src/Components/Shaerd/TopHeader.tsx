import React from 'react';
import { useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

interface TopHeaderProps {
  isScrolled: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ isScrolled }) => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  if (isScrolled || !isHome) return null;

  return (
    <div className="hidden md:block bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="container-lh h-9 flex items-center justify-between gap-4 text-[10px] sm:text-[11px] font-semibold text-white/60">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Trusted &amp; Certified
          <span className="text-white/20">•</span>
          UK-wide emergency dispatch 24/7
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-primary" />
            London, UK
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <a
            href="tel:+448009178020"
            className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3 text-primary" />
            0800 917 8020
          </a>
          <a
            href="mailto:hello@localhero.com"
            className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors"
          >
            <Mail className="w-3 h-3 text-primary" />
            hello@localhero.com
          </a>
        </div>
      </div>
    </div>
  );
};
