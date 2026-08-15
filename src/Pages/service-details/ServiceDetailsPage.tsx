import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllTrades } from '../../services/api';
import { getProfessionalsByTrade } from '../../services/content.service';
import { Zap, ArrowLeft, Wrench, Clock, Users, BadgeCheck, Loader2 } from 'lucide-react';
import type { Trade, TradeService, Professional } from '../../types';
import { ProCard } from '../home/Sections/FeaturedPros/FeaturedProCard';

import { ServiceHero } from './ServiceHero';
import { ServiceOverview } from './ServiceOverview';
import { ServiceIncluded } from './ServiceIncluded';
import { ServiceWhyChoose } from './ServiceWhyChoose';
import { ServiceBookingCard } from './ServiceBookingCard';
import { ServiceGuarantee } from './ServiceGuarantee';
import { ServiceHowItWorks } from './ServiceHowItWorks';
import { ServiceStatsBar } from './ServiceStatsBar';

import { RelatedServices } from './RelatedServices';

// Build the full list of services offered under a trade: the featured service
// plus every popular task (each task becomes a bookable service).
const buildServices = (trade: Trade): TradeService[] => {
  const services: TradeService[] = [];

  if (trade.featuredService) {
    services.push(trade.featuredService);
  }

  (trade.popularTasks ?? []).forEach((task, i) => {
    services.push({
      id: `${trade.id}-task-${i}`,
      title: task,
      estimatedPrice: trade.startingPrice || trade.avgHourlyRate || 'From £85',
      timeEstimate: '1 - 2 Hours',
      popularFor: `Popular ${trade.category} service`,
      description: `Professional ${task.toLowerCase()} carried out by vetted, insured ${trade.category} experts near you. Fixed pricing with no hidden call-out fees.`,
      included: ['Fixed Price Quote', 'Vetted & Insured Pro', 'Workmanship Warranty'],
      icon: trade.iconName || 'Wrench',
      image: trade.featuredService?.image || '',
      isEmergency: trade.featuredService?.isEmergency,
    });
  });

  return services;
};

export const ServiceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [prosLoading, setProsLoading] = useState(true);

  useEffect(() => {
    getAllTrades()
      .then((data) => setAllTrades(data))
      .catch(() => setAllTrades([]));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedIndex(0);
  }, [id]);

  const trade = allTrades.find(
    (t) =>
      t.id === id ||
      (t.category && t.category.toLowerCase().replace(/\s+/g, '-') === id)
  );

  // Load the professionals providing this trade so their profile images
  // show alongside the service details.
  useEffect(() => {
    setProsLoading(true);
    setProfessionals([]);
    if (!trade) return;

    getProfessionalsByTrade(trade.category)
      .then((data) => setProfessionals(data || []))
      .catch(() => setProfessionals([]))
      .finally(() => setProsLoading(false));
  }, [trade]);

  const services = useMemo(() => (trade ? buildServices(trade) : []), [trade]);
  const s = services[selectedIndex] ?? services[0];

  if (!trade || !s) {
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

      {/* Trade context bar */}
      <div className="container-lh max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-lg px-6 py-5 flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Wrench size={20} />
            </div>
            <div>
              <p className="font-heading font-extrabold text-navy-950 dark:text-white leading-tight">
                {tradeName}
              </p>
              {trade.subtitle && (
                <p className="text-xs text-navy-500 dark:text-navy-300">{trade.subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-navy-700 dark:text-navy-200">
            <Clock size={16} className="text-primary" />
            {trade.avgHourlyRate || '£40/hr'} /hr
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-navy-700 dark:text-navy-200">
            <Users size={16} className="text-primary" />
            {trade.activeProsCount != null ? trade.activeProsCount.toLocaleString() : 0} active pros
          </div>

          {trade.badge && (
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              <BadgeCheck size={16} />
              {trade.badge}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container-lh max-w-6xl mx-auto mt-8 sm:mt-12 px-4 sm:px-6">
        {/* All services selector */}
        {services.length > 1 && (
          <div className="mb-10">
            <p className="text-xs font-heading font-bold uppercase tracking-widest text-navy-400 mb-3">
              All {tradeName} services
            </p>
            <div className="flex flex-wrap gap-2.5">
              {services.map((service, idx) => (
                <button
                  key={service.id || `${trade.id}-${idx}`}
                  onClick={() => setSelectedIndex(idx)}
                  className={`px-4 py-2.5 rounded-full text-sm font-heading font-bold border transition-all ${
                    selectedIndex === idx
                      ? 'bg-primary text-white border-primary shadow-md shadow-primary/25'
                      : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-white/10 text-navy-700 dark:text-navy-200 hover:border-primary/50'
                  }`}
                >
                  {service.title}
                </button>
              ))}
            </div>
          </div>
        )}

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

        {/* Trusted professionals for this trade */}
        {prosLoading ? (
          <div className="mt-20 flex items-center justify-center py-12">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          </div>
        ) : professionals.length > 0 ? (
          <div className="mt-20">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/10 px-3.5 py-1.5 rounded-full">
                Our Professionals
              </span>
              <h2 className="font-heading text-3xl font-black text-navy-950 dark:text-white mt-3">
                Trusted {tradeName} experts
              </h2>
              <p className="text-sm text-navy-500 dark:text-navy-300 mt-2">
                Vetted, insured and rated by real local customers. View their profile to see reviews and book directly.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {professionals.map((pro) => (
                <ProCard key={pro.id || pro._id || `${pro.name}-${pro.trade}`} pro={pro} />
              ))}
            </div>
          </div>
        ) : null}

        <ServiceHowItWorks />
        <ServiceStatsBar />

        <RelatedServices related={related} />
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
