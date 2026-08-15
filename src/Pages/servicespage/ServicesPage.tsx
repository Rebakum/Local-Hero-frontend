import React from 'react';
import { SectionTitle } from '../../Components/ui/SectionTitle';
import { ServicesGrid } from './ServicesGrid';



export const ServicesPage: React.FC = () => {
  return (
    <div className='page-top'>
      <section className="section-pad border-y border-navy-100/60 dark:border-white/10">
        <SectionTitle
          eyebrow="Our Services"
          badge={true}
          title="Comprehensive Solutions for Your Business"
          subtitle="Explore our range of expert services designed to help you scale, innovate, and achieve your goals effortlessly."
          align="center"
        />

        <ServicesGrid />
      
      </section>
      
        
      
      </div>
    

    
  );
};