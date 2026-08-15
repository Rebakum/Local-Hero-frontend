import React, { useRef, useState, useEffect, useMemo } from 'react';
import { SearchX, Loader2 } from 'lucide-react';
import { getTrades } from '../../services/api';
import { FilterSidebar, type FilterOption } from '../../Components/ui/FilterSidebar';
import { FilterToolbar, type SortOption } from '../../Components/ui/FilterToolbar';
import { FadeInItem } from './FadeInItem';
import { ServiceCard } from './ServiceCard';
import { Pagination } from '../../Components/ui/Pagination';
import type { Trade } from '../../types';

const SORT_OPTIONS: SortOption[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
];

export const ServicesGrid: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    setPage(1);

    const timer = setTimeout(() => {
      getTrades({
        search: query,
        category: activeCategory || undefined,
        sortBy,
        limit: 50,
      })
        .then((res) => {
          setAllTrades(res.trades || []);
        })
        .catch((err) => {
          console.error(err);
          setAllTrades([]);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query, activeCategory, sortBy]);

  const categories: FilterOption[] = useMemo(() => {
    const map = new Map<string, FilterOption>();

    for (const trade of allTrades) {
      const key = trade.category || trade.id;
      const existing = map.get(key);

      if (existing) {
        existing.count = (existing.count ?? 0) + 1;
      } else {
        map.set(key, {
          value: key,
          label: trade.category || key,
          iconName: trade.iconName,
          count: 1,
        });
      }
    }

    return Array.from(map.values());
  }, [allTrades]);

  const handleCategoryChange = (id: string | null) => {
    setActiveCategory(id);
    setPage(1);
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const pagedTrades = allTrades.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section className="bg-white dark:bg-black py-12">
      <div className="container-lh grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <FilterSidebar
                   options={categories}
          totalCount={allTrades.length}
          allLabel="All Services"
          active={activeCategory}
          onSelect={handleCategoryChange}
          hasActiveFilters={query.trim() !== '' || activeCategory !== null}
          onClear={() => {
            setQuery('');
            setActiveCategory(null);
          }}
        />

        <div ref={resultsRef} className="scroll-mt-24">
          <FilterToolbar
            resultCount={allTrades.length}
            resultLabel="services"
            singularLabel="service"
            searchQuery={query}
            onSearchChange={setQuery}
            searchPlaceholder="Search a service..."
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOptions={SORT_OPTIONS}
            loading={loading}
          />

          {!loading && allTrades.length > 0 ? (
            <>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {pagedTrades.map((trade, i) => (
                  <FadeInItem key={trade.id} delayMs={i * 70}>
                    <ServiceCard trade={trade} />
                  </FadeInItem>
                ))}
              </div>

              <Pagination
                page={page}
                pageSize={PAGE_SIZE}
                total={allTrades.length}
                onPageChange={setPage}
              />
            </>
          ) : !loading && allTrades.length === 0 ? (
            <div className="mt-6 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-neutral-200 py-24 text-center dark:border-white/10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <SearchX size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-navy-900 dark:text-white">
                  No services found
                </p>
                <p className="mt-1 text-sm text-navy-400">
                  Please add services from Admin Panel or check your API connection.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
