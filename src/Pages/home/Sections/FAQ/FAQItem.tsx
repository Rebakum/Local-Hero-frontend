import React from 'react';
import { Plus } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
}) => {
  return (
    <div
      className={`group relative w-full overflow-hidden rounded-2xl border transition-all duration-300 ${
        isOpen
          ? 'border-primary/40 bg-white shadow-card dark:border-primary/40 dark:bg-navy-900'
          : 'border-neutral-200 bg-white shadow-soft hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/30'
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      />
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
      >
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            isOpen
              ? 'rotate-45 bg-primary text-white shadow-glow'
              : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
          }`}
        >
          <Plus className="h-4 w-4" />
        </span>
        <span className="flex-1 font-heading text-lg font-bold leading-snug text-navy-950 transition-colors duration-200 group-hover:text-primary sm:text-xl dark:text-white dark:group-hover:text-primary">
          {question}
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 pl-[4.25rem] pr-6 text-lg leading-relaxed text-navy-800 sm:px-6 sm:pl-[4.25rem] sm:text-base dark:text-navy-300">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};
