import React from 'react';
import { SectionTitle } from '../../Components/ui/SectionTitle';
import { WhyChooseUs } from '../home/Sections/WhyChooseUs';
export const AboutPage: React.FC = () => {
  return (
    <div className="mt-24 ">
      
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Title / Header */}
        <div className="pt-16 pb-6">
          <SectionTitle
            eyebrow="Who We Are"
            badge={true}
            title="Building the Future of Digital Experiences"
            subtitle="We are a team of dedicated professionals committed to delivering exceptional quality, innovative solutions, and value to our clients worldwide."
            align="center"
          />
        </div>            

      </section>
        <WhyChooseUs />
        
    </div>
  );
};