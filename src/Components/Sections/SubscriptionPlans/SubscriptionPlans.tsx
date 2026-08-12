import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Crown, Star, Check, ArrowRight } from 'lucide-react';
import { SectionTitle } from '../../ui/SectionTitle';
import { Reveal, Stagger, StaggerItem } from '../../ui/Reveal';

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
    <section className="bg-cream-100 dark:bg-black py-16 md:py-24">
      <div className="container-lh">
        <SectionTitle
          eyebrow="Subscription"
          badge={true}
          align="center"
          title="Grow your business with LocalHero"
          subtitle="Pick the plan that fits how you work. Upgrade, downgrade or cancel anytime."
          maxWidth="max-w-2xl"
        />

        <Stagger className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <StaggerItem key={plan.id} className="h-full">
                <Reveal className="h-full">
                  <div
                    className={`relative flex flex-col h-full rounded-3xl border p-7 sm:p-8 transition-all duration-300 ${
                      plan.highlight
                        ? 'bg-white dark:bg-navy-900 border-primary/40 shadow-[0_20px_50px_-20px_rgba(220,38,38,0.35)] md:-translate-y-2'
                        : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-white/10 hover:border-primary/40'
                    }`}
                  >
                    {plan.highlight && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-heading font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg shadow-primary/30">
                        Most Popular
                      </span>
                    )}

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          plan.highlight
                            ? 'bg-primary text-white'
                            : 'bg-primary/10 text-primary'
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
                        className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
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
