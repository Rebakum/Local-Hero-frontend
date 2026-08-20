import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../../Components/ui';
import { Card } from '../../../Components/ui/shared/Card';
import { getMySubscription, type ProviderSubscription } from '../../../services/subscription.service';

const SubscriptionSuccess: React.FC = () => {
  const [subscription, setSubscription] = useState<ProviderSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await getMySubscription();
      setSubscription(data);
    } catch {
      // ignore — status will be reflected once the webhook syncs
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="max-w-xl mx-auto">
      <PageHeader
        eyebrow="Provider Panel"
        title="Subscription"
        description="Confirming your subscription"
      />

      <Card padding="lg" className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-navy-900 dark:text-white mt-4">
          Your subscription payment was submitted
        </h2>
        <p className="text-sm text-navy-500 dark:text-navy-400 mt-2">
          We're confirming your subscription. It will become active once the payment is verified — this usually takes a moment.
        </p>

        {loading ? (
          <div className="flex items-center justify-center gap-2 text-xs text-navy-400 mt-6">
            <Loader2 className="w-4 h-4 animate-spin" /> Checking subscription status…
          </div>
        ) : subscription ? (
          <div className="flex items-center justify-center gap-2 mt-6 text-sm">
            <span className="text-navy-500 dark:text-navy-400">Current status:</span>
            <StatusBadge status={subscription.status} />
          </div>
        ) : (
          <p className="text-xs text-navy-400 mt-6">Subscription status will appear here shortly.</p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link
            to="/dashboard/provider/subscription"
            className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Back to Subscription
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;
