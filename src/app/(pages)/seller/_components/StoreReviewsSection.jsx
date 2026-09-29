// src/app/(pages)/store/_components/StoreReviewsSection.jsx

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { StarIcon, StarOutlineIcon } from "@/icons";

export default function StoreReviewsSection({
  reviewsSummary,
  reviews = [],
  totalCount = "1,284 reviews",
}) {
  const {
    totalReviews = "10.0k",
    growth = "+21% ↑",
    growthSubtext = "Growth in reviews on this year",
    averageRating = "4.0",
    ratingSubtext = "Average Ratings on the year",
    distribution = [
      { stars: 5, count: "2.2k", percentage: 92 },
      { stars: 4, count: "1.0k", percentage: 55 },
      { stars: 3, count: "500", percentage: 25 },
      { stars: 2, count: "200", percentage: 10 },
      { stars: 1, count: "0", percentage: 2 },
    ],
  } = reviewsSummary || {};

  return (
    <section className="mt-14 sm:mt-20">
      {/* Header */}
      <div className="flex items-baseline gap-2 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
          Seller reviews
        </h2>
        <span className="text-sm font-normal text-tertiary">
          {totalCount}
        </span>
      </div>

      {/* Grid: Left metrics card (4 cols) + Right cards stack (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left: Summary Metrics Card */}
        <div className="lg:col-span-4 bg-white rounded-[20px] border border-border p-6 shadow-xs space-y-5">
          {/* Total Reviews */}
          <div>
            <p className="text-xs font-semibold text-secondary">Total Reviews</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold tracking-tight text-primary">
                {totalReviews}
              </span>
              {growth && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#ECFDF5] text-success text-xs font-semibold">
                  {growth}
                </span>
              )}
            </div>
            {growthSubtext && (
              <p className="text-xs text-tertiary mt-2">{growthSubtext}</p>
            )}
          </div>

          <div className="border-b border-[#F0F2F5]" />

          {/* Average Ratings */}
          <div>
            <p className="text-xs font-semibold text-secondary">Average Ratings</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-3xl font-bold tracking-tight text-primary">
                {averageRating}
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} size={15} color="#F59E0B" />
                ))}
              </div>
            </div>
            {ratingSubtext && (
              <p className="text-xs text-tertiary mt-2">{ratingSubtext}</p>
            )}
          </div>

          <div className="border-b border-[#F0F2F5]" />

          {/* Rating Distribution Bars */}
          <div className="space-y-2 pt-1">
            {distribution.map((dist) => (
              <div
                key={dist.stars}
                className="flex items-center gap-2.5 text-xs text-tertiary"
              >
                {/* Stars indicator (5 to 1) */}
                <div className="flex items-center gap-0.5 shrink-0 w-20">
                  {[...Array(5)].map((_, i) => {
                    if (i < dist.stars) {
                      return <StarIcon key={i} size={13} color="#F59E0B" />;
                    }
                    return <StarOutlineIcon key={i} size={13} color="#F59E0B" />;
                  })}
                </div>

                {/* Progress bar */}
                <div className="flex-1 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand rounded-full transition-all duration-300"
                    style={{ width: `${dist.percentage || 0}%` }}
                  />
                </div>

                {/* Count */}
                <span className="w-8 text-right text-xs font-normal text-primary shrink-0">
                  {dist.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Stack of Review Cards */}
        <div className="lg:col-span-8 space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-[20px] border border-border p-5 sm:p-6 shadow-2xs"
            >
              {/* Reviewer Header */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative size-10 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                    <Image
                      src={review.avatar || "/review_avater.jpg"}
                      alt={review.author || "Reviewer"}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary">
                      {review.author}
                    </h4>
                    {review.verifiedPurchase && (
                      <span className="text-[11px] font-medium text-success flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="size-3 text-success stroke-[2.5]" />
                        <span>Verified Purchase</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-0.5">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <StarIcon key={i} size={13} color="#F59E0B" />
                    ))}
                  </div>
                  <span className="text-xs text-tertiary ml-1">
                    ({review.ratingFormatted || "5.0"})
                  </span>
                </div>
              </div>

              {/* Comment text */}
              <p className="text-xs sm:text-[13px] text-secondary leading-relaxed mt-3.5">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
