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
    <div className="mt-8 bg-white dark:bg-navy-900 rounded-3xl border border-navy-100 dark:border-white/10 px-6 md:px-8 divide-y divide-navy-100 dark:divide-white/10">
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
