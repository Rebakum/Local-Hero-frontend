import React, { useRef, useState, useEffect, useMemo } from 'react';
import { SearchX, Loader2, ArrowUpDown } from 'lucide-react';
import { getTrades } from '../../services/api';
import { ServicesFilterSidebar, type CategoryOption } from './ServicesFilterBar';
import { FadeInItem } from './FadeInItem';
import { ServiceCard } from './ServiceCard';
import type { Trade } from '../../types';

const SORT_OPTIONS: { value: string; label: string }[] = [
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
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);

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

  const categories: CategoryOption[] = useMemo(() => {
    const map = new Map<string, CategoryOption>();

    for (const trade of allTrades) {
      const key = trade.category || trade.id;
      const existing = map.get(key);

      if (existing) {
        existing.count += 1;
      } else {
        map.set(key, {
          id: key,
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
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <section className="bg-white dark:bg-black py-12">
      <div className="container-lh grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <ServicesFilterSidebar
          categories={categories}
          totalCount={allTrades.length}
          query={query}
          onQueryChange={setQuery}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        <div ref={resultsRef} className="scroll-mt-24">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-xs font-medium text-navy-400">
              {allTrades.length} {allTrades.length === 1 ? 'service' : 'services'} found
              {loading && <Loader2 size={14} className="ml-2 inline animate-spin text-primary" />}
            </p>

            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-navy-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort services"
                className="cursor-pointer rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-navy-900 outline-none transition-colors focus:border-primary dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!loading && allTrades.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {allTrades.map((trade, i) => (
                <FadeInItem key={trade.id} delayMs={i * 70}>
                  <ServiceCard trade={trade} />
                </FadeInItem>
              ))}
            </div>
          ) : !loading && allTrades.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-neutral-200 py-24 text-center dark:border-white/10">
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
