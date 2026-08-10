import React from 'react';
import { Reveal } from '../../Components/ui/Reveal';
import {
  ClipboardList, Search, ThumbsUp, CheckCircle2,
} from 'lucide-react';

const STEPS = [
  { icon: ClipboardList, step: '1', title: 'Post Your Job', desc: 'Tell us what you need. Takes less than 60 seconds.' },
  { icon: Search, step: '2', title: 'Get Matched', desc: 'Receive instant quotes from up to 3 vetted local pros.' },
  { icon: ThumbsUp, step: '3', title: 'Choose Your Pro', desc: 'Compare ratings, reviews and prices. Pick your favourite.' },
  { icon: CheckCircle2, step: '4', title: 'Job Done', desc: 'Work gets completed. Pay securely only when satisfied.' },
];

export const ServicesHowItWorks: React.FC = () => {
  return (
    <section className="bg-cream-100 dark:bg-navy-950 py-12">
      <div className="container-lh">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              How It Works
            </span>
            <h2 className="mt-4 font-heading text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-[1.08] tracking-tight text-navy-950 dark:text-white">
              Book a pro in 4 simple steps
            </h2>
            <p className="mt-4 text-[15px] sm:text-base leading-relaxed text-navy-500 dark:text-navy-300">
              From posting your job to paying after completion — the entire process takes minutes.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((item) => (
            <Reveal key={item.step} delay={0.1}>
              <div className="bg-white dark:bg-navy-900 border border-neutral-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 text-center h-full">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <item.icon size={24} className="text-primary" />
                </div>
                <div className="text-[10px] font-heading font-bold text-primary uppercase tracking-widest mb-2">Step {item.step}</div>
                <h3 className="font-heading font-extrabold text-navy-950 dark:text-white text-base mb-2">{item.title}</h3>
                <p className="text-sm text-navy-500 dark:text-navy-300 leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
