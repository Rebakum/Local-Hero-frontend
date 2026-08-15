import React from 'react';
import { SectionTitle } from '../../Components/ui/SectionTitle';
import FeaturedProsGrid from '../home/Sections/FeaturedPros/FeaturedProsGrid';

export const ProfessionalsPage: React.FC = () => {
  return (
    <div className="page-top">
      <section className="container-lh section-pad border-y border-navy-100/60 dark:border-white/10">
        <SectionTitle
          eyebrow="Our Professionals"
          badge={true}
          title="Meet All Our Local Heroes"
          subtitle="Every vetted tradesperson on LocalHero — fixed rates, verified reviews, and instant booking."
          align="center"
        />        
        <FeaturedProsGrid/>
      </section>

     
    </div>
  );
};

export default ProfessionalsPage;
