import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowUpRight, Wrench } from 'lucide-react';
import type { Trade } from '../../types';

interface ServiceCardProps {
  trade: Trade;
  date?: string;
  author?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ 
  trade, 
  date = "Oct 11, 2025", 
  author = "John Dukes" 
}) => {
  const navigate = useNavigate();
  const s = trade.featuredService;

  if (!s) return null;

  return (
    <article
      onClick={() => navigate(`/services/${trade.id}`)}
      className="group cursor-pointer rounded-2xl bg-slate-50 dark:bg-navy-900 p-4 transition-all duration-300 hover:shadow-lg border border-slate-200/60 dark:border-white/10 flex flex-col justify-between w-full"
    >
      {/* 1. Top Meta Header (Date & Author) */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 px-1">
       
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">{author}</span>
        </div>
      </div>

      {/* 2. Main Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-200 dark:bg-navy-950">
        <img
          src={s.image}
          alt={s.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* 3. Title Section (Bold Uppercase) */}
      <div className="mt-4 mb-3">
        <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white uppercase leading-snug line-clamp-2">
          {s.title}
        </h3>
      </div>

      {/* 4. Bottom Read More / View Link */}
      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors"
        >
          <span>Read More</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </article>
  );
};

export default ServiceCard;