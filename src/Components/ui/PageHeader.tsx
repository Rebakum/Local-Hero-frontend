import React from 'react';
import { motion } from 'motion/react';

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, description, actions }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
  >
    <div>
      {eyebrow && (
        <p className="text-sm text-navy-800 dark:text-navy-300 mb-1">{eyebrow}</p>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-navy-800 dark:text-navy-300 mt-1 max-w-xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
    {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
  </motion.div>
);
