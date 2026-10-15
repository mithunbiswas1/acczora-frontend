// src/components/ui/Badge.jsx

"use client";

const variantStyles = {
  // Status variants matching exact design
  completed: "bg-[#ecfdf5] text-[#10b981] border-[#d1fae5]/80",
  active: "bg-[#ecfdf5] text-[#10b981] border-[#d1fae5]/80",
  approved: "bg-[#ecfdf5] text-[#10b981] border-[#d1fae5]/80",
  paid: "bg-[#ecfdf5] text-[#10b981] border-[#d1fae5]/80",

  processing: "bg-[#fffbeb] text-[#f59e0b] border-[#fef3c7]",
  pending: "bg-[#f3f4f6] text-gray-600 border-gray-200",
  draft: "bg-gray-100 text-gray-700 border-gray-200",

  cancelled: "bg-[#fef2f2] text-[#ef4444] border-[#fee2e2]",
  rejected: "bg-[#fef2f2] text-[#ef4444] border-[#fee2e2]",
  out_of_stock: "bg-[#fef2f2] text-[#ef4444] border-[#fee2e2]",
  inactive: "bg-rose-50 text-rose-700 border-rose-200/60",
  suspend: "bg-[#fff1f2] text-[#f43f5e] border-[#ffe4e6]",
  deactivate: "bg-[#fef2f2] text-[#f87171] border-[#fee2e2]",

  // Soft purple pill (for counters like Pending Actions)
  purple_pill: "bg-[#ede9fe] text-[#7c3aed] border-transparent font-bold",

  // Role variants
  super_admin: "bg-purple-50 text-purple-700 border-purple-200/60",
  admin: "bg-blue-50 text-blue-700 border-blue-200/60",
  seller: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  buyer: "bg-gray-100 text-gray-700 border-gray-200",

  // Generic colors
  brand: "bg-[#f2efff] text-[#6658ff] border-[#e0dcff]",
  neutral: "bg-gray-50 text-gray-700 border-border",
};

export default function Badge({
  variant = "neutral",
  size = "md",
  children,
  className = "",
  dot = false,
  uppercase = false,
}) {
  const normalizedVariant = variant.toLowerCase().replace(/\s+/g, "_");
  const selectedStyle = variantStyles[normalizedVariant] || variantStyles.neutral;

  const sizeStyles = {
    xs: "text-[10px] px-2 py-0.5",
    sm: "text-[11px] px-2.5 py-0.5",
    md: "text-xs px-3 py-1",
    lg: "text-xs px-3.5 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border tracking-normal ${
        uppercase ? "uppercase tracking-wide" : ""
      } ${sizeStyles[size] || sizeStyles.md} ${selectedStyle} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            normalizedVariant.includes("active") ||
            normalizedVariant.includes("completed") ||
            normalizedVariant.includes("approved")
              ? "bg-emerald-500"
              : normalizedVariant.includes("pending") || normalizedVariant.includes("processing")
              ? "bg-amber-500"
              : normalizedVariant.includes("rejected") ||
                normalizedVariant.includes("cancelled") ||
                normalizedVariant.includes("out_of_stock")
              ? "bg-rose-500"
              : "bg-current"
          }`}
        />
      )}
      {children}
    </span>
  );
}

export { Badge };
