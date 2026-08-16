import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface StepIndicatorProps {
  steps: readonly string[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => (
  <div className="flex items-center gap-3">
    {steps.map((label, i) => {
      const n = (i + 1) as number;
      const done = currentStep > n;
      const active = currentStep === n;
      return (
        <React.Fragment key={label}>
          {i > 0 && (
            <div className="h-px flex-1 bg-navy-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full bg-primary transition-all duration-500 ${
                  currentStep > i ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          )}
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-heading font-extrabold transition-all ${
                done
                  ? 'bg-primary text-white'
                  : active
                    ? 'bg-primary text-white shadow-glow'
                    : 'bg-navy-100 text-navy-400 dark:bg-white/10 dark:text-navy-300'
              }`}
            >
              {done ? <CheckCircle2 className="w-3.5 3" /> : n}
            </span>
            <span
              className={`hidden sm:inline text-[11px] font-heading font-bold uppercase tracking-wider ${
                active || done ? 'text-navy-950 dark:text-white' : 'text-navy-400 dark:text-navy-300'
              }`}
            >
              {label}
            </span>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);
