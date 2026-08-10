import React from 'react';
import { Link } from 'react-router-dom';
import { SectionTitle } from '../ui/SectionTitle';
import { Stagger, StaggerItem } from '../ui/Reveal';
import { Search, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    number: '01',
    title: 'Post your job',
    desc: 'Describe the task, choose your service and postcode, and pick a date. Takes under 60 seconds  no account needed.',
    note: 'Free to post • No call-out fees',
  },
  {
    icon: Zap,
    number: '02',
    title: 'Get matched instantly',
    desc: 'LocalHero pings up to 3 vetted professionals nearby. Compare fixed quotes, ratings and availability side by side.',
    note: 'Avg. 3 quotes in under 5 minutes',
  },
  {
    icon: CheckCircle2,
    number: '03',
    title: 'Pay only when happy',
    desc: 'Money stays in secure escrow until you approve the finished job. Backed by our £2M guarantee and 12-month workmanship warranty.',
    note: 'Escrow protected • 0% risk',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="bg-white dark:bg-black border-y border-navy-100/60 dark:border-white/10 py-8 md:py-12"
    >
      <div className="container-lh">
        <SectionTitle badge eyebrow="How it works" title="Book in 3 steps" />
        <Stagger className="mt-8 md:mt-14 grid grid-cols-1 md:grid-cols-2 justify-center items-center lg:grid-cols-3 gap-5">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <StaggerItem key={step.title}>
                <div
                  className="card rounded-3xl p-6 sm:p-8 relative hover:-translate-y-1 hover:shadow-lift hover:border-primary/25 transition-all"
                >
                  <span className="absolute top-6 right-7 font-heading text-6xl font-extrabold leading-none text-navy-100 dark:text-white/5 select-none">
                    {step.number}
                  </span>
                  <div className=" bg-primary  text-white rounded-2xl w-14 h-14 flex items-center justify-center shadow-card">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-6 font-heading text-xl font-extrabold text-navy-950 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-navy-600 dark:text-navy-300">
                    {step.desc}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 border border-primary/25 rounded-full px-3 py-1.5">
                    {step.note}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
        <div className="mt-8 md:mt-12 text-center">
          <Link to="/professionals" className="btn btn-primary px-8 py-3.5 text-sm">
            Browse verified pros <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
