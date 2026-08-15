import React from 'react';
import { SectionTitle } from '../../Components/ui/SectionTitle';
import FeaturedProsGrid from '../home/Sections/FeaturedPros/FeaturedProsGrid';

export const ProfessionalsPage: React.FC = () => {
  return (
    <div className="mt-24">
      <section className="pt-16 pb-6">
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
