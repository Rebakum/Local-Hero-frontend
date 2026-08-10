import React from 'react';
import { PageHero } from '../../Components/ui/PageHero';
import { HowItWorks } from '../../Components/Sections/HowItWorks';
import { Stats } from '../../Components/Sections/Stats';
import { CTA } from '../../Components/Sections/CTA';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className='mt-24'>
     
      <HowItWorks />
      <Stats />
      <CTA />
    </div>
  );
};
