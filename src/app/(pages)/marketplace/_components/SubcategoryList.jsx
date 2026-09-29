// src/app/(pages)/marketplace/_components/SubcategoryList.jsx

"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

export default function SubcategoryList({
  subcategories,
  activeSubcategories,
  onToggle,
  className,
}) {
  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      {subcategories.map((sub) => {
        const checked = activeSubcategories.includes(sub.id);

        return (
          <div
            key={sub.id}
            onClick={() => onToggle(sub.id)}
            className="flex items-center justify-between gap-2.5 py-1 px-1 cursor-pointer group hover:bg-gray-50/60 rounded-md transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(sub.id);
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
              <span className="text-[13px] text-[#374151] group-hover:text-black font-normal truncate select-none">
                {sub.name}
              </span>
            </div>

            <span className="text-xs text-[#9CA3AF]">{sub.count}</span>
          </div>
        );
      })}
    </div>
  );
}
