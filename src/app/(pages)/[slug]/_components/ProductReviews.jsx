// src/app/(pages)/[slug]/_components/ProductReviews.jsx

import Image from "next/image";
import { Star, TrendingUp } from "lucide-react";
import { H3 } from "@/components/ui/Typography";

export default function ProductReviews({ reviewsData }) {
  const {
    totalReviews = "10.0k",
    growth = "21%",
    growthSubtext = "Growth in reviews on this year",
    averageRating = "4.0",
    ratingSubtext = "Average ratings on this year",
    distribution = [
      { stars: 5, count: "9.1k", percentage: 91 },
      { stars: 4, count: "1.2k", percentage: 45 },
      { stars: 3, count: "400", percentage: 20 },
      { stars: 2, count: "150", percentage: 8 },
      { stars: 1, count: "80", percentage: 3 },
    ],
    items = [
      {
        id: 1,
        author: "Rosanna A.",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
        rating: 5,
        comment:
          "Great account and fast delivery. Exactly as described. My previous account was banned and seller helped me set up everything smoothly. Recommended seller!",
      },
      {
        id: 2,
        author: "Rosanna A.",
        avatar:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80",
        rating: 5,
        comment:
          "Instant delivery as promised! Account came with all games active and original credentials. Very responsive customer support.",
      },
      {
        id: 3,
        author: "Rosanna A.",
        avatar:
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80",
        rating: 5,
        comment:
          "Seamless checkout and transfer process. Escrow payment gave me full peace of mind. Will definitely buy again!",
      },
    ],
  } = reviewsData || {};

  return (
    <section className="mt-14 sm:mt-16 pt-10 border-t border-[#F0F2F5]">
      {/* Metrics Overview: 3-column stats card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 shadow-xs">
        {/* Metric 1: Total Reviews */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-[#9CA3AF]">Total Reviews</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl sm:text-4xl font-bold text-[#1F2937]">
                {totalReviews}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                <TrendingUp className="size-3" />
                <span>+{growth}</span>
              </span>
            </div>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-3">{growthSubtext}</p>
        </div>

        {/* Metric 2: Average Ratings */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-[#9CA3AF]">Average Ratings</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl sm:text-4xl font-bold text-[#1F2937]">
                {averageRating}
              </span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`size-4 ${
                      star <= 4
                        ? "fill-[#F59E0B] text-[#F59E0B]"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-3">{ratingSubtext}</p>
        </div>

        {/* Metric 3: Rating Distribution Bars */}
        <div className="space-y-1.5">
          {distribution.map((dist) => (
            <div
              key={dist.stars}
              className="flex items-center gap-2 text-xs text-[#9CA3AF]"
            >
              {/* Stars indicator */}
              <div className="flex items-center gap-0.5 w-16 shrink-0">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`size-2.5 ${
                      i < dist.stars
                        ? "fill-[#F59E0B] text-[#F59E0B]"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* Progress bar */}
              <div className="flex-1 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6658FF] rounded-full transition-all duration-300"
                  style={{ width: `${dist.percentage}%` }}
                />
              </div>

              {/* Count */}
              <span className="w-8 text-right text-[11px] font-medium text-[#9CA3AF] shrink-0">
                {dist.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Testimonials List */}
      <div className="mt-8 divide-y divide-[#F0F2F5]">
        {items.map((review) => (
          <div
            key={review.id}
            className="py-5 sm:py-6 first:pt-2 last:pb-2 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8"
          >
            {/* Reviewer Profile */}
            <div className="flex items-center sm:items-start gap-3 sm:w-48 shrink-0">
              <div className="relative size-11 sm:size-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                <Image
                  src={review.avatar}
                  alt={review.author}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[#1F2937]">
                  {review.author}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex items-center gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="size-3 fill-[#F59E0B] text-[#F59E0B]"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#9CA3AF] font-medium">
                    2.5k
                  </span>
                </div>
              </div>
            </div>

            {/* Review Comment Body */}
            <div className="flex-1 min-w-0 sm:pt-0.5">
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
