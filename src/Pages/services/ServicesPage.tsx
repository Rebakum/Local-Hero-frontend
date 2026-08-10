import React from 'react';
import { SectionTitle } from '../../Components/ui/SectionTitle';
import { ServicesHowItWorks } from './ServicesHowItWorks';
import { ServicesGrid } from './ServicesGrid';
import { FAQ } from '../../Components/Sections/FAQ/FAQ';
import { CTA } from '../../Components/Sections/CTA';
import { Stats } from '../../Components/Sections/Stats';

export const ServicesPage: React.FC = () => {
  return (
    <div className='mt-24'>
      <section className="pt-16 pb-6 ">
        <SectionTitle
          eyebrow="Our Services"
          badge={true}
          title="Comprehensive Solutions for Your Business"
          subtitle="Explore our range of expert services designed to help you scale, innovate, and achieve your goals effortlessly."
          align="center"
        />

        <ServicesGrid />
      <ServicesHowItWorks />
      <Stats />     
      <FAQ />
      <CTA />
      </section>
      
        
      
      </div>
    

    
  );
};