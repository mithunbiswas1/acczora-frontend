// src/app/(pages)/[slug]/_components/SellerShowcaseCard.jsx

import Image from "next/image";
import Link from "next/link";
import { StarIcon, StarSimpleCheckIcon, BasketDollarIcon, BadgeCheckIcon } from "@/icons";

export default function SellerShowcaseCard({ seller }) {
  const {
    name = seller?.name || "NovaStore",
    avatar = "/seller_avater.jpg",
    verified = true,
    rating = 4.9,
    sales = "1,284",
    positiveRating = "98%",
  } = seller || {};

  return (
    <section id="seller" className="mt-14 sm:mt-16 scroll-mt-24">
      <div className="bg-white rounded-[20px] sm:rounded-[24px] border border-[#E5E7EB] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        {/* Left: Avatar & Info */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Avatar */}
          <Link
            href={`/seller/${seller?.slug || "nova-store"}`}
            className="relative size-16 sm:size-18 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200 hover:opacity-85 transition-opacity"
            title={`Visit ${name}`}
          >
            <Image
              src={avatar}
              alt={name}
              fill
              sizes="72px"
              className="object-cover"
            />
          </Link>

          {/* Details */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href={`/seller/${seller?.slug || "nova-store"}`}
                className="text-lg sm:text-xl font-bold text-primary hover:text-brand transition-colors"
              >
                {name}
              </Link>
              {verified && (
                <Link
                  href="/seller"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] hover:bg-[#DBEAFE] text-info text-xs font-semibold transition-colors"
                  title="Browse verified sellers"
                >
                  <BadgeCheckIcon size={14} color="#2563EB" />
                  <span>Verified Seller</span>
                </Link>
              )}
            </div>

            {/* Metrics Row */}
            <div className="flex items-center gap-3 mt-2 text-xs font-medium">
              <div className="flex items-center gap-1.5 text-warning">
                <StarIcon size={14} color="#F59E0B" />
                <span className="font-semibold text-warning">{rating}</span>
              </div>
              <div className="h-3 w-px bg-border" />
              <div className="flex items-center gap-1.5 text-success">
                <BasketDollarIcon size={14} color="#16A34A" />
                <span className="font-semibold text-success">{sales}</span>
              </div>
              <div className="h-3 w-px bg-border" />
              <div className="flex items-center gap-1.5 text-info">
                <StarSimpleCheckIcon size={14} color="#2563EB" />
                <span className="font-semibold text-info">{positiveRating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Action Button */}
        <div className="w-full sm:w-auto shrink-0">
          <Link
            href={`/seller/${seller?.slug || "nova-store"}`}
            className="w-full sm:w-auto px-6 py-2.5 rounded-[8px] bg-brand hover:bg-brand-hover text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Visit Store</span>
            <span className="text-sm">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
