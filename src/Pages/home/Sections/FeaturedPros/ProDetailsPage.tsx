import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Flame,
  HelpCircle,
  ChevronDown,
  Star,
  Maximize2,
  X
} from 'lucide-react';
import { getProfessionalById, getBeforeAfterByProfessional } from '@/src/services/content.service';
import { getOrCreateConversation } from '@/src/services/messaging.service';
import type { Professional, BeforeAfterPair } from '@/src/types';
import { useBooking } from '@/src/Context/BookingContext';
import { useAuth } from '@/src/Context/AuthContext';
import { SaveFavouriteButton } from '@/src/Components/ui/SaveFavouriteButton';

export const ProDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pro, setPro] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reviews' | 'beforeAfter'>('about');
  const [beforeAfter, setBeforeAfter] = useState<BeforeAfterPair[]>([]);
  const [beforeAfterLoading, setBeforeAfterLoading] = useState(true);

  // Form states matching screenshot
  const [fuelType, setFuelType] = useState('');
  const [hasHotWaterTank, setHasHotWaterTank] = useState<string>('');

  const { openBooking } = useBooking();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const proId = pro?.id || (pro as any)?._id || id || '';
  const [messageError, setMessageError] = useState<string | null>(null);
  const [messaging, setMessaging] = useState(false);

  const tradeName = React.useMemo(() => {
    if (!pro?.trade) return 'Professional Service';
    if (typeof pro.trade === 'string') return pro.trade;
    if (typeof pro.trade === 'object') {
      return (pro.trade as any).name || (pro.trade as any).title || 'Professional Service';
    }
    return 'Professional Service';
  }, [pro]);

  const handleBookNow = () => {
    if (!pro) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/professionals/${proId}` } } });
      return;
    }
    openBooking({
      trade: tradeName,
      professionalId: proId,
      professionalName: pro.name,
    });
  };

  const handleMessage = async () => {
    if (!pro) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/professionals/${proId}` } } });
      return;
    }
    setMessaging(true);
    setMessageError(null);
    try {
      const conversation = await getOrCreateConversation(proId);
      const messagesPath =
        user?.role === 'serviceProvider'
          ? '/dashboard/provider/messages'
          : '/dashboard/user/messages';
      navigate(messagesPath, { state: { conversationId: conversation.id } });
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } }; message?: string };
      setMessageError(apiError.response?.data?.message || apiError.message || 'Could not open conversation.');
    } finally {
      setMessaging(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProfessionalById(id)
      .then((data) => setPro(data))
      .catch(() => setPro(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!proId) return;
    setBeforeAfterLoading(true);
    getBeforeAfterByProfessional(proId)
      .then((data) => setBeforeAfter(data || []))
      .catch(() => setBeforeAfter([]))
      .finally(() => setBeforeAfterLoading(false));
  }, [proId]);

  if (loading) {
    return (
      <div className="page-top min-h-screen bg-white flex flex-col items-center justify-center p-4 dark:bg-navy-950">
        <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-navy-800 animate-pulse dark:text-navy-300">Loading profile details...</p>
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="page-top min-h-screen bg-slate-50 flex items-center justify-center px-4 dark:bg-navy-950">
        <div className="max-w-md w-full border border-slate-200 bg-white p-8 shadow-sm text-center rounded-lg dark:border-white/10 dark:bg-navy-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Professional Not Found</h2>
          <p className="text-xs text-navy-800 mt-2 dark:text-navy-300">
            The profile you are looking for might have been removed or is temporarily unavailable.
          </p>
          <Link to="/professionals" className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:underline mt-6">
            <ArrowLeft className="w-4 h-4" /> Return to Search
          </Link>
        </div>
      </div>
    );
  }

  const portfolioImages = pro.portfolioImages || (pro as any).portfolio || [];
  const specialties = pro.specialties || (pro as any).skills || [];
  const reviews = pro.reviews || (pro as any).reviews || [];

  return (
    <div className="page-top min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 dark:bg-navy-950 dark:text-navy-200">
      {/* Top Back Navigation Bar */}
      <div className="border-b border-slate-200 bg-white dark:border-white/10 dark:bg-navy-900">
        <div className="container-lh py-3 sm:py-4">
          <Link to="/professionals" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-red-600 dark:text-navy-300">
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </Link>
        </div>
      </div>

      <div className="container-lh py-8 sm:py-10 md:py-12">
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12 lg:gap-12">
          {/* Left Text & Action Column */}
          <div className="md:col-span-7">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl dark:text-white">
              {pro.name} - {tradeName}
            </h1>
            <div className="mt-2 h-0.5 w-full bg-slate-200 dark:bg-white/10" />

            <p className="mt-4 text-xs leading-relaxed text-slate-600 sm:text-sm lg:text-base lg:leading-relaxed dark:text-navy-300">
              {pro.bio || (pro as any).description || 'When you apply for our professional breakdown cover, you also qualify for annual service and safety inspection. It is very important to have your system checked regularly.'}
            </p>

            {/* Action Buttons & Rate */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-semibold uppercase dark:text-navy-300">Hourly Rate:</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">£{pro.hourlyRate || (pro as any).rate || '0'}/hr</span>
              </div>

              <div className="flex flex-wrap gap-3 sm:w-80 lg:w-96">
                <button
                  onClick={handleBookNow}
                  className="flex-1 flex items-center justify-center gap-2 rounded bg-red-600 py-2.5 px-4 text-xs font-bold text-white shadow hover:bg-red-700 transition-colors"
                >
                  <Flame className="h-4 w-4" />
                  Buy Cover / Book
                </button>

                <button
                  onClick={handleMessage}
                  disabled={messaging}
                  className="flex items-center justify-center gap-2 rounded border-2 border-red-600 bg-white py-2.5 px-4 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 dark:bg-navy-900 dark:hover:bg-navy-800"
                >
                  <HelpCircle className="h-4 w-4" />
                  Message
                </button>

                {proId && <SaveFavouriteButton professionalId={proId} variant="button" className="shrink-0" />}
              </div>

              {messageError && <p className="text-xs font-semibold text-red-600">{messageError}</p>}
            </div>
          </div>

          {/* Right Hero Image (Non-Circle Box) */}
          <div className="flex justify-center md:col-span-5">
            <div className="relative flex h-60 w-72 items-center justify-center rounded-xl bg-slate-100 p-2 border border-slate-200 shadow-sm sm:h-64 sm:w-80 md:h-72 md:w-96 dark:bg-navy-800 dark:border-white/10">
              <img
                src={pro.avatar || (pro as any).image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={pro.name}
                className="h-full w-full rounded-lg object-top object-cover"
              />

              {/* Red Starburst Price Badge */}
              <div className="absolute -left-3 top-4 flex h-20 w-20 rotate-[-12deg] items-center justify-center rounded-full bg-red-600 p-2 text-center text-white shadow-xl ring-4 ring-white dark:ring-navy-950">
                <div>
                  <span className="block text-[8px] font-medium leading-none uppercase">cover from</span>
                  <span className="block text-base font-black leading-tight">£{pro.hourlyRate || '4'}</span>
                  <span className="block text-[8px] font-medium leading-none">per hour</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CORE SERVICES BOX */}
        <div className="mt-10 rounded-xl border border-slate-200 bg-slate-100/80 p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-navy-800/80">
          <h2 className="text-sm font-bold text-slate-900 sm:text-base lg:text-lg dark:text-white">
            Our Care Plan Costs £15.99 Per Month And Includes These Core Services:-
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {specialties.length > 0 ? (
              specialties.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <Flame className="h-4 w-4 text-red-600 shrink-0 fill-red-600" />
                  <span className="text-xs font-medium text-slate-700 sm:text-sm dark:text-navy-200">{item}</span>
                </div>
              ))
            ) : (
              [
                'Time clock or programmer',
                'Circulating pump and valves',
                'Radiator valves',
                'Hot water tank components',
                'Unvented hot water tanks components',
                'Feed and expansion tank components',
                'Pipes and fittings',
                'Motorised valves',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <Flame className="h-4 w-4 text-red-600 shrink-0 fill-red-600" />
                  <span className="text-xs font-medium text-slate-700 sm:text-sm dark:text-navy-200">{item}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* DETAILS & DISCLAIMERS */}
        <div className="mt-8 space-y-3 text-xs leading-relaxed text-slate-600 sm:text-sm dark:text-navy-300">
          <p>
            When you add up all the costs associated with repairing your gas central heating system, it makes sense to be covered from just £15.99 per month. You will be safe in the knowledge that if your system breaks down, expert response is available 24 hours a day, 365 days a year.
          </p>

          <p className="font-bold text-red-600 uppercase tracking-wide">
            GIVE YOURSELF PEACE OF MIND WITH 5 STAR BREAKDOWN COVER
          </p>

          <div className="grid grid-cols-1 items-end gap-6 pt-2 md:grid-cols-12">
            <div className="space-y-1.5 text-[11px] text-slate-500 sm:text-xs md:col-span-9 dark:text-navy-300">
              <p>*Any calls pre-booked by the office then no access is available, minimum charges apply.</p>
              <p>**Please note that reserve rights to amend policies at any time.</p>
              <p className="font-bold text-slate-800 pt-1 dark:text-navy-200">NO EXCESS OR HIDDEN FEES & NO CALL OUT FEE</p>
            </div>

            {/* Gas Safe / Certified Badge */}
            <div className="flex justify-start md:col-span-3 md:justify-end">
              <div className="flex items-center gap-1.5 rounded-br-2xl bg-amber-400 p-2.5 font-black text-slate-900 dark:text-slate-900 shadow">
                <div className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-amber-400 dark:bg-navy-950">GAS</div>
                <span className="text-sm tracking-tighter">safe</span>
              </div>
            </div>
          </div>
        </div>

        {/* DYNAMIC TABS */}
        <div className="mt-10 border-t border-slate-200 pt-6 dark:border-white/10">
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 dark:border-white/10">
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 text-xs font-bold rounded ${activeTab === 'about' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700 dark:bg-navy-800 dark:text-navy-200'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-2 text-xs font-bold rounded ${activeTab === 'portfolio' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700 dark:bg-navy-800 dark:text-navy-200'}`}
            >
              Portfolio ({portfolioImages.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 text-xs font-bold rounded ${activeTab === 'reviews' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700 dark:bg-navy-800 dark:text-navy-200'}`}
            >
              Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('beforeAfter')}
              className={`px-4 py-2 text-xs font-bold rounded ${activeTab === 'beforeAfter' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-700 dark:bg-navy-800 dark:text-navy-200'}`}
            >
              Before & After ({beforeAfter.length})
            </button>
          </div>

          <div className="mt-4">
            {activeTab === 'portfolio' && (
              portfolioImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {portfolioImages.map((img: string, idx: number) => (
                    <div key={idx} onClick={() => setSelectedImage(img)} className="relative h-40 cursor-pointer overflow-hidden rounded border border-slate-200 sm:h-44 lg:h-52 dark:border-white/10">
                      <img src={img} alt={`Portfolio ${idx}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-4 dark:text-navy-300">No portfolio images available.</p>
              )
            )}

            {activeTab === 'reviews' && (
              reviews.length > 0 ? (
                <div className="space-y-3">
                  {reviews.map((rev: any, idx: number) => (
                    <div key={idx} className="border border-slate-200 bg-white p-4 rounded text-xs sm:p-5 sm:text-sm dark:border-white/10 dark:bg-navy-900">
                      <div className="flex justify-between font-bold text-slate-800 mb-1 dark:text-navy-200">
                        <span>{rev.author || 'Client'}</span>
                        <span className="text-amber-500 flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400" /> {rev.rating || 5}</span>
                      </div>
                      <p className="text-slate-600 dark:text-navy-300">{rev.comment || 'No comments.'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-4 dark:text-navy-300">No reviews submitted yet.</p>
              )
            )}

            {activeTab === 'beforeAfter' && (
              beforeAfterLoading ? (
                <p className="text-xs text-slate-500 py-4 dark:text-navy-300">Loading verified before & after work…</p>
              ) : beforeAfter.length > 0 ? (
                <div className="space-y-4">
                  {beforeAfter.map((project) => (
                    <div key={project.id} className="rounded border border-slate-200 bg-white overflow-hidden dark:border-white/10 dark:bg-navy-900">
                      <div className="grid grid-cols-2">
                        <button type="button" onClick={() => setSelectedImage(project.beforeImage)} className="relative h-44 cursor-pointer overflow-hidden sm:h-56 lg:h-64">
                          <img src={project.beforeImage} alt="Before" className="h-full w-full object-cover" />
                          <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Before</span>
                        </button>
                        <button type="button" onClick={() => setSelectedImage(project.afterImage)} className="relative h-44 cursor-pointer overflow-hidden sm:h-56 lg:h-64">
                          <img src={project.afterImage} alt="After" className="h-full w-full object-cover" />
                          <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">After</span>
                        </button>
                      </div>
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 sm:text-xs dark:text-navy-300">
                          <span className="uppercase tracking-wide">{project.trade}</span>
                          <span>{project.location}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-600 leading-relaxed sm:text-sm dark:text-navy-300">{project.description}</p>
                        <div className="mt-2 flex items-center gap-3 text-[11px] font-bold text-slate-700 sm:text-xs dark:text-navy-200">
                          <span>Cost: {project.cost}</span>
                          <span>·</span>
                          <span>Completed in {project.completionDays}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-4 dark:text-navy-300">No verified before & after work available yet.</p>
              )
            )}
          </div>
        </div>

        {/* PURCHASE / FORM SECTION */}
        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-md sm:p-8 dark:border-white/10 dark:bg-navy-900">
          <h3 className="text-base font-bold text-slate-900 sm:text-lg dark:text-white">
            Complete This Simple Form To Purchase Our Gas Care Cover
          </h3>

          <div className="mt-3">
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1 dark:text-navy-300">
              <span>Step 1 of 2</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-white/10">
              <div className="h-2 w-1/2 rounded-full bg-emerald-600" />
            </div>
          </div>

          <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-navy-200">
                Fuel type <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1">
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full appearance-none rounded border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 focus:border-red-500 focus:outline-none dark:border-white/15 dark:bg-navy-950 dark:text-navy-200"
                >
                  <option value="">Select your homes fuel type</option>
                  <option value="natural_gas">Natural Gas</option>
                  <option value="lpg">LPG</option>
                  <option value="oil">Oil</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-400 dark:text-navy-400" />
              </div>
              <p className="mt-1 text-[10px] italic text-navy-800 dark:text-navy-300">
                (*) Fuel type should be written on the boiler
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-navy-200">
                Do you have a hot water tank? <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 flex gap-4">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-navy-200">
                  <input
                    type="radio"
                    name="hotWaterTank"
                    value="yes"
                    checked={hasHotWaterTank === 'yes'}
                    onChange={(e) => setHasHotWaterTank(e.target.value)}
                    className="text-red-600 focus:ring-red-500"
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-navy-200">
                  <input
                    type="radio"
                    name="hotWaterTank"
                    value="no"
                    checked={hasHotWaterTank === 'no'}
                    onChange={(e) => setHasHotWaterTank(e.target.value)}
                    className="text-red-600 focus:ring-red-500"
                  />
                  No
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <button onClick={() => setSelectedImage(null)} className="absolute right-6 top-6 text-white">
            <X className="h-6 w-6" />
          </button>
          <img src={selectedImage} alt="Enlarged" className="max-h-[85vh] max-w-full rounded object-contain" />
        </div>
      )}
    </div>
  );
};

export default ProDetailsPage;