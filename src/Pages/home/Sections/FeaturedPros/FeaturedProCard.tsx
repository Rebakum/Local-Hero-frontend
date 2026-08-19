import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight } from 'lucide-react';
import { Professional } from '@/src/types';
import { SaveFavouriteButton } from '@/src/Components/ui/SaveFavouriteButton';

export const ProCard: React.FC<{ pro: Professional }> = ({ pro }) => {
  const proId = pro.id || (pro as any)._id || '';
  const avatarUrl = pro.avatar || 'https://via.placeholder.com/300?text=No+Image';
  const tradeLabel =
    typeof pro.trade === 'string' ? pro.trade : (pro.trade as any)?.name || pro.companyName || 'Professional';
  const rating = pro.rating || 5.0;

  return (
    <article
      className="group relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition-all duration-300
        hover:-translate-y-1.5 hover:border-red-500/30 hover:shadow-card dark:border-white/10 dark:bg-navy-900
        flex flex-col w-full"
    >
      {/* Top Red Glow Line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-30" />

      {/* Image Container */}
      <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-slate-100 dark:bg-navy-950">
        <img
          src={avatarUrl}
          alt={pro.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-[50%_15%]
            transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300?text=No+Image';
          }}
        />

        {/* Text Legibility Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />

        {/* Rating Floating Badge */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1 rounded-full
          bg-black/40 backdrop-blur-md border border-white/15 px-2.5 py-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
          <span className="text-xs font-bold text-white">{rating}</span>
        </div>

        {/* Save to Favourites Button */}
        {proId && (
          <div className="absolute top-3 right-3 z-20">
            <SaveFavouriteButton professionalId={proId} />
          </div>
        )}

        {/* Name & Trade Info */}
        <div className="absolute bottom-3 left-3.5 sm:left-4 right-3.5 sm:right-4 z-20">
          <h3 className="font-bold text-base text-white leading-snug truncate drop-shadow-md">
            {pro.name}
          </h3>
          <p className="text-xs font-semibold text-amber-400 mt-0.5 truncate drop-shadow-md">
            {tradeLabel}
          </p>
        </div>
      </div>

      {/* Location Strip */}
      <div className="px-4 pt-3 pb-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
        <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
        <span className="truncate">{pro.location || 'N/A'}</span>
      </div>

      {/* Original Red CTA Button */}
      <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 pt-2 mt-auto">
        <Link
          to={`/professionals/${proId}`}
          className="btn-primary w-full group/btn"
        >
          <span>Visit Profile</span>
          <ArrowRight className="w-3.5 3 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default ProCard;