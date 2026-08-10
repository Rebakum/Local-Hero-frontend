import React from 'react';

interface PriceTagProps {
  price: string;
  className?: string;
}

export const PriceTag: React.FC<PriceTagProps> = ({ price, className = '' }) => (
  <span className={`rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ${className}`}>
    {price}
  </span>
);
