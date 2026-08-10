import React from 'react';
import { FeaturedProsGrid } from './FeaturedProsGrid';

export const FeaturedPros: React.FC = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="container-lh">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Featured pros</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-heading font-bold text-navy-950 dark:text-white">
            Trusted pros, ready
          </h2>
          <p className="mt-4 text-lg text-navy-600 dark:text-navy-300">
            Browse verified local experts with strong ratings, clear pricing, and fast response times.
          </p>
        </div>

        <FeaturedProsGrid   limit={4} />
      </div>
    </section>
  );
};

export default FeaturedPros;
