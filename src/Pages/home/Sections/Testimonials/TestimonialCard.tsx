import React from 'react';
import { Star, Quote } from 'lucide-react';
import { isDemoTestimonial } from '@/src/data/testimonials';
import type { Testimonial } from '@/src/types';

interface TestimonialCardProps {
  t: Testimonial;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ t }) => {
  const rating = Math.min(5, Math.max(1, Math.round(t.rating || 5)));
  const avatar = t.avatar || '/images/avatar-placeholder.svg';
  const isDemo = isDemoTestimonial(t);

  return (
    <figure className="group relative h-full rounded-3xl bg-white dark:bg-navy-800 p-5 sm:p-7 flex flex-col overflow-hidden shadow-lg border border-neutral-200 transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl dark:border-white/10">
      <Quote className="absolute -top-2 right-5 w-16 h-16 text-primary/[0.06] dark:text-primary/10 rotate-180" />

      {isDemo && (
        <span className="absolute top-4 right-4 inline-flex items-center rounded-full bg-navy-100 dark:bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-500 dark:text-navy-300">
          Demo
        </span>
      )}

      <div className="relative flex items-center gap-1">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>

      <blockquote className="relative mt-4 text-sm leading-relaxed text-navy-700 dark:text-white/90 flex-1 line-clamp-5">
        &ldquo;{t.comment}&rdquo;
      </blockquote>

      <figcaption className="relative mt-6 pt-5 border-t border-navy-100 dark:border-white/10 flex items-center gap-3.5">
        <img
          src={avatar}
          alt={t.author}
          className="w-11 h-11 rounded-full object-cover ring-2 ring-white dark:ring-navy-900 shadow-sm"
        />
        <div className="min-w-0">
          <div className="font-heading text-sm font-extrabold text-navy-950 dark:text-white truncate">
            {t.author}
          </div>
          <div className="text-xs font-medium text-navy-500 dark:text-navy-300 truncate">
            {t.role} &bull; {t.city}
          </div>
        </div>
      </figcaption>
    </figure>
  );
};

export default TestimonialCard;
