// src/app/(pages)/sellers/_components/SellersListContainer.jsx

"use client";

import { useState, useMemo } from "react";
import SellersFilterBar from "./SellersFilterBar";
import SellerCard from "@/components/shared/SellerCard";
import { useGetAllStoresQuery } from "@/redux/api/storeApi";

export default function SellersListContainer({ initialSellers = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Top Rated");

  const { data: storesResponse, isLoading } = useGetAllStoresQuery({
    search: searchQuery,
  });

  const allSellers = useMemo(() => {
    const apiStores = storesResponse?.data?.stores;
    if (Array.isArray(apiStores) && apiStores.length > 0) {
      return apiStores;
    }
    return initialSellers;
  }, [storesResponse, initialSellers]);

  // Filter and sort sellers
  const filteredSellers = useMemo(() => {
    return allSellers
      .filter((seller) => {
        // Verified filter
        const isVerified = seller.isVerified !== undefined ? seller.isVerified : seller.verified;
        if (verifiedOnly && !isVerified) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const sellerName = (seller.name || seller.shopName || seller.fullName || "").toLowerCase();
          const sellerSlug = (seller.slug || seller.shopSlug || "").toLowerCase();
          if (!sellerName.includes(q) && !sellerSlug.includes(q)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const ratingA = Number(a.rating || 5);
        const ratingB = Number(b.rating || 5);
        if (selectedSort === "Top Rated") {
          return ratingB - ratingA;
        }
        if (selectedSort === "Most Sales") {
          return (b.totalProducts || 0) - (a.totalProducts || 0);
        }
        if (selectedSort === "Newest") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        return 0;
      });
  }, [allSellers, searchQuery, verifiedOnly, selectedSort]);

  return (
    <div>
      {/* Top Filter and Controls Bar */}
      <SellersFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        verifiedOnly={verifiedOnly}
        onToggleVerified={() => setVerifiedOnly((prev) => !prev)}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        currentCount={filteredSellers.length}
        totalCount={allSellers.length}
      />

      {/* Grid of Sellers */}
      {filteredSellers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-4">
          {filteredSellers.map((seller) => (
            <SellerCard
              key={seller._id || seller.id}
              seller={seller}
              href={`/store/${seller.slug || seller.shopSlug || "nova-store"}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-gray-50/50 rounded-[20px] border border-gray-200 mt-6">
          <p className="text-base font-semibold text-gray-800">No sellers found</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Try adjusting your search query or removing the verified filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setVerifiedOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-[#5B4DFB] text-white text-xs sm:text-sm font-medium rounded-[8px] hover:bg-[#4d3fe6] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
