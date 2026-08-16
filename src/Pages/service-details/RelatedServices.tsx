import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '../../Components/ui/Reveal';
import type { Trade } from '../../types';

interface RelatedServicesProps {
  related: Trade[];
}

export const RelatedServices: React.FC<RelatedServicesProps> = ({ related }) => {
  const navigate = useNavigate();

  if (related.length === 0) return null;

  return (
    <Reveal delay={0.2}>
      <div className="mt-20">
        <h2 className="font-heading text-2xl font-black text-navy-950 dark:text-white mb-8">
          Explore Related Services
        </h2>
        <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((t) => {
            const rs = t.featuredService;
            if (!rs) return null;

            return (
              <StaggerItem key={t.id}>
                <article
                  onClick={() => {
                    navigate(`/services/${t.id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800 flex flex-col cursor-pointer"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={rs.image}
                      alt={rs.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {rs.isEmergency && (
                      <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold text-white shadow-md">
                        24/7 Emergency
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-base font-bold text-navy-900 dark:text-white group-hover:text-primary transition-colors">
                      {rs.title}
                    </h3>
                    <p className="mt-2 text-xs text-navy-500 dark:text-navy-300 line-clamp-2 leading-relaxed">
                      {rs.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        {rs.estimatedPrice}
                      </span>
                      <span className="text-xs text-navy-500 flex items-center gap-1">
                        <Clock size={12} /> {rs.timeEstimate}
                      </span>
                    </div>

                    <div className="mt-4 pt-2">
                      <span className="flex items-center justify-center gap-2 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-full px-4 py-2.5 transition group-hover:bg-primary">
                        View Details <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Reveal>
  );
};
