// src/app/(pages)/marketplace/_components/SearchAndCategories.jsx

"use client";

import { useEffect, useRef, useState } from "react";
import { Search, ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import SubcategoryList from "./SubcategoryList";

export default function SearchAndCategories({
  query,
  onQueryChange,
  categories,
  activeCategories,
  onToggleCategory,
  onClearCategories,
  activeSubcategories,
  onToggleSubcategory,
}) {
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (openCategoryId === null) return;

    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpenCategoryId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openCategoryId]);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex items-center gap-3 w-full rounded-2xl border border-border bg-white pl-5 pr-2 py-2 focus-within:border-brand transition-colors">
        <Search className="size-5 text-tertiary shrink-0" />

        <input
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search for products, accounts, or services..."
          className="flex-1 min-w-0 py-2 text-sm text-primary placeholder:text-tertiary outline-none"
        />

        <button
          type="button"
          aria-label="Search"
          className="flex items-center justify-center size-10 rounded-xl bg-primary text-white shrink-0 hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>

      {/* Category pills */}
      <div
        ref={containerRef}
        className="flex items-center gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <button
          type="button"
          onClick={onClearCategories}
          className={cn(
            "shrink-0 px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer",
            activeCategories.length === 0
              ? "bg-white border-brand text-brand"
              : "bg-gray-50 border-transparent text-secondary hover:border-border",
          )}
        >
          All Products
        </button>

        {categories.map((category) => {
          const isActive = activeCategories.includes(category.name);
          const isOpen = openCategoryId === category.id;
          const hasSubcategories = category.subcategories?.length > 0;

          return (
            <div key={category.id} className="relative shrink-0">
              <div
                className={cn(
                  "inline-flex items-center rounded-lg text-sm font-medium border transition-colors",
                  isActive
                    ? "bg-white border-brand text-brand"
                    : "bg-gray-50 border-transparent text-secondary hover:border-border",
                )}
              >
                <button
                  type="button"
                  onClick={() => onToggleCategory(category.name)}
                  className="pl-4 pr-1.5 py-2 cursor-pointer"
                >
                  {category.name}
                </button>

                {hasSubcategories && (
                  <button
                    type="button"
                    onClick={() =>
                      setOpenCategoryId((prev) => (prev === category.id ? null : category.id))
                    }
                    aria-label={`${category.name} subcategories`}
                    className="pl-1 pr-3 py-2 cursor-pointer"
                  >
                    <ChevronDown
                      className={cn(
                        "size-3.5 transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                )}
              </div>

              {isOpen && hasSubcategories && (
                <div className="absolute left-0 top-full z-20 mt-2 w-56 rounded-xl border border-border bg-white p-3 shadow-lg">
                  <SubcategoryList
                    subcategories={category.subcategories}
                    activeSubcategories={activeSubcategories}
                    onToggle={onToggleSubcategory}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
