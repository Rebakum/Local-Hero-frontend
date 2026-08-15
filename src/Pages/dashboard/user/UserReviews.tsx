import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { MyTestimonialsManager } from '../../../Pages/home/Sections/Testimonials/MyTestimonialsManager';

const UserReviews: React.FC = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId') ?? undefined;

  return (
    <MyTestimonialsManager
      eyebrow="Customer Dashboard"
      title="My Reviews"
      description="Write and manage the reviews and testimonials you've shared about professionals."
      prefillBookingId={bookingId}
    />
  );
};

export default UserReviews;
