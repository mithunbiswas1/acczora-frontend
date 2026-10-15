// src/components/ui/EmptyState.jsx

"use client";

import Link from "next/link";
import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "No data found",
  description = "There are no items to display right now.",
  actionLabel,
  actionHref,
  onAction,
  className = "",
}) {
  return (
    <div
      className={`py-12 px-4 flex flex-col items-center justify-center text-center ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-border flex items-center justify-center text-gray-400 mb-3 shadow-2xs">
        <Icon size={24} />
      </div>
      <h4 className="text-sm font-bold text-gray-900 mb-1">{title}</h4>
      <p className="text-xs text-gray-500 max-w-sm mb-4">{description}</p>

      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6658ff] hover:bg-[#5546f0] text-xs font-semibold text-white shadow-xs transition-colors"
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6658ff] hover:bg-[#5546f0] text-xs font-semibold text-white shadow-xs transition-colors"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}

export { EmptyState };
