import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";
import { getAllTrades } from "../../services/api";
import { CategoryCard } from "../home/Sections/Categories/CategoryCard";
import { SectionTitle } from "../../Components/ui/SectionTitle";
import { Pagination } from "../../Components/ui/Pagination";
import { FilterSidebar, type FilterOption } from "../../Components/ui/FilterSidebar";
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

export const AllCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  useEffect(() => {
    getAllTrades()
      .then((data) => setTrades(data))
      .catch(() => setTrades([]));
  }, []);

  const categoryOptions: FilterOption[] = useMemo(() => {
    const map = new Map<string, FilterOption>();
    for (const trade of trades) {
      const key = trade.category || "Other";
      const existing = map.get(key);
      if (existing) {
        existing.count = (existing.count ?? 0) + 1;
      } else {
        map.set(key, {
          value: key,
          label: key,
          iconName: trade.iconName,
          count: 1,
        });
      }
    }
    return Array.from(map.values());
  }, [trades]);

  const handleSelectTrade = (trade: any) => {
    const slug = (trade?.slug || trade?.category || trade?.id || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');
    navigate(`/services/${slug || trade?.id || 'service'}`);
  };

  const filteredTrades = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    let list = trades;

    if (activeCategory) {
      list = list.filter((trade) => (trade.category || "Other") === activeCategory);
    }

    if (query) {
      list = list.filter((trade) => {
        const category = trade.category || "";
        const subtitle = trade.subtitle || "";
        const description = trade.description || "";
        return (
          category.toLowerCase().includes(query) ||
          subtitle.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query)
        );
      });
    }

    const sorted = [...list];
    switch (sortBy) {
      case "name-asc":
        sorted.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
        break;
      case "name-desc":
        sorted.sort((a, b) => (b.category || "").localeCompare(a.category || ""));
        break;
      case "popular":
        sorted.sort((a, b) => (b.activeProsCount ?? 0) - (a.activeProsCount ?? 0));
        break;
      case "price-asc":
        sorted.sort(
          (a, b) =>
            parsePrice(a.startingPrice ?? a.avgHourlyRate) -
            parsePrice(b.startingPrice ?? b.avgHourlyRate)
        );
        break;
      case "price-desc":
        sorted.sort(
          (a, b) =>
            parsePrice(b.startingPrice ?? b.avgHourlyRate) -
            parsePrice(a.startingPrice ?? a.avgHourlyRate)
        );
        break;
      default:
        sorted.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    }

    return sorted;
  }, [trades, activeCategory, searchTerm, sortBy]);

  const pagedTrades = filteredTrades.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-black pb-12 md:pb-20 mt-32">
      <div className="container-lh mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-navy-600 dark:text-navy-300 hover:text-primary transition-colors w-fit my-8"
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

        {/* Left filter / Middle search / Right sort */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          <FilterSidebar
            title="Categories"
            options={categoryOptions}
            totalCount={filteredTrades.length}
            allLabel="All Categories"
            active={activeCategory}
            onSelect={(v) => {
              setActiveCategory(v);
              setPage(1);
            }}
            hasActiveFilters={searchTerm.trim() !== "" || activeCategory !== null}
            onClear={() => {
              setSearchTerm("");
              setActiveCategory(null);
            }}
          />

          <div>
            <FilterToolbar
              resultCount={filteredTrades.length}
              resultLabel="categories"
              singularLabel="category"
              searchQuery={searchTerm}
              onSearchChange={(v) => {
                setSearchTerm(v);
                setPage(1);
              }}
              searchPlaceholder="Search category (e.g. Plumber)..."
              sortBy={sortBy}
              onSortChange={(v) => {
                setSortBy(v);
                setPage(1);
              }}
              sortOptions={SORT_OPTIONS}
            />

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
              <div className="mt-6 text-center py-16 bg-white dark:bg-navy-900 rounded-3xl border border-neutral-200 dark:border-white/10 shadow-sm">
                <SearchX size={28} className="mx-auto text-primary" />
                <p className="mt-4 text-navy-500 dark:text-navy-300 font-semibold text-sm">
                  No categories found matching "{searchTerm}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCategoriesPage;
