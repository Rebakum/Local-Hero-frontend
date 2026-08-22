import React from 'react';
import {
  ShieldCheck,
  BadgeCheck,
  Fingerprint,
  Lock,
  CreditCard,
  Star,
  FileCheck,
  UserCheck,
  ClipboardCheck,
  HeartHandshake,
  AlertTriangle,
  PhoneCall,
  IdCard,
  Timer,
  Headphones,
  KeyRound,
  RefreshCcw,
} from 'lucide-react';
import { SectionTitle } from '@/src/Components/ui/SectionTitle';
import { Reveal } from '@/src/Components/ui/Reveal';
import { Stagger, StaggerItem } from '@/src/Components/ui/Reveal';


const TRUST_BADGES = [
  { icon: BadgeCheck, label: '100% DBS Checked' },
  { icon: IdCard, label: 'ID & Address Verified' },
  { icon: CreditCard, label: 'Secure Payments' },
  { icon: Star, label: 'Verified Reviews' },
];

const STATS = [
  { value: '100%', label: 'Pros DBS checked' },
  { value: '14,200+', label: 'Verified reviews' },
  { value: '45 min', label: 'Emergency dispatch' },
  { value: '4.9/5', label: 'Average rating' },
];

const VETTING_STEPS = [
  {
    icon: UserCheck,
    step: '01',
    title: 'Identity & address check',
    text: 'Every pro must prove who they are and where they work using Government-approved ID documents.',
  },
  {
    icon: ShieldCheck,
    step: '02',
    title: 'DBS criminal record check',
    text: 'A Disclosure and Barring Service check is mandatory before anyone is allowed inside your home.',
  },
  {
    icon: FileCheck,
    step: '03',
    title: 'Licence & insurance review',
    text: 'We verify trade licences (Gas Safe, NICEIC and more) plus public liability insurance of £1m+.',
  },
  {
    icon: RefreshCcw,
    step: '04',
    title: 'Ongoing rating monitoring',
    text: 'Ratings and reviews are monitored continuously — pros who slip below 4.5 stars are removed.',
  },
];

const PILLARS = [
  {
    icon: Fingerprint,
    title: 'Secure Account Protection',
    text: 'Two-factor authentication and encrypted credentials keep your LocalHero account locked down at every step.',
  },
  {
    icon: Lock,
    title: 'Private, Encrypted Messaging',
    text: 'Chat with pros inside the app. Your address, phone number and payment details are never shared directly.',
  },
  {
    icon: CreditCard,
    title: 'Escrow-Style Payments',
    text: 'Money is only released to the pro once the job is complete and you confirm you’re happy.',
  },
  {
    icon: Star,
    title: 'Verified Reviews Only',
    text: 'Reviews are linked to completed bookings. It is impossible for pros to review themselves or friends.',
  },
  {
    icon: HeartHandshake,
    title: 'Workmanship Guarantee',
    text: 'Jobs booked through LocalHero are protected by our 12-month workmanship guarantee. We sort it out.',
  },
  {
    icon: Headphones,
    title: '24/7 Human Support',
    text: 'A real person answers the phone around the clock — before, during and after your job.',
  },
];

const STANDARDS = [
  {
    icon: Timer,
    title: 'Fixed, upfront pricing',
    text: 'The quote you accept is the price you pay. No call-out fees, no surprise add-ons.',
  },
  {
    icon: KeyRound,
    title: 'No doorstep haggling',
    text: 'Pros can never charge more than the agreed fixed quote — it’s written into their contract.',
  },
  {
    icon: ClipboardCheck,
    title: 'Job completion checklist',
    text: 'Every job closes with a checklist so you know exactly what was done and what to look for.',
  },
  {
    icon: AlertTriangle,
    title: 'Simple reporting tools',
    text: 'Spot something wrong? Report it in two taps and our safety team reviews it within hours.',
  },
];

export const TrustSafetyPage: React.FC = () => {
  return (
    <div className="page-top">
      


      {/* ============ SAFETY PILLARS ============ */}
      <section className="relative overflow-hidden bg-white section-pad border-y border-navy-100/60 dark:border-white/10 dark:bg-navy-950">
        <div className="absolute top-1/2 right-0 translate-y-[-50%] w-[420px] h-[420px] rounded-full bg-primary/15 blur-[140px] pointer-events-none" />

        <div className="container-lh relative z-10">
          <SectionTitle
            eyebrow="The LocalHero Promise"
            badge={true}
            title="Protection in every layer"
            subtitle="Six safeguards that hold across every single booking, from first message to final payment."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:shadow-glow">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-bold text-navy-950 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-navy-800 dark:text-navy-300">
                    {text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ OUR STANDARDS ============ */}
      <section className="container-lh section-pad border-y border-navy-100/60 dark:border-white/10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <FileCheck className="w-3.5 3" />
                Our Standards
              </span>
              <h2 className="mt-5 font-heading text-3xl sm:text-4xl font-extrabold leading-tight text-navy-950 dark:text-white">
                Fair for you.
                <span className="text-primary"> Fair for the pro.</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-navy-800 dark:text-navy-300">
                Trust works both ways. The same guarantees that protect your
                home also make sure the tradespeople who work in it are treated
                and paid properly.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {STANDARDS.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800 flex gap-4">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:shadow-glow">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-navy-950 dark:text-white">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-navy-800 dark:text-navy-300">
                      {text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

     
      {/* ============ CTA ============ */}
      
    </div>
  );
};
