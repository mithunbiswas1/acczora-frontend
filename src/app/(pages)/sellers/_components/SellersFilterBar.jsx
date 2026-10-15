// src/app/(pages)/seller/_components/SellersFilterBar.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Check, ChevronDown } from "lucide-react";
import { ShieldCheckIcon } from "@/icons";

export default function SellersFilterBar({
  searchQuery,
  onSearchChange,
  verifiedOnly,
  onToggleVerified,
  selectedSort,
  onSortChange,
  currentCount = 8,
  totalCount = 214,
}) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  const sortOptions = [
    { label: "Top Rated", value: "top_rated" },
    { label: "Most Sales", value: "most_sales" },
    { label: "Most Products", value: "most_products" },
    { label: "Newest", value: "newest" },
  ];

  // Close sort dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-8 pb-4">
      {/* Left: Search & Showing Counter */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-56 md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search"
            className="w-full h-10 pl-10 pr-3.5 rounded-[10px] border border-gray-200 bg-white text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#5B4DFB] focus:ring-1 focus:ring-[#5B4DFB]/30 transition-all shadow-2xs"
          />
        </div>

        {/* Showing text */}
        <span className="text-xs sm:text-sm text-gray-500 font-normal">
          Showing {currentCount} of {totalCount} sellers
        </span>
      </div>

      {/* Right: Verified Only Toggle & Sort Dropdown */}
      <div className="flex items-center gap-2.5 sm:gap-3 self-end md:self-auto">
        {/* Verified Only Button */}
        <button
          type="button"
          onClick={onToggleVerified}
          className={`h-10 px-3.5 sm:px-4 rounded-[10px] text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer shadow-2xs ${
            verifiedOnly
              ? "bg-[#F0FDF4] border border-[#10B981] text-[#15803D]"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
          }`}
        >
          <ShieldCheckIcon
            size={16}
            color={verifiedOnly ? "#16A34A" : "#9CA3AF"}
          />
          <span>Verified Only</span>
        </button>

        {/* Sort Dropdown */}
        <div className="relative" ref={sortRef}>
          <button
            type="button"
            onClick={() => setIsSortOpen((prev) => !prev)}
            className="h-10 px-3.5 sm:px-4 rounded-[10px] bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
          >
            <span>{selectedSort}</span>
            <ChevronDown
              className={`size-3.5 text-gray-500 transition-transform duration-200 ${
                isSortOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isSortOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-gray-200 rounded-[12px] shadow-lg py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onSortChange(option.label);
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${
                    selectedSort === option.label
                      ? "bg-gray-50 text-[#5B4DFB] font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{option.label}</span>
                  {selectedSort === option.label && <Check className="size-3.5 text-[#5B4DFB]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
