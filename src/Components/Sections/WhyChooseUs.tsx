import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../../Context/ThemeContext';
import { SectionTitle } from '../ui/SectionTitle';
import { Reveal, Stagger, StaggerItem } from '../ui/Reveal';
import {
  ShieldCheck, PoundSterling, Lock, Clock, CheckCircle2, PhoneCall, Award,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    icon: ShieldCheck,
    title: '6-point professional vetting',
    desc: 'DBS checks, trade qualifications, insurance, references, identity and background verified before any pro goes live.',
  },
  {
    icon: PoundSterling,
    title: 'Fixed upfront pricing',
    desc: 'Clear quotes with zero hidden call-out fees. The price you approve is the price you pay.',
  },
  {
    icon: Lock,
    title: 'Escrow-protected payments',
    desc: 'Your money stays safe in escrow and is released only after you confirm the job is done right.',
  },
  {
    icon: Clock,
    title: '24/7 emergency dispatch',
    desc: 'Burst pipe at midnight? Vetted pros reach 96% of UK postcodes in under 45 minutes.',
  },
];

export const WhyChooseUs: React.FC = () => {
  const { theme } = useTheme();
  const heroImage = '/images/servuce1.png';
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-us"
      className="bg-white dark:bg-black border-y border-navy-100/60 dark:border-white/10 py-8 md:py-12"
    >
      <div className="container-lh">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-14 items-center">

          {/* Visual side */}
          <Reveal className="lg:col-span-5 relative order-2 lg:order-1" delay={0.1}>
            <div className="relative rounded-[1.75rem] sm:rounded-4xl overflow-hidden border border-navy-100/80 dark:border-white/10 shadow-lift bg-linear-to-br from-primary/10 via-cream-100 to-white dark:from-black dark:via-navy-900 dark:to-black">
              <div className="parallax-img flex items-center justify-center h-64 sm:h-80 md:h-95 lg:h-115 xl:h-135">
                <img src={heroImage} alt="Trusted LocalHero service illustration" className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

              {/* Floating guarantee card */}
              <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5 glass-dark rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-linear-to-br from-primary to-black flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="font-heading text-sm font-extrabold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                    £2M Property Damage Guarantee
                  </div>
                  <div className="text-[11px] font-medium text-white/60">Every booking covered</div>
                </div>
              </div>
            </div>

            {/* Floating experience badge */}
            <div className="absolute -top-3 sm:-top-4 right-2 sm:-top-5 sm:right-6 glass-dark rounded-2xl px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 text-center shadow-lift">
              <div className="font-heading text-2xl font-extrabold text-white">14 yrs</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/60">avg pro experience</div>
            </div>
          </Reveal>

          {/* Content side */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <SectionTitle
              align="left"
              delay={0.08}
              dark={theme === 'dark'}
              badge
              eyebrow="Why LocalHero"
              title="Trust built in"
              subtitle="We rebuilt home services around one idea — homeowners deserve the same protection and transparency as any modern marketplace."
            />

            <Stagger className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <StaggerItem key={feature.title}>
                    <div className="flex gap-4 group">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-[1.05] transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-heading text-base font-extrabold text-navy-950 dark:text-white">
                          {feature.title}
                        </h3>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-navy-600 dark:text-navy-300">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>

            <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="chip border-primary/25! bg-primary/10! text-primary">
                <CheckCircle2 className="w-4 h-4" /> 12-month workmanship warranty
              </span>
              <span className="chip">
                <PhoneCall className="w-4 h-4 text-primary" /> UK support 7 days a week
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};