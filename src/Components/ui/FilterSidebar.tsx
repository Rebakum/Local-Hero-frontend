import React from 'react';
import {
  LayoutGrid,
  SlidersHorizontal,
  MapPin,
  Star,
  PoundSterling,
  CalendarClock,
  ShieldCheck,
  Siren,
  X,
} from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
  iconUrl?: string;
}

// Smart-search filters for the professional directory (Distance, Rating,
// Price Range, Availability, Verified Businesses, Emergency Services).
export interface ProfessionalFilters {
  distance: number | null;
  postcode: string;
  minRating: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  availability: string | null;
  isVerified: boolean | null;
  isEmergency: boolean | null;
}

export const emptyProfessionalFilters: ProfessionalFilters = {
  distance: null,
  postcode: '',
  minRating: null,
  minPrice: null,
  maxPrice: null,
  availability: null,
  isVerified: null,
  isEmergency: null,
};

export const professionalFiltersActive = (f: ProfessionalFilters): boolean =>
  f.distance !== null ||
  f.postcode.trim() !== '' ||
  f.minRating !== null ||
  f.minPrice !== null ||
  f.maxPrice !== null ||
  f.availability !== null ||
  f.isVerified !== null ||
  f.isEmergency !== null;

interface FilterSidebarProps {
  title?: string;
  options: FilterOption[];
  active: string | null;
  onSelect: (value: string | null) => void;
  showAll?: boolean;
  allLabel?: string;
  totalCount?: number;
  hasActiveFilters?: boolean;
  onClear?: () => void;
  className?: string;
  filters?: ProfessionalFilters;
  onFiltersChange?: (filters: ProfessionalFilters) => void;
}

const RATING_OPTIONS = [
  { value: '4.5', label: '4.5 & up' },
  { value: '4', label: '4.0 & up' },
  { value: '3', label: '3.0 & up' },
];

const DISTANCE_OPTIONS = [
  { value: '10', label: 'Within 10 miles' },
  { value: '25', label: 'Within 25 miles' },
  { value: '50', label: 'Within 50 miles' },
];

const AVAILABILITY_OPTIONS = [
  { value: 'Available Today', label: 'Available Today' },
  { value: 'Available Tomorrow', label: 'Available Tomorrow' },
  { value: 'Booked 2 Days', label: 'Booked 2 Days' },
];

const sectionLabel =
  'flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-navy-800 dark:text-navy-300';
const selectClass =
  'w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-navy-900 outline-none transition-colors focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-white/10';
const inputClass =
  'w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-navy-900 outline-none transition-colors focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 dark:border-white/10 dark:bg-white/5 dark:text-white placeholder:text-navy-400 dark:placeholder:text-navy-500 dark:focus:bg-white/10';

const toggleClass =
  'relative inline-flex h-5 w-9 items-center rounded-full transition-colors';

const renderIcon = (iconUrl?: string) => {
  if (!iconUrl) return <LayoutGrid size={15} className="shrink-0" />;
  return (
    <img
      src={iconUrl}
      alt=""
      className="w-5 h-5 rounded-full object-cover shrink-0"
    />
  );
};

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  title = 'Refine',
  options,
  active,
  onSelect,
  showAll = true,
  allLabel = 'All',
  totalCount,
  hasActiveFilters = false,
  onClear,
  className = '',
  filters,
  onFiltersChange,
}) => {
  const buttonBase =
    'group flex w-full items-center justify-between rounded-full py-2.5 pl-3 pr-2.5 text-sm font-medium transition-colors';
  const activeClass = 'border-l-2 border-primary bg-primary/5 text-primary';
  const idleClass =
    'border-l-2 border-transparent text-navy-800 hover:bg-neutral-50 dark:text-navy-300 dark:hover:bg-white/5';

  const patch = (partial: Partial<ProfessionalFilters>) => {
    if (onFiltersChange && filters) {
      onFiltersChange({ ...filters, ...partial });
    }
  };

  const f = filters ?? emptyProfessionalFilters;
  const hasSmartFilters = professionalFiltersActive(f);

  return (
    <aside className={`lg:sticky lg:top-[88px] lg:self-start ${className}`}>
      <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-lg dark:border-white/10 dark:bg-navy-800">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-navy-900 dark:text-white">
            <SlidersHorizontal size={15} className="text-primary" />
            {title}
          </h3>
          {(hasActiveFilters || hasSmartFilters) && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-70"
            >
              <X size={12} />
              Clear all
            </button>
          )}
        </div>

        <nav className="mt-4 flex flex-col gap-1 border-t border-neutral-100 pt-4 dark:border-white/10">
          {showAll && (
            <button
              type="button"
              onClick={() => onSelect(null)}
              className={`${buttonBase} ${active === null ? activeClass : idleClass}`}
            >
              <span className="flex items-center gap-2.5">
                <LayoutGrid size={15} className="shrink-0" />
                {allLabel}
              </span>
              {totalCount !== undefined && (
                <span className={`text-xs ${active === null ? 'text-primary' : 'text-navy-800 dark:text-navy-300'}`}>
                  {totalCount}
                </span>
              )}
            </button>
          )}

          {options.map((opt) => {
            const isActive = active === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onSelect(isActive ? null : opt.value)}
                className={`${buttonBase} ${isActive ? activeClass : idleClass}`}
              >
                <span className="flex items-center gap-2.5">
                  {renderIcon(opt.iconUrl)}
                  {opt.label}
                </span>
                {opt.count !== undefined && (
                  <span className={`text-xs ${isActive ? 'text-primary' : 'text-navy-800 dark:text-navy-300'}`}>
                    {opt.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Smart search filters */}
        {filters && onFiltersChange && (
          <div className="mt-5 space-y-4 border-t border-neutral-100 pt-4 dark:border-white/10">
            {/* Distance */}
            <div className="space-y-1.5">
              <span className={sectionLabel}>
                <MapPin size={12} /> Distance
              </span>
              <input
                type="text"
                value={f.postcode}
                onChange={(e) => patch({ postcode: e.target.value })}
                placeholder="Your postcode (e.g. SW1A)"
                className={inputClass}
              />
              <select
                value={f.distance !== null ? String(f.distance) : ''}
                onChange={(e) =>
                  patch({
                    distance: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className={selectClass}
              >
                <option value="">Any distance</option>
                {DISTANCE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div className="space-y-1.5">
              <span className={sectionLabel}>
                <Star size={12} /> Rating
              </span>
              <select
                value={f.minRating !== null ? String(f.minRating) : ''}
                onChange={(e) =>
                  patch({
                    minRating: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className={selectClass}
              >
                <option value="">Any rating</option>
                {RATING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-1.5">
              <span className={sectionLabel}>
                <PoundSterling size={12} /> Price Range (£/hr)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={f.minPrice ?? ''}
                  onChange={(e) =>
                    patch({
                      minPrice: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  placeholder="Min"
                  className={inputClass}
                />
                <span className="text-xs text-navy-800 dark:text-navy-300">to</span>
                <input
                  type="number"
                  min={0}
                  value={f.maxPrice ?? ''}
                  onChange={(e) =>
                    patch({
                      maxPrice: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  placeholder="Max"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-1.5">
              <span className={sectionLabel}>
                <CalendarClock size={12} /> Availability
              </span>
              <select
                value={f.availability ?? ''}
                onChange={(e) =>
                  patch({ availability: e.target.value || null })
                }
                className={selectClass}
              >
                <option value="">Any availability</option>
                {AVAILABILITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Verified Businesses */}
            <div className="flex items-center justify-between">
              <span className={sectionLabel}>
                <ShieldCheck size={12} /> Verified Businesses
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={f.isVerified === true}
                onClick={() =>
                  patch({
                    isVerified: f.isVerified === true ? null : true,
                  })
                }
                className={`${toggleClass} ${f.isVerified === true ? 'bg-emerald-500' : 'bg-navy-200 dark:bg-white/10'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    f.isVerified === true ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Emergency Services */}
            <div className="flex items-center justify-between">
              <span className={sectionLabel}>
                <Siren size={12} /> Emergency Services
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={f.isEmergency === true}
                onClick={() =>
                  patch({
                    isEmergency: f.isEmergency === true ? null : true,
                  })
                }
                className={`${toggleClass} ${f.isEmergency === true ? 'bg-red-500' : 'bg-navy-200 dark:bg-white/10'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    f.isEmergency === true ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};