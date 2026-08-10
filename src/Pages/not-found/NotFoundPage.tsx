import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <section className="relative pt-44 lg:pt-56 pb-24 overflow-hidden bg-black min-h-screen flex items-start justify-center">
      <div className="absolute inset-0 grid-fade pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[640px] h-[400px] rounded-full bg-primary/15 blur-3xl pointer-events-none" />

      <div className="container-lh relative z-10 text-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/15 mb-8">
          <SearchX className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-white/80">404  page not found</span>
        </div>

        <h1 className="font-heading text-[clamp(4rem,14vw,9rem)] leading-none font-extrabold tracking-tight text-white">
          4<span className="text-primary">0</span>4
        </h1>

        <p className="mt-6 text-[15px] sm:text-lg text-white/60 max-w-md mx-auto">
          This page has done a runner. Let&apos;s get you back to a job well done.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="btn btn-primary px-8 py-3.5">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <Link to="/services" className="btn btn-ghost-light px-8 py-3.5">
            Browse services
          </Link>
        </div>
      </div>
    </section>
  );
};
