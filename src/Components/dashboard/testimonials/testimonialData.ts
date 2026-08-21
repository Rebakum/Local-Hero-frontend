import type { Testimonial } from '../../../types';
import type { TestimonialInput } from '../../../services/content.service';

export const TRADE_OPTIONS = [
  { value: 'Plumber', label: 'Plumber' },
  { value: 'Electrician', label: 'Electrician' },
  { value: 'Cleaner', label: 'Cleaner' },
  { value: 'Painter', label: 'Painter' },
  { value: 'Gardener', label: 'Gardener' },
  { value: 'Carpenter', label: 'Carpenter' },
  { value: 'Locksmith', label: 'Locksmith' },
  { value: 'Roofer', label: 'Roofer' },
];

export const TRADE_TONES: Record<string, 'primary' | 'success' | 'warning' | 'neutral'> = {
  Plumber: 'primary',
  Electrician: 'warning',
  Cleaner: 'success',
  Gardener: 'success',
  Carpenter: 'neutral',
  Locksmith: 'warning',
  Painter: 'primary',
  Roofer: 'neutral',
};

export type StatusFilter = 'all' | 'live' | 'hidden' | 'featured';

export const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All Reviews' },
  { value: 'live', label: 'Live (approved)' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'featured', label: 'Featured' },
];

export interface TestimonialFormValues {
  author: string;
  role: string;
  city: string;
  trade: string;
  rating: number;
  date: string;
  comment: string;
  verifiedJob: string;
  avatar: string;
  folder: string;
  source: string;
}

export const toFormValues = (testimonial: Testimonial | null): TestimonialFormValues => ({
  author: testimonial?.author ?? '',
  role: testimonial?.role ?? 'Homeowner',
  city: testimonial?.city ?? '',
  trade: testimonial?.trade ?? '',
  rating: testimonial?.rating ?? 5,
  date: testimonial?.date ?? new Date().toLocaleDateString('en-GB'),
  comment: testimonial?.comment ?? '',
  verifiedJob: testimonial?.verifiedJob ?? '',
  avatar: testimonial?.avatar ?? '',
  folder: 'avatars',
  source: testimonial?.source ?? 'PLATFORM',
});

export const toPayload = (values: TestimonialFormValues): TestimonialInput => ({
  author: values.author.trim(),
  role: values.role.trim() || undefined,
  city: values.city.trim() || undefined,
  trade: values.trade,
  rating: Number(values.rating) || 5,
  date: values.date.trim() || undefined,
  comment: values.comment.trim() || undefined,
  verifiedJob: values.verifiedJob.trim() || undefined,
  avatar: values.avatar || undefined,
  source: values.source.trim() || 'PLATFORM',
});

export const formatTestimonialDate = (t: Testimonial): string => {
  if (t.createdAt) {
    const d = new Date(t.createdAt);
    if (!Number.isNaN(d.getTime())) return d.toLocaleDateString('en-GB');
  }
  return t.date || '—';
};

export const professionalName = (t: Testimonial): string =>
  t.professional?.companyName ?? t.professional?.name ?? '—';
