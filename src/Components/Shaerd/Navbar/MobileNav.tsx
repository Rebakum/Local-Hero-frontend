import React from 'react';
import { Logo } from './Logo'; // এই লাইনটি মুছে ফেলুন (মুছে ফেলা হয়েছে)
import { ThemeToggle } from '../ThemeToggle';
import { NotificationBell } from './NotificationBell';
import { Menu, X } from 'lucide-react';

interface MobileNavToggleProps {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  atTop: boolean;
  isScrolled: boolean;
  isTransparent: boolean;
}

export const MobileNavToggle: React.FC<MobileNavToggleProps> = ({
  mobileOpen,
  setMobileOpen,
  atTop,
  isScrolled,
  isTransparent,
}) => {
  return (
    <div className="flex lg:hidden items-center gap-2 sm:gap-4">
      <NotificationBell atTop={atTop} variant="chip" />
      <ThemeToggle atTop={atTop} isScrolled={isScrolled} variant="chip" />

      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="p-2.5 rounded-full transition-all duration-300 text-primary hover:bg-navy-100 dark:hover:bg-white/10 active:scale-95"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  );
};