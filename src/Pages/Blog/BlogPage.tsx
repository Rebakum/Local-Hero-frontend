import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Search,
  ArrowRight,
  Clock,
  Calendar,
  User,
  BookOpen,
  PenLine,
  Sparkles,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { SectionTitle } from '@/src/Components/ui/SectionTitle';
import { Reveal } from '@/src/Components/ui/Reveal';

interface BlogPost {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  role: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
}

const CATEGORIES = [
  'All',
  'Homeowner Guides',
  'Plumbing',
  'Electrical',
  'Gardening',
  'Cleaning',
  'News',
];

const POSTS: BlogPost[] = [
  {
    id: '1',
    category: 'Homeowner Guides',
    title: '10 Signs It’s Time to Replace Your Boiler (Before Winter Hits)',
    excerpt:
      'An old boiler quietly costs you money every single month. Here are the tell-tale signs, the average replacement costs for 2026, and how to get three fixed quotes in under a minute.',
    author: 'Sarah Mitchell',
    role: 'Head of Home Care',
    date: 'Aug 12, 2026',
    readTime: '8 min read',
    image:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop',
    featured: true,
  },
  {
    id: '2',
    category: 'Plumbing',
    title: 'Why Your Bills Are 20% Higher Than Your Neighbours',
    excerpt:
      'Hidden leaks, ageing pipework and inefficient fittings are the usual suspects. We break down the maths and the fixes a plumber will actually recommend.',
    author: 'James Okafor',
    role: 'Master Plumber',
    date: 'Aug 8, 2026',
    readTime: '6 min read',
    image:
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '3',
    category: 'Electrical',
    title: 'Consumer Units Explained: Should You Upgrade in 2026?',
    excerpt:
      'The fuse box you’ve been ignoring could be the biggest fire risk in your home. Learn what a modern consumer unit does and how much an upgrade costs.',
    author: 'Priya Sharma',
    role: 'NICEIC Electrician',
    date: 'Aug 4, 2026',
    readTime: '7 min read',
    image:
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '4',
    category: 'Gardening',
    title: 'The Complete Guide to Autumn Garden Prep in the UK',
    excerpt:
      'From lawn scarification to hedge cuts, a seasonal checklist that keeps your garden thriving through the frost — and adds real value come spring.',
    author: 'Tom Whitfield',
    role: 'RHS Gardener',
    date: 'Jul 30, 2026',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '5',
    category: 'Cleaning',
    title: 'Deep Clean vs. Standard Clean: What Are You Actually Paying For?',
    excerpt:
      'Confused by cleaning quotes? We compare scopes, hourly rates and the checklist every reputable cleaner should follow before they leave.',
    author: 'Amelia Rose',
    role: 'Cleaning Manager',
    date: 'Jul 25, 2026',
    readTime: '4 min read',
    image:
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '6',
    category: 'Homeowner Guides',
    title: 'How to Read a Trade Quote (And Spot a Hidden Fee From a Mile Away)',
    excerpt:
      'Call-out charges, VAT surprises, material markups. Our guide shows you exactly what to look for so you never overpay for home repairs again.',
    author: 'Sarah Mitchell',
    role: 'Head of Home Care',
    date: 'Jul 18, 2026',
    readTime: '9 min read',
    image:
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: '7',
    category: 'News',
    title: 'LocalHero Launches 45-Minute Emergency Dispatch Across 40 Cities',
    excerpt:
      'Burst pipe at midnight? The new Emergency Dispatch network now guarantees a vetted local pro on the way within 45 minutes in 40 UK cities.',
    author: 'The LocalHero Team',
    role: 'Company News',
    date: 'Jul 12, 2026',
    readTime: '3 min read',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
  },
];

const CATEGORY_GRADIENTS: Record<string, string> = {
  'Homeowner Guides':
    'linear-gradient(135deg, rgba(239,17,26,0.92), rgba(0,0,0,0.85))',
  Plumbing: 'linear-gradient(135deg, #0ea5e9, #1e3a8a)',
  Electrical: 'linear-gradient(135deg, #f59e0b, #b91c1c)',
  Gardening: 'linear-gradient(135deg, #10b981, #065f46)',
  Cleaning: 'linear-gradient(135deg, #6366f1, #111827)',
  News: 'linear-gradient(135deg, #ef111a, #450a0a)',
};

export const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const reduce = useReducedMotion();

  const featured = POSTS.find((p) => p.featured);
  const remaining = POSTS.filter((p) => !p.featured);

  const filtered = useMemo(() => {
    return remaining.filter((post) => {
      const matchesCategory =
        activeCategory === 'All' || post.category === activeCategory;
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm, remaining]);

  return (
    <div className="page-top">
      {/* ============ PAGE HEADER ============ */}
      <section className="container-lh section-pad pt-12 pb-4">
        <SectionTitle
          eyebrow="The LocalHero Blog"
          badge={true}
          title="Advice you can actually use"
          subtitle="Practical guides, honest how-tos and news from the tradespeople you book — no jargon, no fluff."
          align="center"
        />

        {/* Search */}
        <Reveal delay={0.1}>
          <div className="relative mx-auto mt-8 md:mt-10 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles (e.g. boiler, plumbing, quotes)..."
              className="input-lh pl-11! py-3.5"
            />
          </div>
        </Reveal>
      </section>

      {/* ============ CATEGORY FILTER ============ */}
      <section className="container-lh pt-10 pb-2 border-y border-navy-100/60 dark:border-white/10">
        <div className="flex flex-wrap justify-center gap-2.5">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`chip transition-all duration-300 ${
                  active
                    ? '!bg-primary !border-primary !text-white shadow-[0_8px_20px_-8px_rgba(239,17,26,0.6)]'
                    : 'hover:border-primary/50 hover:text-primary'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* ============ FEATURED POST ============ */}
      {featured && (
        <section className="container-lh section-pad pb-10 border-y border-navy-100/60 dark:border-white/10">
          <Reveal>
            <article className="group relative grid lg:grid-cols-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative h-64 sm:h-80 lg:h-full overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-glow">
                  <Sparkles className="w-3.5 3" />
                  Featured
                </span>
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-10">
                <span className="inline-flex w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                  {featured.category}
                </span>
                <h2 className="mt-4 font-heading text-2xl sm:text-3xl font-extrabold leading-snug text-navy-950 dark:text-white">
                  {featured.title}
                </h2>
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-navy-800 dark:text-navy-300">
                  {featured.excerpt}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-navy-800 dark:text-navy-300">
                  <span className="inline-flex items-center gap-1.5">
                    <User className="w-3.5 3 text-primary" />
                    {featured.author}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 3 text-primary" />
                    {featured.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 3 text-primary" />
                    {featured.readTime}
                  </span>
                </div>

                <button className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-navy-950 dark:bg-white px-6 py-3 text-sm font-semibold text-white dark:text-navy-950 transition-all duration-300 hover:bg-primary hover:shadow-glow">
                  Read article
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </article>
          </Reveal>
        </section>
      )}

      {/* ============ POSTS GRID ============ */}
      <section className="container-lh section-pad pt-8 border-y border-navy-100/60 dark:border-white/10">
        <SectionTitle
          eyebrow="Latest Articles"
          badge={true}
          title="Fresh from the blog"
          subtitle="Guides, how-tos and honest answers from the tradespeople you book."
          align="center"
        />

        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((post, i) => (
                <motion.article
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800 flex flex-col"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white"
                      style={{ background: CATEGORY_GRADIENTS[post.category] }}>
                      {post.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-heading text-lg font-bold leading-snug text-navy-950 dark:text-white transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-800 dark:text-navy-300 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-navy-100 dark:border-white/10 pt-4 text-xs font-semibold text-navy-800 dark:text-navy-300">
                      <span className="inline-flex items-center gap-1.5">
                        <User className="w-3.5 3 text-primary" />
                        {post.author}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 3 text-primary" />
                        {post.readTime}
                      </span>
                    </div>

                    <button className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-all duration-300 group-hover:gap-2.5">
                      Read article
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 rounded-2xl border border-dashed border-navy-200 dark:border-white/15 py-20 text-center"
            >
              <BookOpen className="mx-auto h-12 w-12 text-primary/60" />
              <p className="mt-4 font-heading text-lg font-bold text-navy-950 dark:text-white">
                No articles found
              </p>
              <p className="mt-1 text-sm text-navy-800 dark:text-navy-300">
                Try a different category or search term.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ============ NEWSLETTER ============ */}
      <section className="relative overflow-hidden bg-navy-950 section-pad border-y border-navy-100/60 dark:border-white/10">
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-primary/15 blur-[140px] pointer-events-none" />

        <div className="container-lh relative z-10 max-w-2xl mx-auto text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Mail className="w-3.5 3" />
              The Weekly Brief
            </span>
            <h2 className="mt-5 font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Home tips, twice a month. No spam.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-white/60">
              Join 40,000+ homeowners getting practical maintenance advice and
              seasonal checklists.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="input-lh !bg-white/10 !border-white/15 !text-white placeholder:!text-white/40 flex-1 rounded-full px-5"
              />
              <button
                type="submit"
                className="btn btn-primary px-7 py-3 text-sm font-semibold"
              >
                Subscribe
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
