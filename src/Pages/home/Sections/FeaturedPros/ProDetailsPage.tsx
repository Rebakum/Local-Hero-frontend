import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  Maximize2,
  X,
  Briefcase,
  Award,
  CheckCircle2,
  Calendar,
  User,
  MessageSquare
} from 'lucide-react';
import { getProfessionalById } from '@/src/services/content.service';
import { getOrCreateConversation } from '@/src/services/messaging.service';
import type { Professional } from '@/src/types';
import { useBooking } from '@/src/Context/BookingContext';
import { useAuth } from '@/src/Context/AuthContext';
import { SaveFavouriteButton } from '@/src/Components/ui/SaveFavouriteButton';

export const ProDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pro, setPro] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reviews'>('about');

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-500 dark:text-navy-300 animate-pulse">
          Loading profile details...
        </p>
      </div>
    );
  }

  if (!pro) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-navy-800 border border-neutral-200 dark:border-white/10 rounded-3xl shadow-lg p-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-slate-400 dark:text-navy-400" />
          </div>
          <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">Professional Not Found</h2>
          <p className="text-sm text-slate-500 dark:text-navy-300 mt-2">
            The profile you are looking for might have been removed or is temporarily unavailable.
          </p>
          <Link
            to="/professionals"
            className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:underline mt-6"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Professionals
          </Link>
        </div>
      </div>
    );
  }

  const portfolioImages = pro.portfolioImages || (pro as any).portfolio || [];
  const specialties = pro.specialties || (pro as any).skills || [];
  const reviews = (pro as any).reviews || [];

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-navy-950 text-slate-800 dark:text-slate-100 page-top pb-28 sm:pb-16 transition-colors">
      
      {/* Top Navigation */}
      <div className="border-b border-slate-200/60 dark:border-white/10 bg-white/50 dark:bg-navy-900/50 backdrop-blur-md">
        <div className="container-lh py-3.5">
          <Link
            to="/professionals"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-navy-300 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>
        </div>
      </div>

      <div className="container-lh mt-6">
        
        {/* Main Header Card without Banner */}
        <div className="bg-white dark:bg-navy-800 rounded-3xl border border-neutral-200 dark:border-white/10 shadow-lg p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Avatar & Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 text-center sm:text-left">
              <div className="relative shrink-0">
                <img
                  src={pro.avatar || (pro as any).image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={pro.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-white/10 shadow-md"
                />
                <span className="absolute -bottom-1.5 -right-1.5 bg-red-600 text-white p-1 rounded-lg shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>

              <div className="min-w-0 space-y-1">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="min-w-0 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white capitalize break-words text-center sm:text-left">
                    {pro.name}
                  </h1>
                  <CheckCircle2 className="w-5 h-5 text-red-600 fill-red-600/10 shrink-0" />
                </div>
                <p className="text-red-600 dark:text-red-400 font-semibold text-sm sm:text-base break-words">
                  {tradeName} {pro.companyName && <span>• {pro.companyName}</span>}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-navy-300 flex items-center justify-center sm:justify-start gap-1 pt-0.5 break-words">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {pro.location || (pro as any).address || 'Location Not Specified'}
                </p>
              </div>
            </div>

            {/* Price & Action */}
              <div className="flex flex-col md:items-end gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/10">
                <div className="text-center md:text-right">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Hourly Rate</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    £{pro.hourlyRate || (pro as any).rate || '0'}
                    <span className="text-xs font-normal text-slate-500 dark:text-navy-300">/hr</span>
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  {proId && <SaveFavouriteButton professionalId={proId} variant="button" className="flex-1 sm:flex-none" />}
                  <button
                    onClick={handleMessage}
                    disabled={messaging}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold px-8 py-3.5 rounded-full transition-all text-sm border border-slate-200 dark:border-white/10 text-navy-700 dark:text-navy-200 hover:bg-navy-50 dark:hover:bg-white/5 disabled:opacity-50"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </button>
                  <button
                    onClick={handleBookNow}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-red-600/20 transition-all text-sm"
                  >
                    Request Quote
                  </button>
                </div>
                {messageError && (
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 text-center md:text-right mt-2">
                    {messageError}
                  </p>
                )}
              </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-white/10">
            <div className="min-w-0 bg-slate-50/80 dark:bg-white/5 p-3.5 sm:p-4 rounded-2xl border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2 text-amber-500 mb-1">
                <Star className="w-4 h-4 fill-amber-400 shrink-0" />
                <span className="font-bold text-slate-900 dark:text-white text-base">{pro.rating || (pro as any).avgRating || '5.0'}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-navy-300 truncate">
                {pro.reviewCount ? `${pro.reviewCount} Reviews` : `${reviews.length} Reviews`}
              </p>
            </div>

            <div className="min-w-0 bg-slate-50/80 dark:bg-white/5 p-3.5 sm:p-4 rounded-2xl border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2 text-red-600 mb-1">
                <Clock className="w-4 h-4 shrink-0" />
                <span className="font-bold text-slate-900 dark:text-white text-base">{pro.responseMinutes ? `~${pro.responseMinutes}m` : '~30m'}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-navy-300">Response Time</p>
            </div>

            <div className="min-w-0 bg-slate-50/80 dark:bg-white/5 p-3.5 sm:p-4 rounded-2xl border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Briefcase className="w-4 h-4 shrink-0" />
                <span className="font-bold text-slate-900 dark:text-white text-base">Verified</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-navy-300">Background Checked</p>
            </div>

            <div className="min-w-0 bg-slate-50/80 dark:bg-white/5 p-3.5 sm:p-4 rounded-2xl border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <Calendar className="w-4 h-4 shrink-0" />
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm truncate">{pro.availability || 'Available Today'}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-navy-300">Current Status</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-6 border-b border-slate-200 dark:border-white/10 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'about'
                ? 'border-red-600 text-red-600 dark:text-red-500'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-navy-300 dark:hover:text-white'
            }`}
          >
            Overview & Specialties
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'portfolio'
                ? 'border-red-600 text-red-600 dark:text-red-500'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-navy-300 dark:hover:text-white'
            }`}
          >
            Portfolio Showcase ({portfolioImages.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-red-600 text-red-600 dark:text-red-500'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-navy-300 dark:hover:text-white'
            }`}
          >
            Client Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-navy-800 p-6 sm:p-7 rounded-3xl border border-neutral-200 dark:border-white/10 shadow-lg">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">About the Professional</h3>
                <p className="text-slate-600 dark:text-navy-200 leading-relaxed text-sm sm:text-base break-words whitespace-pre-wrap">
                  {pro.bio || (pro as any).description || 'No detailed biography provided yet.'}
                </p>
              </div>

              {specialties.length > 0 && (
                <div className="bg-white dark:bg-navy-800 p-6 sm:p-7 rounded-3xl border border-neutral-200 dark:border-white/10 shadow-lg">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-red-600" /> Services & Specialties
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {specialties.map((specialty: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-900/40 text-xs font-semibold px-3.5 py-1.5 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="bg-white dark:bg-navy-800 p-6 rounded-3xl border border-neutral-200 dark:border-white/10 shadow-lg lg:sticky lg:top-24">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Service Guarantee</h4>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-navy-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Identity verified</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Direct booking protection</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Transparent hourly rates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div>
            {portfolioImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {portfolioImages.map((img: string, index: number) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className="group relative h-56 rounded-2xl overflow-hidden cursor-pointer bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-white/10"
                  >
                    <img
                      src={img}
                      alt={`Portfolio item ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-navy-800 rounded-3xl border border-neutral-200 dark:border-white/10 shadow-lg">
                <p className="text-xs sm:text-sm text-slate-400">No portfolio images uploaded.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((rev: any, idx: number) => (
                <div key={idx} className="bg-white dark:bg-navy-800 p-5 rounded-2xl border border-neutral-200 dark:border-white/10 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {rev.userName || rev.user?.name || 'Anonymous Client'}
                        </h5>
                        <p className="text-[10px] text-slate-400">{rev.date || 'Verified Review'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {rev.rating || '5.0'}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-navy-200">{rev.comment || rev.text}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-navy-800 rounded-3xl border border-neutral-200 dark:border-white/10 shadow-lg">
                <p className="text-xs sm:text-sm text-slate-400">No client reviews submitted yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={selectedImage}
            alt="Enlarged Portfolio Item"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}

      {/* Mobile Sticky Footer */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 dark:bg-navy-900/95 backdrop-blur-md border-t border-slate-200 dark:border-white/10 p-3.5 z-40 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Rate</span>
          <p className="text-base font-black text-slate-900 dark:text-white">
            £{pro.hourlyRate || (pro as any).rate || '0'}<span className="text-xs font-normal text-slate-500">/hr</span>
          </p>
        </div>
        <button
          onClick={handleBookNow}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-full text-xs sm:text-sm shadow-md"
        >
          Book Now
        </button>
      </div>

    </div>
  );
};

export default ProDetailsPage;