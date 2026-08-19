import React from 'react';
import { Stagger, StaggerItem } from '@/src/Components/ui/Reveal';
import { PopularServiceCard } from './PopularServiceCard';
import type { Trade } from '@/src/types';

interface PopularServicesGridProps {
  trades: Trade[];
}

export const PopularServicesGrid: React.FC<PopularServicesGridProps> = ({ trades }) => {
  return (
    <Stagger className="mt-8 md:mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
      {trades.map((trade, i) => (
        <StaggerItem key={trade.id} className={`h-full ${i >= 4 ? 'hidden md:block' : ''}`}>
          <PopularServiceCard trade={trade} />
        </StaggerItem>
      ))}
    </Stagger>
  );
};
