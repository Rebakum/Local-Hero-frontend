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

const parseRate = (value: string): number => {
  const match = value.match(/\d+(?:\.\d+)?/);
  return match ? parseFloat(match[0]) : Number.MAX_SAFE_INTEGER;
};

const tradeName = (trade: Trade): string =>
  (trade.featuredServices?.[0]?.title as string | undefined) ?? trade.category;

const matchesSearch = (trade: Trade, search: string): boolean => {
  const fs = (trade.featuredServices ?? [])[0];
  const haystack = [
    trade.category,
    trade.subtitle,
    trade.description,
    ...(trade.popularTasks ?? []),
    fs?.title,
    fs?.description,
    ...(fs?.popularFor ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(search);
};

const applySort = (trades: Trade[], sortBy: string): Trade[] => {
  const list = [...trades];

  switch (sortBy) {
    case 'name-asc':
      list.sort((a, b) => tradeName(a).localeCompare(tradeName(b)));
      break;
    case 'name-desc':
      list.sort((a, b) => tradeName(b).localeCompare(tradeName(a)));
      break;
    case 'popular':
      list.sort((a, b) => (b.activeProsCount ?? 0) - (a.activeProsCount ?? 0));
      break;
    case 'price-asc':
      list.sort((a, b) => parseRate(a.avgHourlyRate) - parseRate(b.avgHourlyRate));
      break;
    case 'price-desc':
      list.sort((a, b) => parseRate(b.avgHourlyRate) - parseRate(a.avgHourlyRate));
      break;
    default:
      list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      break;
  }

  return list;
};

export const ServicesGrid: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    getTrades({ limit: 500 })
      .then((res) => {
        if (!cancelled) setAllTrades(res.trades || []);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setAllTrades([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
          iconUrl: trade.iconUrl ?? undefined,
          count: 1,
        });
      }
    }

    return Array.from(map.values());
  }, [allTrades]);

  const filteredTrades: Trade[] = useMemo(() => {
    let list = allTrades;

    if (activeCategory) {
      list = list.filter((trade) => (trade.category || trade.id) === activeCategory);
    }

    const search = query.trim().toLowerCase();
    if (search) {
      list = list.filter((trade) => matchesSearch(trade, search));
    }

    return applySort(list, sortBy);
  }, [allTrades, query, activeCategory, sortBy]);

  const totalCount = filteredTrades.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedTrades = filteredTrades.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const resetToFirstPage = () => {
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    setPage(1);
  };

  const handleCategoryChange = (id: string | null) => {
    setActiveCategory(id);
    resetToFirstPage();
  };

  const handleSearchChange = (value: string) => {
    setQuery(value);
    resetToFirstPage();
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    resetToFirstPage();
  };

  return (
    <section className="bg-white section-pad dark:bg-black border-y border-navy-100/60 dark:border-white/10">
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
            resetToFirstPage();
          }}
        />

        <div ref={resultsRef} className="scroll-mt-24">
          <FilterToolbar
            resultCount={totalCount}
            resultLabel="services"
            singularLabel="service"
            searchQuery={query}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search a service..."
            sortBy={sortBy}
            onSortChange={handleSortChange}
            sortOptions={SORT_OPTIONS}
            loading={loading}
          />

          {!loading && totalCount > 0 ? (
            <>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {pagedTrades.map((trade, i) => (
                  <FadeInItem key={trade.id} delayMs={i * 70}>
                    <ServiceCard trade={trade} />
                  </FadeInItem>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  page={safePage}
                  pageSize={PAGE_SIZE}
                  total={totalCount}
                  onPageChange={setPage}
                />
              )}
            </>
          ) : !loading && totalCount === 0 ? (
            <div className="mt-6 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-neutral-200 py-24 text-center dark:border-white/10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <SearchX size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-navy-900 dark:text-white">
                  No services found
                </p>
                <p className="mt-1 text-sm text-navy-800 dark:text-navy-300">
                  Try a different search term or category.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
