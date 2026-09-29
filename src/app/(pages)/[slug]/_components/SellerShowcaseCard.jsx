// src/app/(pages)/[slug]/_components/SellerShowcaseCard.jsx

import Image from "next/image";
import Link from "next/link";
import { Star, Check, ShoppingBag, ArrowRight } from "lucide-react";
import { H3 } from "@/components/ui/Typography";

export default function SellerShowcaseCard({ seller }) {
  const {
    name = "Candidate Name",
    avatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    verified = true,
    rating = 4.9,
    sales = "1.5k",
    productsCount = "50+",
  } = seller || {};

  return (
    <section className="mt-12 sm:mt-14">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        {/* Left: Avatar & Info */}
        <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
          {/* Avatar */}
          <div className="relative size-14 sm:size-16 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
            <Image
              src={avatar}
              alt={name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2">
              <H3 className="text-base sm:text-lg font-bold text-[#1F2937]">
                {name}
              </H3>
              {verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[11px] font-semibold">
                  <Check className="size-2.5 stroke-[3.5]" />
                  <span>Verified Seller</span>
                </span>
              )}
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-3 mt-1.5 text-xs text-[#9CA3AF]">
              <div className="flex items-center gap-1 font-semibold text-[#1F2937]">
                <Star className="size-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                <span>{rating}</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-[#6B7280]">
                <span>{sales} Sales</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 text-[#6B7280]">
                <ShoppingBag className="size-3 text-[#9CA3AF]" />
                <span>{productsCount} Products</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Action Button */}
        <div className="w-full sm:w-auto shrink-0">
          <Link
            href="/marketplace"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#6658FF] hover:bg-[#5546F0] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <span>Visit Store</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
