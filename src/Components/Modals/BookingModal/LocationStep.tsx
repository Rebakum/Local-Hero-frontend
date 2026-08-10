import React from 'react';
import { MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import type { BookingFormData } from '../../../types';

interface LocationStepProps {
  bookingData: Partial<BookingFormData>;
  updateBookingData: (data: Partial<BookingFormData>) => void;
  onNext: (e: React.FormEvent) => void;
  onBack: () => void;
}

export const LocationStep: React.FC<LocationStepProps> = ({
  bookingData,
  updateBookingData,
  onNext,
  onBack,
}) => {
  return (
    <form onSubmit={onNext} className="space-y-5">
      <div>
        <label className="block text-xs font-heading font-bold text-navy-700 dark:text-navy-200 uppercase tracking-wider mb-2">
          UK postcode <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <input
            type="text"
            required
            placeholder="e.g. SW1A 1AA or M20 2AB"
            value={bookingData.postcode || ''}
            onChange={(e) => updateBookingData({ postcode: e.target.value.toUpperCase() })}
            className="input-lh !pl-12 py-3.5"
          />
        </div>
        <p className="text-[11px] font-medium text-navy-500 dark:text-navy-300 mt-1.5">
          We cover all major UK postcode sectors with guaranteed local dispatch.
        </p>
      </div>

      <div>
        <label className="block text-xs font-heading font-bold text-navy-700 dark:text-navy-200 uppercase tracking-wider mb-2">
          Full street address &amp; property details
        </label>
        <input
          type="text"
          placeholder="e.g. 24 Kensington High Street, Flat 3"
          value={bookingData.address || ''}
          onChange={(e) => updateBookingData({ address: e.target.value })}
          className="input-lh"
        />
      </div>

      <div>
        <label className="block text-xs font-heading font-bold text-navy-700 dark:text-navy-200 uppercase tracking-wider mb-2">
          Describe the job or problem
        </label>
        <textarea
          rows={3}
          placeholder="e.g. Radiator in bedroom is cold at top and making ticking noises — need bleed or powerflush quote."
          value={bookingData.description || ''}
          onChange={(e) => updateBookingData({ description: e.target.value })}
          className="input-lh resize-none"
        />
      </div>

      <div className="flex justify-between items-center pt-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-heading font-bold text-navy-500 hover:text-navy-950 dark:text-navy-300 dark:hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <button type="submit" className="btn btn-primary px-6 py-3.5 text-base">
          Continue to schedule <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
