import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useTheme } from '../../Context/ThemeContext';

export interface SectionTitleProps {
  eyebrow?: string;
  badge?: boolean;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'center' | 'left';
  dark?: boolean;
  className?: string;
  animate?: boolean;
  delay?: number;
  maxWidth?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  eyebrow,
  badge = false,
  title,
  subtitle,
  align = 'center',
  dark = false,
  className = '',
  animate = true,
  delay = 0,
  maxWidth = 'max-w-2xl',
}) => {
  const reduce = useReducedMotion();
  const { theme } = useTheme();
  const centered = align === 'center';
  const isDark = dark || theme === 'dark';

  const content = (
    <>
      {eyebrow && (badge ? (
        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </span>
      ) : (
        <p className={`eyebrow ${isDark ? 'eyebrow-dark' : ''} ${centered ? 'justify-center' : ''}`}>
          {eyebrow}
        </p>
      ))}
      <h2
        className={`mt-3 sm:mt-4 font-heading text-[40px] font-extrabold leading-[1.08] tracking-tight transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-navy-950'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 sm:mt-4 text-[14px] sm:text-[15px] md:text-base leading-relaxed transition-colors duration-300 ${
            isDark ? 'text-white/60' : 'text-navy-500'
          }`}
        >
          {subtitle}
        </p>
      )}
    </>
  );

  const wrapper = `${centered ? 'text-center mx-auto' : 'text-left'} ${maxWidth} ${className}`;

  if (!animate) {
    return <div className={wrapper}>{content}</div>;
  }

  return (
    <motion.div
      className={wrapper}
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {content}
    </motion.div>
  );
};