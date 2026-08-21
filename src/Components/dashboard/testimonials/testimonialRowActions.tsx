import React from 'react';
import { Star, EyeOff, RotateCcw } from 'lucide-react';
import { editAction, deleteAction, type RowAction } from '../RowActions';
import type { Testimonial } from '../../../types';

interface RowActionOpts {
  isBusy: (id: string) => boolean;
  onHide: (t: Testimonial) => void;
  onRestore: (t: Testimonial) => void;
  onToggleFeatured: (t: Testimonial) => void;
  onEdit: (t: Testimonial) => void;
  onDelete: (t: Testimonial) => void;
}

export const testimonialRowActions = (t: Testimonial, opts: RowActionOpts): RowAction[] => [
  t.isApproved === false
    ? {
        key: 'restore',
        icon: <RotateCcw className="w-3.5 h-3.5" />,
        label: 'Restore (make public again)',
        tone: 'success',
        loading: opts.isBusy(t.id),
        onClick: () => opts.onRestore(t),
      }
    : {
        key: 'hide',
        icon: <EyeOff className="w-3.5 h-3.5" />,
        label: 'Hide (remove from public view)',
        tone: 'warning',
        loading: opts.isBusy(t.id),
        onClick: () => opts.onHide(t),
      },
  {
    key: 'feature',
    icon: <Star className={`w-3.5 h-3.5 ${t.isFeatured ? 'fill-current' : ''}`} />,
    label: t.isFeatured ? 'Unfeature' : 'Feature',
    tone: 'warning',
    loading: opts.isBusy(t.id),
    onClick: () => opts.onToggleFeatured(t),
  },
  { ...editAction(() => opts.onEdit(t)), loading: opts.isBusy(t.id) },
  { ...deleteAction(() => opts.onDelete(t)), loading: opts.isBusy(t.id) },
];
