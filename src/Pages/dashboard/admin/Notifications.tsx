import React from 'react';
import { NotificationsManager } from '../../../Components/dashboard/NotificationsManager';

const Notifications: React.FC = () => {
  return (
    <NotificationsManager
      eyebrow="Admin Panel"
      title="Notifications"
      description="Updates about approvals, moderation, trades, professionals and platform activity."
    />
  );
};

export default Notifications;
