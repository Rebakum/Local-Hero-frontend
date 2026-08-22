import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";
import { getAllTrades } from "../../services/api";
import { CategoryCard } from "../home/Sections/Categories/CategoryCard";
import { SectionTitle } from "../../Components/ui/SectionTitle";
import { Pagination } from "../../Components/ui/Pagination";
import { FilterToolbar, type SortOption } from "../../Components/ui/FilterToolbar";
import type { Trade } from "../../types";

const SORT_OPTIONS: SortOption[] = [
  { value: "featured", label: "Featured" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
];

const parsePrice = (value?: string): number => {
  if (!value) return Number.MAX_SAFE_INTEGER;
  const match = value.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : Number.MAX_SAFE_INTEGER;
};

const searchableText = (trade: Trade): string => {
  const fs = trade.featuredServices?.[0];
  return [
    trade.id,
    trade.category,
    trade.subtitle,
    trade.iconUrl,
    trade.description,
    trade.avgHourlyRate,
    trade.badge,
    ...(trade.popularTasks ?? []),
    fs?.title,
    fs?.description,
    ...((fs?.popularFor as string[] | undefined) ?? []),
    fs?.estimatedPrice,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

export const AllCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

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

  const filteredTrades = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    let list = query
      ? trades.filter((trade) => searchableText(trade).includes(query))
      : [...trades];

    switch (sortBy) {
      case "name-asc":
        list.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
        break;
      case "name-desc":
        list.sort((a, b) => (b.category || "").localeCompare(a.category || ""));
        break;
      case "popular":
        list.sort((a, b) => (b.activeProsCount ?? 0) - (a.activeProsCount ?? 0));
        break;
      case "price-asc":
        list.sort(
          (a, b) => parsePrice(a.avgHourlyRate) - parsePrice(b.avgHourlyRate)
        );
        break;
      case "price-desc":
        list.sort(
          (a, b) => parsePrice(b.avgHourlyRate) - parsePrice(a.avgHourlyRate)
        );
        break;
      default:
        list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    }

    return list;
  }, [trades, searchTerm, sortBy]);

  const pagedTrades = filteredTrades.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-black pb-12 md:pb-20 page-top">
      <div className="container-lh">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-navy-800 dark:text-navy-300 hover:text-primary transition-colors w-fit my-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        {/* Section Title */}
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

        {/* Search + Sort */}
        <div className="mx-auto max-w-4xl">
          <FilterToolbar
            resultCount={filteredTrades.length}
            resultLabel="categories"
            singularLabel="category"
            searchQuery={searchTerm}
            onSearchChange={(v) => {
              setSearchTerm(v);
              setPage(1);
            }}
            searchPlaceholder="Search all fields (e.g. Plumber, £85/hr, boiler)..."
            sortBy={sortBy}
            onSortChange={(v) => {
              setSortBy(v);
              setPage(1);
            }}
            sortOptions={SORT_OPTIONS}
          />
        </div>

        {/* Results Grid */}
        {filteredTrades.length > 0 ? (
          <>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {pagedTrades.map((trade: any, index: number) => (
                <CategoryCard
                  key={trade.id || index}
                  trade={trade}
                  onSelect={handleSelectTrade}
                />
              ))}
            </div>

            <Pagination
              page={page}
              pageSize={PAGE_SIZE}
              total={filteredTrades.length}
              onPageChange={setPage}
            />
          </>
        ) : (
          <div className="mt-6 group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white px-6 py-16 shadow-soft transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-card dark:border-white/10 dark:bg-navy-900 dark:hover:border-primary/40 dark:hover:bg-navy-800 text-center">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <SearchX size={28} className="mx-auto text-primary" />
            <p className="mt-4 text-navy-800 dark:text-navy-300 font-semibold text-sm">
              No categories found matching "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCategoriesPage;
