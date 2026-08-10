import React from 'react';
import { SectionTitle } from '../../Components/ui/SectionTitle';

import { BeforeAfter } from '../../Components/Sections/BeforeAfter';
import { CTA } from '../../Components/Sections/CTA';
import FeaturedProsGrid from '../../Components/Sections/FeaturedPros/FeaturedProsGrid';

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

      <BeforeAfter />
      <CTA />
    </div>
  );
};

export default ProfessionalsPage;
