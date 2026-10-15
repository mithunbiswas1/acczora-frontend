// src/app/(dashboard)/_components/overview/OverviewStatCards.jsx

import React from "react";
import {
  TotalSalesIcon,
  CartFlatbedBoxesIcon,
  CubesIcon,
  DashboardStarIcon,
} from "@/icons";

const DEFAULT_STATS = [
  {
    label: "Total Sales",
    value: "$12,480",
    change: "12.5% ↑",
    subtext: "Last month",
    iconBg: "bg-brand/10 text-brand",
    icon: TotalSalesIcon,
  },
  {
    label: "Orders",
    value: "248",
    change: "8.2% ↑",
    subtext: "Last month",
    iconBg: "bg-[#dcfce7] text-[#16a34a]",
    icon: CartFlatbedBoxesIcon,
  },
  {
    label: "Products",
    value: "48",
    subtext: "6 active",
    iconBg: "bg-[#e0e7ff] text-[#4f46e5]",
    icon: CubesIcon,
  },
  {
    label: "Rating",
    value: "4.9",
    subtext: "128 reviews",
    iconBg: "bg-[#fef3c7] text-[#d97706]",
    icon: DashboardStarIcon,
  },
];

export default function OverviewStatCards({ stats = DEFAULT_STATS }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label || idx}
            className="bg-white rounded-2xl p-5 border border-border shadow-xs hover:shadow-md transition-shadow"
          >
            {/* Top row: Icon + Label */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${stat.iconBg}`}
              >
                {Icon && <Icon size={16} />}
              </div>
              <span className="text-xs font-medium text-gray-600 truncate">
                {stat.label}
              </span>
            </div>

            {/* Middle row: Big Value + Optional Change Badge */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">
                {stat.value}
              </span>
              {stat.change && (
                <span className="text-xs font-semibold text-emerald-600">
                  {stat.change}
                </span>
              )}
            </div>

            {/* Bottom row: Subtext */}
            {stat.subtext && (
              <p className="text-[11px] font-medium text-gray-400">
                {stat.subtext}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
