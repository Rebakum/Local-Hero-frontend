import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { Card } from '../../Components/ui/shared';


export interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: 'emerald' | 'amber' | 'blue' | 'purple' | 'red';
  };
  iconBgColor?: string;
  iconTextColor?: string;
  delay?: number;
}

const badgeStyles = {
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  subtitle,
  badge,
  iconBgColor = 'bg-primary/10',
  iconTextColor = 'text-primary',
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card padding="md" className="relative overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl ${iconBgColor} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${iconTextColor}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-navy-400 dark:text-navy-500">{title}</p>
              <h3 className="text-2xl font-bold text-navy-900 dark:text-white mt-0.5">{value}</h3>
            </div>
          </div>

          {badge && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeStyles[badge.variant || 'emerald']}`}>
              {badge.text}
            </span>
          )}
        </div>

        {subtitle && (
          <p className="text-xs text-navy-400 dark:text-navy-500 mt-3 pt-3 border-t border-navy-50 dark:border-white/5">
            {subtitle}
          </p>
        )}
      </Card>
    </motion.div>
  );
};