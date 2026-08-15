import { BeforeAfter } from './Sections/BeforeAfter';
import { Categories } from './Sections/Categories/Categories';
import { CTA } from './Sections/CTA';
import { FAQ } from './Sections/FAQ/FAQ';
import FeaturedPros from './Sections/FeaturedPros/FeaturedPros';
import { Hero } from './Sections/Hero/Hero';
import { HowItWorks } from './Sections/HowItWorks';
import { PopularServices } from './Sections/PopularServices/PopularServices';
import SubscriptionPlans from './Sections/SubscriptionPlans/SubscriptionPlans';
import TestimonialsSlider from './Sections/Testimonials/TestimonialsSlider';
import { TrustedBy } from './Sections/TrustedBy';
import React from 'react';

export const HomePage: React.FC = () => {
  return (
    <>
     <Hero />
      <TrustedBy />
      <Categories />
      <HowItWorks />
      <FeaturedPros />      
      <PopularServices />
      <BeforeAfter />
      <TestimonialsSlider />     
      <CTA/>      
     
    </>
  );
};
