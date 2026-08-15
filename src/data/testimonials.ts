import type { Testimonial } from '../types';

/**
 * Demo / placeholder testimonials shown on the homepage when no approved
 * customer testimonials exist yet.
 *
 * IMPORTANT: These are fictional, frontend-only entries. They are NOT stored
 * in the database and are never mixed into real customer review lists. Every
 * item carries `source: "DEMO"` so the UI can clearly badge them as demo
 * content instead of presenting them as verified real customer reviews.
 */
export const STATIC_TESTIMONIALS: Testimonial[] = [
  {
    id: 'testimonial-1',
    author: 'Sarah Mitchell',
    role: 'Homeowner',
    city: 'London',
    trade: 'Plumber',
    rating: 5,
    date: '2026-01-15',
    comment:
      'Excellent service from start to finish. The professional was reliable, friendly and completed the work exactly as promised.',
    verifiedJob: 'Demo showcase',
    avatar: null,
    source: 'DEMO',
  },
  {
    id: 'testimonial-2',
    author: 'James Wilson',
    role: 'Homeowner',
    city: 'Manchester',
    trade: 'Electrician',
    rating: 5,
    date: '2026-02-03',
    comment:
      'Very easy to book and the quality of work was excellent. I would definitely use LocalHero again.',
    verifiedJob: 'Demo showcase',
    avatar: null,
    source: 'DEMO',
  },
  {
    id: 'testimonial-3',
    author: 'Emma Roberts',
    role: 'Homeowner',
    city: 'Birmingham',
    trade: 'Cleaner',
    rating: 5,
    date: '2026-02-20',
    comment:
      'A smooth experience with a trustworthy professional. The communication and workmanship were both excellent.',
    verifiedJob: 'Demo showcase',
    avatar: null,
    source: 'DEMO',
  },
];

export const isDemoTestimonial = (t: Testimonial): boolean =>
  t.source === 'DEMO' || (typeof t.id === 'string' && t.id.startsWith('testimonial-'));
