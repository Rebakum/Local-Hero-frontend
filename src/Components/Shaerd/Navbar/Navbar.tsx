import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useBooking } from '../../../Context/BookingContext';
import { TopHeader } from '../TopHeader';
import { Logo } from './Logo';
import { DesktopNav } from './DesktopNav';
import { MobileNavToggle } from './MobileNav';
import { MobileMenu } from './MobileMenu';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openBooking } = useBooking();
  const { pathname } = useLocation();

  const isHome = pathname === '/';
  const atTop = !isScrolled && isHome;
  const isTransparent = atTop;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        atTop
          ? 'bg-white dark:bg-navy-950 border-b border-transparent'
          : 'border-b border-black/[0.06] dark:border-white/[0.06] shadow-lg bg-white/95 dark:bg-navy-900/95 backdrop-blur-xl'
      }`}
    >
     

      <div className="container-lh h-14 sm:h-16 md:h-20 flex items-center justify-between gap-5 sm:gap-4 px-3 sm:px-4 md:px-6">

        <Logo atTop={atTop} />
        <DesktopNav
          pathname={pathname}
          atTop={atTop}
          isScrolled={isScrolled}
          isTransparent={isTransparent}
          openBooking={openBooking}
        />
        <MobileNavToggle
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          atTop={atTop}
          isScrolled={isScrolled}
          isTransparent={isTransparent}
        />
      </div>

      <MobileMenu
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        pathname={pathname}
      />
    </motion.header>
  );
};

export default Navbar;