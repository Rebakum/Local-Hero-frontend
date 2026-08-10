import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTrades } from '../../../services/api';
import { useTheme } from '../../../Context/ThemeContext';
import { SectionTitle } from '../../ui/SectionTitle';
import { Reveal } from '../../ui/Reveal';
import { ArrowRight } from 'lucide-react';
import { PopularServicesGrid } from './PopularServicesGrid';
import type { Trade } from '../../../types';

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
    <section id="popular-services" className="bg-white dark:bg-black py-8 md:py-12">
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
               className="btn btn-primary test-white px-7 py-4 transition-all duration-300 hover:scale-[1.02]"
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
