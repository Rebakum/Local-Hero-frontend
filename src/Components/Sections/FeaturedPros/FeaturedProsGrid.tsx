import React, { useEffect } from 'react';
import { ProCard } from './FeaturedProCard';
import { useProfessionals } from '../../../Context/ProfessionalsContext';

interface FeaturedProsGridProps {
  limit?: number; // Optional limit prop
}

export const FeaturedProsGrid: React.FC<FeaturedProsGridProps> = ({ limit }) => {
  const { professionals, isLoading, refresh } = useProfessionals();

  useEffect(() => {
    if (!isLoading && professionals.length === 0) {
      refresh();
    }
  }, [isLoading, professionals.length, refresh]);

  // If limit is provided, take only that many items. Otherwise, show ALL professionals.
  const displayed = limit ? professionals.slice(0, limit) : professionals;

  if (isLoading) {
    return (
      <div className="mt-8 md:mt-12 text-center py-10">
        <p className="text-sm font-semibold text-slate-500 animate-pulse">
          Loading professionals...
        </p>
      </div>
    );
  }

  if (displayed.length === 0) {
    return (
      <div className="mt-8 md:mt-12 rounded-3xl bg-white dark:bg-navy-900 border border-navy-100 dark:border-white/10 px-6 py-14 text-center">
        <p className="font-heading text-lg font-bold text-navy-950 dark:text-white">
          No professionals yet
        </p>
        <p className="text-sm text-navy-500 dark:text-navy-400 mt-1.5">
          Newly registered professionals will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 md:mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {displayed.map((pro) => {
        const proId = pro.id || pro._id;
        return <ProCard key={proId} pro={pro} />;
      })}
    </div>
  );
};

export default FeaturedProsGrid;