import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../../Context/BookingContext';
import { useAuth } from '../../../Context/AuthContext';
import { TradeCategory } from '../../../types';
import { ModalShell } from '../../ui/ModalShell';
import { ThemeLogo } from '../../ui/ThemeLogo';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import type { BookingFormData } from '../../../types';
import { TradeStep } from './TradeStep';
import { LocationStep } from './LocationStep';
import { ScheduleStep } from './ScheduleStep';
import { ConfirmStep } from './ConfirmStep';
import { createBooking, type BookingRecord } from '../../../services/booking.service';

const STEPS = ['Trade', 'Location', 'Schedule', 'Confirm'] as const;
type Step = 1 | 2 | 3 | 4;

type BookingFormDataUrgency = BookingFormData['urgency'];

const URGENCY_OPTIONS: { id: BookingFormDataUrgency; label: string; desc: string; eta: string }[] = [
  { id: 'Standard', label: 'Standard booking', desc: 'Pick date & time', eta: 'Next available slot' },
  { id: 'Urgent (Same Day)', label: 'Urgent today', desc: 'Within 3 – 6 hours', eta: 'Arrival in 3 – 6 hours' },
  { id: 'Emergency 24/7 (45 Mins)', label: 'Emergency 24/7', desc: '45 min arrival', eta: 'Arrival in ~45 minutes' },
];

export const BookingModal: React.FC = () => {
  const { isBookingOpen, closeBooking, bookingData, updateBookingData, bookingOpenCount } = useBooking();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    if (bookingOpenCount > 0) {
      setStep(bookingData.trade ? 2 : 1);
      setIsSubmitted(false);
    }
  }, [bookingOpenCount, bookingData.trade]);

  const handleTradeSelect = (trade: TradeCategory) => {
    updateBookingData({ trade });
    setStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.postcode) return;
    setStep(3);
  };

  const handleStep3Next = (e: React.FormEvent) => {
    e.preventDefault();
    updateBookingData({
      date: bookingData.date || new Date().toISOString().split('T')[0],
      timeSlot: bookingData.timeSlot || 'Morning (8am - 12pm)',
    });
    setStep(4);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!isAuthenticated) {
      // Booking requires an account so we can track it in "My Bookings" and
      // take payment later — send them to login, then back here.
      closeBooking();
      navigate('/login', { state: { redirectTo: '/', reopenBooking: true } });
      return;
    }

    setIsSubmitting(true);
    try {
      const booking = await createBooking(bookingData, bookingData.professionalId);
      setCreatedBooking(booking);
      setIsSubmitted(true);
    } catch (err: any) {
      setSubmitError(
        err?.response?.data?.message || 'Something went wrong submitting your booking. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedUrgency = URGENCY_OPTIONS.find((u) => u.id === bookingData.urgency) ?? URGENCY_OPTIONS[0];
  const displayTrade = bookingData.trade || 'Professional';

  return (
    <ModalShell isOpen={isBookingOpen} onClose={closeBooking}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-navy-100 dark:border-white/10">
        <div className="flex items-center gap-3">
          {/* variant="compact" এর পরিবর্তে variant="modal" ব্যবহার করা হয়েছে */}
          <ThemeLogo variant="modal" alt="LocalHero" className="h-10 w-auto" />
          <div>
            <h3 className="font-heading text-lg font-extrabold tracking-tight text-navy-950 dark:text-white">
              Book a Local Hero
            </h3>
            <p className="text-xs font-medium text-navy-500 dark:text-navy-300">
              Guaranteed fixed quotes &amp; vetted UK tradespeople
            </p>
          </div>
        </div>
        <button
          onClick={closeBooking}
          aria-label="Close"
          className="p-2 rounded-full text-navy-400 hover:text-navy-950 hover:bg-navy-100 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress */}
      {!isSubmitted && (
        <div className="px-6 py-4 border-b border-navy-100 dark:border-white/10 flex items-center gap-3">
          {STEPS.map((label, i) => {
            const n = (i + 1) as Step;
            const done = step > n;
            const active = step === n;
            return (
              <React.Fragment key={label}>
                {i > 0 && (
                  <div className="h-px flex-1 bg-navy-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-primary transition-all duration-500 ${
                        step > i ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-heading font-extrabold transition-all ${
                      done
                        ? 'bg-primary text-white'
                        : active
                          ? 'bg-primary text-white shadow-glow'
                          : 'bg-navy-100 text-navy-400 dark:bg-white/10 dark:text-navy-300'
                    }`}
                  >
                    {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : n}
                  </span>
                  <span
                    className={`hidden sm:inline text-[11px] font-heading font-bold uppercase tracking-wider ${
                      active || done ? 'text-navy-950 dark:text-white' : 'text-navy-400 dark:text-navy-300'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Body */}
      <div className="p-6 overflow-y-auto flex-1 min-h-0">
        {isSubmitted ? (
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-black text-white flex items-center justify-center mx-auto shadow-glow">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="font-heading text-2xl font-extrabold text-navy-950 dark:text-white">
              Booking request dispatched!
            </h4>
            <p className="text-sm text-navy-600 dark:text-navy-300 max-w-md mx-auto">
              We've matched your request with 3 vetted{' '}
              <span className="font-bold text-primary capitalize">{displayTrade}s</span> near{' '}
              <span className="font-bold text-navy-950 dark:text-white">{bookingData.postcode}</span>.
              You'll receive direct SMS quotes within 5 minutes.
            </p>
            <div className="bg-cream-100 dark:bg-navy-800 border border-navy-100 dark:border-white/10 rounded-2xl p-4 max-w-sm mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between text-navy-500 dark:text-navy-300">
                <span>Reference ID</span>
                <span className="font-mono font-bold text-navy-950 dark:text-white">
                  {createdBooking ? createdBooking.id.slice(0, 8).toUpperCase() : '—'}
                </span>
              </div>
              <div className="flex justify-between text-navy-500 dark:text-navy-300">
                <span>Trade category</span>
                <span className="font-bold text-navy-950 dark:text-white capitalize">{displayTrade}</span>
              </div>
              <div className="flex justify-between text-navy-500 dark:text-navy-300">
                <span>Postcode area</span>
                <span className="font-bold text-navy-950 dark:text-white">{bookingData.postcode}</span>
              </div>
              {bookingData.professionalName && (
                <div className="flex justify-between text-navy-500 dark:text-navy-300">
                  <span>Professional</span>
                  <span className="font-bold text-navy-950 dark:text-white">
                    {bookingData.professionalName}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-navy-500 dark:text-navy-300">
                <span>Urgency</span>
                <span className="font-bold text-primary">{selectedUrgency.label}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setCreatedBooking(null);
                setStep(1);
                closeBooking();
                navigate('/dashboard/user/bookings');
              }}
              className="btn btn-primary px-8 py-3.5 text-base"
            >
              View my bookings
            </button>
          </div>
        ) : step === 1 ? (
          <TradeStep
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onTradeSelect={handleTradeSelect}
          />
        ) : step === 2 ? (
          <LocationStep
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onNext={handleStep2Next}
            onBack={() => setStep(1)}
          />
        ) : step === 3 ? (
          <ScheduleStep
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onNext={handleStep3Next}
            onBack={() => setStep(2)}
          />
        ) : (
          <ConfirmStep
            bookingData={bookingData}
            updateBookingData={updateBookingData}
            onSubmit={handleFinalSubmit}
            onBack={() => setStep(3)}
            isSubmitting={isSubmitting}
            submitError={submitError}
          />
        )}
      </div>
    </ModalShell>
  );
};