// src/app/(pages)/marketplace/_components/MarketplaceCatalog.jsx

"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [showFilters, setShowFilters] = useState(true);
  const [sort, setSort] = useState("popular");

  // Default: All Products is selected (empty activeCategories)
  const [activeCategories, setActiveCategories] = useState([]);
  const [activeSubcategories, setActiveSubcategories] = useState([]);
  const [activePriceRanges, setActivePriceRanges] = useState([]);
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");
  const [activeRatings, setActiveRatings] = useState([]);
  const [activeSellers, setActiveSellers] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState([]);
  const [activeAvailability, setActiveAvailability] = useState([]);

  // Mobile check: close overlay by default on small viewports
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setShowFilters(false);
    }
  }, []);

  const debouncedQuery = useDebounce(query, 300);

  const activeFilterCount =
    activeCategories.length +
    activePriceRanges.length +
    (customMin || customMax ? 1 : 0) +
    activeRatings.length +
    activeSellers.length +
    activeDelivery.length +
    activeAvailability.length;

  function handleToggleCategory(categoryName) {
    const isCurrentlyActive = activeCategories.includes(categoryName);
    const categoryObj = categories.find((c) => c.name === categoryName);

    if (isCurrentlyActive) {
      // Unselect category -> unselect all its subcategories
      setActiveCategories((prev) => prev.filter((name) => name !== categoryName));
      if (categoryObj?.subcategories?.length > 0) {
        const subIdsToRemove = categoryObj.subcategories.map((s) => s.id);
        setActiveSubcategories((prev) =>
          prev.filter((id) => !subIdsToRemove.includes(id))
        );
      }
    } else {
      // Select category -> default select all its subcategories
      setActiveCategories((prev) => [...prev, categoryName]);
      if (categoryObj?.subcategories?.length > 0) {
        const subIdsToAdd = categoryObj.subcategories.map((s) => s.id);
        setActiveSubcategories((prev) => {
          const set = new Set([...prev, ...subIdsToAdd]);
          return Array.from(set);
        });
      }
    }
  }

  function handleToggleSubcategory(subId) {
    const isCurrentlyActive = activeSubcategories.includes(subId);
    const parentCategory = categories.find((cat) =>
      cat.subcategories?.some((sub) => sub.id === subId)
    );

    if (isCurrentlyActive) {
      const newActiveSubs = activeSubcategories.filter((id) => id !== subId);
      setActiveSubcategories(newActiveSubs);

      if (parentCategory) {
        const hasOtherSubActive = parentCategory.subcategories.some(
          (sub) => sub.id !== subId && newActiveSubs.includes(sub.id)
        );
        if (!hasOtherSubActive) {
          setActiveCategories((prev) =>
            prev.filter((name) => name !== parentCategory.name)
          );
        }
      }
    } else {
      setActiveSubcategories((prev) => [...prev, subId]);
      if (parentCategory && !activeCategories.includes(parentCategory.name)) {
        setActiveCategories((prev) => [...prev, parentCategory.name]);
      }
    }
  }

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

    if (activeCategories.length > 0 || activeSubcategories.length > 0) {
      const activeSubcategoryPairs = activeSubcategories
        .map((subId) => {
          for (const category of categories) {
            const sub = category.subcategories?.find((item) => item.id === subId);
            if (sub) return { categoryName: category.name, subName: sub.name };
          }
          return null;
        })
        .filter(Boolean);

      const categoriesWithActiveSubs = new Set(
        activeSubcategoryPairs.map((p) => p.categoryName),
      );

      list = list.filter((product) => {
        if (categoriesWithActiveSubs.has(product.category)) {
          return activeSubcategoryPairs.some(
            (p) => p.categoryName === product.category && p.subName === product.subcategory,
          );
        }
        return activeCategories.includes(product.category);
      });
    }

    if (activePriceRanges.length > 0) {
      list = list.filter((product) =>
        activePriceRanges.some((rangeId) => {
          const range = priceRanges.find((item) => item.id === rangeId);
          return range && product.price >= range.min && product.price <= range.max;
        }),
      );
    }

    if (customMin !== "" || customMax !== "") {
      const min = customMin !== "" ? parseFloat(customMin) : 0;
      const max = customMax !== "" ? parseFloat(customMax) : Infinity;
      if (!isNaN(min) && !isNaN(max)) {
        list = list.filter((product) => product.price >= min && product.price <= max);
      }
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
    customMin,
    customMax,
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
    setCustomMin("");
    setCustomMax("");
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
          onToggleCategory={handleToggleCategory}
          onClearCategories={() => {
            setActiveCategories([]);
            setActiveSubcategories([]);
          }}
          activeSubcategories={activeSubcategories}
          onToggleSubcategory={handleToggleSubcategory}
        />

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {showFilters && (
            <FilterSidebar
              categories={categories}
              activeCategories={activeCategories}
              onToggleCategory={handleToggleCategory}
              activeSubcategories={activeSubcategories}
              onToggleSubcategory={handleToggleSubcategory}
              priceRanges={priceRanges}
              activePriceRanges={activePriceRanges}
              onTogglePriceRange={(id) => setActivePriceRanges((prev) => toggleValue(prev, id))}
              customMin={customMin}
              customMax={customMax}
              onCustomMinChange={setCustomMin}
              onCustomMaxChange={setCustomMax}
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
              onClose={() => setShowFilters(false)}
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
