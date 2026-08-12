import React from 'react';
import { MessagesManager } from '../../../Components/dashboard/MessagesManager';

const Messages: React.FC = () => {
  return (
    <MessagesManager
      eyebrow="Customer Dashboard"
      title="Messages"
      description="Private conversations with professionals about your bookings and quotes."
    />
  );
};

export default Messages;
