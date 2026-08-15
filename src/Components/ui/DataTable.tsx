import React, { useMemo, useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Loader2,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { Card } from './shared/Card';
import { EmptyState } from './shared/EmptyState';
import { Pagination } from './Pagination';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  hideOn?: 'sm' | 'md' | 'lg';
  /** Used for sorting. Falls back to the raw value of `key`. */
  sortValue?: (row: T) => string | number;
}

export interface DataTableFilter<T> {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  /** Extracts the value to compare. Falls back to the raw value of `key`. */
  filterValue?: (row: T) => string;
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

  /** Show the search box. Filters rows across every string column value (or `searchKeys`). */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Custom searchable text per row. Defaults to all string column values. */
  searchKeys?: (row: T) => string[];

  /** Enable clickable column headers for client-side sorting. */
  sortable?: boolean;

  /** Dropdown filters rendered above the table. */
  filters?: DataTableFilter<T>[];

  /** Client-side page size when server pagination props are not provided. */
  defaultPageSize?: number;
  /** Show the "rows per page" selector. */
  pageSizeOptions?: number[];
  /** Extra classes applied to each row. */
  rowClassName?: (row: T) => string;
  /** Initial client-side page (1-based). Useful for deep-linking to a row. */
  initialPage?: number;
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
  page: serverPage,
  pageSize: serverPageSize,
  total: serverTotal,
  onPageChange,
  className = '',
  searchable = false,
  searchPlaceholder = 'Search...',
  searchKeys,
  sortable = false,
  filters = [],
  defaultPageSize = 5,
  pageSizeOptions = [5, 10, 20, 50],
  rowClassName,
  initialPage = 1,
}: DataTableProps<T>) {
  const isServerPaginated = onPageChange !== undefined;

  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [clientPage, setClientPage] = useState(initialPage);
  const [clientPageSize, setClientPageSize] = useState(defaultPageSize);

  const page = isServerPaginated ? (serverPage ?? 1) : clientPage;
  const pageSize = isServerPaginated ? (serverPageSize ?? defaultPageSize) : clientPageSize;

  // --- Search ---
  const defaultSearchKeys = (row: T) =>
    columns
      .map((col) => (row as Record<string, unknown>)[col.key])
      .filter((v): v is string => typeof v === 'string');

  const searchFn = useMemo(() => searchKeys ?? defaultSearchKeys, [searchKeys]);

  // --- Filter + search + sort (always client-side) ---
  const processed = useMemo(() => {
    let rows = data;

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      rows = rows.filter((row) =>
        searchFn(row).some((v) => String(v ?? '').toLowerCase().includes(q))
      );
    }

    const activeFilterEntries = Object.entries(activeFilters).filter(([, v]) => v);
    if (activeFilterEntries.length > 0) {
      rows = rows.filter((row) =>
        activeFilterEntries.every(([key, value]) => {
          const col = columns.find((c) => c.key === key);
          const filter = filters.find((f) => f.key === key);
          const raw = filter?.filterValue
            ? filter.filterValue(row)
            : String((row as Record<string, unknown>)[key] ?? '');
          return raw === value;
        })
      );
    }

    if (sortKey && sortable) {
      const col = columns.find((c) => c.key === sortKey);
      const getValue = (row: T): string | number => {
        if (col?.sortValue) return col.sortValue(row);
        const raw = (row as Record<string, unknown>)[sortKey];
        if (typeof raw === 'number') return raw;
        return String(raw ?? '').toLowerCase();
      };
      rows = [...rows].sort((a, b) => {
        const av = getValue(a);
        const bv = getValue(b);
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }

    return rows;
  }, [data, searchQuery, searchFn, activeFilters, filters, columns, sortKey, sortDir, sortable]);

  // --- Pagination ---
  const resolvedTotal = isServerPaginated ? (serverTotal ?? data.length) : processed.length;

  const startIndex = isServerPaginated ? 0 : (page - 1) * pageSize;
  const visibleRows = isServerPaginated
    ? processed
    : processed.slice(startIndex, startIndex + pageSize);

  const hasPagination = resolvedTotal > pageSize;
  const showToolbar = searchable || filters.length > 0;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <Card padding="sm" className={`overflow-hidden ${className}`}>
      {showToolbar && !isLoading && (
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 px-5 py-4 border-b border-navy-100 dark:border-white/10">
          {searchable && (
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setClientPage(1);
                }}
                placeholder={searchPlaceholder}
                className="input-lh pl-9 h-10 text-sm"
              />
            </div>
          )}

          {filters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
              <SlidersHorizontal className="w-4 h-4 text-navy-400" />
              {filters.map((filter) => (
                <select
                  key={filter.key}
                  value={activeFilters[filter.key] ?? ''}
                  onChange={(e) => {
                    setActiveFilters((prev) => ({ ...prev, [filter.key]: e.target.value }));
                    setClientPage(1);
                  }}
                  className="input-lh h-10 text-sm w-auto pr-8"
                >
                  <option value="">{filter.label}: All</option>
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ))}
            </div>
          )}

          <p className="text-xs text-navy-400 dark:text-navy-500 lg:ml-auto shrink-0">
            {processed.length} {processed.length === 1 ? 'record' : 'records'}
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <p className="text-sm font-semibold text-navy-500 dark:text-navy-400">{loadingText}</p>
        </div>
      ) : visibleRows.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          icon={emptyIcon}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100 dark:border-white/10 bg-navy-50 dark:bg-navy-800/40">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`text-left py-3 px-5 font-semibold text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider ${col.hideOn ? HIDE_CLASS[col.hideOn] : ''} ${col.headerClassName ?? ''}`}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(col.key)}
                        className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-navy-900 dark:hover:text-white transition-colors"
                      >
                        {col.header}
                        {sortKey === col.key ? (
                          sortDir === 'asc' ? (
                            <ChevronUp className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-primary" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
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
              {visibleRows.map((row, i) => (
                <tr
                  key={rowKey(row)}
                  className={`border-b border-navy-100/60 dark:border-white/5 last:border-0 bg-white odd:bg-navy-50/50 dark:bg-navy-800/40 dark:odd:bg-white/[0.02] hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors ${rowClassName ? rowClassName(row) : ''}`}
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
            <Pagination
              page={page}
              pageSize={pageSize}
              total={resolvedTotal}
              onPageChange={(p) => {
                if (isServerPaginated) {
                  onPageChange?.(p);
                } else {
                  setClientPage(p);
                }
              }}
              onPageSizeChange={
                !isServerPaginated && pageSizeOptions.length > 1
                  ? (size) => {
                      setClientPageSize(size);
                      setClientPage(1);
                    }
                  : undefined
              }
              showRange={!isServerPaginated}
            />
          )}
        </div>
      )}
    </Card>
  );
}
