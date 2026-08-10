import React, { useRef, useState, useEffect } from 'react';
import { SearchX, Loader2 } from 'lucide-react';
import { getTrades } from '../../services/api'; // getTrades ইমপোর্ট করুন
import { ServicesFilterSidebar } from './ServicesFilterBar';
import { FadeInItem } from './FadeInItem';
import { ServiceCard } from './ServiceCard';
import type { Trade } from '../../types';

export const ServicesGrid: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // ব্যাকএন্ড থেকে ডেটা ফেচ করার মূল অংশ
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      getTrades({
        search: query,
        category: activeCategory || undefined,
        limit: 50,
      })
        .then((res) => {
          // res.trades দিয়ে স্টেট সেট করতে হবে
          setAllTrades(res.trades || []);
        })
        .catch((err) => {
          console.error(err);
          setAllTrades([]);
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query, activeCategory]);

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
          trades={allTrades}
          query={query}
          onQueryChange={setQuery}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          countFor={() => allTrades.length}
        />

        <div ref={resultsRef} className="scroll-mt-24">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-medium text-navy-400">
              {allTrades.length} {allTrades.length === 1 ? 'service' : 'services'} found
            </p>
            {loading && <Loader2 size={16} className="animate-spin text-primary" />}
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