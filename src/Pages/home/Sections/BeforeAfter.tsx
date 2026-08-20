import React, { useEffect, useRef, useState } from 'react';
import { getFeaturedBeforeAfterProjects, getAllBeforeAfterProjects } from '@/src/services/api';
import { useBooking } from '@/src/Context/BookingContext';
import { useTheme } from '@/src/Context/ThemeContext';
import { SectionTitle } from '@/src/Components/ui/SectionTitle';
import { Reveal } from '@/src/Components/ui/Reveal';
import { SectionWave } from '@/src/Components/ui/SectionWave';
import {
  MapPin, Clock, ArrowRight, CheckCircle2, PoundSterling, SlidersHorizontal, Loader2
} from 'lucide-react';
import type { BeforeAfterPair } from '@/src/types';

const CHECKLIST = [
  '100% escrow-protected payment',
  '12-month workmanship warranty',
  'Certified photos on completion',
];

export const BeforeAfter: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState(50);
  const [projects, setProjects] = useState<BeforeAfterPair[]>([]);
  const [loading, setLoading] = useState(true);
  const { openBooking } = useBooking();
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    (async () => {
      try {
        // Show admin-curated featured showcases first.
        const featured = await getFeaturedBeforeAfterProjects();
        if (featured && featured.length > 0) {
          setProjects(featured);
        } else {
          // No curated picks yet — fall back to approved showcases so the
          // section is never hidden when there's verified work to show.
          const approved = await getAllBeforeAfterProjects();
          setProjects(approved || []);
        }
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const project = projects[activeIndex];

  // 1. Return null or a skeleton/spinner while loading or if no projects exist
  if (loading) {
    return (
      <section className="bg-cream-100 dark:bg-black section-pad flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  if (!projects.length || !project) {
    return null; // Or render an empty state message
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-cream-100 dark:bg-black border-y border-navy-100/60 dark:border-white/10 section-pad">
      <SectionWave />
      <div className="container-lh relative z-10">
        <SectionTitle
          badge
          eyebrow="Real transformations"
          title="Before & after"
          subtitle="Drag the slider to compare real jobs completed by LocalHero pros across the UK."
          dark={theme === 'dark'}
        />

        {/* Project tabs */}
        <Reveal delay={0.08}>
          <div className="mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-2.5">
            {projects.map((proj, idx) => (
              <button
                key={proj.id}
                onClick={() => {
                  setActiveIndex(idx);
                  setPosition(50);
                }}
                className={`px-4 py-2 rounded-full text-xs font-heading font-bold transition-all duration-200 border-primary ${
                  activeIndex === idx
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'bg-white dark:bg-navy-800 border border-navy-200 dark:border-white/15 text-navy-600 dark:text-navy-200 hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary hover:shadow-md'
                }`}
              >
                {proj.title}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center">

          {/* Interactive split slider */}
          <Reveal className="lg:col-span-7" delay={0.1}>
            <div className="relative w-full h-[280px] sm:h-[380px] md:h-[480px] rounded-4xl overflow-hidden border border-neutral-200 dark:border-white/10 shadow-lg select-none group">
              <img
                src={project.afterImage}
                alt={`${project.title} after`}
                loading="lazy"
                className="w-full h-full object-cover object-top [image-rendering:-webkit-optimize-contrast] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
                <img
                  src={project.beforeImage}
                  alt={`${project.title} before`}
                  loading="lazy"
                  className="w-full h-full object-cover object-top [image-rendering:-webkit-optimize-contrast] group-hover:scale-105 transition-transform duration-500"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              {/* Labels */}
              <span className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                Before
              </span>
              <span className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                After
              </span>

              {/* Drag handle */}
              <div
                className="absolute top-0 bottom-0 w-[3px] bg-white/90 z-20 cursor-ew-resize"
                style={{ left: `${position}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-[0_0_20px_rgba(239,17,26,0.7)]">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                </div>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                aria-label="Before after slider"
              />
            </div>
            <p className="text-center text-xs font-medium text-navy-400 dark:text-navy-500 mt-3">
              Drag the handle to compare before vs. after
            </p>
          </Reveal>

          {/* Project details */}
          <Reveal className="lg:col-span-5 space-y-4 md:space-y-6" delay={0.16}>
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 chip">
                <MapPin className="w-3.5 3 text-primary" />
                {project.location} • {project.trade}
              </span>
              <h3 className="font-heading text-2xl font-extrabold tracking-tight text-navy-950 dark:text-white leading-tight">
                {project.title}
              </h3>
              <p className="text-sm leading-relaxed text-navy-600 dark:text-navy-300">
                {project.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3.5 sm:p-5 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800 space-y-1">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="text-[10px] font-heading font-bold uppercase tracking-widest text-navy-400 dark:text-navy-300 flex items-center gap-1">
                  <PoundSterling className="w-3.5 3 text-primary" /> Project cost
                </div>
                <div className="font-heading text-2xl font-extrabold text-navy-950 dark:text-white">
                  {project.cost}
                </div>
                <div className="text-[11px] font-semibold text-primary">Fixed upfront quote</div>
              </div>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3.5 sm:p-5 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800 space-y-1">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="text-[10px] font-heading font-bold uppercase tracking-widest text-navy-400 dark:text-navy-300 flex items-center gap-1">
                  <Clock className="w-3.5 3 text-primary" /> Time to complete
                </div>
                <div className="font-heading text-2xl font-extrabold text-navy-950 dark:text-white">
                  {project.completionDays}
                </div>
                <div className="text-[11px] font-semibold text-navy-500 dark:text-navy-400">Warranty included</div>
              </div>
            </div>

            <div className="space-y-2.5">
              {CHECKLIST.map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-[13px] font-semibold text-navy-700 dark:text-navy-200">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>

            <button
              onClick={() => openBooking({ trade: project.trade })}
              className="btn btn-primary w-full mt-4 md:mt-6 py-3 text-xs sm:text-sm shadow-sm group-hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              Get a similar quote <ArrowRight className="w-4 h-4" />
            </button>
          </Reveal>

        </div>
      </div>
    </section>
  );
};