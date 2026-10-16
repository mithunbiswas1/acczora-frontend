// src/app/(dashboard)/_components/overview/OverviewBanner.jsx

import React from "react";
import LinkButton from "@/components/ui/LinkButton";
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
        <LinkButton
          href={actionHref}
          variant="outline-border"
          size="sm"
          rounded="xl"
          className="text-brand hover:text-brand gap-2"
        >
          <StoreEyeIcon size={16} className="text-brand" />
          <span>{actionLabel}</span>
        </LinkButton>
      </div>
    </div>
  );
}
