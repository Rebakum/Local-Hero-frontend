import React, { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { Search, PhoneCall } from 'lucide-react';
import { useBooking } from '@/src/Context/BookingContext';
import { TradeCategory } from '@/src/types';

interface HeroButtonsProps {
  itemVariant: Variants;
  trade: TradeCategory;
}

export const HeroButtons: React.FC<HeroButtonsProps> = ({ itemVariant, trade }) => {
  const { openBooking, openEmergencyModal, userPostcode } = useBooking();
  const [date] = useState<string>(new Date().toISOString().split('T')[0]);

  return (
    <motion.div variants={itemVariant} className="flex flex-col sm:flex-row my-6 md:my-12 flex-wrap items-stretch sm:items-center gap-3">
      <button onClick={() => openBooking({ trade, postcode: userPostcode, date })} className="btn btn-primary px-7 py-4 transition-all duration-300 hover:scale-[1.02]">
        <Search className="w-4 h-4" />
        Get a Free Quote
      </button>
      <button
        type="button"
        onClick={() => openEmergencyModal(trade)}
        className="btn btn-outline px-7 py-4 border-white/40 text-white hover:bg-white hover:text-navy-950"
      >
        <PhoneCall className="w-4 h-4" />
        Emergency 24/7
      </button>
    </motion.div>
  );
};
