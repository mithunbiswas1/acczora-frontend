// src/components/shared/ProductReviews.jsx

import Image from "next/image";
import { StarIcon, StarOutlineIcon } from "@/icons";

export default function ProductReviews({ reviewsData }) {
  if (!reviewsData) return null;

  const {
    totalReviews,
    growth,
    growthSubtext,
    averageRating,
    ratingSubtext,
    distribution = [],
    items = [],
  } = reviewsData;

  return (
    <section className="mt-14 sm:mt-16">
      {/* Metrics Overview: 3-column stats with vertical divider borders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 pb-8 sm:pb-10 border-b border-[#F0F2F5]">
        {/* Metric 1: Total Reviews */}
        <div className="flex flex-col justify-between md:pr-8 md:border-r md:border-[#F0F2F5]">
          <div>
            <p className="text-sm font-semibold text-primary">Total Reviews</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
                {totalReviews}
              </span>
              {growth && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#ECFDF5] text-success text-xs font-semibold">
                  {growth}
                </span>
              )}
            </div>
          </div>
          {growthSubtext && (
            <p className="text-xs text-tertiary mt-3 sm:mt-4">{growthSubtext}</p>
          )}
        </div>

        {/* Metric 2: Average Ratings */}
        <div className="flex flex-col justify-between md:px-8 md:border-r md:border-[#F0F2F5]">
          <div>
            <p className="text-sm font-semibold text-primary">Average Ratings</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
                {averageRating}
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} size={16} color="#F59E0B" />
                ))}
              </div>
            </div>
          </div>
          {ratingSubtext && (
            <p className="text-xs text-tertiary mt-3 sm:mt-4">{ratingSubtext}</p>
          )}
        </div>

        {/* Metric 3: Rating Distribution Bars */}
        <div className="space-y-2 md:pl-8 flex flex-col justify-center">
          {distribution.map((dist) => (
            <div
              key={dist.stars}
              className="flex items-center gap-3 text-xs text-tertiary"
            >
              {/* Stars indicator (filled + outline) */}
              <div className="flex items-center gap-1 shrink-0 w-22">
                {[...Array(5)].map((_, i) => {
                  if (i < dist.stars) {
                    return <StarIcon key={i} size={14} color="#F59E0B" />;
                  }
                  return <StarOutlineIcon key={i} size={14} color="#F59E0B" />;
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

      {/* Customer Testimonials List */}
      {items.length > 0 && (
        <div className="divide-y divide-[#F0F2F5]">
          {items.map((review) => (
            <div
              key={review.id}
              className="py-6 sm:py-7 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
            >
              {/* Reviewer Profile */}
              <div className="flex items-center gap-3 sm:w-52 shrink-0">
                {review.avatar && (
                  <div className="relative size-12 rounded-[10px] overflow-hidden bg-gray-100 shrink-0 border border-gray-100 shadow-2xs">
                    <Image
                      src={review.avatar}
                      alt={review.author || "Reviewer"}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-primary">
                    {review.author}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex items-center gap-0.5">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <StarIcon key={i} size={13} color="#F59E0B" />
                      ))}
                    </div>
                    <span className="text-xs text-tertiary">
                      ({review.ratingFormatted || (review.rating ? Number(review.rating).toFixed(1) : "5.0")})
                    </span>
                  </div>
                </div>
              </div>

              {/* Vertical separator between profile & comment */}
              <div className="hidden sm:block h-10 w-px bg-border shrink-0" />

              {/* Review Comment Body */}
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-[13px] text-secondary leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
