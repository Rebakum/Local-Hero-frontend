import React from 'react';
import { Stagger, StaggerItem } from '../../ui/Reveal';
import { PopularServiceCard } from './PopularServiceCard';

interface Trade {
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
}

interface PopularServicesGridProps {
  trades: Trade[];
}

export const PopularServicesGrid: React.FC<PopularServicesGridProps> = ({ trades }) => {
  return (
    <Stagger className="mt-8 md:mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {trades.map((trade) => (
        <StaggerItem key={trade.id}>
          <PopularServiceCard trade={trade} />
        </StaggerItem>
      ))}
    </Stagger>
  );
};
