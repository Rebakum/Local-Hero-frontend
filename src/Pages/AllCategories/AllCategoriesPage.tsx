import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { getAllTrades } from "../../services/api";
import { CategoryCard } from "../../Components/Sections/Categories/CategoryCard";
import { SectionTitle } from "../../Components/ui/SectionTitle";
import type { Trade } from "../../types";

export const AllCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    getAllTrades()
      .then((data) => setTrades(data))
      .catch(() => setTrades([]));
  }, []);

  const handleSelectTrade = (trade: any) => {
    const slug = (trade?.slug || trade?.category || trade?.id || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');
    navigate(`/services/${slug || trade?.id || 'service'}`);
  };

  const filteredTrades = trades.filter((trade) => {
    const category = trade.category || "";
    const subtitle = trade.subtitle || "";
    const description = trade.description || "";
    const query = searchTerm.toLowerCase();

    return (
      category.toLowerCase().includes(query) ||
      subtitle.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-black pb-12 md:pb-20 mt-32">
      <div className="container-lh mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Back & Search Bar Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-8">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold text-navy-600 dark:text-navy-300 hover:text-primary transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 dark:text-navy-300" />
            <input
              type="text"
              placeholder="Search category (e.g. Plumber)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-navy-900 text-navy-950 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Section Title Section */}
        <div className="mb-10 sm:mb-12">
          <SectionTitle
            eyebrow="Categories"
            badge={true}
            align="center"
            title="Explore All Categories"
            subtitle="Browse all available professional trade services tailored for your home and office needs."
            maxWidth="max-w-3xl"
          />
        </div>

        {/* All Categories Grid */}
        {filteredTrades.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredTrades.map((trade: any, index: number) => (
              <CategoryCard
                key={trade.id || index}
                trade={trade}
                onSelect={handleSelectTrade}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-navy-900 rounded-3xl border border-neutral-200 dark:border-white/10 shadow-sm">
            <p className="text-navy-500 dark:text-navy-300 font-semibold text-sm">
              No categories found matching "{searchTerm}"
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AllCategoriesPage;
