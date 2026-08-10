import React from 'react';
import { PageHero } from '../../Components/ui/PageHero';
import { FeaturedPros } from '../../Components/Sections/FeaturedPros/FeaturedPros';
import { BeforeAfter } from '../../Components/Sections/BeforeAfter';
import { CTA } from '../../Components/Sections/CTA';

export const ProfessionalsPage: React.FC = () => {
  return (
    <div className='mt-24'>
     
      <FeaturedPros />
      <BeforeAfter />
      <CTA />
    </div>
  );
};
