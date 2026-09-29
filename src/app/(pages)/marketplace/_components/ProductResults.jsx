// src/app/(pages)/marketplace/_components/ProductResults.jsx

"use client";

import { ChevronDown } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import EmptyState from "@/components/shared/EmptyState";
import Select from "@/components/ui/Select";
import { cn } from "@/lib/cn";
import { sortOptions } from "./marketplaceData";

export default function ProductResults({
  query,
  results,
  totalCount,
  showFilters,
  onToggleFilters,
  activeFilterCount,
  sort,
  onSortChange,
  onClearFilters,
}) {
  const hasQuery = query.trim().length > 0;
  const isNoResults = results.length === 0;

  return (
    <div className="flex-1 min-w-0">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Filter toggle button matching Image 1 */}
          <button
            type="button"
            onClick={onToggleFilters}
            className={cn(
              "w-44 px-3.5 py-2 rounded-lg border border-[#E5E7EB] bg-white flex items-center justify-between text-sm text-[#374151] hover:border-gray-400 transition-colors shadow-xs cursor-pointer select-none",
              showFilters && "border-[#6658FF]/50 ring-1 ring-[#6658FF]/20",
            )}
          >
            <div className="flex items-center gap-2">
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#2563EB] text-white text-[10px] font-semibold leading-none">
                  {String(activeFilterCount).padStart(2, "0")}
                </span>
              )}
            </div>
            <ChevronDown
              className={cn(
                "size-4 text-[#9CA3AF] transition-transform duration-200",
                showFilters && "rotate-180",
              )}
            />
          </button>

          {/* Results summary / Not found message matching Image 1 */}
          <p className="text-xs md:text-sm text-[#4B5563]">
            {isNoResults ? (
              hasQuery ? (
                <>
                  No products found for{" "}
                  <span className="text-[#E11D48] italic font-medium">
                    &ldquo;{query}&rdquo;
                  </span>
                  . Try a different keyword or browse our categories.
                </>
              ) : (
                "No products found. Try removing some filters or adjusting your selection."
              )
            ) : hasQuery ? (
              <>
                Search results for{" "}
                <span className="font-semibold text-[#6658FF]">
                  &ldquo;{query}&rdquo;
                </span>{" "}
                <span className="text-[#9CA3AF]">
                  &bull; {results.length} product{results.length === 1 ? "" : "s"} found
                </span>
              </>
            ) : (
              <span className="text-[#9CA3AF]">{totalCount} Products</span>
            )}
          </p>
        </div>

        {/* Sort dropdown */}
        <div className="shrink-0">
          <Select
            variant="outline"
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            options={sortOptions}
            suffix={<ChevronDown className="size-4 text-secondary" />}
          />
        </div>
      </div>

      {/* Results or Empty State */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              href={`/${product.slug || product.id}`}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          variant="search"
          title="No products found"
          description="Try removing some filters or adjusting your search."
          actions={[
            {
              label: "Clear all Filters",
              onClick: onClearFilters,
              variant: "outline",
            },
            {
              label: "Browse all Products",
              onClick: onClearFilters,
              variant: "solid",
            },
          ]}
        />
      )}
    </div>
  );
}
