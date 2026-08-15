import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';

interface PopularServiceCardProps {
  trade: {
    id: string;
    featuredService?: {
      image: string;
      title: string;
      description: string;
      estimatedPrice: string;
      timeEstimate: string;
      included: string[];
      isEmergency?: boolean;
    };
  };
}

export const PopularServiceCard: React.FC<PopularServiceCardProps> = ({ trade }) => {
  const navigate = useNavigate();
  const s = trade.featuredService;

  if (!s) return null;

  return (
    <article className="group rounded-2xl bg-white dark:bg-navy-800 overflow-hidden flex flex-col justify-between w-full h-full shadow-lg border border-neutral-200 transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl dark:border-white/10">
      
      {/* Top Image Container - object-top ব্যবহার করা হয়েছে যেন ওপরের অংশ না কাটে */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-navy-950">
        <img
          src={s.image}
          alt={s.title}
          loading="lazy"
          className="w-full h-full object-cover object-top [image-rendering:-webkit-optimize-contrast] group-hover:scale-105 transition-transform duration-500"
        />

        {/* Price Badge */}
        <span className="absolute bottom-3 left-3 bg-navy-950/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
          {s.estimatedPrice}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
            {s.title}
          </h3>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{s.timeEstimate}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate(`/services/${trade.id}`)}
          className="mt-4 btn btn-primary text-white w-full py-2.5 px-4 rounded-full font-semibold text-xs flex items-center justify-center gap-2 group/btn transition-all"
        >
          <span>View Service</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

    </article>
  );
};