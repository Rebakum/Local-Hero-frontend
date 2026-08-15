import React from 'react';
import { NotificationsManager } from '../../../Components/dashboard/NotificationsManager';

const Notifications: React.FC = () => {
  return (
    <NotificationsManager
      eyebrow="Super Admin Panel"
      title="Notifications"
      description="Updates about admin approvals, provider approvals, users and platform activity."
    />
  );
};

export default Notifications;
