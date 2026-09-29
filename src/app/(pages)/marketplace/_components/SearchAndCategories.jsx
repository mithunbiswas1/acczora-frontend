// src/app/(pages)/marketplace/_components/SearchAndCategories.jsx

"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
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
  const [panelRect, setPanelRect] = useState(null);
  const containerRef = useRef(null);
  const panelRef = useRef(null);
  const pillRefs = useRef(new Map());

  const openCategory = categories.find((category) => category.id === openCategoryId) ?? null;

  // Desktop mouse wheels only scroll vertically by default; redirect that
  // vertical delta to horizontal scroll so the pill row is wheel-scrollable
  // (touchscreens already scroll it fine via native horizontal drag).
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

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex items-center gap-3 w-full rounded-xl border border-[#E5E7EB] bg-white pl-4 pr-1.5 py-1.5 focus-within:border-[#6658FF] transition-colors shadow-xs">
        <Search className="size-5 text-[#374151] shrink-0" />

        <input
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Netflix Ultra Pro Max 2099"
          className="flex-1 min-w-0 py-1.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] bg-transparent outline-none"
        />

        <button
          type="button"
          aria-label="Search"
          className="size-9 bg-[#0B1528] hover:bg-black text-white rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer"
        >
          <ArrowRight className="size-4 text-white" />
        </button>
      </div>

      {/* Category pills */}
      <div
        ref={containerRef}
        className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <button
          type="button"
          onClick={onClearCategories}
          className={cn(
            "shrink-0 inline-flex items-center rounded-lg text-xs font-medium border px-3.5 py-1.5 transition-colors cursor-pointer select-none",
            activeCategories.length === 0
              ? "bg-white border-[#6658FF] text-[#6658FF] shadow-xs"
              : "bg-white border-[#E5E7EB] text-[#374151] hover:border-gray-400",
          )}
        >
          All Products
        </button>

        {categories.map((category) => {
          const isActive = activeCategories.includes(category.name);
          const isOpen = openCategoryId === category.id;
          const hasSubcategories = category.subcategories?.length > 0;

          return (
            <div
              key={category.id}
              ref={(el) => {
                if (el) pillRefs.current.set(category.id, el);
                else pillRefs.current.delete(category.id);
              }}
              className={cn(
                "shrink-0 inline-flex items-center gap-1.5 rounded-lg text-xs font-medium border px-3 py-1.5 transition-colors cursor-pointer select-none",
                isActive
                  ? "bg-white border-[#6658FF] text-[#6658FF] shadow-xs"
                  : "bg-white border-[#E5E7EB] text-[#374151] hover:border-gray-400",
              )}
            >
              <span
                onClick={() => onToggleCategory(category.name)}
                className="cursor-pointer"
              >
                {category.name}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasSubcategories) {
                    handleChevronClick(category.id);
                  } else {
                    onToggleCategory(category.name);
                  }
                }}
                aria-label={`${category.name} options`}
                className="cursor-pointer text-[#9CA3AF] hover:text-gray-700"
              >
                <ChevronDown
                  className={cn(
                    "size-3 transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating dropdown, portaled to <body> so the scrolling pill row's
          overflow-x-auto (which also clips vertical overflow) can't hide it.
          Positioned with fixed coords from the trigger pill's own rect. */}
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
              onToggle={onToggleSubcategory}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
