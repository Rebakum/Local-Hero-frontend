import React, { useEffect, useState } from 'react';
import { getAllFAQs } from '@/src/services/api';
import { Search, PhoneCall, Mail } from 'lucide-react';
import { SectionTitle } from '@/src/Components/ui/SectionTitle';
import { Reveal } from '@/src/Components/ui/Reveal';
import { FAQAccordion } from './FAQAccordion';
import type { FAQItem } from '@/src/types';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [query, setQuery] = useState('');
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  useEffect(() => {
    getAllFAQs()
      .then((data) => setFaqs(data))
      .catch(() => setFaqs([]));
  }, []);

  useEffect(() => {
    setOpenIndex(null);
  }, [query]);

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(query.toLowerCase()) ||
      f.answer.toLowerCase().includes(query.toLowerCase()),
  );

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="bg-cream-100 dark:bg-black border-y border-navy-100/60 dark:border-white/10 section-pad"
    >
      <div className="container-lh">
        <SectionTitle
          badge
          eyebrow="FAQ"
          title="Questions answered"
          subtitle="Straight answers about vetting, pricing, guarantees and emergency dispatch."
        />

        <Reveal delay={0.1}>
          <div className="mx-auto ">
            {/* Search */}
            <div className="relative mx-auto mt-8 md:mt-10 max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions (e.g. call-out fees, insurance)..."
                className="input-lh pl-11! py-3.5"
              />
            </div>

            {/* Accordion */}
            <FAQAccordion
              items={filtered}
              openIndex={openIndex}
              onToggle={handleToggle}
              query={query}
              onClearSearch={() => setQuery('')}
            />

            {/* Still need help */}
            <div className="relative mt-8 md:mt-10 overflow-hidden rounded-4xl bg-black text-white p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,17,26,0.35),transparent_60%)] pointer-events-none" />
              <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
              <div className="relative z-10 text-center md:text-left">
                <h3 className="font-heading text-xl md:text-2xl font-extrabold text-white">
                  Still have questions?
                </h3>
                <p className="mt-1.5 text-sm text-white/60">
                  Our UK team is available 7 days a week, 8am  8pm.
                </p>
              </div>
              <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="tel:+448009178020"
                  className="btn btn-white px-6 py-3"
                >
                  <PhoneCall className="w-4 h-4" /> 0800 917 8020
                </a>
                <a
                  href="mailto:hello@localhero.com"
                  className="btn btn-ghost-light px-6 py-3"
                >
                  <Mail className="w-4 h-4" /> Email us
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
