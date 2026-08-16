import React from 'react';
import { FAQItem } from './FAQItem';

interface FAQEntry {
  id: string | number;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQEntry[];
  openIndex: number | null;
  onToggle: (index: number) => void;
  query: string;
  onClearSearch: () => void;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({
  items,
  openIndex,
  onToggle,
  query,
  onClearSearch,
}) => {
  return (
    <div className="mt-8 group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white px-6 md:px-8 divide-y divide-navy-100 dark:divide-white/10 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {items.length === 0 && (
        <div className="py-14 text-center">
          <p className="text-sm font-semibold text-navy-500 dark:text-navy-300">
            No results for &quot;{query}&quot;  try another search term.
          </p>
          <button
            onClick={onClearSearch}
            className="btn btn-outline mt-5 px-5 py-2.5 text-xs"
          >
            Clear search
          </button>
        </div>
      )}
      {items.map((faq, i) => (
        <FAQItem
          key={faq.id}
          question={faq.question}
          answer={faq.answer}
          isOpen={openIndex === i}
          onToggle={() => onToggle(i)}
        />
      ))}
    </div>
  );
};
