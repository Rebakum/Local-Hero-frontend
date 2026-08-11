import React from 'react';
import { MessageSquare } from 'lucide-react';
import { PageHeader } from '../../../Components/ui';
import { Card } from '../../../Components/ui/shared/Card';
import { EmptyState } from '../../../Components/ui/shared/EmptyState';

const Messages: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Provider Panel"
        title="Messages"
        description="Conversations with customers about their bookings will appear here."
      />
      <Card padding="lg">
        <EmptyState
          title="No messages yet"
          description="When a customer messages you about a booking, the conversation will show up here."
          icon={<MessageSquare className="w-12 h-12 text-navy-300 dark:text-navy-600" />}
        />
      </Card>
    </div>
  );
};

export default Messages;
