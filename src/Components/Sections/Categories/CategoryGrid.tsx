import React from "react";
import { Stagger, StaggerItem } from "../../ui/Reveal";
import { CategoryCard } from "./CategoryCard";

interface CategoryGridProps {
  trades: any[];
  onSelectTrade: (trade: any) => void;
  limit?: number;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ 
  trades, 
  onSelectTrade,
  limit = 6 // ডিফল্টভাবে ৬টি আইটেম লিমিট রাখা হলো
}) => {
  const displayedTrades = limit ? trades.slice(0, limit) : trades;

  return (
    // grid-cols-2 থেকে মাঝারি ও বড় স্ক্রিনে grid-cols-4 সেট করা হয়েছে
    <Stagger className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 justify-center items-stretch">
      {displayedTrades.map((trade: any, index: number) => (
        <StaggerItem key={trade.id || index}>
          <CategoryCard trade={trade} onSelect={onSelectTrade} />
        </StaggerItem>
      ))}
    </Stagger>
  );
};