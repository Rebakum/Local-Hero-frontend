import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Card } from './shared/Card';
import { EmptyState } from './shared/EmptyState';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  hideOn?: 'sm' | 'md' | 'lg';
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  /** Rendered in a trailing "Actions" column when provided. */
  actions?: (row: T) => React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

const HIDE_CLASS: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
};

export function DataTable<T>({
  columns,
  data,
  rowKey,
  actions,
  isLoading = false,
  loadingText = 'Loading...',
  emptyTitle = 'No records found',
  emptyDescription,
  emptyIcon,
  page = 1,
  pageSize = 10,
  total,
  onPageChange,
  className = '',
}: DataTableProps<T>) {
  const resolvedTotal = total ?? data.length;
  const totalPages = Math.max(1, Math.ceil(resolvedTotal / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const hasPagination = onPageChange !== undefined && resolvedTotal > pageSize;

  return (
    <Card padding="sm" className={`overflow-hidden ${className}`}>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <p className="text-sm font-semibold text-navy-500 dark:text-navy-400">{loadingText}</p>
        </div>
      ) : data.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          icon={emptyIcon}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100 dark:border-white/10 bg-navy-50/50 dark:bg-white/[0.02]">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`text-left py-3 px-5 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider ${col.hideOn ? HIDE_CLASS[col.hideOn] : ''} ${col.headerClassName ?? ''}`}
                  >
                    {col.header}
                  </th>
                ))}
                {actions && (
                  <th className="text-right py-3 px-5 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr
                  key={rowKey(row)}
                  className="border-b border-navy-50 dark:border-white/5 last:border-0 hover:bg-navy-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-3.5 px-5 ${col.hideOn ? HIDE_CLASS[col.hideOn] : ''} ${col.className ?? ''}`}
                    >
                      {col.render ? col.render(row, i) : String((row as Record<string, unknown>)[col.key] ?? '—')}
                    </td>
                  ))}
                  {actions && (
                    <td className="py-3.5 px-5">
                      <div className="flex items-center justify-end gap-2">{actions(row)}</div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {hasPagination && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-navy-100 dark:border-white/10">
              <p className="text-xs text-navy-400 dark:text-navy-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange?.(page - 1)}
                  disabled={!canPrev}
                  aria-label="Previous page"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-500 dark:text-navy-400 border border-navy-200 dark:border-white/10 hover:bg-navy-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onPageChange?.(page + 1)}
                  disabled={!canNext}
                  aria-label="Next page"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-500 dark:text-navy-400 border border-navy-200 dark:border-white/10 hover:bg-navy-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
