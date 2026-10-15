// src/components/ui/SearchInput.jsx

"use client";

import { Search, X } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  size = "md",
}) {
  const sizeClasses = {
    sm: "h-9 text-xs pl-8 pr-7",
    md: "h-11 text-xs pl-9 pr-8",
    lg: "h-12 text-sm pl-10 pr-9",
  };

  const iconSizes = {
    sm: 14,
    md: 15,
    lg: 18,
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search
        size={iconSizes[size] || 15}
        className="absolute left-3 text-gray-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e)}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-border bg-white text-gray-900 placeholder:text-gray-400 focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none transition-all shadow-xs ${
          sizeClasses[size] || sizeClasses.md
        }`}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            const fakeEvent = {
              target: { value: "" },
              currentTarget: { value: "" },
              preventDefault: () => {},
              stopPropagation: () => {},
            };
            fakeEvent[Symbol.toPrimitive] = () => "";
            onChange?.(fakeEvent);
          }}
          className="absolute right-2.5 p-1 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export { SearchInput };
