// src/app/(pages)/store/_components/StoreProductsSection.jsx

"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";

export default function StoreProductsSection({
  products = [],
  categories = [],
  totalCount = "126 products",
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      const activeCat = categories.find((c) => c.id === selectedCategory);
      if (activeCat) {
        list = list.filter(
          (p) =>
            p.category?.toLowerCase() === activeCat.name.toLowerCase() ||
            p.subcategory?.toLowerCase() === activeCat.name.toLowerCase(),
        );
      }
    }

    // Sort logic
    if (sortBy === "price-low") {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-high") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return list;
  }, [products, searchQuery, selectedCategory, categories, sortBy]);

  const sortOptions = [
    { id: "popular", label: "Popular..." },
    { id: "price-low", label: "Price: Low to High" },
    { id: "price-high", label: "Price: High to Low" },
    { id: "newest", label: "Newest" },
  ];

  const currentSortLabel =
    sortOptions.find((opt) => opt.id === sortBy)?.label || "Popular...";

  return (
    <section className="mt-14 sm:mt-18">
      {/* Header */}
      <div className="flex items-baseline gap-2 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
          All products
        </h2>
        <span className="text-sm font-normal text-tertiary">
          {filteredProducts.length} products
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-white text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-brand shadow-2xs transition-all"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="h-10 px-4 rounded-xl border border-border bg-white text-sm text-primary flex items-center justify-between gap-3 hover:border-gray-400 transition-colors shadow-2xs cursor-pointer select-none"
          >
            <span>{currentSortLabel}</span>
            <ChevronDown
              className={`size-4 text-muted transition-transform duration-200 ${
                isSortOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-border rounded-xl shadow-lg py-1.5 z-30">
              {sortOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSortBy(opt.id);
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    sortBy === opt.id
                      ? "bg-brand/10 text-brand"
                      : "text-primary hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Categories Tabs Bar */}
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                isActive
                  ? "border border-brand text-brand bg-brand/5 shadow-2xs font-semibold"
                  : "border border-border text-secondary hover:text-primary hover:border-gray-300 bg-white"
              }`}
            >
              <span>{cat.name}</span>
              {cat.hasDropdown && (
                <ChevronDown
                  className={`size-3.5 ${
                    isActive ? "text-brand" : "text-muted"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Products Grid using shared ProductCard */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              href={`/product/${product.slug || product.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-sm text-secondary bg-gray-50 rounded-2xl border border-dashed border-border mt-6">
          No products found matching your search.
        </div>
      )}
    </section>
  );
}
