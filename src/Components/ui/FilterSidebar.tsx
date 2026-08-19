import React from 'react';
import {
  LayoutGrid,
  SlidersHorizontal,
} from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  iconUrl?: string;
}

interface FilterSidebarProps {
  title?: string;
  options: FilterOption[];
  active: string | null;
  onSelect: (value: string | null) => void;
  showAll?: boolean;
  allLabel?: string;
  totalCount?: number;
  hasActiveFilters?: boolean;
  onClear?: () => void;
  className?: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  title = 'Refine',
  options,
  active,
  onSelect,
  showAll = true,
  allLabel = 'All',
  totalCount,
  hasActiveFilters = false,
  onClear,
  className = '',
}) => {
  const renderIcon = (iconUrl?: string) => {
    if (!iconUrl) return <LayoutGrid size={15} className="shrink-0" />;
    return (
      <img
        src={iconUrl}
        alt=""
        className="w-5 h-5 rounded-full object-cover shrink-0"
      />
    );
  };

  const buttonBase =
    'group flex w-full items-center justify-between rounded-full py-2.5 pl-3 pr-2.5 text-sm font-medium transition-colors';
  const activeClass = 'border-l-2 border-primary bg-primary/5 text-primary';
  const idleClass =
    'border-l-2 border-transparent text-navy-600 hover:bg-neutral-50 dark:text-navy-300 dark:hover:bg-white/5';

  return (
    <aside className={`lg:sticky lg:top-[88px] lg:self-start ${className}`}>
      <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-navy-800">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-navy-900 dark:text-white">
            <SlidersHorizontal size={15} className="text-primary" />
            {title}
          </h3>
          {hasActiveFilters && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-semibold text-primary hover:opacity-70"
            >
              Clear all
            </button>
          )}
        </div>

        <nav className="mt-4 flex flex-col gap-1 border-t border-neutral-100 pt-4 dark:border-white/10">
          {showAll && (
            <button
              type="button"
              onClick={() => onSelect(null)}
              className={`${buttonBase} ${active === null ? activeClass : idleClass}`}
            >
              <span className="flex items-center gap-2.5">
                <LayoutGrid size={15} className="shrink-0" />
                {allLabel}
              </span>
              {totalCount !== undefined && (
                <span className={`text-xs ${active === null ? 'text-primary' : 'text-navy-400'}`}>
                  {totalCount}
                </span>
              )}
            </button>
          )}

          {options.map((opt) => {
            const isActive = active === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSelect(isActive ? null : opt.value)}
                className={`${buttonBase} ${isActive ? activeClass : idleClass}`}
              >
                <span className="flex items-center gap-2.5">
                  {renderIcon(opt.iconUrl)}
                  {opt.label}
                </span>
                {opt.count !== undefined && (
                  <span className={`text-xs ${isActive ? 'text-primary' : 'text-navy-400'}`}>
                    {opt.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
