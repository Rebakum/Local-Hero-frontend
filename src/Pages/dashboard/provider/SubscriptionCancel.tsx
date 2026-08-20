import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { PageHeader } from '../../../Components/ui';
import { Card } from '../../../Components/ui/shared/Card';

const SubscriptionCancel: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto">
      <PageHeader
        eyebrow="Provider Panel"
        title="Subscription"
        description="Checkout cancelled"
      />

      <Card padding="lg" className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-navy-900 dark:text-white mt-4">
          Checkout cancelled
        </h2>
        <p className="text-sm text-navy-500 dark:text-navy-400 mt-2">
          Your subscription was not changed. You can return to your subscription page at any time to upgrade or change plans.
        </p>

        <Link
          to="/dashboard/provider/subscription"
          className="inline-block px-5 py-2.5 mt-8 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Back to Subscription
        </Link>
      </Card>
    </div>
  );
};

export default SubscriptionCancel;
