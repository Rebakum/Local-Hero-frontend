import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  MapPin, MessageSquare, ShieldCheck, BellRing, Star, CheckCircle2, Apple, Play,
} from 'lucide-react';
import { SectionTitle } from '@/src/Components/ui/SectionTitle';
import { Reveal, Stagger, StaggerItem } from '@/src/Components/ui/Reveal';

gsap.registerPlugin(ScrollTrigger);

const APP_FEATURES = [
  { icon: MapPin, title: 'Live pro tracking', desc: 'Watch your tradesperson arrive in real time with live ETA updates.' },
  { icon: MessageSquare, title: 'In-app chat & photos', desc: 'Share photos and agree scope with your pro before the job starts.' },
  { icon: ShieldCheck, title: 'Secure payments', desc: 'Escrow-held payments released only once you approve the work.' },
  { icon: BellRing, title: 'Smart alerts', desc: 'Instant notifications for quotes, dispatch and job completion.' },
];

export const MobileAppPreview: React.FC = () => {
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
    <section ref={sectionRef} className="bg-white dark:bg-black py-8 md:py-12">
      <div className="container-lh">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Phone mockup */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <Reveal delay={0.1}>
            <div className="relative w-60 sm:w-75 mx-auto parallax-img scale-[1.12]">
              <div className="absolute -inset-8 bg-primary/15 blur-3xl rounded-[3rem] pointer-events-none" />

              <div className="relative bg-black rounded-[2.75rem] border border-white/10 p-3 shadow-lift">
                <div className="relative rounded-[2.25rem] bg-cream-50 dark:bg-navy-900 overflow-hidden pt-10 px-3 pb-3">
                  {/* Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full z-20" />

                  {/* Mini map */}
                  <div className="relative h-44 sm:h-56 rounded-2xl overflow-hidden bg-black">
                    <div className="absolute inset-0 dot-grid" />
                    <span className="absolute left-8 top-14 w-3 h-3 rounded-full bg-primary pulse-dot" />
                    <span className="absolute right-10 top-24 w-3 h-3 rounded-full bg-white/30" />
                    <span className="absolute left-1/3 bottom-12 w-3 h-3 rounded-full bg-white/30" />
                    {/* Route line */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 240 256" fill="none" preserveAspectRatio="none">
                      <path d="M40 56 C 90 40, 150 90, 200 84" stroke="var(--color-primary)" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />
                    </svg>
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" /> James S. • 12 min away
                    </div>
                  </div>

                  {/* Pro card */}
                  <div className="mt-3 rounded-2xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-white/10 p-3 sm:p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src="/images/service2.png"
                        alt="James Stirling"
                        className="w-11 h-11 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-heading font-extrabold text-navy-950 dark:text-white truncate">James Stirling</div>
                        <div className="text-[10px] font-medium text-navy-500 dark:text-navy-300 truncate">Stirling Heating &amp; Gas</div>
                        <div className="mt-0.5 flex items-center gap-1">
                          <span className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                            ))}
                          </span>
                          <span className="text-[10px] font-bold text-navy-600 dark:text-navy-300">4.98</span>
                        </div>
                      </div>
                      <span className="shrink-0 bg-primary text-white text-[10px] font-bold rounded-full px-2.5 py-1">£55/hr</span>
                    </div>
                    {/* Mock actions  plain text, deliberately not clickable */}
                    <div className="mt-3 pt-3 border-t border-navy-100 dark:border-white/10 flex items-center gap-3 text-xs font-semibold text-navy-500 dark:text-navy-300">
                      <span>Confirm booking</span>
                      <span className="w-px h-3 bg-navy-200 dark:bg-white/15" />
                      <span>View details</span>
                    </div>
                  </div>

                  {/* Floating notification  in-flow so it never overflows the phone */}
                  <div className="mt-3 glass rounded-2xl p-3 sm:p-3.5 flex items-center gap-2.5 shadow-lift">
                    <span className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-black flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </span>
                    <div>
                      <div className="text-[11px] font-heading font-extrabold text-navy-950 dark:text-white">New quote received</div>
                      <div className="text-[10px] font-semibold text-navy-500 dark:text-navy-300">Boiler repair • £180 fixed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </Reveal>
          </div>

          {/* Content */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <SectionTitle
              align="left"
              delay={0.08}
              badge
              eyebrow="The LocalHero app"
              title="Your home team"
              subtitle="Book, track and pay from anywhere. The full LocalHero experience  rom emergency dispatch to digital invoices  n one beautiful app."
            />

            <Stagger className="mt-7 md:mt-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {APP_FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <StaggerItem key={feature.title}>
                    <div className="bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 rounded-2xl p-4 sm:p-5">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="mt-3 sm:mt-4 font-heading text-[14px] sm:text-[15px] font-extrabold text-navy-950 dark:text-white">{feature.title}</h3>
                      <p className="mt-1 sm:mt-1.5 text-[12px] sm:text-[13px] leading-relaxed text-navy-600 dark:text-navy-300">{feature.desc}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>

            <div className="mt-7 md:mt-9 flex flex-col sm:flex-row flex-wrap gap-3">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-dark flex-1 justify-start px-4 sm:px-6 py-3 sm:py-3.5"
              >
                <Apple className="w-5 h-5 fill-white" />
                <span className="text-left leading-tight">
                  <span className="block text-[10px] font-medium text-white/70">Download on the</span>
                  <span className="font-semibold text-white">App Store</span>
                </span>
              </a>
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-dark flex-1 justify-start px-4 sm:px-6 py-3 sm:py-3.5"
              >
                <Play className="w-5 h-5 fill-white" />
                <span className="text-left leading-tight">
                  <span className="block text-[10px] font-medium text-white/70">Get it on</span>
                  <span className="font-semibold text-white">Google Play</span>
                </span>
              </a>
            </div>

            <div className="mt-5 md:mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-navy-500 dark:text-navy-300">
              <span className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
                ))}
              </span>
              <span>4.9 • 25,000+ reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
