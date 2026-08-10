import React, { useState, useEffect } from 'react';
import { motion, type Variants } from 'motion/react';
import { CheckCircle2, Star } from 'lucide-react';
import { getFeaturedProfessionals } from '../../../services/api';

interface HeroSearchProps {
  itemVariant: Variants;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ itemVariant }) => {
  const [avatars, setAvatars] = useState<string[]>([]);

  useEffect(() => {
    getFeaturedProfessionals()
      .then((pros) => setAvatars(pros.slice(0, 3).map((p) => p.avatar)))
      .catch(() => {
        setAvatars([
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&q=90&fit=crop&crop=faces&auto=format',
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&q=90&fit=crop&crop=faces&auto=format',
          'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&q=90&fit=crop&crop=faces&auto=format',
        ]);
      });
  }, []);

  return (
    <motion.div
      variants={itemVariant}
      className="glass-dark inline-flex items-center gap-2 sm:gap-3 rounded-2xl p-2.5 sm:p-3 pr-4 sm:pr-5 mt-2"
    >
      <div className="flex -space-x-3">
        {avatars.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-white/20"
          />
        ))}
        <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary-500 border-2 border-white/20 flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-white" />
        </span>
      </div>
      <div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-xs font-bold text-white ml-1">4.9</span>
        </div>
        <div className="text-[11px] font-medium text-white/60">14,200+ verified reviews</div>
      </div>
    </motion.div>
  );
};
