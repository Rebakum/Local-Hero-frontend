import React from 'react';
import { FeaturedProsGrid } from './FeaturedProsGrid';
import { SectionWave } from '@/src/Components/ui/SectionWave';

export const FeaturedPros: React.FC = () => {
  return (
    <section className="relative overflow-hidden section-pad border-y border-navy-100/60 dark:border-white/10">
      <SectionWave />
      <div className="container-lh relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Featured pros</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-heading font-bold text-navy-950 dark:text-white">
            Trusted pros, ready
          </h2>
          <p className="mt-4 text-lg text-navy-600 dark:text-navy-300">
            Browse verified local experts with strong ratings, clear pricing, and fast response times.
          </p>
        </div>

        <FeaturedProsGrid   limit={6} />
      </div>
    </section>
  );
};

export default FeaturedPros;
