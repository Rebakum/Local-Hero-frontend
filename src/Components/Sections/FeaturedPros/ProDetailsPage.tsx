import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, ShieldCheck, Clock, Maximize2 } from 'lucide-react';
import { getProfessionalById } from '../../../services/api';
import type { Professional } from '../../../types';

export const ProDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pro, setPro] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProfessionalById(id)
      .then((data) => setPro(data))
      .catch(() => setPro(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (!pro) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 rounded-3xl shadow-xl shadow-navy-950/5 dark:shadow-black/30 px-8 py-12">
          <div className="w-14 h-14 rounded-2xl bg-navy-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-6 h-6 text-navy-400 dark:text-navy-500" />
          </div>
          <p className="font-heading text-lg font-bold text-navy-950 dark:text-white">Professional not found</p>
          <p className="text-sm text-navy-500 dark:text-navy-400 mt-1.5">
            This profile may have moved or no longer exists.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors mt-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy-50/40 dark:bg-navy-950 min-h-screen pb-28 sm:pb-16 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-navy-500 dark:text-navy-400 hover:text-primary transition-colors mb-6 sm:mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Header card */}
        <div
          className={`relative overflow-hidden rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 shadow-xl shadow-navy-950/5 dark:shadow-black/40 px-5 py-8 sm:px-10 sm:py-10 transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          {/* decorative glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 dark:bg-primary/20 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex flex-col items-center sm:items-start shrink-0">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-primary/15 shadow-lg shadow-primary/10">
                  <img src={pro.avatar} alt={pro.name} className="w-full h-full object-cover" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center ring-4 ring-white dark:ring-navy-900">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-navy-950 dark:text-white tracking-tight">
                {pro.name}
              </h1>
              <p className="text-sm font-semibold text-primary mt-1">
                {pro.trade} <span className="text-navy-300 dark:text-navy-600">·</span> {pro.companyName}
              </p>

              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-2 mt-4 text-sm">
                <span className="inline-flex items-center gap-1.5 text-navy-600 dark:text-navy-300">
                  <MapPin className="w-4 h-4 text-navy-400 dark:text-navy-500" /> {pro.location}
                </span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-navy-200 dark:bg-navy-700" />
                <span className="inline-flex items-center gap-1.5 text-navy-600 dark:text-navy-300">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-navy-950 dark:text-white">{pro.rating}</span>
                  <span className="text-navy-400 dark:text-navy-500">({pro.reviewCount})</span>
                </span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-navy-200 dark:bg-navy-700" />
                <span className="inline-flex items-center gap-1.5 text-navy-600 dark:text-navy-300">
                  <Clock className="w-4 h-4 text-navy-400 dark:text-navy-500" /> Responds in ~{pro.responseMinutes} min
                </span>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-navy-100 dark:border-white/10 w-full sm:w-auto">
              <p className="font-heading text-2xl sm:text-3xl font-black text-navy-950 dark:text-white">
                £{pro.hourlyRate}
                <span className="text-sm font-medium text-navy-400 dark:text-navy-500">/hr</span>
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {pro.availability}
              </span>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="mt-6 sm:mt-8 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 shadow-sm px-5 py-6 sm:px-8 sm:py-8">
          <h2 className="font-heading text-base font-bold text-navy-950 dark:text-white mb-3">About</h2>
          <p className="text-navy-600 dark:text-navy-300 leading-relaxed text-[15px]">{pro.bio}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {pro.specialties.map((s: string) => (
              <span
                key={s}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-navy-50 dark:bg-white/5 border border-navy-100 dark:border-white/10 text-navy-700 dark:text-navy-200"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Portfolio */}
        <div className="mt-6 sm:mt-8">
          <h2 className="font-heading text-base font-bold text-navy-950 dark:text-white mb-4">Portfolio</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {pro.portfolioImages.map((img: string, i: number) => (
              <div
                key={i}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-navy-100 dark:bg-white/5 cursor-pointer"
              >
                <img
                  src={img}
                  alt={`${pro.name} portfolio ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/30 transition-colors duration-300 flex items-center justify-center">
                  <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop CTA */}
        <button className="hidden sm:inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold rounded-full mt-10 px-8 py-3.5 shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all">
          Book {pro.name.split(' ')[0]}
        </button>
      </div>

      {/* Sticky mobile CTA */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 dark:bg-navy-900/90 backdrop-blur-lg border-t border-navy-100 dark:border-white/10 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-heading text-lg font-black text-navy-950 dark:text-white leading-none">
              £{pro.hourlyRate}
              <span className="text-xs font-medium text-navy-400 dark:text-navy-500">/hr</span>
            </p>
          </div>
          <button className="flex-1 max-w-[200px] bg-primary text-white font-semibold rounded-full py-3 text-sm shadow-lg shadow-primary/25 active:scale-[0.98] transition-transform">
            Book {pro.name.split(' ')[0]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProDetailsPage;