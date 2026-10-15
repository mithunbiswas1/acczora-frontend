// src/app/(dashboard)/_components/overview/OverviewBanner.jsx

import React from "react";
import Link from "next/link";
import { StoreEyeIcon } from "@/icons";

export default function OverviewBanner({
  name = "NovaStore",
  greeting = "Welcome back",
  subtitle = "Here's what's happening with your store.",
  actionLabel = "View Store",
  actionHref = "/store/novastore",
}) {
  return (
    <div className="bg-gradient-to-r from-[#ede9fe] via-[#f5f0ff] to-[#e8e2fe] rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#e2d9fc] shadow-xs">
      <div>
        <p className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center gap-1.5">
          {greeting}, {name}! <span className="inline-block animate-wiggle">👋</span>
        </p>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight mt-1">
          {subtitle}
        </h2>
      </div>

      <div className="flex-shrink-0">
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-border text-brand text-xs font-semibold shadow-xs hover:bg-gray-50 hover:border-brand/30 transition-all"
        >
          <StoreEyeIcon size={16} className="text-brand" />
          <span>{actionLabel}</span>
        </Link>
      </div>
    </div>
  );
}
