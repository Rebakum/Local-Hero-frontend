import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Crown, Star, Check, ArrowRight } from 'lucide-react';
import { SectionTitle } from '@/src/Components/ui/SectionTitle';
import { Reveal, Stagger, StaggerItem } from '@/src/Components/ui/Reveal';

interface Plan {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  icon: React.FC<{ className?: string }>;
  highlight?: boolean;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: 'FREE',
    name: 'Free Listing',
    tagline: 'Get started and let customers find you.',
    price: '£0',
    period: '/month',
    icon: Gift,
    features: [
      'Basic business profile',
      'Receive leads & bookings',
      'Public customer reviews',
      'Up to 5 portfolio photos',
    ],
  },
  {
    id: 'PREMIUM',
    name: 'Premium Listing',
    tagline: 'Stand out and win more work.',
    price: '£29.99',
    period: '/month',
    icon: Crown,
    highlight: true,
    features: [
      'Everything in Free',
      'Priority search ranking',
      'Unlimited photos & advanced stats',
      'Verified badge on your profile',
    ],
  },
  {
    id: 'FEATURED',
    name: 'Featured Business',
    tagline: 'Own the top of search results.',
    price: '£49.99',
    period: '/month',
    icon: Star,
    features: [
      'Everything in Premium',
      'Top-of-search featured slot',
      'Featured badge for your chosen period',
      'Extended visibility across the app',
    ],
  },
];

export const SubscriptionPlans: React.FC = () => {
  return (
    <section className="bg-cream-100 dark:bg-black section-pad border-y border-navy-100/60 dark:border-white/10">
      <div className="container-lh">
        <SectionTitle
          eyebrow="Subscription"
          badge={true}
          align="center"
          title="Grow your business with LocalHero"
          subtitle="Pick the plan that fits how you work. Upgrade, downgrade or cancel anytime."
          maxWidth="max-w-2xl"
        />

        <Stagger className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <StaggerItem key={plan.id} className="h-full">
                <Reveal className="h-full">
                  <div
                    className={`group relative flex flex-col h-full rounded-2xl border border-neutral-200 dark:border-white/10 px-7 sm:px-8 pb-7 sm:pb-8 transition-all duration-300 shadow-soft ${
                      plan.highlight
                        ? 'pt-14 sm:pt-16 bg-white dark:bg-navy-900 shadow-[0_20px_50px_-20px_rgba(220,38,38,0.35)] md:-translate-y-2 hover:border-primary/40 hover:shadow-card'
                        : 'pt-7 sm:pt-8 bg-white dark:bg-navy-900 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:hover:border-primary/40 dark:hover:bg-navy-800'
                    }`}
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-t-2xl" />
                    
                    {plan.highlight && (
                      <span className="absolute top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-heading font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-primary/30 whitespace-nowrap z-10">
                        Most Popular
                      </span>
                    )}

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow ${
                          plan.highlight
                            ? 'bg-primary text-white'
                            : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-extrabold text-navy-950 dark:text-white">
                          {plan.name}
                        </h3>
                        <p className="text-xs text-navy-500 dark:text-navy-400">{plan.tagline}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="font-heading text-4xl font-black text-navy-950 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-sm font-semibold text-navy-400 dark:text-navy-500">
                        {plan.period}
                      </span>
                    </div>

                    <ul className="mt-6 space-y-3 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm text-navy-700 dark:text-navy-200">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8">
                      <Link
                        to="/register"
                        className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-bold transition-all ${
                          plan.highlight
                            ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25'
                            : 'bg-navy-100 dark:bg-white/5 text-navy-800 dark:text-white hover:bg-primary hover:text-white'
                        }`}
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </Reveal>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
};

export default SubscriptionPlans;