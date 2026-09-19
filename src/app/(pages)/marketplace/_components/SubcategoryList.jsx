// src/app/(pages)/marketplace/_components/SubcategoryList.jsx

"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/cn";

export default function SubcategoryList({
  subcategories,
  activeSubcategories,
  onToggle,
  className,
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      {subcategories.map((sub) => {
        const checked = activeSubcategories.includes(sub.id);

        return (
          <label
            key={sub.id}
            htmlFor={`subcategory-${sub.id}`}
            className="flex items-center justify-between gap-3 py-1.5 cursor-pointer group"
          >
            <span className="flex items-center gap-2.5">
              <Checkbox
                id={`subcategory-${sub.id}`}
                checked={checked}
                onCheckedChange={() => onToggle(sub.id)}
              />
              <span className="text-sm text-secondary group-hover:text-primary transition-colors">
                {sub.name}
              </span>
            </span>

            <span className="text-xs text-tertiary">{sub.count}</span>
          </label>
        );
      })}
    </div>
  );
}
