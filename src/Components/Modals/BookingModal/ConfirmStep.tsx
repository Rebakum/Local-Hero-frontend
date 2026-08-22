import React from 'react';
import { Sparkles, ShieldCheck, Wrench, ArrowLeft } from 'lucide-react';
import type { BookingFormData } from '../../../types';

type BookingFormDataUrgency = BookingFormData['urgency'];

const URGENCY_OPTIONS: { id: BookingFormDataUrgency; label: string; desc: string; eta: string }[] = [
  { id: 'Standard', label: 'Standard booking', desc: 'Pick date & time', eta: 'Next available slot' },
  { id: 'Urgent (Same Day)', label: 'Urgent today', desc: 'Within 3 – 6 hours', eta: 'Arrival in 3 – 6 hours' },
  { id: 'Emergency 24/7 (45 Mins)', label: 'Emergency 24/7', desc: '45 min arrival', eta: 'Arrival in ~45 minutes' },
];

interface ConfirmStepProps {
  bookingData: Partial<BookingFormData>;
  updateBookingData: (data: Partial<BookingFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

export const ConfirmStep: React.FC<ConfirmStepProps> = ({
  bookingData,
  updateBookingData,
  onSubmit,
  onBack,
  isSubmitting = false,
  submitError = null,
}) => {
  const selectedUrgency = URGENCY_OPTIONS.find((u) => u.id === bookingData.urgency) ?? URGENCY_OPTIONS[0];
  const displayTrade = bookingData.trade || 'Professional';

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-heading font-bold text-navy-700 dark:text-navy-200 uppercase tracking-wider mb-1.5">
            Your full name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. John Smith"
            value={bookingData.fullName || ''}
            onChange={(e) => updateBookingData({ fullName: e.target.value })}
            className="input-lh"
          />
        </div>
        <div>
          <label className="block text-xs font-heading font-bold text-navy-700 dark:text-navy-200 uppercase tracking-wider mb-1.5">
            UK mobile number
          </label>
          <input
            type="tel"
            required
            placeholder="e.g. 07700 900123"
            value={bookingData.phone || ''}
            onChange={(e) => updateBookingData({ phone: e.target.value })}
            className="input-lh"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-heading font-bold text-navy-700 dark:text-navy-200 uppercase tracking-wider mb-1.5">
          Email address
        </label>
        <input
          type="email"
          required
          placeholder="e.g. john@example.com"
          value={bookingData.email || ''}
          onChange={(e) => updateBookingData({ email: e.target.value })}
          className="input-lh"
        />
      </div>

      <div className="p-4 rounded-2xl bg-cream-100 dark:bg-navy-800 border border-navy-100 dark:border-white/10 space-y-2 text-xs">
        <div className="font-heading font-extrabold text-navy-950 dark:text-white border-b border-navy-100 dark:border-white/10 pb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> Booking summary
        </div>
        <div className="flex justify-between text-navy-800 dark:text-navy-300">
          <span>Selected trade</span>
          <span className="font-bold text-navy-950 dark:text-white capitalize">{displayTrade}</span>
        </div>
        {bookingData.professionalName && (
          <div className="flex justify-between text-navy-800 dark:text-navy-300">
            <span>Professional</span>
            <span className="font-bold text-navy-950 dark:text-white">
              {bookingData.professionalName}
            </span>
          </div>
        )}
        <div className="flex justify-between text-navy-800 dark:text-navy-300">
          <span>Postcode / location</span>
          <span className="font-bold text-navy-950 dark:text-white">{bookingData.postcode}</span>
        </div>
        <div className="flex justify-between text-navy-800 dark:text-navy-300">
          <span>Estimated arrival</span>
          <span className="font-bold text-primary">{selectedUrgency.eta}</span>
        </div>
        <div className="flex justify-between text-navy-800 dark:text-navy-300">
          <span>Protection</span>
          <span className="font-bold text-primary flex items-center gap-1">
            <ShieldCheck className="w-3.5 3" /> £2M insurance included
          </span>
        </div>
      </div>

      {submitError && (
        <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs font-semibold text-red-600 dark:text-red-400">
          {submitError}
        </div>
      )}

      <div className="flex justify-between items-center pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-heading font-bold text-navy-800 hover:text-navy-950 dark:text-navy-300 dark:hover:text-white disabled:opacity-50"
        >
          <ArrowLeft className="w-3.5 3" /> Back
        </button>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary px-8 py-4 text-base disabled:opacity-60">
          <Wrench className="w-4 h-4" />
          {isSubmitting ? 'Submitting…' : 'Confirm & request pros'}
        </button>
      </div>
    </form>
  );
};
