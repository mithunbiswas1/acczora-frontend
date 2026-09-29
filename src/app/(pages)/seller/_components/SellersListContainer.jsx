// src/app/(pages)/seller/_components/SellersListContainer.jsx
"use client";

import { useState, useMemo } from "react";
import SellersFilterBar from "./SellersFilterBar";
import SellerCard from "@/components/shared/SellerCard";

export default function SellersListContainer({ initialSellers = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [selectedSort, setSelectedSort] = useState("Top Rated");

  // Filter and sort sellers
  const filteredSellers = useMemo(() => {
    return initialSellers
      .filter((seller) => {
        // Verified filter
        if (verifiedOnly && !seller.isVerified) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = seller.name.toLowerCase().includes(q);
          const matchesPlatform = seller.platforms?.some((p) =>
            p.name.toLowerCase().includes(q)
          );
          if (!matchesName && !matchesPlatform) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (selectedSort === "Top Rated") {
          return b.rating - a.rating;
        }
        if (selectedSort === "Most Sales") {
          return b.id - a.id;
        }
        if (selectedSort === "Newest") {
          return b.id - a.id;
        }
        return 0;
      });
  }, [initialSellers, searchQuery, verifiedOnly, selectedSort]);

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
        totalCount={214}
      />

      {/* Grid of Sellers */}
      {filteredSellers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mt-4">
          {filteredSellers.map((seller) => (
            <SellerCard
              key={seller.id}
              seller={seller}
              href={`/seller/${seller.slug || "nova-store"}`}
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
