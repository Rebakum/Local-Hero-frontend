import React, { useEffect, useRef, useState } from 'react';
import {
  Search, X, ChevronDown, Wrench, Zap, Sparkles, Paintbrush, Trees, Hammer, Key, Home, LayoutGrid,
} from 'lucide-react';
import type { Trade } from '../../types';

const TRADE_ICONS: Record<string, React.FC<any>> = {
  Wrench, Zap, Sparkles, Paintbrush, Trees, Hammer, Key, Home,
};

interface ServicesFilterSidebarProps {
  trades: Trade[];
  query: string;
  onQueryChange: (value: string) => void;
  activeCategory: string | null;
  onCategoryChange: (id: string | null) => void;
  countFor: (id: string | null) => number;
}

export const ServicesFilterSidebar: React.FC<ServicesFilterSidebarProps> = ({
  trades,
  query,
  onQueryChange,
  activeCategory,
  onCategoryChange,
  countFor,
}) => {
  const hasActiveFilters = query.trim() !== '' || activeCategory !== null;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeTrade = trades.find((t) => t.id === activeCategory);
  const ActiveIcon = activeTrade ? TRADE_ICONS[activeTrade.iconName] || Wrench : LayoutGrid;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectCategory = (id: string | null) => {
    onCategoryChange(id === activeCategory ? null : id);
    setDropdownOpen(false);
  };

  return (
    <aside className="lg:sticky lg:top-[88px] lg:self-start">
      <div className="rounded-3xl border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-navy-900">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wide text-navy-900 dark:text-white">
            Refine
          </h3>
          {hasActiveFilters && (
            <button
              onClick={() => {
                onQueryChange('');
                onCategoryChange(null);
              }}
              className="text-xs font-semibold text-primary hover:opacity-70"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search a service..."
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-2.5 pl-10 pr-9 text-sm text-navy-900 placeholder:text-navy-400 outline-none transition-colors focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10"
          />
          {query && (
            <button
              onClick={() => onQueryChange('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-900 dark:hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Mobile / tablet — dropdown (below lg) */}
        <div ref={dropdownRef} className="relative mt-4 lg:hidden">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-navy-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <span className="flex items-center gap-2">
              <ActiveIcon size={16} className="text-primary" />
              {activeTrade ? activeTrade.category : 'All Services'}
            </span>
            <ChevronDown
              size={16}
              className={`text-navy-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-72 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-navy-900">
              <button
                onClick={() => selectCategory(null)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                  activeCategory === null
                    ? 'bg-primary/10 text-primary'
                    : 'text-navy-600 hover:bg-neutral-50 dark:text-navy-300 dark:hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <LayoutGrid size={15} />
                  All Services
                </span>
                <span className="text-xs text-navy-400">{countFor(null)}</span>
              </button>

              {trades.map((trade) => {
                const Icon = TRADE_ICONS[trade.iconName] || Wrench;
                const isActive = activeCategory === trade.id;
                return (
                  <button
                    key={trade.id}
                    onClick={() => selectCategory(trade.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-navy-600 hover:bg-neutral-50 dark:text-navy-300 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon size={15} />
                      {trade.category}
                    </span>
                    <span className={`text-xs ${isActive ? 'text-primary' : 'text-navy-400'}`}>
                      {countFor(trade.id)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Desktop — vertical list (lg and up) */}
        <nav className="mt-5 hidden flex-col gap-1 border-t border-neutral-100 pt-4 dark:border-white/10 lg:flex">
          <button
            onClick={() => selectCategory(null)}
            className={`group flex items-center justify-between rounded-xl py-2.5 pl-3 pr-2.5 text-sm font-medium transition-colors ${
              activeCategory === null
                ? 'border-l-2 border-primary bg-primary/5 text-primary'
                : 'border-l-2 border-transparent text-navy-600 hover:bg-neutral-50 dark:text-navy-300 dark:hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <LayoutGrid size={15} />
              All Services
            </span>
            <span className="text-xs text-navy-400">{countFor(null)}</span>
          </button>

          {trades.map((trade) => {
            const Icon = TRADE_ICONS[trade.iconName] || Wrench;
            const isActive = activeCategory === trade.id;
            return (
              <button
                key={trade.id}
                onClick={() => selectCategory(trade.id)}
                className={`group flex items-center justify-between rounded-xl py-2.5 pl-3 pr-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-l-2 border-primary bg-primary/5 text-primary'
                    : 'border-l-2 border-transparent text-navy-600 hover:bg-neutral-50 dark:text-navy-300 dark:hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon size={15} />
                  {trade.category}
                </span>
                <span className={`text-xs ${isActive ? 'text-primary' : 'text-navy-400'}`}>
                  {countFor(trade.id)}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};