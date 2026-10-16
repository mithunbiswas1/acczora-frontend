// src/components/ui/EmptyState.jsx

"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

/**
 * EmptyState component matching Acczora design system
 * Supports:
 * 1. variant="search": Search magnifying glass with exclamation mark (for 0 filtered/search results)
 * 2. variant="empty": Monitor with exclamation mark (for 0 items total in catalog/table)
 */
export default function EmptyState({
  variant = "empty", // "empty" | "search"
  itemType = "items", // e.g. "products", "categories", "sub-categories"
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  onClear,
  className = "",
  customIcon,
}) {
  const isSearchVariant = variant === "search";

  // Resolved titles & descriptions
  const resolvedTitle =
    title ||
    (isSearchVariant
      ? `No ${itemType} found`
      : `No ${itemType} yet`);

  const resolvedDescription =
    description ||
    (isSearchVariant
      ? `We couldn't find any ${itemType} matching your search or filters.`
      : `Start by adding your first ${itemType.replace(/s$/, "")}.`);

  return (
    <div
      className={`py-16 sm:py-24 px-4 flex flex-col items-center justify-center text-center select-none ${className}`}
    >
      {/* Icon Graphic */}
      <div className="flex items-center justify-center text-[#cbd5e1] mb-5">
        {customIcon ? (
          customIcon
        ) : isSearchVariant ? (
          // Magnifying Glass with Exclamation Mark
          <svg
            width="82"
            height="82"
            viewBox="0 0 84 84"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#cbd5e1]"
          >
            <circle
              cx="38"
              cy="38"
              r="24"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M56 56L72 72"
              stroke="currentColor"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="38"
              y1="28"
              x2="38"
              y2="40"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="38" cy="47" r="2.5" fill="currentColor" />
          </svg>
        ) : (
          // Monitor Screen with Exclamation Mark
          <svg
            width="86"
            height="86"
            viewBox="0 0 88 88"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#cbd5e1]"
          >
            <rect
              x="14"
              y="16"
              width="60"
              height="44"
              rx="10"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M34 60L30 70H58L54 60"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="44"
              y1="28"
              x2="44"
              y2="42"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="44" cy="49" r="2.5" fill="currentColor" />
          </svg>
        )}
      </div>

      {/* Main Title */}
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight mb-2">
        {resolvedTitle}
      </h3>

      {/* Subtitle Description */}
      <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
        {resolvedDescription}
      </p>

      {/* Action / CTA */}
      {isSearchVariant ? (
        <button
          type="button"
          onClick={onClear || onAction}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-border bg-white hover:bg-gray-50 text-[#5b52f9] text-xs sm:text-sm font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
        >
          {actionLabel || "Clear filters"}
        </button>
      ) : actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-border bg-white hover:bg-gray-50 text-[#5b52f9] text-xs sm:text-sm font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
        >
          <Plus size={15} className="stroke-[2.5]" />
          <span>{actionLabel || `Add ${itemType.replace(/s$/, "")}`}</span>
        </Link>
      ) : onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-border bg-white hover:bg-gray-50 text-[#5b52f9] text-xs sm:text-sm font-semibold transition-all shadow-2xs active:scale-95 cursor-pointer"
        >
          <Plus size={15} className="stroke-[2.5]" />
          <span>{actionLabel || `Add ${itemType.replace(/s$/, "")}`}</span>
        </button>
      ) : null}
    </div>
  );
}

export { EmptyState };
