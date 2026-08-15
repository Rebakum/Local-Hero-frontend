import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  /** When provided, renders the "Rows per page" selector. Changing it resets to page 1. */
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  /** Show "1–10 of 24" instead of "Page 1 of 3". */
  showRange?: boolean;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const pageNumbers = (page: number, totalPages: number): (number | 'gap')[] =>
  Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
    .reduce<(number | 'gap')[]>((acc, n, idx, arr) => {
      if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('gap');
      acc.push(n);
      return acc;
    }, []);

export const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  showRange = true,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  if (total === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 border-t border-navy-100 dark:border-white/10">
      <div className="flex flex-wrap items-center gap-3">
        {onPageSizeChange && (
          <label className="flex items-center gap-2 text-xs text-navy-400 dark:text-navy-500">
            Rows per page
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="input-lh h-8 text-xs w-auto pr-7"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}
        <p className="text-xs text-navy-400 dark:text-navy-500">
          {showRange ? `${rangeStart}–${rangeEnd} of ${total}` : `Page ${page} of ${totalPages}`}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
          aria-label="Previous page"
          className="w-8 h-8 rounded-full flex items-center justify-center text-navy-500 dark:text-navy-400 border border-navy-200 dark:border-white/10 hover:bg-navy-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pageNumbers(page, totalPages).map((n, idx) =>
          n === 'gap' ? (
            <span key={`gap-${idx}`} className="px-1 text-xs text-navy-400">
              …
            </span>
          ) : (
            <button
              key={n}
              onClick={() => onPageChange(n)}
              aria-label={`Page ${n}`}
              aria-current={n === page ? 'page' : undefined}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors ${
                n === page
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/25'
                  : 'text-navy-500 dark:text-navy-400 border-navy-200 dark:border-white/10 hover:bg-navy-50 dark:hover:bg-white/5'
              }`}
            >
              {n}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
          aria-label="Next page"
          className="w-8 h-8 rounded-full flex items-center justify-center text-navy-500 dark:text-navy-400 border border-navy-200 dark:border-white/10 hover:bg-navy-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
