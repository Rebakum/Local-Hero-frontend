import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { SortDropdown, type SortOption } from './SortDropdown';

export type { SortOption };

interface FilterToolbarProps {
  resultCount: number;
  resultLabel?: string;
  singularLabel?: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  sortBy: string;
  onSortChange: (value: string) => void;
  sortOptions: SortOption[];
  loading?: boolean;
  className?: string;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  resultCount,
  resultLabel = 'results',
  singularLabel,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
  sortBy,
  onSortChange,
  sortOptions,
  loading = false,
  className = '',
}) => {
  const label = resultCount === 1 ? singularLabel || resultLabel : resultLabel;

  return (
    <div className={className}>
      <p className="mb-3 text-xs font-medium text-navy-400">
        {resultCount} {label}
        {loading && <Loader2 size={14} className="ml-2 inline animate-spin text-primary" />}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Middle — search bar */}
        <div className="relative flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 w-4 h-4 -translate-y-1/2 text-navy-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-9 text-sm text-navy-900 placeholder:text-navy-400 outline-none transition-colors focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-900 dark:hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="sm:ml-auto" />

        {/* Right — sort (modern dropdown) */}
        <SortDropdown
          value={sortBy}
          onChange={onSortChange}
          options={sortOptions}
          align="right"
        />
      </div>
    </div>
  );
};
