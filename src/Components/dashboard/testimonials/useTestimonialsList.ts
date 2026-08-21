import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTestimonialsAdmin } from '../../../services/content.service';
import { useToast } from '../../../Context/ToastContext';
import type { Testimonial } from '../../../types';
import type { StatusFilter } from './testimonialData';

export interface TestimonialsList {
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  isLoading: boolean;
  error: string | null;
  setError: (v: string | null) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (v: StatusFilter) => void;
  filtered: Testimonial[];
  stats: { total: number; live: number; hidden: number; featured: number; average: number };
  reload: () => void;
}

export const useTestimonialsList = (): TestimonialsList => {
  const toast = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTestimonialsAdmin({ limit: 1000 });
      setTestimonials(data);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Failed to load testimonials.');
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const stats = useMemo(() => {
    const total = testimonials.length;
    const live = testimonials.filter((t) => t.isApproved !== false).length;
    const hidden = testimonials.filter((t) => t.isApproved === false).length;
    const featured = testimonials.filter((t) => t.isFeatured).length;
    const average =
      total === 0 ? 0 : testimonials.reduce((sum, t) => sum + (t.rating ?? 0), 0) / total;
    return { total, live, hidden, featured, average };
  }, [testimonials]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let rows = testimonials;
    if (statusFilter === 'live') rows = rows.filter((t) => t.isApproved !== false);
    else if (statusFilter === 'hidden') rows = rows.filter((t) => t.isApproved === false);
    else if (statusFilter === 'featured') rows = rows.filter((t) => t.isFeatured);
    if (q) {
      rows = rows.filter((t) =>
        [t.author, t.comment, t.city]
          .filter(Boolean)
          .some((v) => (v as string).toLowerCase().includes(q)),
      );
    }
    return rows;
  }, [testimonials, statusFilter, searchQuery]);

  return {
    testimonials,
    setTestimonials,
    isLoading,
    error,
    setError,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    filtered,
    stats,
    reload,
  };
};
