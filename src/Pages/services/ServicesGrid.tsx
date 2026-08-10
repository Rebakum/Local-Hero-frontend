import React, { useMemo, useRef, useState, useEffect } from 'react';
import { SearchX } from 'lucide-react';
import { getAllTrades } from '../../services/api';
import { ServicesFilterSidebar } from './ServicesFilterBar';
import { FadeInItem } from './FadeInItem';
import { ServiceCard } from './ServiceCard';
import type { Trade } from '../../types';


export const ServicesGrid: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [allTrades, setAllTrades] = useState<Trade[]>([]);

  useEffect(() => {
    getAllTrades()
      .then((data) => setAllTrades(data))
      .catch(() => setAllTrades([]));
  }, []);

  const matchesQuery = (trade: Trade, q: string) => {
    if (!q) return true;
    const haystack = [
      trade.category,
      trade.description,
      trade.featuredService?.title,
      ...(trade.popularTasks || []),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  };

  const q = query.trim().toLowerCase();

  const filteredTrades = useMemo(
    () =>
      allTrades.filter((trade) => {
        const matchesCategory = !activeCategory || trade.id === activeCategory;
        return matchesCategory && matchesQuery(trade, q);
      }),
    [q, activeCategory, allTrades],
  );

  const countFor = (categoryId: string | null) =>
    allTrades.filter((trade) => {
      const matchesCategory = !categoryId || trade.id === categoryId;
      return matchesCategory && matchesQuery(trade, q);
    }).length;

  
  const handleCategoryChange = (id: string | null) => {
    setActiveCategory(id);
    requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const gridKey = `${activeCategory ?? 'all'}-${q}`;

  return (
    <section className="bg-white dark:bg-black py-12">
      <div className="container-lh grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <ServicesFilterSidebar
          trades={allTrades}
          query={query}
          onQueryChange={setQuery}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          countFor={countFor}
        />

        <div ref={resultsRef} className="scroll-mt-24">
          <p className="mb-4 text-xs font-medium text-navy-400">
            {filteredTrades.length} {filteredTrades.length === 1 ? 'service' : 'services'} found
          </p>

          {filteredTrades.length > 0 ? (
            <div key={gridKey} className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredTrades.map((trade, i) => (
                <FadeInItem key={trade.id} delayMs={i * 70}>
                  <ServiceCard trade={trade} />
                </FadeInItem>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-neutral-200 py-24 text-center dark:border-white/10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <SearchX size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-navy-900 dark:text-white">No services match your search</p>
                <p className="mt-1 text-sm text-navy-400">Try a different keyword or clear the category filter.</p>
              </div>
              <button
                onClick={() => {
                  setQuery('');
                  setActiveCategory(null);
                }}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
