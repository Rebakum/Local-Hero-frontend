import React from 'react';
import { SearchX } from 'lucide-react';
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
    <div className="mt-8 space-y-3 md:mt-10">
      {items.length === 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-12 text-center shadow-soft dark:border-white/10 dark:bg-navy-900">
          <SearchX size={28} className="mx-auto text-primary" />
          <p className="mt-4 text-sm font-semibold text-navy-500 dark:text-navy-300">
            No results for &quot;{query}&quot; — try another search term.
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
