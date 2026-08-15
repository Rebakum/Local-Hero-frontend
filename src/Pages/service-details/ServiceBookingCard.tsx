import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { useBooking } from '../../Context/BookingContext';
import { Reveal } from '../../Components/ui/Reveal';

interface ServiceBookingCardProps {
  estimatedPrice: string;
  timeEstimate: string;
  tradeName: string;
}

export const ServiceBookingCard: React.FC<ServiceBookingCardProps> = ({
  estimatedPrice,
  timeEstimate,
  tradeName,
}) => {
  const navigate = useNavigate();
  const { openBooking } = useBooking();

  const handleBookNow = () => {
    openBooking({ trade: tradeName as any });
  };

  return (
    <Reveal>
      <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-0" />

        <div className="relative z-10">
          <div className="mb-4">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-navy-400">Fixed Instant Quote</span>
            <div className="text-4xl font-heading font-black text-primary mt-1">{estimatedPrice}</div>
          </div>

          <div className="flex items-center gap-2 text-sm text-navy-600 dark:text-navy-300 mb-6 bg-slate-50 dark:bg-navy-800 p-3 rounded-xl border border-slate-100 dark:border-white/5">
            <Clock size={16} className="text-primary" />
            <span>Estimated Duration: <strong>{timeEstimate}</strong></span>
          </div>

          <button
            onClick={handleBookNow}
            className="btn btn-primary w-full py-4 text-base font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Request Quote<ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate('/services')}
            className="mt-3 w-full flex items-center justify-center gap-2 rounded-full border border-slate-200 dark:border-white/10 py-3 text-sm font-semibold text-navy-600 dark:text-navy-300 transition hover:bg-slate-50 dark:hover:bg-navy-800"
          >
            <ArrowLeft size={14} />
            Browse Other Services
          </button>
        </div>
      </div>
    </Reveal>
  );
};
