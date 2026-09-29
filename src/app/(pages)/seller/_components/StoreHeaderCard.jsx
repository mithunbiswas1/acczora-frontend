// src/app/(pages)/store/_components/StoreHeaderCard.jsx

import Image from "next/image";
import { Send } from "lucide-react";
import { BadgeCheckIcon } from "@/icons";

export default function StoreHeaderCard({ seller }) {
  if (!seller) return null;

  const {
    name = "NovaStore",
    avatar = "/seller_avater.jpg",
    verified = true,
    bio = "Streaming, AI tools and design licenses",
    rating = "4.9",
    ratingLabel = "Seller rating",
    sales = "1,284",
    salesLabel = "Sales",
    positiveReviews = "98%",
    positiveLabel = "Positive reviews",
    since = "Since 2025",
    sinceLabel = "Selling on ACCZORA",
  } = seller;

  return (
    <div className="bg-white rounded-[24px] border border-border p-6 sm:p-8 shadow-xs">
      {/* Top Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {/* Left: Avatar & Title info */}
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative size-18 sm:size-20 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
            <Image
              src={avatar}
              alt={name}
              fill
              sizes="80px"
              className="object-cover"
              priority
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
                {name}
              </h1>
              {verified && (
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EFF6FF] text-info text-xs font-semibold">
                  <BadgeCheckIcon size={14} color="#2563EB" />
                  <span>Verified Seller</span>
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-secondary mt-1">
              {bio}
            </p>
          </div>
        </div>

        {/* Right: Share Store button */}
        <div className="shrink-0">
          <button
            type="button"
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-border bg-white hover:bg-gray-50 text-xs sm:text-sm font-semibold text-primary flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <Send className="size-4 text-primary" />
            <span>Share Store</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-[#F0F2F5] my-6 sm:my-8" />

      {/* Bottom 4 Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
        <div className="md:pr-6 md:border-r md:border-border">
          <p className="text-xl sm:text-2xl font-bold text-primary">{rating}</p>
          <p className="text-xs text-secondary mt-0.5">{ratingLabel}</p>
        </div>

        <div className="md:px-6 md:border-r md:border-border">
          <p className="text-xl sm:text-2xl font-bold text-primary">{sales}</p>
          <p className="text-xs text-secondary mt-0.5">{salesLabel}</p>
        </div>

        <div className="md:px-6 md:border-r md:border-border">
          <p className="text-xl sm:text-2xl font-bold text-primary">{positiveReviews}</p>
          <p className="text-xs text-secondary mt-0.5">{positiveLabel}</p>
        </div>

        <div className="md:pl-6">
          <p className="text-xl sm:text-2xl font-bold text-primary">{since}</p>
          <p className="text-xs text-secondary mt-0.5">{sinceLabel}</p>
        </div>
      </div>
    </div>
  );
}
