import React from 'react';
import { NotificationsManager } from '../../../Components/dashboard/NotificationsManager';

const Notifications: React.FC = () => {
  return (
    <NotificationsManager
      eyebrow="Customer Dashboard"
      title="Notifications"
      description="Updates about your quotes, bookings, messages and payments."
    />
  );
};

export default Notifications;
