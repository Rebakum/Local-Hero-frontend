import React from 'react';
import { Logo } from './Logo'; // এই লাইনটি মুছে ফেলুন (মুছে ফেলা হয়েছে)
import { ThemeToggle } from '../ThemeToggle';
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
    <div className="flex lg:hidden items-center gap-4">
     
      <ThemeToggle atTop={atTop} isScrolled={isScrolled} />

      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="p-2.5 rounded-xl transition-all duration-300 bg-navy-100 dark:bg-navy-800/80 text-navy-800 dark:text-navy-100"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  );
};