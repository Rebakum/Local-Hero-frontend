import React from 'react';
import { ShieldCheck, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import type { BookingFormData } from '../../../types';

type BookingFormDataUrgency = BookingFormData['urgency'];

const URGENCY_OPTIONS: { id: BookingFormDataUrgency; label: string; desc: string; eta: string }[] = [
  { id: 'Standard', label: 'Standard booking', desc: 'Pick date & time', eta: 'Next available slot' },
  { id: 'Urgent (Same Day)', label: 'Urgent today', desc: 'Within 3 – 6 hours', eta: 'Arrival in 3 – 6 hours' },
  { id: 'Emergency 24/7 (45 Mins)', label: 'Emergency 24/7', desc: '45 min arrival', eta: 'Arrival in ~45 minutes' },
];

interface ScheduleStepProps {
  bookingData: Partial<BookingFormData>;
  updateBookingData: (data: Partial<BookingFormData>) => void;
  onNext: (e: React.FormEvent) => void;
  onBack: () => void;
}

export const ScheduleStep: React.FC<ScheduleStepProps> = ({
  bookingData,
  updateBookingData,
  onNext,
  onBack,
}) => {
  return (
    <form onSubmit={onNext} className="space-y-5">
      <div>
        <label className="block text-xs font-heading font-bold text-navy-700 dark:text-navy-200 uppercase tracking-wider mb-2">
          How urgent is the job?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {URGENCY_OPTIONS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => updateBookingData({ urgency: item.id })}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                bookingData.urgency === item.id
                  ? 'border-primary bg-primary/10 shadow-card'
                  : 'border-navy-100 dark:border-white/10 bg-white dark:bg-navy-800 hover:border-primary/50 hover:-translate-y-0.5'
              }`}
            >
              <div className="text-[13px] font-heading font-extrabold text-navy-950 dark:text-white">
                {item.label}
              </div>
              <div className="text-[11px] font-medium text-navy-500 dark:text-navy-300 mt-1">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-heading font-bold text-navy-700 dark:text-navy-200 uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5 text-primary" /> Preferred date
          </label>
          <div className="relative">
            <input
              type="date"
              value={bookingData.date || new Date().toISOString().split('T')[0]}
              onChange={(e) => updateBookingData({ date: e.target.value })}
              className="input-lh w-full text-navy-950 dark:text-white bg-white dark:bg-navy-900 border border-navy-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary [color-scheme:light] dark:[color-scheme:dark]"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-heading font-bold text-navy-700 dark:text-navy-200 uppercase tracking-wider mb-2">
            Preferred time slot
          </label>
          <select
            value={bookingData.timeSlot || 'Morning (8am - 12pm)'}
            onChange={(e) => updateBookingData({ timeSlot: e.target.value })}
            className="input-lh w-full text-navy-950 dark:text-white bg-white dark:bg-navy-900 border border-navy-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
          >
            <option className="bg-white dark:bg-navy-900 text-navy-950 dark:text-white">Morning (8am - 12pm)</option>
            <option className="bg-white dark:bg-navy-900 text-navy-950 dark:text-white">Afternoon (12pm - 4pm)</option>
            <option className="bg-white dark:bg-navy-900 text-navy-950 dark:text-white">Evening (4pm - 8pm)</option>
            <option className="bg-white dark:bg-navy-900 text-navy-950 dark:text-white">As Soon As Possible</option>
          </select>
        </div>
      </div>

      <div className="p-4 rounded-2xl border border-primary/25 bg-primary/10 flex items-start gap-3 text-xs text-navy-700 dark:text-navy-200">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <span>
          <span className="font-heading font-extrabold text-navy-950 dark:text-white">LocalHero Guarantee:</span>{' '}
          Free cancellation up to 2 hours before the appointment, zero charge until work is completed.
        </span>
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
          Continue to confirm <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
