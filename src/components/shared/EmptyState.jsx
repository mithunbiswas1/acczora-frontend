// src/components/shared/EmptyState.jsx

"use client";

import { cn } from "@/lib/cn";

// Magnifying glass with 'i' (info) inside the lens (exact match to Image 1)
function SearchInfoIcon({ className = "size-20 text-[#CBD5E1]" }) {
  return (
    <svg
      viewBox="0 0 72 72"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Circle lens */}
      <circle cx="32" cy="32" r="20" strokeWidth="2.5" />
      {/* Handle */}
      <line x1="47" y1="47" x2="61" y2="61" strokeWidth="3" />
      {/* 'i' dot */}
      <circle cx="32" cy="25" r="1.5" fill="currentColor" stroke="none" />
      {/* 'i' stem */}
      <line x1="32" y1="30" x2="32" y2="40" strokeWidth="2.5" />
    </svg>
  );
}

// Monitor screen with exclamation '!' mark (exact match to Image 2)
function MonitorAlertIcon({ className = "size-20 text-[#CBD5E1]" }) {
  return (
    <svg
      viewBox="0 0 72 72"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Monitor frame */}
      <rect x="14" y="12" width="44" height="32" rx="4" strokeWidth="2.5" />
      {/* Stand post */}
      <line x1="36" y1="44" x2="36" y2="52" strokeWidth="2.5" />
      {/* Stand base */}
      <line x1="26" y1="52" x2="46" y2="52" strokeWidth="2.5" />
      {/* Exclamation stem */}
      <line x1="36" y1="21" x2="36" y2="30" strokeWidth="2.5" />
      {/* Exclamation dot */}
      <circle cx="36" cy="35" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function EmptyState({
  variant = "search",
  title = "No products found",
  description = "Try removing some filters or adjusting your search.",
  actions = [],
}) {
  const isSearchEmpty = variant === "search" || variant === "empty";

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 md:py-24 px-4 max-w-lg mx-auto">
      {/* Icon */}
      <div className="mb-5 flex items-center justify-center">
        {isSearchEmpty ? (
          <SearchInfoIcon className="size-20 text-[#CBD5E1]" />
        ) : (
          <MonitorAlertIcon className="size-20 text-[#CBD5E1]" />
        )}
      </div>

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-bold text-[#1F2937] tracking-tight">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="mt-2 text-sm text-[#6B7280] font-normal leading-relaxed">
          {description}
        </p>
      )}

      {/* Actions */}
      {actions.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actions.map(({ label, onClick, variant: btnVariant = "outline-secondary" }) => {
            if (btnVariant === "link" || btnVariant === "text") {
              return (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer transition-all"
                >
                  {label}
                </button>
              );
            }

            if (btnVariant === "solid" || btnVariant === "primary") {
              return (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  className="px-4 py-2 bg-[#6658FF] hover:bg-[#5546F0] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  {label}
                </button>
              );
            }

            return (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className="px-4 py-2 bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#374151] text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { SearchInfoIcon, MonitorAlertIcon };
