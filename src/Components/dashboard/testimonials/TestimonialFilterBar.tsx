import React from 'react';
import { Search } from 'lucide-react';
import { FILTER_OPTIONS, type StatusFilter } from './testimonialData';

interface TestimonialFilterBarProps {
  statusFilter: StatusFilter;
  onStatusChange: (v: StatusFilter) => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  count: number;
}

export const TestimonialFilterBar: React.FC<TestimonialFilterBarProps> = ({
  statusFilter,
  onStatusChange,
  searchQuery,
  onSearchChange,
  count,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
          className="input-lh h-10 text-sm w-auto pr-8"
          aria-label="Filter reviews by status"
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <p className="text-sm font-semibold text-navy-800 dark:text-navy-300">
          {count} {count === 1 ? 'review' : 'reviews'}
        </p>
      </div>
      <div className="relative sm:ml-auto w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
        <input
          type="text"
          placeholder="Search author, review or city..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-lh pl-9 h-10 text-sm"
        />
      </div>
    </div>
  );
};

export default TestimonialFilterBar;