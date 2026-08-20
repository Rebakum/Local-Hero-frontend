import React, { useCallback, useEffect, useState } from 'react';
import {
  Loader2,
  AlertCircle,
  BadgeCheck,
  Crown,
  Gift,
  Star,
  Check,
  ExternalLink,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { PageHeader, StatusBadge } from '../../../Components/ui';
import { Card } from '../../../Components/ui/shared/Card';
import { Badge } from '../../../Components/ui/shared/Badge';
import { useToast } from '../../../Context/ToastContext';
import {
  getSubscriptionPlans,
  getMySubscription,
  createSubscriptionCheckout,
  changeSubscriptionPlan,
  cancelSubscription,
  resumeSubscription,
  getBillingPortalUrl,
  getFeaturedAddons,
  createFeatureCheckout,
  type SubscriptionPlan,
  type ProviderSubscription,
  type SubscriptionStatus,
  type FeaturedAddon,
} from '../../../services/subscription.service';

const formatGBP = (pence: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(
    (pence || 0) / 100
  );

const STATUS_MESSAGE: Record<SubscriptionStatus, string> = {
  ACTIVE: 'Your subscription is active.',
  TRIALING: 'Your subscription is in trial.',
  PAST_DUE: 'Your payment needs attention.',
  INCOMPLETE: 'Your payment is incomplete.',
  CANCELLED: 'Your subscription is no longer active.',
  EXPIRED: 'Your subscription has expired.',
};

const PLAN_ICON: Record<string, React.FC<{ className?: string }>> = {
  free: Gift,
  premium: Crown,
  starter: Star,
  professional: Crown,
  business: Crown,
};

const formatDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

const Subscription: React.FC = () => {
  const toast = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [addons, setAddons] = useState<FeaturedAddon[]>([]);
  const [subscription, setSubscription] = useState<ProviderSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [featurePlan, setFeaturePlan] = useState<string | null>(null);
  const [busy, setBusy] = useState<'change' | 'cancel' | 'resume' | 'portal' | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [plansData, subData, addonsData] = await Promise.all([
        getSubscriptionPlans(),
        getMySubscription(),
        getFeaturedAddons(),
      ]);
      setPlans(plansData);
      setSubscription(subData);
      setAddons(addonsData);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setError(apiError.response?.data?.message || apiError.message || 'Could not load subscription information.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const currentPlanId = subscription?.planId ?? null;
  const status = subscription?.status ?? 'ACTIVE';
  const isPaidActive = !!subscription && ['ACTIVE', 'TRIALING'].includes(status);

  const handleCheckout = async (plan: SubscriptionPlan) => {
    if (checkoutPlan) return; // prevent double-click
    setCheckoutPlan(plan.id);
    try {
      const res = await createSubscriptionCheckout(plan.id);
      if (res.url) {
        window.location.href = res.url;
        return;
      }
      toast.error('No checkout URL returned. Please try again.');
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(apiError.response?.data?.message || apiError.message || 'Could not start checkout.');
    } finally {
      setCheckoutPlan(null);
    }
  };

  const handleChangePlan = async (plan: SubscriptionPlan) => {
    setBusy('change');
    try {
      await changeSubscriptionPlan(plan.id);
      toast.success('Plan change submitted. Confirming with Stripe...');
      await load();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(apiError.response?.data?.message || apiError.message || 'Could not change plan.');
    } finally {
      setBusy(null);
    }
  };

  const handleCancel = async () => {
    setBusy('cancel');
    try {
      await cancelSubscription();
      toast.success('Your subscription will end at the end of this billing period.');
      await load();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(apiError.response?.data?.message || apiError.message || 'Could not cancel subscription.');
    } finally {
      setBusy(null);
    }
  };

  const handleResume = async () => {
    setBusy('resume');
    try {
      await resumeSubscription();
      toast.success('Your subscription has been resumed.');
      await load();
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(apiError.response?.data?.message || apiError.message || 'Could not resume subscription.');
    } finally {
      setBusy(null);
    }
  };

  const handlePortal = async () => {
    setBusy('portal');
    try {
      const res = await getBillingPortalUrl();
      if (res.url) {
        window.location.href = res.url;
        return;
      }
      toast.error('Could not open billing portal.');
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(apiError.response?.data?.message || apiError.message || 'Could not open billing portal.');
    } finally {
      setBusy(null);
    }
  };

  const handleFeatureCheckout = async (addon: FeaturedAddon) => {
    if (featurePlan) return; // prevent double-click
    setFeaturePlan(addon.id);
    try {
      const res = await createFeatureCheckout(addon.id);
      if (res.url) {
        window.location.href = res.url;
        return;
      }
      toast.error('No checkout URL returned. Please try again.');
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(apiError.response?.data?.message || apiError.message || 'Could not start featured checkout.');
    } finally {
      setFeaturePlan(null);
    }
  };

  const featureActive = !!subscription?.isFeatured && !!subscription?.featureEndAt && new Date(subscription.featureEndAt) > new Date();

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Provider Panel" title="Subscription" description="Your plan and billing." />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <Card padding="lg" className="lg:col-span-2"><div className="h-6 w-40 bg-navy-100 dark:bg-white/10 rounded mb-4" /><div className="h-4 w-64 bg-navy-100 dark:bg-white/10 rounded" /></Card>
          <Card padding="lg"><div className="h-6 w-28 bg-navy-100 dark:bg-white/10 rounded" /></Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Provider Panel"
        title="Subscription"
        description="Your LocalHero plan, billing and visibility."
      />

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-sm font-semibold text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
          <button onClick={load} className="ml-auto inline-flex items-center gap-1 text-primary hover:underline">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Current subscription */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card padding="lg" className="lg:col-span-2 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary/5 blur-2xl" />
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              {(() => {
                const Icon = PLAN_ICON[subscription?.planDetail?.slug ?? ''] ?? Gift;
                return <Icon className="w-7 h-7" />;
              })()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-navy-900 dark:text-white">
                  {subscription?.planDetail?.name ?? 'Free'}
                </h2>
                <StatusBadge status={status} />
              </div>
              <p className="text-sm text-navy-500 dark:text-navy-400 mt-1">
                {subscription?.planDetail?.description ?? 'Basic profile and listings.'}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-navy-500 dark:text-navy-400">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy-100 dark:bg-white/5">
                  <BadgeCheck className="w-3.5 3 text-primary" />
                  {formatGBP(subscription?.priceInPence ?? 0)}
                  {subscription?.planDetail?.interval === 'YEARLY' ? ' / year' : ' / month'}
                </span>
                {subscription?.cancelAtPeriodEnd && subscription?.status === 'ACTIVE' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold">
                    <XCircle className="w-3.5 3" /> Ends {formatDate(subscription.currentPeriodEnd)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-5 border-t border-navy-100 dark:border-white/10 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-navy-400 dark:text-navy-500">Status</span>
              <span className="font-semibold text-navy-700 dark:text-navy-200">
                {subscription?.cancelAtPeriodEnd && subscription?.status === 'ACTIVE'
                  ? `Ends ${formatDate(subscription.currentPeriodEnd)}`
                  : STATUS_MESSAGE[status]}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-navy-400 dark:text-navy-500">Renews</span>
              <span className="font-semibold text-navy-700 dark:text-navy-200">
                {formatDate(subscription?.currentPeriodEnd)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-navy-400 dark:text-navy-500">Started</span>
              <span className="font-semibold text-navy-700 dark:text-navy-200">
                {formatDate(subscription?.startedAt)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-navy-400 dark:text-navy-500">Plan</span>
              <span className="font-semibold text-navy-700 dark:text-navy-200">
                {subscription?.planDetail?.name ?? 'Free'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-navy-100 dark:border-white/10">
            <button
              onClick={handlePortal}
              disabled={busy === 'portal' || !subscription}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-100 dark:bg-white/5 text-navy-700 dark:text-navy-200 text-sm font-semibold hover:bg-navy-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              {busy === 'portal' ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
              Manage Billing
            </button>
            {subscription?.status === 'ACTIVE' && subscription?.cancelAtPeriodEnd ? (
              <button
                onClick={handleResume}
                disabled={busy === 'resume'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {busy === 'resume' && <Loader2 className="w-4 h-4 animate-spin" />}
                Resume Subscription
              </button>
            ) : isPaidActive ? (
              <button
                onClick={handleCancel}
                disabled={busy === 'cancel'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                {busy === 'cancel' && <Loader2 className="w-4 h-4 animate-spin" />}
                Cancel Subscription
              </button>
            ) : null}
          </div>
        </Card>

        <Card padding="lg" className="relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-amber-500/5 blur-2xl" />
          <h3 className="text-sm font-bold text-navy-900 dark:text-white">Plan features</h3>
          <ul className="mt-4 space-y-2.5 text-xs text-navy-500 dark:text-navy-400">
            {(subscription?.planDetail?.features?.length
              ? subscription.planDetail.features
              : ['Business profile', 'Receive leads & bookings', 'Public reviews']
            ).map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {feature}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Available plans */}
      <div>
        <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-4">Available plans</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlanId;
            const isFree = plan.priceInPence <= 0;
            const Icon = PLAN_ICON[plan.slug] ?? Gift;
            const showCheckout = !isCurrent && !isFree;
            const showChange = !isCurrent && !isFree && isPaidActive;
            const busyThis = checkoutPlan === plan.id || (busy === 'change' && isCurrent === false);
            return (
              <Card
                key={plan.id}
                padding="md"
                className={`h-full flex flex-col ${isCurrent ? 'border-2 border-primary/40' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="font-bold text-navy-900 dark:text-white">{plan.name}</p>
                    {isCurrent && <Badge variant="success">Current plan</Badge>}
                  </div>
                </div>

                <p className="text-xs text-navy-500 dark:text-navy-400 mt-3 min-h-[2.5rem]">{plan.description}</p>

                <div className="mt-3">
                  <span className="text-2xl font-black text-navy-900 dark:text-white">
                    {isFree ? 'Free' : formatGBP(plan.priceInPence)}
                  </span>
                  {!isFree && (
                    <span className="text-xs text-navy-400 dark:text-navy-500">
                      {' '}/ {plan.interval === 'YEARLY' ? 'year' : 'month'}
                    </span>
                  )}
                </div>

                <ul className="mt-4 space-y-2 text-xs text-navy-500 dark:text-navy-400 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /> {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-5">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400 text-sm font-semibold cursor-default"
                    >
                      Current plan
                    </button>
                  ) : isFree ? (
                    <button
                      disabled
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-navy-100 dark:bg-white/5 text-navy-500 dark:text-navy-400 text-sm font-semibold cursor-default"
                    >
                      Free
                    </button>
                  ) : (
                    <button
                      onClick={() => (isPaidActive ? handleChangePlan(plan) : handleCheckout(plan))}
                      disabled={busyThis}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {busyThis && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isPaidActive ? 'Change plan' : 'Upgrade'}
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Featured Business add-on */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-navy-900 dark:text-white">Featured Business</h3>
          {featureActive && (
            <Badge variant="warning">
              <Star className="w-3 h-3" /> Active until {formatDate(subscription?.featureEndAt)}
            </Badge>
          )}
        </div>
        <p className="text-xs text-navy-500 dark:text-navy-400 mb-4">
          Appear at the top of search results for a set number of days. One-time purchase.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {addons.map((addon) => {
            const busyThis = featurePlan === addon.id;
            return (
              <Card key={addon.id} padding="md" className="h-full flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <Star className="w-4.5 h-4.5" />
                  </div>
                  <p className="font-bold text-navy-900 dark:text-white">{addon.durationDays} days</p>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-black text-navy-900 dark:text-white">
                    {formatGBP(addon.priceInPence)}
                  </span>
                  <span className="text-xs text-navy-400 dark:text-navy-500"> one-time</span>
                </div>
                <p className="text-xs text-navy-500 dark:text-navy-400 mt-3 flex-1">
                  Top-of-search featured placement for {addon.durationDays} days.
                </p>
                <button
                  onClick={() => handleFeatureCheckout(addon)}
                  disabled={busyThis}
                  className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  {busyThis && <Loader2 className="w-4 h-4 animate-spin" />}
                  Get Featured
                </button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
