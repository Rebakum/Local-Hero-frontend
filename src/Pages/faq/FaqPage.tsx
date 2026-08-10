import React from 'react';
import { PageHero } from '../../Components/ui/PageHero';
import { FAQ } from '../../Components/Sections/FAQ/FAQ';
import { CTA } from '../../Components/Sections/CTA';

export const FaqPage: React.FC = () => {
  return (
    <div className='mt-24'>
      
      <FAQ />
      <CTA />
    </div>
  );
};
