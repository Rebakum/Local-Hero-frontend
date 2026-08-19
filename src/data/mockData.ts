import { FAQItem } from '../types';

// Static FAQ content. All provider/trade/testimonial mock data has been
// removed — providers must come from the real backend (approved Provider
// Applications only), never from hardcoded/dummy records.

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'General',
    question: 'How does LocalHero vet tradespeople in the UK?',
    answer: 'Every professional on LocalHero undergoes our strict 6-point verification process. We verify proof of identity (DBS background check), professional qualifications (e.g. Gas Safe, NICEIC, NVQ certifications), public liability insurance (minimum £1M coverage), business address, and past client references before they can accept bookings.',
  },
  {
    id: 'faq-2',
    category: 'Booking',
    question: 'How quickly can a pro arrive at my house?',
    answer: 'For emergency services (such as burst pipes, lockouts, or loss of power), our 24/7 Fast-Track dispatch service connects you with local pros who arrive in average 30 to 45 minutes across major UK towns and cities.',
  },
  {
    id: 'faq-3',
    category: 'Pricing',
    question: 'Are quotes fixed or subject to surprise call-out fees?',
    answer: 'All quotes generated via LocalHero specify fixed pricing or clear hourly caps upfront. There are no hidden call-out fees. The payment is held securely in escrow and only released to the tradesperson after you approve the completed job.',
  },
  {
    id: 'faq-4',
    category: 'Pros & Vetting',
    question: 'Is my property protected if something goes wrong?',
    answer: 'Yes! All jobs booked and paid through the LocalHero app are covered by our £2,000,000 Property Damage Guarantee in addition to the professional\'s own mandatory Public Liability Insurance.',
  },
  {
    id: 'faq-5',
    category: 'Emergency',
    question: 'What qualifies as an Emergency 24/7 Request?',
    answer: 'Active water leaks threatening ceilings, total loss of power, boiler breakdown during freezing temperatures, broken locks leaving a home unsecure, or dangerous gas smells (call 0800 111999 first for gas emergencies!).',
  },
];