import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight, Wrench, Zap, Sparkles, Paintbrush, Trees, Hammer, Key, Home,
} from 'lucide-react';
import type { Trade } from '../../types';

const TRADE_ICONS: Record<string, React.FC<any>> = {
  Wrench, Zap, Sparkles, Paintbrush, Trees, Hammer, Key, Home,
};

interface ServiceListRowProps {
  trade: Trade;
  style?: React.CSSProperties;
}

export const ServiceListRow: React.FC<ServiceListRowProps> = ({ trade, style }) => {
  const navigate = useNavigate();
  const s = trade.featuredService;
  if (!s) return null;
  const Icon = TRADE_ICONS[trade.iconName] || Wrench;

  return (
    <article
      style={style}
      onClick={() => navigate(`/services/${trade.id}`)}
      className="animate-row-in group flex cursor-pointer flex-col gap-4 border-b border-neutral-100 py-6 transition-colors hover:bg-neutral-50/70 dark:border-white/5 dark:hover:bg-white/[0.03] sm:flex-row sm:items-center sm:gap-6 sm:px-3"
    >
      {/* Thumbnail */}
      <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-2xl sm:h-24 sm:w-32">
        <img
          src={s.image}
          alt={s.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {s.isEmergency && (
          <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold text-white">
            24/7
          </span>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
          <Icon size={12} />
          {trade.category}
        </div>
        <h3 className="mt-1 truncate text-lg font-bold text-navy-900 dark:text-white">
          {s.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-navy-500 dark:text-navy-300">
          {s.description}
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {s.included.slice(0, 2).map((item) => (
            <span
              key={item}
              className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-navy-500 dark:bg-white/10 dark:text-navy-300"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Price + CTA */}
      <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:gap-2 sm:text-right">
        <div>
          <p className="text-base font-bold text-navy-900 dark:text-white">{s.estimatedPrice}</p>
          <p className="text-xs text-navy-400">{s.timeEstimate}</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-navy-500 transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-white dark:border-white/10 dark:text-navy-300">
          <ArrowUpRight size={16} />
        </span>
      </div>
    </article>
  );
};