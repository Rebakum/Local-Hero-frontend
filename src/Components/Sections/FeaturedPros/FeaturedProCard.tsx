import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight } from 'lucide-react';

export const ProCard: React.FC<{ pro: any }> = ({ pro }) => {
  return (
    <article className="group rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 overflow-hidden hover:shadow-xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 flex flex-col justify-between w-full">
      
      {/* Top Image Section with Blur Prevention */}
      <div className="relative  w-full overflow-hidden bg-slate-100 dark:bg-navy-950 flex items-center justify-center">
        {/* Main Image with Rendering Fixes */}
        <img
          src={pro.avatar}
          alt={pro.name}
          loading="lazy"
          className="w-full h-full object-cover object-top filter brightness-105 contrast-105   group-hover:scale-105 transition-all duration-500"
          onError={(e) => {
            
            (e.target as HTMLElement).classList.remove('object-cover');
            (e.target as HTMLElement).classList.add('object-contain', 'p-4');
          }}
        />

        {/* Dark Gradient Overlay for Crisp Text Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

        {/* Name & Trade Positioned Over Image */}
        <div className="absolute bottom-3 left-3 sm:left-4 right-3 sm:right-4 text-white z-10">
          <h3 className="font-bold text-sm text-white leading-snug truncate drop-shadow-md">
            {pro.name}
          </h3>
          <p className="text-xs font-semibold text-amber-400 dark:text-amber-300 mt-0.5 truncate drop-shadow-md">
            {pro.trade}
          </p>
        </div>
      </div>

      {/* Middle Section: Rating & Location */}
      <div className="p-3.5 sm:p-4 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 gap-2">
        <span className="flex items-center gap-1 font-semibold text-slate-900 dark:text-white shrink-0">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
          {pro.rating}
        </span>
        
        <span className="flex items-center gap-1 truncate text-slate-500 dark:text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className="truncate">{pro.location}</span>
        </span>
      </div>

      {/* Bottom Visit Button */}
      <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4">
        <Link
          to={`/pros/${pro.id}`}
          className="btn btn-primary text-white w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 group/btn transition-all"
        >
          <span>Visit Profile</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>

    </article>
  );
};

export default ProCard;