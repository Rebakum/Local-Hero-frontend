import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight, BadgeCheck } from 'lucide-react';
import { Professional } from '@/src/types';
import { SaveFavouriteButton } from '@/src/Components/ui/SaveFavouriteButton';

export const ProCard: React.FC<{ pro: Professional }> = ({ pro }) => {
  const proId = pro.id || (pro as any)._id || '';
  const avatarUrl = pro.avatar || 'https://via.placeholder.com/300?text=No+Image';
  const tradeLabel =
    typeof pro.trade === 'string' ? pro.trade : (pro.trade as any)?.name || pro.companyName || 'Professional';
  const rating = pro.rating || 5.0;
  const isTopRated = Number(rating) >= 4.8;

  return (
    <article
      className="group relative rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900
        overflow-hidden flex flex-col w-full transition-all duration-500
        hover:-translate-y-1 hover:shadow-[0_20px_45px_-15px_rgba(220,38,38,0.35)] hover:border-red-500/50 dark:hover:border-red-500/40"
    >
      {/* Image Stage — photo fills the frame, no empty gaps */}
      <div className="relative w-full h-56 sm:h-60 overflow-hidden bg-slate-950">
        <img
          src={avatarUrl}
          alt={pro.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-top
            transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300?text=No+Image';
          }}
        />

        {/* Gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/0 z-10 pointer-events-none" />

        {/* Rating — floating glass badge, top-left */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1 rounded-full
          bg-black/50 backdrop-blur-md border border-white/10 px-2.5 py-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
          <span className="text-xs font-bold text-white">{rating}</span>
        </div>

        {/* Save to favourites — floating heart, top-right */}
        {proId && (
          <div className="absolute top-3 right-3 z-20">
            <SaveFavouriteButton professionalId={proId} />
          </div>
        )}

       

        {/* Name & Trade over the image */}
        <div className="absolute bottom-3 left-3.5 sm:left-4 right-3.5 sm:right-4 z-20">
          <h3 className="font-bold text-base text-white leading-snug truncate drop-shadow-md">
            {pro.name}
          </h3>
          <p className="text-xs font-semibold text-amber-400 mt-0.5 truncate drop-shadow-md">
            {tradeLabel}
          </p>
        </div>
      </div>

      {/* Location strip */}
      <div className="px-4 pt-3 pb-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
        <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
        <span className="truncate">{pro.location || 'N/A'}</span>
      </div>

      {/* CTA */}
      <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 pt-2">
        <Link
          to={`/professionals/${proId}`}
          className="relative overflow-hidden bg-red-600 text-white w-full py-2.5 px-4 rounded-full font-semibold text-xs
            flex items-center justify-center gap-2 group/btn transition-all duration-300 shadow-md
            hover:shadow-lg hover:shadow-red-600/30 hover:bg-red-700"
        >
          <span>Visit Profile</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default ProCard;