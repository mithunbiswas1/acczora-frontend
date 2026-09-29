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
      <div className="mb-6 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
        {/* Mobile: Count above. Desktop: Filter button + Count together */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          {/* Results summary / Count */}
          <div className="order-1 md:order-2 text-sm md:text-base font-semibold text-primary">
            {isNoResults ? (
              hasQuery ? (
                <span className="text-xs md:text-sm font-normal text-secondary">
                  No products found for{" "}
                  <span className="text-error italic font-medium">
                    &ldquo;{query}&rdquo;
                  </span>
                </span>
              ) : (
                <span className="text-xs md:text-sm font-normal text-secondary">
                  No products found.
                </span>
              )
            ) : hasQuery ? (
              <span className="text-xs md:text-sm font-normal text-secondary">
                Search results for{" "}
                <span className="font-semibold text-brand">
                  &ldquo;{query}&rdquo;
                </span>{" "}
                <span className="text-muted">
                  &bull; {results.length} product{results.length === 1 ? "" : "s"} found
                </span>
              </span>
            ) : (
              <span>24,680 Products</span>
            )}
          </div>

          {/* Action Row on Mobile (Filter on left, Sort on right) / Desktop Filter Button */}
          <div className="order-2 md:order-1 flex items-center justify-between md:justify-start gap-3">
            <button
              type="button"
              onClick={onToggleFilters}
              className={cn(
                "h-[40px] px-4 rounded-lg border border-border bg-white flex items-center justify-between gap-3 text-sm text-[#374151] hover:border-gray-400 transition-colors shadow-xs cursor-pointer select-none",
                showFilters && "border-brand/50 ring-1 ring-brand/20",
              )}
            >
              <span>Filter</span>
              <ChevronDown
                className={cn(
                  "size-4 text-muted transition-transform duration-200",
                  showFilters && "rotate-180",
                )}
              />
            </button>

            {/* Mobile-only Sort dropdown placed beside Filter */}
            <div className="md:hidden shrink-0">
              <Select
                variant="outline"
                value={sort}
                onChange={(event) => onSortChange(event.target.value)}
                options={sortOptions}
                suffix={<ChevronDown className="size-4 text-secondary" />}
              />
            </div>
          </div>
        </div>

        {/* Desktop-only Sort dropdown on right */}
        <div className="hidden md:block shrink-0">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5 xl:gap-6">
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
