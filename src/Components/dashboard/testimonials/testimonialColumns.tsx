import React from 'react';
import { Star } from 'lucide-react';
import type { DataTableColumn } from '../../ui/DataTable';
import { Badge } from '../../ui/shared/Badge';
import type { Testimonial } from '../../../types';
import { TRADE_TONES, formatTestimonialDate, professionalName } from './testimonialData';

export const testimonialColumns = (): DataTableColumn<Testimonial>[] => [
  {
    key: 'author',
    header: 'Author',
    sortValue: (t) => t.author,
    render: (t) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-navy-100 dark:bg-white/5 shrink-0 border border-navy-100 dark:border-white/10">
          <img src={t.avatar || '/images/avatar-placeholder.svg'} alt={t.author} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-navy-800 dark:text-navy-200 truncate max-w-[160px]">{t.author}</p>
          <p className="text-[11px] text-navy-800 dark:text-navy-300 truncate max-w-[160px]">
            {t.role} &bull; {t.city}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: 'trade',
    header: 'Trade',
    sortValue: (t) => t.trade,
    render: (t) => <Badge variant={TRADE_TONES[t.trade] ?? 'neutral'}>{t.trade}</Badge>,
  },
  {
    key: 'rating',
    header: 'Rating',
    sortValue: (t) => t.rating,
    render: (t) => (
      <span className="inline-flex items-center gap-1 font-semibold text-navy-800 dark:text-navy-200">
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        {t.rating}
      </span>
    ),
  },
  {
    key: 'comment',
    header: 'Review',
    hideOn: 'sm',
    render: (t) => (
      <span title={t.comment} className="text-navy-800 dark:text-navy-300 block truncate max-w-[240px] cursor-help">
        &ldquo;{t.comment}&rdquo;
      </span>
    ),
  },
  {
    key: 'professional',
    header: 'Professional',
    hideOn: 'md',
    sortValue: (t) => professionalName(t),
    render: (t) => (
      <span className="text-navy-800 dark:text-navy-300 truncate block max-w-[160px]">{professionalName(t)}</span>
    ),
  },
  {
    key: 'date',
    header: 'Date',
    hideOn: 'lg',
    sortValue: (t) => t.createdAt ?? t.date,
    render: (t) => <span className="text-navy-800 dark:text-navy-300">{formatTestimonialDate(t)}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (t) => (
      <div className="flex items-center gap-1.5">
        <Badge variant={t.isApproved === false ? 'warning' : 'success'}>
          {t.isApproved === false ? 'Hidden' : 'Live'}
        </Badge>
        {t.isFeatured && <Badge variant="primary"><Star className="w-3 h-3 fill-current" /> Featured</Badge>}
      </div>
    ),
  },
];
