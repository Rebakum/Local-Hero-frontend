import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllTrades } from '../../services/api';
import { Zap, ArrowLeft } from 'lucide-react';
import type { Trade } from '../../types';

import { ServiceHero } from './ServiceHero';
import { ServiceOverview } from './ServiceOverview';
import { ServiceIncluded } from './ServiceIncluded';
import { ServiceWhyChoose } from './ServiceWhyChoose';
import { ServiceBookingCard } from './ServiceBookingCard';
import { ServiceGuarantee } from './ServiceGuarantee';
import { ServiceHowItWorks } from './ServiceHowItWorks';
import { ServiceStatsBar } from './ServiceStatsBar';

import { RelatedServices } from './RelatedServices';

export const ServiceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [allTrades, setAllTrades] = useState<Trade[]>([]);

  useEffect(() => {
    getAllTrades()
      .then((data) => setAllTrades(data))
      .catch(() => setAllTrades([]));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const trade = allTrades.find(
    (t) =>
      t.id === id ||
      (t.category && t.category.toLowerCase().replace(/\s+/g, '-') === id)
  );

  if (!trade || !trade.featuredService) {
    return (
      <div className="min-h-[60vh] mt-24 flex flex-col items-center justify-center p-6 text-center bg-cream-100 dark:bg-navy-950">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
          <Zap size={32} />
        </div>
        <h2 className="text-3xl font-heading font-extrabold text-navy-950 dark:text-white mb-2">
          Service Not Found
        </h2>
        <p className="text-sm text-navy-500 dark:text-navy-300 mb-6 max-w-md">
          The service you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/services')}
          className="btn btn-primary px-6 py-3 shadow-lg shadow-primary/25 hover:shadow-xl transition-all inline-flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
        </button>
      </div>
    );
  }

  const s = trade.featuredService;
  const tradeName = trade.category || trade.id;
  const related = allTrades.filter((t) => t.id !== trade.id).slice(0, 3);

  return (
    <div className="bg-slate-50 dark:bg-navy-950 min-h-screen pt-16 pb-20">
      
     
      <div className="w-full relative h-[400px] sm:h-[500px] md:h-[600px]">
        <ServiceHero
          image={s.image}
          title={s.title}
          tradeName={tradeName}
          isEmergency={s.isEmergency}
          className="absolute inset-0 w-full h-full object-cover" 
        />
      </div>

      {/* Main Content Layout */}
      <div className="container-lh max-w-6xl mx-auto mt-8 sm:mt-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Left Column (Detailed Specs) */}
          <div className="lg:col-span-2 space-y-8">
            <ServiceOverview
              description={s.description}
              estimatedPrice={s.estimatedPrice}
              timeEstimate={s.timeEstimate}
              popularFor={s.popularFor}
            />
            <ServiceIncluded included={s.included} />
            <ServiceWhyChoose />
          </div>

          {/* Right Sidebar - Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 space-y-6">
              <ServiceBookingCard
                estimatedPrice={s.estimatedPrice}
                timeEstimate={s.timeEstimate}
                tradeName={tradeName}
              />
              <ServiceGuarantee />
            </div>
          </div>

        </div>

        <ServiceHowItWorks />
        <ServiceStatsBar />
        
        <RelatedServices related={related} />
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
