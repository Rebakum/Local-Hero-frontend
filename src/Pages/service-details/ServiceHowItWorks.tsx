import React from 'react';
import { ClipboardList, Search, ThumbsUp, CheckCircle2 } from 'lucide-react';
import { Reveal } from '../../Components/ui/Reveal';

const steps = [
  { icon: ClipboardList, step: '1', title: 'Post Your Job', desc: 'Tell us what you need and pick a time that suits you.' },
  { icon: Search, step: '2', title: 'Get Matched', desc: 'We connect you with up to 3 vetted local pros instantly.' },
  { icon: ThumbsUp, step: '3', title: 'Choose Your Pro', desc: 'Compare quotes, check reviews and pick your favourite.' },
  { icon: CheckCircle2, step: '4', title: 'Job Done', desc: "Work gets completed. Pay securely only when you're satisfied." },
];

export const ServiceHowItWorks: React.FC = () => {
  return (
    <Reveal delay={0.1}>
      <div className="mt-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3.5 py-1.5 rounded-full">Process</span>
          <h2 className="font-heading text-3xl font-black text-navy-950 dark:text-white mt-3">
            How Booking Works
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => (
            <div key={item.step} className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 text-center hover:border-primary/40 transition-all hover:-translate-y-1 shadow-sm">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <item.icon size={26} />
              </div>
              <div className="text-[11px] font-heading font-black text-primary uppercase tracking-widest mb-1">Step {item.step}</div>
              <h3 className="font-heading font-bold text-navy-950 dark:text-white text-base mb-2">{item.title}</h3>
              <p className="text-xs text-navy-500 dark:text-navy-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
};
