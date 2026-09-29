// src/app/(pages)/marketplace/_components/FilterSidebar.jsx

"use client";

import { useEffect, useState } from "react";
import { Star, ChevronRight, ChevronDown, CircleX, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import SubcategoryList from "./SubcategoryList";

const CATEGORY_COUNTS = {
  "Social Media": 120,
  Email: 380,
  Gaming: 50,
  Streaming: 220,
  "Software & Apps": 100,
  "AI Tools": 20,
  Business: 110,
  Developer: 40,
  "E-commerce": 150,
  "Crypto & Web3": 80,
  Education: 200,
  Productivity: 100,
};

function toggleValue(list, value) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

function FilterCheckbox({ checked, onChange, id }) {
  return (
    <button
      type="button"
      id={id}
      role="checkbox"
      aria-checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={cn(
        "size-[18px] shrink-0 rounded-[4px] flex items-center justify-center transition-all cursor-pointer",
        checked
          ? "bg-[#2563EB] border border-[#2563EB] text-white"
          : "bg-white border border-[#9CA3AF] text-[#9CA3AF] hover:border-gray-500",
      )}
    >
      <Check
        className={cn(
          "size-3",
          checked ? "stroke-[2.8] text-white" : "stroke-[2] text-[#9CA3AF]",
        )}
      />
    </button>
  );
}

function SectionHeader({ title, count = "03", totalCount, isOpen, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className="flex items-center justify-between cursor-pointer select-none py-1 group"
    >
      <div className="flex items-center gap-2">
        <span className="text-[14px] font-semibold text-[#1F2937] tracking-tight">
          {title}
        </span>
        <span className="px-2 py-0.5 rounded-full bg-[#EBF3FE] text-[#2563EB] text-[11px] font-semibold leading-none">
          {count}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {totalCount !== undefined && (
          <span className="text-xs text-[#9CA3AF] font-normal">{totalCount}</span>
        )}
        <ChevronDown
          className={cn(
            "size-3.5 text-[#9CA3AF] transition-transform duration-200 group-hover:text-gray-600",
            !isOpen && "-rotate-90",
          )}
        />
      </div>
    </div>
  );
}

function FilterRow({ id, label, checked, onChange }) {
  return (
    <div
      onClick={onChange}
      className="flex items-center gap-2.5 py-1 px-1 rounded-md cursor-pointer group hover:bg-gray-50/60 transition-colors"
    >
      <FilterCheckbox id={id} checked={checked} onChange={onChange} />
      <span className="text-[13px] text-[#374151] group-hover:text-black font-normal transition-colors select-none">
        {label}
      </span>
    </div>
  );
}

function CategoryRow({
  category,
  checked,
  onChange,
  isExpanded,
  onToggleExpand,
  activeSubcategories,
  onToggleSubcategory,
}) {
  const hasSubcategories = category.subcategories?.length > 0;
  const count = CATEGORY_COUNTS[category.name] ?? category.count ?? 0;
  const isSocialMedia = category.name === "Social Media";

  return (
    <div>
      <div
        onClick={onChange}
        className={cn(
          "flex items-center justify-between gap-2.5 py-1.5 px-2.5 rounded-xl transition-all cursor-pointer group",
          isSocialMedia
            ? "border border-gray-200/90 bg-white"
            : "border border-transparent hover:border-gray-200/70 hover:bg-gray-50/50",
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <FilterCheckbox
            id={`category-${category.id}`}
            checked={checked}
            onChange={onChange}
          />
          <span className="text-[13px] text-[#374151] group-hover:text-black font-normal truncate select-none">
            {category.name}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-[#9CA3AF] font-normal">{count}</span>

          <ChevronRight
            onClick={(e) => {
              if (hasSubcategories) {
                e.stopPropagation();
                onToggleExpand();
              }
            }}
            className={cn(
              "size-3.5 text-[#9CA3AF] transition-transform duration-200 group-hover:text-gray-600",
              isExpanded && "rotate-90",
            )}
          />
        </div>
      </div>

      {hasSubcategories && isExpanded && (
        <div className="ml-3 pl-3 border-l border-gray-100 py-1">
          <SubcategoryList
            subcategories={category.subcategories}
            activeSubcategories={activeSubcategories}
            onToggle={onToggleSubcategory}
          />
        </div>
      )}
    </div>
  );
}

export default function FilterSidebar({
  categories = [],
  activeCategories = [],
  onToggleCategory,
  activeSubcategories = [],
  onToggleSubcategory,
  priceRanges = [],
  activePriceRanges = [],
  onTogglePriceRange,
  customMin = "",
  customMax = "",
  onCustomMinChange,
  onCustomMaxChange,
  ratingOptions = [],
  activeRatings = [],
  onToggleRating,
  sellerOptions = [],
  activeSellers = [],
  onToggleSeller,
  deliveryOptions = [],
  activeDelivery = [],
  onToggleDelivery,
  availabilityOptions = [],
  activeAvailability = [],
  onToggleAvailability,
  activeFilterCount = 0,
  onClearAll,
  onClose,
}) {
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    rating: true,
    seller: true,
    delivery: true,
    availability: true,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 1023.98px)").matches) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const getSectionCount = (activeLength) =>
    activeLength > 0 ? String(activeLength).padStart(2, "0") : "03";

  const filterContent = (
    <div className="divide-y divide-[#F0F2F5]">
      {/* 1. Categories Section */}
      <div className="pb-3.5">
        <SectionHeader
          title="Categories"
          count={getSectionCount(activeCategories.length)}
          totalCount={categories.length || 12}
          isOpen={openSections.categories}
          onToggle={() => toggleSection("categories")}
        />

        {openSections.categories && (
          <div className="mt-2.5 space-y-1">
            {categories.map((category) => (
              <CategoryRow
                key={category.id}
                category={category}
                checked={activeCategories.includes(category.name)}
                onChange={() => onToggleCategory(category.name)}
                isExpanded={expandedCategories.includes(category.id)}
                onToggleExpand={() =>
                  setExpandedCategories((prev) => toggleValue(prev, category.id))
                }
                activeSubcategories={activeSubcategories}
                onToggleSubcategory={onToggleSubcategory}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. Price Section */}
      <div className="py-3.5">
        <SectionHeader
          title="Price"
          count={getSectionCount(activePriceRanges.length)}
          isOpen={openSections.price}
          onToggle={() => toggleSection("price")}
        />

        {openSections.price && (
          <div className="mt-2.5 space-y-1.5">
            {priceRanges.map((range) => (
              <FilterRow
                key={range.id}
                id={`price-${range.id}`}
                label={range.label}
                checked={activePriceRanges.includes(range.id)}
                onChange={() => onTogglePriceRange(range.id)}
              />
            ))}

            <div className="pt-2">
              <span className="text-xs text-[#9CA3AF] font-normal block mb-2">
                Custom Price
              </span>
              <div className="flex items-center gap-2.5">
                <input
                  type="text"
                  placeholder="00"
                  value={customMin}
                  onChange={(e) => onCustomMinChange?.(e.target.value)}
                  className="w-full h-8 bg-[#F1F3F6] rounded-md text-center text-xs text-[#374151] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
                <span className="text-xs text-[#9CA3AF] shrink-0">to</span>
                <input
                  type="text"
                  placeholder="00"
                  value={customMax}
                  onChange={(e) => onCustomMaxChange?.(e.target.value)}
                  className="w-full h-8 bg-[#F1F3F6] rounded-md text-center text-xs text-[#374151] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Rating Section */}
      <div className="py-3.5">
        <SectionHeader
          title="Rating"
          count={getSectionCount(activeRatings.length)}
          isOpen={openSections.rating}
          onToggle={() => toggleSection("rating")}
        />

        {openSections.rating && (
          <div className="mt-2.5 space-y-1.5">
            {ratingOptions.map((rating) => (
              <FilterRow
                key={rating.id}
                id={`rating-${rating.id}`}
                label={
                  <span className="flex items-center gap-1.5">
                    <Star className="size-3.5 fill-[#F59E0B] text-[#F59E0B] shrink-0" />
                    <span>{rating.label}</span>
                  </span>
                }
                checked={activeRatings.includes(rating.id)}
                onChange={() => onToggleRating(rating.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. Seller Section */}
      <div className="py-3.5">
        <SectionHeader
          title="Seller"
          count={getSectionCount(activeSellers.length)}
          isOpen={openSections.seller}
          onToggle={() => toggleSection("seller")}
        />

        {openSections.seller && (
          <div className="mt-2.5 space-y-1.5">
            {sellerOptions.map((seller) => (
              <FilterRow
                key={seller.id}
                id={`seller-${seller.id}`}
                label={seller.label}
                checked={activeSellers.includes(seller.id)}
                onChange={() => onToggleSeller(seller.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. Delivery Section */}
      <div className="py-3.5">
        <SectionHeader
          title="Delivery"
          count={getSectionCount(activeDelivery.length)}
          isOpen={openSections.delivery}
          onToggle={() => toggleSection("delivery")}
        />

        {openSections.delivery && (
          <div className="mt-2.5 space-y-1.5">
            {deliveryOptions.map((option) => (
              <FilterRow
                key={option.id}
                id={`delivery-${option.id}`}
                label={option.label}
                checked={activeDelivery.includes(option.id)}
                onChange={() => onToggleDelivery(option.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 6. Availability Section */}
      <div className="pt-3.5">
        <SectionHeader
          title="Availability"
          count={getSectionCount(activeAvailability.length)}
          isOpen={openSections.availability}
          onToggle={() => toggleSection("availability")}
        />

        {openSections.availability && (
          <div className="mt-2.5 space-y-1.5">
            {availabilityOptions.map((option) => (
              <FilterRow
                key={option.id}
                id={`availability-${option.id}`}
                label={option.label}
                checked={activeAvailability.includes(option.id)}
                onChange={() => onToggleAvailability(option.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: inline sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xs self-start">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#F0F2F5]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-[#4B5563] hover:text-[#111827] transition-colors cursor-pointer"
              title="Close filter"
            >
              <CircleX className="size-5 stroke-[1.6]" />
            </button>
            <span className="text-[15px] font-bold text-[#1F2937]">Filter</span>
            <span className="px-2 py-0.5 rounded-full bg-[#2563EB] text-white text-[11px] font-semibold leading-none">
              {activeFilterCount > 0
                ? String(activeFilterCount).padStart(2, "0")
                : "03"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-medium text-[#EF4444] bg-[#FEF2F2] hover:bg-[#FEE2E2] px-2.5 py-0.5 rounded-full cursor-pointer transition-colors"
          >
            Celar all
          </button>
        </div>

        {filterContent}
      </aside>

      {/* Mobile: full-screen overlay drawer */}
      <div className="lg:hidden fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        <div className="absolute inset-y-0 right-0 flex h-full w-full max-w-xs flex-col bg-white shadow-2xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F2F5] shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-[#1F2937]">Filter</span>
              <span className="px-2 py-0.5 rounded-full bg-[#2563EB] text-white text-[11px] font-semibold leading-none">
                {activeFilterCount > 0
                  ? String(activeFilterCount).padStart(2, "0")
                  : "03"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClearAll}
                className="text-[11px] font-medium text-[#EF4444] bg-[#FEF2F2] hover:bg-[#FEE2E2] px-2.5 py-0.5 rounded-full cursor-pointer transition-colors"
              >
                Celar all
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="p-1 text-gray-500 hover:text-gray-800"
              >
                <CircleX className="size-5 stroke-[1.6]" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">{filterContent}</div>

          <div className="flex items-center gap-3 px-5 py-4 border-t border-[#F0F2F5] shrink-0">
            <button
              type="button"
              onClick={onClearAll}
              className="flex-1 py-2 text-xs font-semibold text-[#374151] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-xs font-semibold text-white bg-[#2563EB] rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
