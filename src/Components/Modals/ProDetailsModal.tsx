import React from 'react';
import { useBooking } from '../../Context/BookingContext';
import { ModalShell } from '../ui/ModalShell';
import { X, Star, ShieldCheck, Clock, MapPin, Award, Calendar } from 'lucide-react';

export const ProDetailsModal: React.FC = () => {
  const { selectedPro, closeProModal, openBooking } = useBooking();

  if (!selectedPro) return null;

  const handleBookPro = () => {
    const trade = selectedPro.trade;
    closeProModal();
    openBooking({ trade, postcode: selectedPro.postcodeArea });
  };

  const badges: { label: string; show: boolean }[] = [
    { label: 'DBS vetted', show: true },
    { label: 'Gas Safe registered', show: !!selectedPro.verifiedStatus.gasSafe },
    { label: 'NICEIC certified', show: !!selectedPro.verifiedStatus.niceic },
    { label: `${selectedPro.verifiedStatus.insuranceAmount} cover`, show: true },
  ];

  return (
    <ModalShell isOpen={!!selectedPro} onClose={closeProModal}>
      {/* Header banner */}
      <div className="relative h-32 bg-black dot-grid shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,17,26,0.35),transparent_65%)]" />
        <button
          onClick={closeProModal}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/10 backdrop-blur text-white hover:bg-white/25 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 pt-0 overflow-y-auto flex-1 relative space-y-6">
        {/* Avatar & title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 pb-5 border-b border-navy-100 dark:border-white/10">
          <div className="flex items-end gap-4">
            <img
              src={selectedPro.avatar}
              alt={selectedPro.name}
              className="w-24 h-24 rounded-3xl object-cover border-4 border-white dark:border-navy-900 shadow-lift"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-2xl font-extrabold tracking-tight text-navy-950 dark:text-white">
                  {selectedPro.name}
                </h3>
                {selectedPro.verifiedStatus.dbsChecked && (
                  <ShieldCheck className="w-5 h-5 text-primary" />
                )}
              </div>
              <p className="text-sm font-bold text-primary mt-0.5">{selectedPro.companyName}</p>
              <div className="flex items-center gap-3 text-xs font-medium text-navy-500 dark:text-navy-300 mt-1.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {selectedPro.location} ({selectedPro.postcodeArea})
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {selectedPro.responseMinutes} min avg reply
                </span>
              </div>
            </div>
          </div>

          <div className="sm:text-right">
            <div className="font-heading text-2xl font-extrabold text-navy-950 dark:text-white">
              £{selectedPro.hourlyRate}<span className="text-xs font-medium text-navy-500 dark:text-navy-300">/hr</span>
            </div>
            <div className="flex items-center sm:justify-end gap-1 mt-1">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-sm font-heading font-extrabold text-navy-950 dark:text-white">{selectedPro.rating}</span>
              <span className="text-xs font-medium text-navy-500 dark:text-navy-300">({selectedPro.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Vetting badges  always render 4 slots so the grid stays even */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {badges.map((badge) => (
            <div
              key={badge.label}
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                badge.show
                  ? 'border-primary/25 bg-primary/10'
                  : 'border-navy-100 dark:border-white/10 bg-cream-100 dark:bg-navy-800 opacity-40'
              }`}
            >
              <Award className={`w-4 h-4 shrink-0 ${badge.show ? 'text-primary' : 'text-navy-400'}`} />
              <span className="font-bold text-navy-900 dark:text-white">{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div>
          <h4 className="text-xs font-heading font-bold text-navy-400 dark:text-navy-300 uppercase tracking-wider mb-2">
            About the professional
          </h4>
          <p className="text-sm leading-relaxed text-navy-700 dark:text-navy-200">{selectedPro.bio}</p>
        </div>

        {/* Specialties */}
        <div>
          <h4 className="text-xs font-heading font-bold text-navy-400 dark:text-navy-300 uppercase tracking-wider mb-2">
            Core services &amp; expertise
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedPro.specialties.map((spec, i) => (
              <span key={i} className="chip">{spec}</span>
            ))}
          </div>
        </div>

        {/* Portfolio */}
        {selectedPro.portfolioImages && selectedPro.portfolioImages.length > 0 && (
          <div>
            <h4 className="text-xs font-heading font-bold text-navy-400 dark:text-navy-300 uppercase tracking-wider mb-2">
              Recent completed UK jobs
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {selectedPro.portfolioImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Job ${i}`}
                  className="w-full h-36 object-cover rounded-2xl border border-navy-100 dark:border-white/10 shadow-soft"
                />
              ))}
            </div>
          </div>
        )}

        {/* Action bar */}
        <div className="pt-5 border-t border-navy-100 dark:border-white/10 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-navy-500 dark:text-navy-300">Availability</span>
            <div className="text-sm font-heading font-extrabold text-primary flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {selectedPro.availability}
            </div>
          </div>
          <button onClick={handleBookPro} className="btn btn-primary px-7 py-3.5 text-base">
            <Calendar className="w-4 h-4" />
            Book {selectedPro.name.split(' ')[0]} now
          </button>
        </div>
      </div>
    </ModalShell>
  );
};
