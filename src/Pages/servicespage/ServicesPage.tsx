import React from 'react';
import { SectionTitle } from '../../Components/ui/SectionTitle';
import { ServicesGrid } from './ServicesGrid';



export const ServicesPage: React.FC = () => {
  return (
    <div className='page-top'>
      <section className="container-lh pt-12 md:pt-16 pb-8">
        <SectionTitle
          eyebrow="Our Services"
          badge={true}
          title="Comprehensive Solutions for Your Business"
          subtitle="Explore our range of expert services designed to help you scale, innovate, and achieve your goals effortlessly."
          align="center"
        />
      </section>

      <ServicesGrid />
    </div>
  );
};