import React, { useState, useEffect } from 'react';
import { TradeCategory } from '../../../types';
import { getAllTrades } from '../../../services/api';
import { Users } from 'lucide-react';
import type { BookingFormData } from '../../../types';
import type { Trade } from '../../../types';

interface TradeStepProps {
  bookingData: Partial<BookingFormData>;
  updateBookingData: (data: Partial<BookingFormData>) => void;
  onTradeSelect: (trade: TradeCategory) => void;
}

export const TradeStep: React.FC<TradeStepProps> = ({
  bookingData,
  onTradeSelect,
}) => {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    getAllTrades()
      .then((data) => setTrades(data))
      .catch(() => setTrades([]));
  }, []);

  return (
    <div className="space-y-4">
      <h4 className="font-heading text-base font-extrabold text-navy-950 dark:text-white">
        What do you need help with?
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {trades.map((cat: any) => {
          const catName = cat.category || cat.id || '';
          const hourlyRate = cat.featuredService?.estimatedPrice || cat.avgHourlyRate || '£40/hr';
          const prosCount = cat.activeProsCount ?? 100;

          return (
            <button
              key={cat.id || catName}
              type="button"
              onClick={() => onTradeSelect(catName as TradeCategory)}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 ${
                bookingData.trade === catName
                  ? 'border-primary bg-primary/10 shadow-card'
                  : 'border-navy-100 dark:border-white/10 bg-white dark:bg-navy-800 hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-soft'
              }`}
            >
              <span className="text-[11px] font-heading font-bold text-primary">{hourlyRate}</span>
              <span className="font-heading text-base font-extrabold text-navy-950 dark:text-white mt-2 capitalize">
                {catName}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-navy-800 dark:text-navy-300 mt-1">
                <Users className="w-3 h-3" /> {prosCount.toLocaleString()} active pros
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
