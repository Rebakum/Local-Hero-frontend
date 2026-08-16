import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../Context/ThemeContext';

export const DashboardLoading: React.FC = () => {
  const { theme } = useTheme();
  const logoSrc = theme === 'dark' ? '/logoBlack/logo4.png' : '/logoWhite/logo.png';
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white dark:bg-black transition-colors duration-300 overflow-hidden">
      {/* Ambient glow */}
      <motion.div
        className="pointer-events-none absolute w-[480px] h-[480px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(239,17,26,0.12) 0%, rgba(239,17,26,0.04) 45%, transparent 70%)',
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
      />

      {/* Logo + Ring */}
      <div className="relative flex h-40 w-40 items-center justify-center">
        {/* Faint static ring */}
        <div
          className={`absolute inset-0 rounded-full border-2 ${
            isDark ? 'border-white/10' : 'border-navy-900/10'
          }`}
        />

        {/* Sweeping gradient arc ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0%, rgba(239,17,26,0.95) 18%, transparent 42%)',
            WebkitMask:
              'radial-gradient(farthest-side, transparent calc(100% - 7px), #000 calc(100% - 6px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 7px), #000 calc(100% - 6px))',
          }}
          initial={{ rotate: 0, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 360, opacity: 1, scale: 1 }}
          transition={{
            rotate: { duration: 1.1, ease: 'linear', repeat: Infinity },
            opacity: { type: 'spring', stiffness: 120, damping: 20 },
            scale: { type: 'spring', stiffness: 200, damping: 18 },
          }}
        />

        {/* Second faint arc spinning opposite */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'conic-gradient(from 180deg, transparent 0%, rgba(239,17,26,0.3) 12%, transparent 34%)',
            WebkitMask:
              'radial-gradient(farthest-side, transparent calc(100% - 7px), #000 calc(100% - 6px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 7px), #000 calc(100% - 6px))',
          }}
          initial={{ rotate: 180, opacity: 0 }}
          animate={{ rotate: -360, opacity: 1 }}
          transition={{
            rotate: { duration: 2.4, ease: 'linear', repeat: Infinity },
            opacity: { delay: 0.4, type: 'spring', stiffness: 120, damping: 20 },
          }}
        />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 20, delay: 0.1 }}
          className="relative z-10"
        >
          <img
            src={logoSrc}
            alt="LocalHero"
            className="h-14 w-auto select-none"
            draggable={false}
          />
        </motion.div>
      </div>

      {/* Status text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.35 }}
        className={`mt-8 font-heading text-sm font-semibold tracking-[0.25em] uppercase ${
          isDark ? 'text-white/50' : 'text-navy-900/50'
        }`}
      >
        Loading your dashboard
      </motion.p>

      {/* Dots */}
      <div className="mt-4 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-primary"
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1, 0.8] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.18,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
};
