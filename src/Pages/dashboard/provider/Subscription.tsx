import React, { useCallback, useEffect, useState } from 'react';
import {
  Loader2,
  AlertCircle,
  BadgeCheck,
  Crown,
  Star,
  Gift,
} from 'lucide-react';
import { PageHeader } from '../../../Components/ui';
import { Card } from '../../../Components/ui/shared/Card';
import { Badge } from '../../../Components/ui/shared/Badge';
import { getMySubscription, type ProviderSubscription } from '../../../services/subscription.service';

const PLAN_META: Record<
  string,
  { label: string; icon: React.FC<{ className?: string }>; tone: string; description: string }
> = {
  FREE: { label: 'Free Listing', icon: Gift, tone: 'neutral', description: 'Basic profile, limited gallery, receive leads and public reviews.' },
  PREMIUM: { label: 'Premium Listing', icon: Crown, tone: 'success', description: 'Priority ranking, unlimited photos, verified badge, advanced stats.' },
  FEATURED: { label: 'Featured Business', icon: Star, tone: 'warning', description: 'Appear at the top of search results for a featured period.' },
};

const formatGBP = (pence: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100);

const Subscription: React.FC = () => {
  const [subscription, setSubscription] = useState<ProviderSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMySubscription();
      setSubscription(data);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Could not load your subscription.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const plan = subscription?.plan ?? 'FREE';
  const meta = PLAN_META[plan] ?? PLAN_META.FREE;
  const Icon = meta.icon;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Provider Panel"
        title="Subscription"
        description="Your LocalHero listing plan and visibility."
      />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {isLoading ? (
        <Card padding="lg">
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card padding="lg" className="lg:col-span-2 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary/5 blur-2xl" />
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Icon className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-navy-900 dark:text-white">{meta.label}</h2>
                  {subscription?.isFeatured && (
                    <Badge variant="warning">
                      <Star className="w-3 h-3" /> Featured
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-navy-500 dark:text-navy-400 mt-1">{meta.description}</p>
                <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-navy-500 dark:text-navy-400">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-100 dark:bg-white/5">
                    <BadgeCheck className="w-3.5 3 text-primary" />
                    Status: {subscription?.status ?? 'ACTIVE'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-100 dark:bg-white/5">
                    Price: {formatGBP(subscription?.priceInPence ?? 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-5 border-t border-navy-100 dark:border-white/10 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-navy-400 dark:text-navy-500">Started</span>
                <span className="font-semibold text-navy-700 dark:text-navy-200">
                  {subscription?.startedAt
                    ? new Date(subscription.startedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-navy-400 dark:text-navy-500">Expires</span>
                <span className="font-semibold text-navy-700 dark:text-navy-200">
                  {subscription?.expiresAt
                    ? new Date(subscription.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '—'}
                </span>
              </div>
              {subscription?.featureStartAt && (
                <div className="flex items-center justify-between">
                  <span className="text-navy-400 dark:text-navy-500">Featured from</span>
                  <span className="font-semibold text-navy-700 dark:text-navy-200">
                    {new Date(subscription.featureStartAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              )}
              {subscription?.featureEndAt && (
                <div className="flex items-center justify-between">
                  <span className="text-navy-400 dark:text-navy-500">Featured until</span>
                  <span className="font-semibold text-navy-700 dark:text-navy-200">
                    {new Date(subscription.featureEndAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              )}
            </div>
          </Card>

          <Card padding="lg" className="relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-amber-500/5 blur-2xl" />
            <h3 className="text-sm font-bold text-navy-900 dark:text-white">Plan features</h3>
            <ul className="mt-4 space-y-2.5 text-xs text-navy-500 dark:text-navy-400">
              <li className="flex items-start gap-2"><BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Basic business profile</li>
              <li className="flex items-start gap-2"><BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Receive leads & bookings</li>
              <li className="flex items-start gap-2"><BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Public customer reviews</li>
              {plan !== 'FREE' && (
                <li className="flex items-start gap-2"><BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Priority search ranking</li>
              )}
              {plan === 'PREMIUM' && (
                <li className="flex items-start gap-2"><BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Unlimited photos & advanced stats</li>
              )}
              {plan === 'FEATURED' && (
                <li className="flex items-start gap-2"><BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> Top-of-search featured slot</li>
              )}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Subscription;
