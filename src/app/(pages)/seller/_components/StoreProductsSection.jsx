// src/app/(pages)/seller/_components/StoreProductsSection.jsx

"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown } from "lucide-react";
import ProductCard from "@/components/shared/ProductCard";
import SubcategoryList from "../../marketplace/_components/SubcategoryList";
import { categories as marketplaceCategories } from "@/data";
import { cn } from "@/lib/cn";

export default function StoreProductsSection({
  products = [],
  categories: propCategories = [],
  totalCount = "126 products",
}) {
  // Use marketplace categories which include rich subcategories
  const categoriesList = useMemo(() => {
    if (propCategories.length > 0 && propCategories[0]?.subcategories?.length > 0) {
      return propCategories;
    }
    return marketplaceCategories;
  }, [propCategories]);

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategories, setActiveSubcategories] = useState([]);
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [panelRect, setPanelRect] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const containerRef = useRef(null);
  const panelRef = useRef(null);
  const pillRefs = useRef(new Map());

  const openCategory = categoriesList.find((c) => c.id === openCategoryId) ?? null;

  // Horizontal wheel-scrollable pill row
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function handleWheel(event) {
      if (event.deltaY === 0) return;
      el.scrollLeft += event.deltaY;
      event.preventDefault();
    }

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  function updatePanelRect(categoryId) {
    const pillEl = pillRefs.current.get(categoryId);
    if (!pillEl) return;
    const rect = pillEl.getBoundingClientRect();
    setPanelRect({
      top: rect.bottom + 8,
      left: rect.left,
      width: Math.max(rect.width, 224),
    });
  }

  function handleChevronClick(categoryId) {
    if (openCategoryId === categoryId) {
      setOpenCategoryId(null);
      setPanelRect(null);
      return;
    }
    updatePanelRect(categoryId);
    setOpenCategoryId(categoryId);
  }

  // Close floating portal panel when clicking outside or resizing
  useEffect(() => {
    if (openCategoryId === null) return;

    function handleClickOutside(event) {
      const target = event.target;
      const insidePills = containerRef.current?.contains(target);
      const insidePanel = panelRef.current?.contains(target);
      if (!insidePills && !insidePanel) {
        setOpenCategoryId(null);
        setPanelRect(null);
      }
    }

    function handleReposition() {
      updatePanelRect(openCategoryId);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [openCategoryId]);

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
    if (activeCategory) {
      list = list.filter(
        (p) => p.category?.toLowerCase() === activeCategory.toLowerCase(),
      );
    }

    // Subcategories filter
    if (activeSubcategories.length > 0) {
      const selectedSubNames = activeSubcategories.map((subId) => {
        for (const cat of categoriesList) {
          const found = cat.subcategories?.find((s) => s.id === subId);
          if (found) return found.name.toLowerCase();
        }
        return String(subId).toLowerCase();
      });

      list = list.filter(
        (p) =>
          p.subcategory && selectedSubNames.includes(p.subcategory.toLowerCase()),
      );
    }

    // Sort logic
    if (sortBy === "price-low") {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-high") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === "newest") {
      list.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return list;
  }, [products, searchQuery, activeCategory, activeSubcategories, categoriesList, sortBy]);

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

      {/* Categories Tabs Bar (Marketplace-styled pill row) */}
      <div
        ref={containerRef}
        className="mt-6 flex items-center gap-[10px] overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* All Products Pill */}
        <button
          type="button"
          onClick={() => {
            setActiveCategory(null);
            setActiveSubcategories([]);
            setOpenCategoryId(null);
          }}
          className={cn(
            "shrink-0 inline-flex items-center justify-center min-w-[134px] h-[39px] p-[10px] gap-[10px] rounded-[8px] text-xs md:text-sm font-medium border transition-colors cursor-pointer select-none",
            !activeCategory
              ? "bg-white border-[#6658FF] text-[#6658FF] shadow-xs"
              : "bg-[#F0F1F3] border-[#E5E7EB] text-[#2B2F38] hover:border-gray-400 hover:bg-[#e8e9ec]",
          )}
        >
          All Products
        </button>

        {/* Category Pills */}
        {categoriesList.map((category) => {
          const isActive = activeCategory === category.name;
          const isOpen = openCategoryId === category.id;
          const hasSubcategories = category.subcategories?.length > 0;

          return (
            <div
              key={category.id}
              ref={(el) => {
                if (el) pillRefs.current.set(category.id, el);
                else pillRefs.current.delete(category.id);
              }}
              onClick={() => {
                if (isActive) {
                  setActiveCategory(null);
                  setActiveSubcategories([]);
                } else {
                  setActiveCategory(category.name);
                }
              }}
              className={cn(
                "shrink-0 inline-flex items-center justify-between min-w-[134px] h-[39px] p-[10px] gap-[10px] rounded-[8px] text-xs md:text-sm font-medium border transition-colors cursor-pointer select-none",
                isActive
                  ? "bg-white border-[#6658FF] text-[#6658FF] shadow-xs"
                  : "bg-[#F0F1F3] border-[#E5E7EB] text-[#2B2F38] hover:border-gray-400 hover:bg-[#e8e9ec]",
              )}
            >
              <span className="truncate">{category.name}</span>

              {hasSubcategories && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChevronClick(category.id);
                  }}
                  aria-label={`${category.name} options`}
                  className="cursor-pointer text-[#6B7280] hover:text-gray-900 shrink-0 ml-1"
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
          );
        })}
      </div>

      {/* Floating Subcategories Dropdown (Portaled to body like Marketplace) */}
      {openCategory &&
        panelRect &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: "fixed",
              top: panelRect.top,
              left: panelRect.left,
              width: panelRect.width,
            }}
            className="z-50 rounded-xl border border-border bg-white p-3 shadow-lg"
          >
            <SubcategoryList
              subcategories={openCategory.subcategories}
              activeSubcategories={activeSubcategories}
              onToggle={(subId) => {
                setActiveSubcategories((prev) =>
                  prev.includes(subId)
                    ? prev.filter((id) => id !== subId)
                    : [...prev, subId],
                );
                if (activeCategory !== openCategory.name) {
                  setActiveCategory(openCategory.name);
                }
              }}
            />
          </div>,
          document.body,
        )}

      {/* Products Grid using shared ProductCard */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              href={`/${product.slug || product.id}`}
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
