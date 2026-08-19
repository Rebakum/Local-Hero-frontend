import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import type { Trade } from '@/src/types';

interface PopularServiceCardProps {
  trade: Trade;
}

export const PopularServiceCard: React.FC<PopularServiceCardProps> = ({ trade }) => {
  const navigate = useNavigate();
  const s = (trade.featuredServices ?? [])[0];

  if (!s) return null;

  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-red-500/30 hover:shadow-card dark:border-white/10 dark:bg-navy-900 flex flex-col justify-between w-full">
      {/* Top Red Glow Accent Bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-30" />

      {/* Top Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-navy-950">
        <img
          src={s.imageUrl ?? ''}
          alt={s.title}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x250?text=Service+Image';
          }}
        />

        {/* Subtle Gradient Overlay for Text Visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />

        {/* Category Tag - Top Left */}
        <span className="absolute top-3 left-3 z-20 flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 px-2.5 py-1 text-[11px] font-semibold text-white">
         
          <span>{trade.category || 'Service'}</span>
        </span>

        {/* Price Badge - Bottom Left */}
        <span className="absolute bottom-3 left-3 z-20 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {s.estimatedPrice}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
            {s.title}
          </h3>

          <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-red-600 dark:text-red-500 shrink-0" />
            <span>{s.timeEstimate}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 mt-auto">
          <button
            onClick={() => navigate(`/services/${trade.id}`)}
            className="btn-primary w-full group/btn"
          >
            <span>View Service</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default PopularServiceCard;