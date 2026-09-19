// src/app/(pages)/marketplace/_components/FilterSidebar.jsx

"use client";

import { useState } from "react";
import { Star, ChevronRight } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import { Checkbox } from "@/components/ui/Checkbox";
import { H5 } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";
import SubcategoryList from "./SubcategoryList";

function toggleValue(list, value) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

const SECTIONS = [
  "categories",
  "price",
  "rating",
  "seller",
  "delivery",
  "availability",
];

function SectionTitle({ children, count }) {
  return (
    <span className="flex items-center gap-2 text-sm font-semibold text-primary">
      {children}
      <span className="px-1.5 py-0.5 rounded-full bg-gray-100 text-[11px] text-secondary">
        {count}
      </span>
    </span>
  );
}

function FilterRow({ id, label, count, checked, onChange }) {
  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between gap-3 py-1.5 cursor-pointer group"
    >
      <span className="flex items-center gap-2.5">
        <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
        <span className="text-sm text-secondary group-hover:text-primary transition-colors">
          {label}
        </span>
      </span>

      {count !== undefined && (
        <span className="text-xs text-tertiary">{count}</span>
      )}
    </label>
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

  return (
    <div>
      <div className="flex items-center justify-between gap-3 py-1.5 group">
        <label
          htmlFor={`category-${category.id}`}
          className="flex items-center gap-2.5 cursor-pointer min-w-0"
        >
          <Checkbox
            id={`category-${category.id}`}
            checked={checked}
            onCheckedChange={onChange}
          />
          <span className="text-sm text-secondary group-hover:text-primary transition-colors truncate">
            {category.name}
          </span>
        </label>

        <span className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-tertiary">{category.count}</span>

          {hasSubcategories && (
            <button
              type="button"
              onClick={onToggleExpand}
              aria-label={`${category.name} subcategories`}
              className="text-tertiary hover:text-primary cursor-pointer"
            >
              <ChevronRight
                className={cn(
                  "size-4 transition-transform duration-200",
                  isExpanded && "rotate-90",
                )}
              />
            </button>
          )}
        </span>
      </div>

      {hasSubcategories && isExpanded && (
        <SubcategoryList
          subcategories={category.subcategories}
          activeSubcategories={activeSubcategories}
          onToggle={onToggleSubcategory}
          className="ml-2.5 pl-4 border-l border-border"
        />
      )}
    </div>
  );
}

export default function FilterSidebar({
  categories,
  activeCategories,
  onToggleCategory,
  activeSubcategories,
  onToggleSubcategory,
  priceRanges,
  activePriceRanges,
  onTogglePriceRange,
  ratingOptions,
  activeRatings,
  onToggleRating,
  sellerOptions,
  activeSellers,
  onToggleSeller,
  deliveryOptions,
  activeDelivery,
  onToggleDelivery,
  availabilityOptions,
  activeAvailability,
  onToggleAvailability,
  activeFilterCount,
  onClearAll,
}) {
  const [expandedCategories, setExpandedCategories] = useState([]);

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <H5 className="font-semibold text-primary">Filter</H5>
          <span className="px-1.5 py-0.5 rounded-full bg-brand/10 text-brand text-xs font-semibold">
            {String(activeFilterCount).padStart(2, "0")}
          </span>
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-medium text-error hover:underline cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={SECTIONS}>
        <AccordionItem value="categories">
          <AccordionTrigger>
            <SectionTitle count={activeCategories.length}>Categories</SectionTitle>
          </AccordionTrigger>
          <AccordionContent>
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>
            <SectionTitle count={activePriceRanges.length}>Price</SectionTitle>
          </AccordionTrigger>
          <AccordionContent>
            {priceRanges.map((range) => (
              <FilterRow
                key={range.id}
                id={`price-${range.id}`}
                label={range.label}
                checked={activePriceRanges.includes(range.id)}
                onChange={() => onTogglePriceRange(range.id)}
              />
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rating">
          <AccordionTrigger>
            <SectionTitle count={activeRatings.length}>Rating</SectionTitle>
          </AccordionTrigger>
          <AccordionContent>
            {ratingOptions.map((rating) => (
              <FilterRow
                key={rating.id}
                id={`rating-${rating.id}`}
                label={
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3.5 fill-warning text-warning" />
                    {rating.label}
                  </span>
                }
                checked={activeRatings.includes(rating.id)}
                onChange={() => onToggleRating(rating.id)}
              />
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="seller">
          <AccordionTrigger>
            <SectionTitle count={activeSellers.length}>Seller</SectionTitle>
          </AccordionTrigger>
          <AccordionContent>
            {sellerOptions.map((seller) => (
              <FilterRow
                key={seller.id}
                id={`seller-${seller.id}`}
                label={seller.label}
                checked={activeSellers.includes(seller.id)}
                onChange={() => onToggleSeller(seller.id)}
              />
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="delivery">
          <AccordionTrigger>
            <SectionTitle count={activeDelivery.length}>Delivery</SectionTitle>
          </AccordionTrigger>
          <AccordionContent>
            {deliveryOptions.map((option) => (
              <FilterRow
                key={option.id}
                id={`delivery-${option.id}`}
                label={option.label}
                checked={activeDelivery.includes(option.id)}
                onChange={() => onToggleDelivery(option.id)}
              />
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability">
          <AccordionTrigger>
            <SectionTitle count={activeAvailability.length}>Availability</SectionTitle>
          </AccordionTrigger>
          <AccordionContent>
            {availabilityOptions.map((option) => (
              <FilterRow
                key={option.id}
                id={`availability-${option.id}`}
                label={option.label}
                checked={activeAvailability.includes(option.id)}
                onChange={() => onToggleAvailability(option.id)}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
