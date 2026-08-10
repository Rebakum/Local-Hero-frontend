import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  reviewCount,
  size = 'sm',
  className = '',
}) => {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Star className={`${starSize} fill-amber-400 text-amber-400`} />
      <span className={`font-bold ${textSize} text-navy-950 dark:text-white`}>{rating}</span>
      {reviewCount !== undefined && (
        <span className={`${textSize} text-navy-500 dark:text-navy-400`}>({reviewCount})</span>
      )}
    </div>
  );
};
