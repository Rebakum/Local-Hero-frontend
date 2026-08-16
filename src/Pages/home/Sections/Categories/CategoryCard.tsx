import React from "react";
import { ArrowRight } from "lucide-react";
import {
  Wrench,
  Zap,
  Sparkles,
  Paintbrush,
  Trees,
  Hammer,
  Key,
  Home,
} from "lucide-react";

const ICON_MAP: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Wrench, Zap, Sparkles, Paintbrush, Trees, Hammer, Key, Home,
};

interface CategoryCardProps {
  trade: any;
  onSelect: (trade: any) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ trade, onSelect }) => {
  const tradeName = trade.category || '';
  const subtitle = trade.subtitle || 'Expert Home Service';
  const iconKey = trade.iconName || 'Wrench';
  const Icon = ICON_MAP[iconKey] || Wrench;

  return (
    <button
      type="button"
      onClick={() => onSelect(trade)}
      className="group flex h-full w-full flex-col items-center overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-glow">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
      </div>

      <h3 className="mt-4 sm:mt-5 font-heading text-sm sm:text-base font-bold leading-snug text-navy-950 transition-colors duration-300 group-hover:text-primary dark:text-white text-center">
        {tradeName}
      </h3>
      <p className="mt-1 text-[11px] sm:text-xs text-navy-500 dark:text-navy-300 text-center line-clamp-1">
        {subtitle}
      </p>

      <div className="mt-auto pt-4 sm:pt-5">
        <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary transition-all duration-300 group-hover:translate-x-1">
          Explore Details
          <ArrowRight className="3 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </button>
  );
};
