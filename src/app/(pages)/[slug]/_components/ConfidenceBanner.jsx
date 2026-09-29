// src/app/(pages)/[slug]/_components/ConfidenceBanner.jsx

import { ShieldCheck, Zap, BadgeCheck, LifeBuoy } from "lucide-react";
import { H2 } from "@/components/ui/Typography";

const confidenceItems = [
  {
    id: "escrow",
    title: "Escrow Payment",
    icon: ShieldCheck,
    isActive: false,
  },
  {
    id: "order-complete",
    title: "Order Complete",
    icon: Zap,
    isActive: true, // highlighted purple card in design
  },
  {
    id: "verified",
    title: "Verified Sellers",
    icon: BadgeCheck,
    isActive: false,
  },
  {
    id: "protection",
    title: "Buyer Protection",
    icon: LifeBuoy,
    isActive: false,
  },
];

export default function ConfidenceBanner() {
  return (
    <section className="mt-14 sm:mt-16">
      {/* Subtitle */}
      <p className="text-xs font-semibold text-[#9CA3AF] tracking-wide">
        Buyer Protection
      </p>

      {/* Main Heading */}
      <H2 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight mt-1">
        Shop with confidence on ACCZORA.
      </H2>

      {/* 4 Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-6">
        {confidenceItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;

          return (
            <div
              key={item.id}
              className={`p-6 sm:p-7 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-white border-2 border-[#6658FF] shadow-sm shadow-[#6658FF]/10"
                  : "bg-white border border-[#E5E7EB] hover:border-gray-300"
              }`}
            >
              {/* Icon Container */}
              <div
                className={`size-11 sm:size-12 rounded-xl flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-[#6658FF] text-white shadow-xs"
                    : "bg-[#F3F4F6] text-[#6B7280]"
                }`}
              >
                <Icon className="size-5 sm:size-6" strokeWidth={isActive ? 2.5 : 2} />
              </div>

              {/* Title */}
              <span
                className={`text-xs sm:text-sm font-semibold mt-3.5 ${
                  isActive ? "text-[#1F2937]" : "text-[#4B5563]"
                }`}
              >
                {item.title}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
