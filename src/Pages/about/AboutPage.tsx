import React from 'react';
import { SectionTitle } from '../../Components/ui/SectionTitle';
import { WhyChooseUs } from '../home/Sections/WhyChooseUs';
export const AboutPage: React.FC = () => {
  return (
    <div className="page-top">
      
      <section className="container-lh section-pad space-y-10 border-y border-navy-100/60 dark:border-white/10">
        
        {/* Title / Header */}
        <div>
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