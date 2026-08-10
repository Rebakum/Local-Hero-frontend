import React from 'react';
import { ChevronDown } from 'lucide-react';

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
    <div>
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between gap-4 text-left"
      >
        <span className="font-heading font-bold text-[15px] leading-snug text-navy-950 dark:text-white">
          {question}
        </span>
        <span
          className={`shrink-0 w-8 h-8 rounded-full border border-navy-200 dark:border-white/15 flex items-center justify-center transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <ChevronDown
            className={`w-4 h-4 transition-colors duration-300 ${
              isOpen ? 'text-primary' : 'text-navy-400 dark:text-navy-300'
            }`}
          />
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-relaxed text-navy-600 dark:text-navy-300">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};
