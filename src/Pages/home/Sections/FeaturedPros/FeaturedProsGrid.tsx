import React, { useEffect, useMemo, useState } from 'react';
import { SearchX } from 'lucide-react';
import { ProCard } from './FeaturedProCard';
import { useProfessionals } from '@/src/Context/ProfessionalsContext';
import { Pagination } from '@/src/Components/ui/Pagination';
import { FilterSidebar, type FilterOption } from '@/src/Components/ui/FilterSidebar';
import { FilterToolbar, type SortOption } from '@/src/Components/ui/FilterToolbar';

interface FeaturedProsGridProps {
  limit?: number; // Optional limit prop (home page teaser)
}

const SORT_OPTIONS: SortOption[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating-desc', label: 'Top Rated' },
  { value: 'reviews-desc', label: 'Most Reviewed' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'hourly-asc', label: 'Price (Low to High)' },
  { value: 'hourly-desc', label: 'Price (High to Low)' },
];

export const FeaturedProsGrid: React.FC<FeaturedProsGridProps> = ({ limit }) => {
  const { professionals, isLoading, refresh } = useProfessionals();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTrade, setActiveTrade] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    if (!isLoading && professionals.length === 0) {
      refresh();
    }
  }, [isLoading, professionals.length, refresh]);

  const tradeOptions: FilterOption[] = useMemo(() => {
    const map = new Map<string, FilterOption>();
    for (const p of professionals) {
      const key = p.trade || 'Other';
      const existing = map.get(key);
      if (existing) {
        existing.count = (existing.count ?? 0) + 1;
      } else {
        map.set(key, { value: key, label: key, count: 1 });
      }
    }
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [professionals]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = professionals;

    if (activeTrade) {
      list = list.filter((p) => (p.trade || 'Other') === activeTrade);
    }

    if (q) {
      list = list.filter((p) =>
        [p.name, p.trade, p.location, p.postcodeArea, p.companyName, ...(p.specialties ?? [])]
          .filter(Boolean)
          .some((v) => (v as string).toLowerCase().includes(q))
      );
    }

    const sorted = [...list];
    switch (sortBy) {
      case 'rating-desc':
        sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case 'reviews-desc':
        sorted.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'hourly-asc':
        sorted.sort((a, b) => (a.hourlyRate ?? 0) - (b.hourlyRate ?? 0));
        break;
      case 'hourly-desc':
        sorted.sort((a, b) => (b.hourlyRate ?? 0) - (a.hourlyRate ?? 0));
        break;
      default:
        sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    return sorted;
  }, [professionals, activeTrade, searchQuery, sortBy]);

  const totalCount = limit ? professionals.length : filtered.length;
  const displayed = limit
    ? professionals.slice(0, limit)
    : filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="mt-8 md:mt-12 text-center py-10">
        <p className="text-sm font-semibold text-slate-500 animate-pulse">
          Loading professionals...
        </p>
      </div>
    );
  }

  if (displayed.length === 0) {
    return (
      <div className="mt-8 md:mt-12 group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white px-6 py-14 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800 text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <SearchX size={28} className="mx-auto text-primary" />
        <p className="mt-4 font-heading text-lg font-bold text-navy-950 dark:text-white">
          No professionals found
        </p>
        <p className="text-sm text-navy-500 dark:text-navy-400 mt-1.5">
          Try clearing your filters or search term.
        </p>
      </div>
    );
  }

  /* Home page teaser — simple grid without filters */
  if (limit) {
    return (
      <div className="mt-8 md:mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {displayed.map((pro, i) => {
          const proId = pro.id || pro._id;
          // Show 4 cards on small screens, all 6 on md+.
          return (
            <div key={proId} className={i >= 4 ? 'hidden md:block' : ''}>
              <ProCard pro={pro} />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mt-8 md:mt-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <FilterSidebar
          title="Trade"
          options={tradeOptions}
          totalCount={filtered.length}
          allLabel="All Trades"
          active={activeTrade}
          onSelect={(v) => {
            setActiveTrade(v);
            setPage(1);
          }}
          hasActiveFilters={searchQuery.trim() !== '' || activeTrade !== null}
          onClear={() => {
            setSearchQuery('');
            setActiveTrade(null);
          }}
        />

        <div>
          <FilterToolbar
            resultCount={filtered.length}
            resultLabel="professionals"
            singularLabel="professional"
            searchQuery={searchQuery}
            onSearchChange={(v) => {
              setSearchQuery(v);
              setPage(1);
            }}
            searchPlaceholder="Search professionals..."
            sortBy={sortBy}
            onSortChange={(v) => {
              setSortBy(v);
              setPage(1);
            }}
            sortOptions={SORT_OPTIONS}
          />

          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {displayed.map((pro) => {
              const proId = pro.id || pro._id;
              return <ProCard key={proId} pro={pro} />;
            })}
          </div>

          <div className="mt-8">
            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={filtered.length}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProsGrid;
