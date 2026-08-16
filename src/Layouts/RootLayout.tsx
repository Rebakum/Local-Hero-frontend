import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ThemeProvider } from '../Context/ThemeContext';
import { BookingProvider } from '../Context/BookingContext';
import { SmoothScroll } from '../Components/ui/SmoothScroll';
import { LoadingSplash } from '../Components/ui/LoadingSplash';
import { BookingModal } from '../Components/Modals/BookingModal/BookingModal';
import { EmergencyModal } from '../Components/Modals/EmergencyModal';
import { ProDetailsModal } from '../Components/Modals/ProDetailsModal';

import { Footer } from '../Components/Shaerd/Footer/Footer';
import Navbar from '../Components/Shaerd/Navbar/Navbar';

export const RootLayout: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <ThemeProvider>
      <BookingProvider>
        <SmoothScroll>
          <div className="min-h-screen bg-cream-100 dark:bg-navy-950 font-body text-navy-800 dark:text-navy-200 overflow-x-clip transition-colors duration-300">
            <LoadingSplash />
            <Navbar />
            <main>
              <Outlet />
            </main>
            <Footer />
            <BookingModal />
            <EmergencyModal />
            <ProDetailsModal />
          </div>
        </SmoothScroll>
      </BookingProvider>
    </ThemeProvider>
  );
};
