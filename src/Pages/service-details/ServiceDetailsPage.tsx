import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllTrades } from '../../services/api';
import { getProfessionalsByTrade } from '../../services/content.service';
import {
  Zap,
  ArrowLeft,
  Wrench,
  Clock,
  Users,
  BadgeCheck,
  Loader2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import type { Trade, FeaturedService, Professional } from '../../types';
import { ProCard } from '../home/Sections/FeaturedPros/FeaturedProCard';
import { ServiceHero } from './ServiceHero';
import { ServiceOverview } from './ServiceOverview';
import { ServiceIncluded } from './ServiceIncluded';
import { ServiceWhyChoose } from './ServiceWhyChoose';
import { ServiceBookingCard } from './ServiceBookingCard';
import { ServiceGuarantee } from './ServiceGuarantee';
import { RelatedServices } from './RelatedServices';

interface DisplayService extends FeaturedService {
  included: string[];
  isEmergency?: boolean;
  estimatedPrice: string;
  timeEstimate: string;
}

const DEFAULT_INCLUDED = [
  'Fixed Price Quote',
  'Vetted & Insured Pro',
  'Workmanship Warranty',
];

const buildServices = (trade: Trade): DisplayService[] => {
  const featured = (trade.featuredServices ?? []).filter(
    (fs) => fs.isActive !== false
  );

  if (featured.length > 0) {
    return featured.map((fs) => ({
      ...fs,
      estimatedPrice: fs.estimatedPrice ?? '',
      timeEstimate: fs.timeEstimate ?? '',
      included: DEFAULT_INCLUDED,
    }));
  }

  return (trade.popularTasks ?? []).map((task, idx) => ({
    id: `${trade.id}-${idx}`,
    tradeId: trade.id,
    title: task,
    estimatedPrice: trade.avgHourlyRate || 'From £85',
    timeEstimate: '1 - 2 Hours',
    popularFor: [`Popular ${trade.category} service`],
    description: `Professional ${task.toLowerCase()} carried out by vetted, insured ${trade.category} experts near you. Fixed pricing with no hidden call-out fees.`,
    imageUrl: null,
    sortOrder: idx,
    isActive: true,
    included: DEFAULT_INCLUDED,
  }));
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
      <div className="min-h-[70vh] pt-24 flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-navy-950">
        <div className="relative">
          <div className="w-20 h-20 bg-red-500/10 dark:bg-red-500/20 rounded-3xl flex items-center justify-center text-red-600 dark:text-red-500 shadow-xl shadow-red-500/10 animate-bounce">
            <Zap size={40} />
          </div>
        </div>
        <h2 className="text-3xl font-heading font-black text-slate-900 dark:text-white mt-6 mb-2">
          Service Not Found
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 max-w-md leading-relaxed">
          The service you are looking for is unavailable, inactive, or may have been relocated.
        </p>
        <button
          onClick={() => navigate('/services')}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-lg shadow-red-600/30 hover:shadow-red-600/40 transition-all duration-300 inline-flex items-center gap-2 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Services</span>
        </button>
      </div>
    );
  }

  const tradeName = trade.category || trade.id;
  const related = allTrades.filter((t) => t.id !== trade.id).slice(0, 3);

  return (
    <div className="bg-slate-50/50 dark:bg-navy-950 min-h-screen page-top pb-24 transition-colors">
      
      {/* Dynamic Floating Back Button & Breadcrumb Navigation Bar */}
      <div className="container-lh pt-4 pb-2 flex items-center justify-between">
      

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Services</span>
          <ChevronRight className="w-3 h-3 text-slate-400 dark:text-navy-400" />
          <span className="text-red-600 dark:text-red-500">{tradeName}</span>
        </div>
      </div>

      {/* Hero Banner Container with Rounded Frame */}
      <div className="container-lh">
        <div className="relative h-[380px] sm:h-[480px] md:h-[540px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-white/10">
          <ServiceHero
            image={s.imageUrl ?? ''}
            title={s.title}
            tradeName={tradeName}
            isEmergency={s.isEmergency}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Floating Trade Feature Bar */}
      <div className="container-lh -mt-10 relative z-20">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 dark:bg-navy-900/90 backdrop-blur-xl px-6 py-5 shadow-xl transition-all duration-300 dark:border-white/10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="flex flex-wrap items-center justify-between gap-6">
            
            {/* Trade Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-500 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shrink-0 overflow-hidden">
                {trade.iconUrl ? (
                  <img
                    src={trade.iconUrl}
                    alt={tradeName}
                    className="w-6 h-6 object-contain rounded-full"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Wrench size={22} />
                )}
              </div>
              <div>
                <h1 className="font-heading font-black text-slate-900 dark:text-white text-lg sm:text-xl leading-tight">
                  {tradeName}
                </h1>
                {trade.subtitle && (
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    {trade.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-white/5 w-full sm:w-auto">
              
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-navy-800 flex items-center justify-center text-red-600 dark:text-red-500">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-navy-400 uppercase tracking-wider">Rate</p>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    {trade.avgHourlyRate || '£40/hr'}/hr
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-navy-800 flex items-center justify-center text-red-600 dark:text-red-500">
                  <Users size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-navy-400 uppercase tracking-wider">Experts</p>
                  <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    {trade.activeProsCount != null ? trade.activeProsCount.toLocaleString() : 0} Pros
                  </p>
                </div>
              </div>

              {trade.badge && (
                <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1.5 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <BadgeCheck size={16} />
                  <span>{trade.badge}</span>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="container-lh mt-10">
        
        {/* All Services Tabs Pill Bar */}
        {services.length > 1 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-red-600 dark:text-red-500" />
              <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Available {tradeName} Options
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {services.map((service, idx) => {
                const isActive = selectedIndex === idx;
                return (
                  <button
                    key={`${trade.id}-${idx}`}
                    onClick={() => setSelectedIndex(idx)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 scale-[1.02]'
                        : 'bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-red-500/40 hover:bg-slate-50 dark:hover:bg-navy-800'
                    }`}
                  >
                    <span>{service.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-soft">
              <ServiceOverview
                description={s.description}
                estimatedPrice={s.estimatedPrice}
                timeEstimate={s.timeEstimate}
                popularFor={s.popularFor?.join(', ')}
              />
            </div>

            <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-soft">
              <ServiceIncluded included={s.included ?? []} />
            </div>

            <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-white/10 shadow-soft">
              <ServiceWhyChoose />
            </div>
          </div>

          {/* Sticky Booking Column */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-xl relative overflow-hidden">
                <ServiceBookingCard
                  estimatedPrice={s.estimatedPrice}
                  timeEstimate={s.timeEstimate}
                  tradeName={tradeName}
                />
              </div>

              <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200/80 dark:border-white/10 shadow-soft">
                <ServiceGuarantee />
              </div>
            </div>
          </div>

        </div>

        {/* Vetted Professionals Section */}
        {prosLoading ? (
          <div className="mt-20 flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-red-600 dark:text-red-500 mb-3" />
            <p className="text-xs font-semibold text-slate-500 dark:text-navy-400">Loading top professionals...</p>
          </div>
        ) : professionals.length > 0 ? (
          <section className="mt-24 pt-10 border-t border-slate-200/60 dark:border-white/10">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-red-600 dark:text-red-500 uppercase tracking-widest bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20">
                <ShieldCheck size={14} />
                <span>Verified Talent</span>
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-4">
                Trusted {tradeName} Experts
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Vetted, insured, and highly rated local specialists ready to take on your request.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {professionals.map((pro) => (
                <ProCard key={pro.id || pro._id || `${pro.name}-${pro.trade}`} pro={pro} />
              ))}
            </div>
          </section>
        ) : null}

        {/* Related Services */}
        <div className="mt-20">
          <RelatedServices related={related} />
        </div>

      </main>
    </div>
  );
};

export default ServiceDetailsPage;