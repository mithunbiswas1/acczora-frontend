// src/app/(pages)/marketplace/_components/ProductResults.jsx

"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import EmptyState from "@/components/shared/EmptyState";
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
  const ChevronIcon = showFilters ? ChevronUp : ChevronDown;

  return (
    <div className="flex-1 min-w-0">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onToggleFilters}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer",
              showFilters
                ? "border-brand text-brand bg-brand/5"
                : "border-border text-secondary hover:border-primary",
            )}
          >
            Filter
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-brand text-white text-[10px] font-semibold">
                {String(activeFilterCount).padStart(2, "0")}
              </span>
            )}
            <ChevronIcon className="size-4" />
          </button>

          <p className="text-sm text-secondary">
            {hasQuery ? (
              <>
                Search results for{" "}
                <span className="font-semibold text-brand">
                  &ldquo;{query}&rdquo;
                </span>{" "}
                <span className="text-tertiary">
                  &bull; {results.length} product{results.length === 1 ? "" : "s"} found
                </span>
              </>
            ) : (
              <span className="text-tertiary">{totalCount} Products</span>
            )}
          </p>
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            className="appearance-none pl-4 pr-9 py-2 rounded-lg border border-border bg-white text-sm text-primary outline-none focus:ring-1 focus:ring-brand cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-secondary" />
        </div>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              href={`/products/${product.id}`}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          variant="empty"
          title="No products found"
          description={
            hasQuery
              ? `We couldn't find anything for "${query}". Try a different keyword or browse our categories.`
              : "Try removing some filters or adjusting your search."
          }
          actions={[
            {
              label: "Clear all Filters",
              onClick: onClearFilters,
              variant: "outline-secondary",
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
