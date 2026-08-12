import { BeforeAfter } from '@/src/Components/Sections/BeforeAfter';
import { Categories } from '@/src/Components/Sections/Categories/Categories';
import { CTA } from '@/src/Components/Sections/CTA';
import { FAQ } from '@/src/Components/Sections/FAQ/FAQ';
import FeaturedPros from '@/src/Components/Sections/FeaturedPros/FeaturedPros';
import { Hero } from '@/src/Components/Sections/Hero/Hero';
import { HowItWorks } from '@/src/Components/Sections/HowItWorks';
import { PopularServices } from '@/src/Components/Sections/PopularServices/PopularServices';
import SubscriptionPlans from '@/src/Components/Sections/SubscriptionPlans/SubscriptionPlans';
import TestimonialsSlider from '@/src/Components/Sections/Testimonials/TestimonialsSlider';
import { TrustedBy } from '@/src/Components/Sections/TrustedBy';
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
      <SubscriptionPlans />
      <BeforeAfter />
      <TestimonialsSlider />
      <FAQ />
      <CTA/>      
     
    </>
  );
};
