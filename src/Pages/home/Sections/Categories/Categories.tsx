import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SectionTitle } from "@/src/Components/ui/SectionTitle";
import { SectionWave } from "@/src/Components/ui/SectionWave";
import { useBooking } from "@/src/Context/BookingContext";
import { getAllTrades } from "@/src/services/api";
import { TradeCategory, Trade } from "@/src/types";
import { CategoryGrid } from "./CategoryGrid";
import { TradeDetailModal } from "./TradeDetailModal";
import { ArrowRight, Grid } from "lucide-react";

export const Categories: React.FC = () => {
  const navigate = useNavigate();
  const { openBooking } = useBooking();
  const [selectedTradeDetails, setSelectedTradeDetails] = useState<any | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    getAllTrades()
      .then((data) => setTrades(data))
      .catch(() => setTrades([]));
  }, []);

  const handleOpenDetails = (trade: any) => {
    const slug = (trade?.category || trade?.id || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');
    navigate(`/services/${slug || trade?.id || 'service'}`);
  };

  const handleCloseDetails = () => {
    setSelectedTradeDetails(null);
  };

  const handleProceedToBooking = (tradeName: string) => {
    setSelectedTradeDetails(null);
    openBooking({ trade: tradeName as TradeCategory });
  };

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-cream-100 dark:bg-black section-pad border-y border-navy-100/60 dark:border-white/10"
    >
      <SectionWave />
      <div className="container-lh relative z-10">
        <SectionTitle
          badge
          eyebrow={`Trade Categories`}
          title="Find the right pro"
          subtitle="Fixed rates, DBS-checked professionals, transparent pricing and same-week availability across the UK."
        />

        <CategoryGrid
          trades={trades}
          limit={6}
          onSelectTrade={handleOpenDetails}
        />

        <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/categories")}
           className="btn btn-primary px-8 py-3.5"
          >
            <Grid className="w-4 h-4 text-primary" />
            <span>See All Categories </span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <TradeDetailModal
        trade={selectedTradeDetails}
        isOpen={!!selectedTradeDetails}
        onClose={handleCloseDetails}
        onProceedToBooking={handleProceedToBooking}
      />
    </section>
  );
};
