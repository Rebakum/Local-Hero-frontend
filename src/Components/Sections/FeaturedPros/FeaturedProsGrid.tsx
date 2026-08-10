import React, { useState, useEffect } from 'react';
import { getFeaturedProfessionals } from '../../../services/api';
import { ProCard } from './FeaturedProCard';
import type { Professional } from '../../../types';

export const FeaturedProsGrid: React.FC = () => {
  const [pros, setPros] = useState<Professional[]>([]);

  useEffect(() => {
    getFeaturedProfessionals()
      .then((data) => setPros(data.slice(0, 4)))
      .catch(() => setPros([]));
  }, []);

  return (
    <div className="mt-8 md:mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {pros.map((pro) => (
        <ProCard key={pro.id} pro={pro} />
      ))}
    </div>
  );
};

export default FeaturedProsGrid;