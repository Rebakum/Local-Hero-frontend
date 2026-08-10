import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { motion, AnimatePresence } from 'framer-motion'; // Motion standard import
import { loaderData } from '../../lib/loaderData';


export const LoadingSplash: React.FC = () => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loading-splash"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 bg-black"
          exit={{ opacity: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }}
        >
          <div className="relative w-28 h-28">
            <Lottie animationData={loaderData} loop autoplay className="absolute inset-0" />
          </div>
          <img src='/logoBlack/logo3.png' alt="LocalHero" className="h-10 w-auto select-none" />
          <div className="w-44 h-0.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'left' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};