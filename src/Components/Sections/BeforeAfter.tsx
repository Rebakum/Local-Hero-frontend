import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAllBeforeAfterProjects } from '../../services/api';
import { useBooking } from '../../Context/BookingContext';
import { useTheme } from '../../Context/ThemeContext';
import { SectionTitle } from '../ui/SectionTitle';
import { Reveal } from '../ui/Reveal';
import {
  MapPin, Clock, ArrowRight, CheckCircle2, PoundSterling, SlidersHorizontal, Loader2
} from 'lucide-react';
import type { BeforeAfterPair } from '../../types';

gsap.registerPlugin(ScrollTrigger);

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
    getAllBeforeAfterProjects()
      .then((data) => setProjects(data || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        gsap.to('.parallax-img', {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, [projects]);

  const project = projects[activeIndex];

  // 1. Return null or a skeleton/spinner while loading or if no projects exist
  if (loading) {
    return (
      <section className="bg-cream-100 dark:bg-black py-12 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    );
  }

  if (!projects.length || !project) {
    return null; // Or render an empty state message
  }

  return (
    <section ref={sectionRef} className="bg-cream-100 dark:bg-black border-y border-navy-100/60 dark:border-white/10 py-8 md:py-12">
      <div className="container-lh">
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
                className={`px-4 py-2 rounded-full text-xs font-heading font-bold transition-all border-primary ${
                  activeIndex === idx
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-navy-800 border border-navy-200 dark:border-white/15 text-navy-600 dark:text-navy-200'
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
            <div className="relative w-full h-[280px] sm:h-[380px] md:h-[480px] rounded-4xl overflow-hidden border border-navy-100 dark:border-white/10 shadow-lift select-none group">
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
                <MapPin className="w-3.5 h-3.5 text-primary" />
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
              <div className="rounded-2xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-white/10 p-3.5 sm:p-5 space-y-1">
                <div className="text-[10px] font-heading font-bold uppercase tracking-widest text-navy-400 dark:text-navy-300 flex items-center gap-1">
                  <PoundSterling className="w-3.5 h-3.5 text-primary" /> Project cost
                </div>
                <div className="font-heading text-2xl font-extrabold text-navy-950 dark:text-white">
                  {project.cost}
                </div>
                <div className="text-[11px] font-semibold text-primary">Fixed upfront quote</div>
              </div>
              <div className="rounded-2xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-white/10 p-3.5 sm:p-5 space-y-1">
                <div className="text-[10px] font-heading font-bold uppercase tracking-widest text-navy-400 dark:text-navy-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Time to complete
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