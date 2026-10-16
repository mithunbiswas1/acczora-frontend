// src/app/(pages)/marketplace/_components/MarketplaceCatalog.jsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import SearchAndCategories from "./SearchAndCategories";
import FilterSidebar from "./FilterSidebar";
import ProductResults from "./ProductResults";
import {
  products as fallbackProducts,
  categories as fallbackCategories,
  priceRanges,
  ratingOptions,
  sellerOptions,
  deliveryOptions,
  availabilityOptions,
} from "@/data";
import { useGetAllProductsQuery } from "@/redux/api/productApi";
import { useGetAllCategoriesActiveQuery } from "@/redux/api/categoryApi";

function toggleValue(list, value) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export default function MarketplaceCatalog() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  // Live queries
  const { data: apiProductsResponse, isLoading: isLoadingProducts } =
    useGetAllProductsQuery({
      limit: 100,
      is_active: "true",
    });
  const { data: apiCategoriesResponse } = useGetAllCategoriesActiveQuery();

  const categories = useMemo(() => {
    const rawList =
      apiCategoriesResponse?.data?.categories ||
      apiCategoriesResponse?.data ||
      [];
    if (Array.isArray(rawList) && rawList.length > 0) {
      return rawList.map((c) => ({
        ...c,
        id: c._id || c.id,
        name: c.name,
        slug: c.slug,
        subcategories: Array.isArray(c.subcategories) ? c.subcategories : [],
      }));
    }
    return fallbackCategories;
  }, [apiCategoriesResponse]);

  const allProducts = useMemo(() => {
    const rawList =
      apiProductsResponse?.data?.products ||
      apiProductsResponse?.data ||
      [];
    if (Array.isArray(rawList) && rawList.length > 0) {
      return rawList;
    }
    return fallbackProducts;
  }, [apiProductsResponse]);

  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
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

  // Sync category param from URL query
  useEffect(() => {
    if (categoryParam && categories.length > 0) {
      const decoded = decodeURIComponent(categoryParam).trim().toLowerCase();
      const matchedCategory = categories.find(
        (c) =>
          c.name?.toLowerCase() === decoded ||
          c.slug?.toLowerCase() === decoded ||
          c.name?.toLowerCase().replace(/[^a-z0-9]/g, "-") === decoded ||
          c.name?.toLowerCase().replace(/&/g, "and") === decoded
      );

      if (matchedCategory) {
        setActiveCategories([matchedCategory.name]);
        if (matchedCategory.subcategories?.length > 0) {
          const subIds = matchedCategory.subcategories.map(
            (s) => s._id || s.id
          );
          setActiveSubcategories(subIds);
        }
      }
    }
  }, [categoryParam, categories]);

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
      setActiveCategories((prev) =>
        prev.filter((name) => name !== categoryName)
      );
      if (categoryObj?.subcategories?.length > 0) {
        const subIdsToRemove = categoryObj.subcategories.map(
          (s) => s._id || s.id
        );
        setActiveSubcategories((prev) =>
          prev.filter((id) => !subIdsToRemove.includes(id))
        );
      }
    } else {
      setActiveCategories((prev) => [...prev, categoryName]);
      if (categoryObj?.subcategories?.length > 0) {
        const subIdsToAdd = categoryObj.subcategories.map(
          (s) => s._id || s.id
        );
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
      cat.subcategories?.some((sub) => (sub._id || sub.id) === subId)
    );

    if (isCurrentlyActive) {
      const newActiveSubs = activeSubcategories.filter((id) => id !== subId);
      setActiveSubcategories(newActiveSubs);

      if (parentCategory) {
        const hasOtherSubActive = parentCategory.subcategories.some(
          (sub) =>
            (sub._id || sub.id) !== subId &&
            newActiveSubs.includes(sub._id || sub.id)
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
    let list = allProducts;

    const q = debouncedQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((product) => {
        const prodTitle = product.title || "";
        const prodCat =
          typeof product.category === "object"
            ? product.category?.name || ""
            : product.categoryName || product.category || "";
        return (
          prodTitle.toLowerCase().includes(q) ||
          prodCat.toLowerCase().includes(q)
        );
      });
    }

    if (activeCategories.length > 0 || activeSubcategories.length > 0) {
      list = list.filter((product) => {
        const prodCat =
          typeof product.category === "object"
            ? product.category?.name || ""
            : product.categoryName || product.category || "";
        const prodSlug =
          typeof product.category === "object" ? product.category?.slug : "";

        return (
          activeCategories.includes(prodCat) ||
          activeCategories.includes(prodSlug)
        );
      });
    }

    if (activePriceRanges.length > 0) {
      list = list.filter((product) => {
        const regularPrice = Number(product.price || 0);
        const salePrice = Number(product.salePrice || product.discountPrice || 0);
        const price =
          salePrice > 0 && salePrice < regularPrice ? salePrice : regularPrice;
        return activePriceRanges.some((rangeId) => {
          const range = priceRanges.find((item) => item.id === rangeId);
          return range && price >= range.min && price <= range.max;
        });
      });
    }

    if (customMin !== "" || customMax !== "") {
      const min = customMin !== "" ? parseFloat(customMin) : 0;
      const max = customMax !== "" ? parseFloat(customMax) : Infinity;
      if (!isNaN(min) && !isNaN(max)) {
        list = list.filter((product) => {
          const regularPrice = Number(product.price || 0);
          const salePrice = Number(product.salePrice || product.discountPrice || 0);
          const price =
            salePrice > 0 && salePrice < regularPrice ? salePrice : regularPrice;
          return price >= min && price <= max;
        });
      }
    }

    if (activeRatings.length > 0) {
      list = list.filter((product) => {
        const rating = parseFloat(
          product.seller?.rating || product.rating || 5
        );
        return activeRatings.some((ratingId) => {
          const ratingOpt = ratingOptions.find((item) => item.id === ratingId);
          return ratingOpt && rating >= ratingOpt.min;
        });
      });
    }

    if (activeSellers.length > 0) {
      list = list.filter((product) =>
        activeSellers.some((sellerId) => {
          if (sellerId === "verified") return true;
          if (sellerId === "top") return Boolean(product.isBestSeller);
          return false;
        })
      );
    }

    if (activeDelivery.length > 0) {
      list = list.filter((product) =>
        activeDelivery.some(
          (deliveryId) => deliveryId === "instant" && (product.instantDelivery ?? true)
        )
      );
    }

    if (activeAvailability.length > 0) {
      list = list.filter((product) => {
        const isInStock =
          product.inStock !== undefined
            ? Boolean(product.inStock)
            : (product.stock ?? 0) > 0;
        return activeAvailability.some(
          (availabilityId) =>
            (availabilityId === "in-stock" ||
              availabilityId === "available-now") &&
            isInStock
        );
      });
    }

    const sorted = [...list];
    if (sort === "price-asc") {
      sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }
    if (sort === "price-desc") {
      sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }
    if (sort === "newest") {
      sorted.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    }

    return sorted;
  }, [
    allProducts,
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

        <div className="flex flex-col lg:flex-row gap-6 mt-8">
          {showFilters && (
            <FilterSidebar
              categories={categories}
              activeCategories={activeCategories}
              onToggleCategory={handleToggleCategory}
              activeSubcategories={activeSubcategories}
              onToggleSubcategory={handleToggleSubcategory}
              priceRanges={priceRanges}
              activePriceRanges={activePriceRanges}
              onTogglePriceRange={(id) =>
                setActivePriceRanges((prev) => toggleValue(prev, id))
              }
              customMin={customMin}
              customMax={customMax}
              onCustomMinChange={setCustomMin}
              onCustomMaxChange={setCustomMax}
              ratingOptions={ratingOptions}
              activeRatings={activeRatings}
              onToggleRating={(id) =>
                setActiveRatings((prev) => toggleValue(prev, id))
              }
              sellerOptions={sellerOptions}
              activeSellers={activeSellers}
              onToggleSeller={(id) =>
                setActiveSellers((prev) => toggleValue(prev, id))
              }
              deliveryOptions={deliveryOptions}
              activeDelivery={activeDelivery}
              onToggleDelivery={(id) =>
                setActiveDelivery((prev) => toggleValue(prev, id))
              }
              availabilityOptions={availabilityOptions}
              activeAvailability={activeAvailability}
              onToggleAvailability={(id) =>
                setActiveAvailability((prev) => toggleValue(prev, id))
              }
              activeFilterCount={activeFilterCount}
              onClearAll={clearAllFilters}
              onClose={() => setShowFilters(false)}
            />
          )}

          <ProductResults
            query={debouncedQuery}
            results={results}
            totalCount={allProducts.length}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters((prev) => !prev)}
            activeFilterCount={activeFilterCount}
            sort={sort}
            onSortChange={setSort}
            onClearFilters={clearAllFilters}
            isLoading={isLoadingProducts}
          />
        </div>
      </div>
    </section>
  );
}
