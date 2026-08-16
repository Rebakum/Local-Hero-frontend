import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTrades } from '@/src/services/api';
import { useTheme } from '@/src/Context/ThemeContext';
import { SectionTitle } from '@/src/Components/ui/SectionTitle';
import { Reveal } from '@/src/Components/ui/Reveal';
import { ArrowRight } from 'lucide-react';
import { PopularServicesGrid } from './PopularServicesGrid';
import type { Trade } from '@/src/types';

export const PopularServices: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    getAllTrades()
      .then((data) => setTrades(data.slice(0, 6)))
      .catch(() => setTrades([]));
  }, []);

  return (
    <section id="popular-services" className="bg-white dark:bg-black section-pad border-y border-navy-100/60 dark:border-white/10">
      <div className="container-lh">
        <SectionTitle
          badge
          eyebrow="Popular services"
          title="Fixed price jobs"
          subtitle="The jobs UK homes book most fixed quotes, honest estimates, every detail included before you pay a penny."
          dark={theme === 'dark'}
        />

        <PopularServicesGrid trades={trades} />

        <Reveal delay={0.15}>
          <div className="mt-8 md:mt-12 flex justify-center">
            <button
              onClick={() => navigate('/services')}
               className="btn btn-primary test-white px-7 py-3 transition-all duration-300 hover:scale-[1.02]"
            >
              View More
              <ArrowRight size={16} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
