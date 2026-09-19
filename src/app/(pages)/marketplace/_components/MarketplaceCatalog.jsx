// src/app/(pages)/marketplace/_components/MarketplaceCatalog.jsx

"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import SearchAndCategories from "./SearchAndCategories";
import FilterSidebar from "./FilterSidebar";
import ProductResults from "./ProductResults";
import {
  products,
  categories,
  priceRanges,
  ratingOptions,
  sellerOptions,
  deliveryOptions,
  availabilityOptions,
} from "./marketplaceData";

function toggleValue(list, value) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export default function MarketplaceCatalog() {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState("popular");

  const [activeCategories, setActiveCategories] = useState([]);
  const [activeSubcategories, setActiveSubcategories] = useState([]);
  const [activePriceRanges, setActivePriceRanges] = useState([]);
  const [activeRatings, setActiveRatings] = useState([]);
  const [activeSellers, setActiveSellers] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState([]);
  const [activeAvailability, setActiveAvailability] = useState([]);

  const debouncedQuery = useDebounce(query, 300);

  const activeFilterCount =
    activeCategories.length +
    activeSubcategories.length +
    activePriceRanges.length +
    activeRatings.length +
    activeSellers.length +
    activeDelivery.length +
    activeAvailability.length;

  const results = useMemo(() => {
    let list = products;

    const q = debouncedQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (product) =>
          product.title.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q),
      );
    }

    if (activeCategories.length > 0) {
      list = list.filter((product) => activeCategories.includes(product.category));
    }

    if (activeSubcategories.length > 0) {
      const activeSubcategoryPairs = activeSubcategories
        .map((subId) => {
          for (const category of categories) {
            const sub = category.subcategories.find((item) => item.id === subId);
            if (sub) return { categoryName: category.name, subName: sub.name };
          }
          return null;
        })
        .filter(Boolean);

      list = list.filter((product) =>
        activeSubcategoryPairs.some(
          (pair) => pair.categoryName === product.category && pair.subName === product.subcategory,
        ),
      );
    }

    if (activePriceRanges.length > 0) {
      list = list.filter((product) =>
        activePriceRanges.some((rangeId) => {
          const range = priceRanges.find((item) => item.id === rangeId);
          return range && product.price >= range.min && product.price <= range.max;
        }),
      );
    }

    if (activeRatings.length > 0) {
      list = list.filter((product) =>
        activeRatings.some((ratingId) => {
          const rating = ratingOptions.find((item) => item.id === ratingId);
          return rating && parseFloat(product.seller.rating) >= rating.min;
        }),
      );
    }

    if (activeSellers.length > 0) {
      list = list.filter((product) =>
        activeSellers.some((sellerId) => {
          if (sellerId === "verified") return product.seller.verified;
          if (sellerId === "top") return product.isBestSeller;
          return false;
        }),
      );
    }

    if (activeDelivery.length > 0) {
      list = list.filter((product) =>
        activeDelivery.some((deliveryId) => deliveryId === "instant" && product.instantDelivery),
      );
    }

    if (activeAvailability.length > 0) {
      list = list.filter((product) =>
        activeAvailability.some(
          (availabilityId) =>
            (availabilityId === "in-stock" || availabilityId === "available-now") &&
            product.inStock,
        ),
      );
    }

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "newest") sorted.reverse();

    return sorted;
  }, [
    debouncedQuery,
    activeCategories,
    activeSubcategories,
    activePriceRanges,
    activeRatings,
    activeSellers,
    activeDelivery,
    activeAvailability,
    sort,
  ]);

  function clearAllFilters() {
    setActiveCategories([]);
    setActiveSubcategories([]);
    setActivePriceRanges([]);
    setActiveRatings([]);
    setActiveSellers([]);
    setActiveDelivery([]);
    setActiveAvailability([]);
    setQuery("");
  }

  return (
    <section className="w-full py-8 md:py-10">
      <div className="site-container">
        <SearchAndCategories
          query={query}
          onQueryChange={setQuery}
          categories={categories}
          activeCategories={activeCategories}
          onToggleCategory={(name) => setActiveCategories((prev) => toggleValue(prev, name))}
          onClearCategories={() => setActiveCategories([])}
          activeSubcategories={activeSubcategories}
          onToggleSubcategory={(id) => setActiveSubcategories((prev) => toggleValue(prev, id))}
        />

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {showFilters && (
            <FilterSidebar
              categories={categories}
              activeCategories={activeCategories}
              onToggleCategory={(name) => setActiveCategories((prev) => toggleValue(prev, name))}
              activeSubcategories={activeSubcategories}
              onToggleSubcategory={(id) => setActiveSubcategories((prev) => toggleValue(prev, id))}
              priceRanges={priceRanges}
              activePriceRanges={activePriceRanges}
              onTogglePriceRange={(id) => setActivePriceRanges((prev) => toggleValue(prev, id))}
              ratingOptions={ratingOptions}
              activeRatings={activeRatings}
              onToggleRating={(id) => setActiveRatings((prev) => toggleValue(prev, id))}
              sellerOptions={sellerOptions}
              activeSellers={activeSellers}
              onToggleSeller={(id) => setActiveSellers((prev) => toggleValue(prev, id))}
              deliveryOptions={deliveryOptions}
              activeDelivery={activeDelivery}
              onToggleDelivery={(id) => setActiveDelivery((prev) => toggleValue(prev, id))}
              availabilityOptions={availabilityOptions}
              activeAvailability={activeAvailability}
              onToggleAvailability={(id) => setActiveAvailability((prev) => toggleValue(prev, id))}
              activeFilterCount={activeFilterCount}
              onClearAll={clearAllFilters}
            />
          )}

          <ProductResults
            query={debouncedQuery}
            results={results}
            totalCount={products.length}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters((prev) => !prev)}
            activeFilterCount={activeFilterCount}
            sort={sort}
            onSortChange={setSort}
            onClearFilters={clearAllFilters}
          />
        </div>
      </div>
    </section>
  );
}
