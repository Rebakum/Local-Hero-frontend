import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  background?: 'white' | 'cream' | 'dark' | 'black';
  border?: boolean;
}

const BG_MAP = {
  white: 'bg-white dark:bg-black',
  cream: 'bg-cream-100 dark:bg-navy-950',
  dark: 'bg-navy-950 dark:bg-cream-100',
  black: 'bg-black',
};

export const Section: React.FC<SectionProps> = ({
  children,
  id,
  className = '',
  background = 'white',
  border = false,
}) => (
  <section
    id={id}
    className={`${BG_MAP[background]} ${border ? 'border-y border-navy-100/60 dark:border-white/10' : ''} py-12 ${className}`}
  >
    <div className="container-lh">{children}</div>
  </section>
);
