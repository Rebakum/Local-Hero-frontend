import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  Zap,
  Sparkles,
  Paintbrush,
  Trees,
  Hammer,
  Key,
  Home,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { getAllTrades } from '@/src/services/api';
import { TRADES as FALLBACK_TRADES } from '@/src/data/mockData';
import type { Trade } from '@/src/types';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Wrench,
  Zap,
  Sparkles,
  Paintbrush,
  Trees,
  Hammer,
  Key,
  Home,
};

export default function HeroSlider() {
  const navigate = useNavigate();
  const [trades, setTrades] = useState<Trade[]>(FALLBACK_TRADES);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAllTrades()
      .then((data) => {
        if (data.length > 0) setTrades(data);
      })
      .catch(() => {
        /* Keep fallback data on failure. */
      });
  }, []);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-slide]');
    const amount = card ? card.offsetWidth + 12 : 200;
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  const goToTrade = (trade: Trade) => {
    const slug = (trade.category || trade.id || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');
    navigate(`/services/${slug || 'service'}`);
  };

  return (
    <div className="relative z-20 -mt-10 md:-mt-14">
      <div className="container-lh">
        <div className="rounded-3xl border border-navy-100 bg-white/95 p-4 sm:p-5 shadow-lift backdrop-blur-xl dark:border-white/10 dark:bg-navy-900/95">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-navy-800 dark:text-white">
              <TrendingUp className="w-4 h-4 text-primary" />
              Popular Trades
            </p>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/categories')}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80 transition-opacity"
              >
                See all
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollByCard(-1)}
                  aria-label="Scroll trades left"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-navy-200 text-navy-600 transition-colors hover:border-primary hover:text-primary dark:border-white/10 dark:text-navy-200 dark:hover:border-primary"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollByCard(1)}
                  aria-label="Scroll trades right"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-navy-200 text-navy-600 transition-colors hover:border-primary hover:text-primary dark:border-white/10 dark:text-navy-200 dark:hover:border-primary"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Track */}
          <div
            ref={trackRef}
            className="flex gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {trades.map((trade, i) => {
              const Icon = ICON_MAP[trade.iconName] || Wrench;
              return (
                <button
                  key={trade.id || `${trade.category}-${i}`}
                  type="button"
                  data-slide
                  onClick={() => goToTrade(trade)}
                  className="group flex w-40 sm:w-44 shrink-0 flex-col items-start gap-3 rounded-2xl border border-navy-100 bg-cream-50 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-card dark:border-white/10 dark:bg-navy-950"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-heading text-sm font-bold text-navy-950 dark:text-white">
                      {trade.category}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] font-medium text-navy-400 dark:text-navy-500">
                      {trade.activeProsCount
                        ? `${trade.activeProsCount.toLocaleString()} pros online`
                        : 'Fixed rates · Book today'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
