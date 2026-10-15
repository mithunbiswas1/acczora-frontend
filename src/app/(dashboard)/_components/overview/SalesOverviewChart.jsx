// src/app/(dashboard)/_components/overview/SalesOverviewChart.jsx

"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

const RANGES = ["7 Days", "30 Days", "3 Months", "12 Months"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mrc",
  "Afr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const Y_TICKS = ["10k", "8k", "6k", "4k", "2k", "00"];

export default function SalesOverviewChart({
  title = "Platform Revenue",
  initialRange = "12 Months",
  peakAmount = "$ 7,900",
  className = "",
}) {
  const [selectedRange, setSelectedRange] = useState(initialRange);

  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      {/* Header with Title and Range Switcher */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-0">
        <CardTitle>{title}</CardTitle>

        <div className="inline-flex items-center gap-2.5 p-1">
          {RANGES.map((range) => {
            const isActive = selectedRange === range;
            return (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all duration-150 cursor-pointer ${isActive
                  ? "bg-brand text-white"
                  : " bg-gray-50 text-gray-500 hover:text-gray-900"
                  }`}
              >
                {range}
              </button>
            );
          })}
        </div>
      </CardHeader>

      {/* Responsive Chart Container */}
      <div className="relative w-full h-[230px] sm:h-[250px] select-none">
        {/* Y-Axis Labels & Gridlines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
          {Y_TICKS.map((tick, i) => (
            <div key={tick} className="flex items-center w-full">
              <span className="w-8 text-[11px] font-medium text-gray-400">
                {tick}
              </span>
              <div
                className={`flex-1 border-b ${i === Y_TICKS.length - 1
                  ? "border-gray-200"
                  : "border-gray-100/80 border-dashed"
                  }`}
              />
            </div>
          ))}
        </div>

        {/* Floating Tooltip at September Peak with Caret Pointing Down */}
        <div
          className="absolute z-10 -translate-x-1/2 flex flex-col items-center pointer-events-none"
          style={{ left: "77%", top: "10%" }}
        >
          <div className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl relative">
            <span>{peakAmount}</span>
            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-black rotate-45" />
          </div>
        </div>

        {/* SVG Curve Layer */}
        <div className="absolute inset-0 pl-8 pb-6">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 1000 200"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Green Wave Linear Gradient */}
              <linearGradient id="revenueGreenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                <stop offset="45%" stopColor="#34d399" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#d1fae5" stopOpacity="0.02" />
              </linearGradient>

              {/* Slate/Grey Early Wave Linear Gradient */}
              <linearGradient id="revenueSlateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.40" />
                <stop offset="70%" stopColor="#cbd5e1" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#f1f5f9" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Left Slate/Grey Wave (Jan to Feb hump) */}
            <path
              d="M 0 120 
                 C 20 80, 40 25, 70 30 
                 C 100 35, 120 110, 150 125 
                 L 150 200 L 0 200 Z"
              fill="url(#revenueSlateGradient)"
            />
            <path
              d="M 0 120 
                 C 20 80, 40 25, 70 30 
                 C 100 35, 120 110, 150 125"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Main Emerald/Green Wave Fill Area */}
            <path
              d="M 0 125 
                 C 80 120, 120 122, 180 110 
                 C 240 100, 300 70, 380 50 
                 C 440 32, 500 35, 560 60 
                 C 620 85, 680 90, 720 75 
                 C 760 60, 790 55, 830 90 
                 C 870 120, 900 60, 940 45 
                 C 970 35, 990 38, 1000 35 
                 L 1000 200 L 0 200 Z"
              fill="url(#revenueGreenGradient)"
            />

            {/* Main Emerald/Green Curve Stroke */}
            <path
              d="M 0 125 
                 C 80 120, 120 122, 180 110 
                 C 240 100, 300 70, 380 50 
                 C 440 32, 500 35, 560 60 
                 C 620 85, 680 90, 720 75 
                 C 760 60, 790 55, 830 90 
                 C 870 120, 900 60, 940 45 
                 C 970 35, 990 38, 1000 35"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* X-Axis Month Labels */}
        <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[11px] font-medium text-gray-400">
          {MONTHS.map((month) => (
            <span key={month} className="text-center">
              {month}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
