// src/components/ui/StatCard.jsx

"use client";

import Card from "./Card";
import { H3 } from "./Typography";

export default function StatCard({
  title,
  value,
  change,
  subtext,
  icon: Icon,
  iconBg = "bg-[#ede9fe] text-[#7c3aed]",
}) {
  return (
    <Card>
      {/* Top row: Icon + Title */}
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
          >
            <Icon size={18} />
          </div>
        )}
        <span className="text-xs sm:text-sm font-medium font-hand text-secondary">
          {title}
        </span>
      </div>

      {/* Middle row: Large Value + Percentage Trend */}
      <div className="flex items-baseline gap-2">
        <H3>{value}</H3>
        {change && (
          <span
            className={`text-xs font-semibold flex items-center gap-0.5 ${change.includes("-") ? "text-rose-500" : "text-emerald-500"
              }`}
          >
            {change}
          </span>
        )}
      </div>

      {/* Bottom row: Subtext */}
      {subtext && (
        <div className="mt-1.5 text-xs text-gray-400 font-normal">
          {subtext}
        </div>
      )}
    </Card>
  );
}
