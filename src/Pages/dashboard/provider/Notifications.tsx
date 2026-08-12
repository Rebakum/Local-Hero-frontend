import React from 'react';
import { NotificationsManager } from '../../../Components/dashboard/NotificationsManager';

const Notifications: React.FC = () => {
  return (
    <NotificationsManager
      eyebrow="Provider Panel"
      title="Notifications"
      description="Updates about new leads, quotes, bookings, reviews and messages."
    />
  );
};

export default Notifications;
