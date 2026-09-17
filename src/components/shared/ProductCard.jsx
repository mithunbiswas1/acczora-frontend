// src/components/shared/ProductCard.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Check } from "lucide-react";
import { HeartIcon, HeartFillIcon } from "@/icons";
import { H5, H6, Caption } from "@/components/ui/Typography";

export default function ProductCard({ product, href }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="group relative bg-card rounded-[12px] border border-border cursor-pointer transition-all duration-200 hover:border-brand flex flex-col justify-between overflow-hidden">
      {/* Optional Card Link */}
      {href && (
        <Link
          href={href}
          className="absolute inset-0 z-0"
          aria-label={product.title}
        />
      )}

      <div>
        {/* Visual Box (Gradient from left-bottom to right-top) */}
        <div
          style={{
            background:
              product.gradient ||
              `linear-gradient(to top right, ${product.bg || "#066BDA1A"} 0%, transparent 100%)`,
          }}
          className="relative w-full h-29 p-[14px] flex items-end"
        >
          {/* Brand Logo (Image from logo_image) */}
          <div className="flex items-center transition-transform duration-200">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.title}
                width={56}
                height={56}
                className="size-14 object-contain"
              />
            ) : product.renderLogo ? (
              product.renderLogo()
            ) : null}
          </div>

          {/* Wishlist Button (Top-Right: 14px) */}
          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-[14px] right-[14px] z-10 p-1 rounded-full transition-colors cursor-pointer"
          >
            {isLiked ? (
              <HeartFillIcon size={20} color="#F43F5E" />
            ) : (
              <HeartIcon
                size={20}
                color="#111827"
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            )}
          </button>

          {/* Best Seller Badge (Bottom-Right: 14px) */}
          {product.isBestSeller && (
            <span className="absolute bottom-[14px] right-[14px] px-1.5 py-0.5 text-[10px] font-medium text-primary bg-primary/6 rounded-full">
              Best Seller
            </span>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4">
          {/* Category Badge */}
          <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-primary bg-primary/6 rounded-full">
            {product.category}
          </span>

          {/* Title */}
          <H5 className="mt-2 transition-colors duration-200 group-hover:text-brand line-clamp-1 align-middle">
            {product.title}
          </H5>

          {/* Specs */}
          <Caption className="mt-1.5 line-clamp-1 align-middle">
            {product.specs.join("\u00A0\u00A0 • \u00A0\u00A0")}
          </Caption>

          {/* Status Badges */}
          <div className="mt-3 flex items-center gap-2">
            {product.inStock && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium text-success bg-success/10 rounded-full">
                In Stock
              </span>
            )}
            {product.instantDelivery && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium text-secondary-600 bg-secondary-600/10 rounded-full">
                Instant Delivery
              </span>
            )}
          </div>

          {/* Seller Info Box */}
          <div className="mt-4 p-2.5 bg-[#F9FAFB] rounded-[16px] flex items-center gap-3">
            <Image
              src={product.seller.avatar}
              alt={product.seller.name}
              width={32}
              height={32}
              className="size-8 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <H6 className="truncate align-middle font-semibold text-[12px] text-[#111827]">
                  {product.seller.name}
                </H6>
                {product.seller.verified && (
                  <span className="size-3.5 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                    <Check className="size-2.5" strokeWidth={3.5} />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                <Star className="size-3 fill-[#F59E0B] text-[#F59E0B] shrink-0" />
                <span className="font-semibold text-[#2563EB]">
                  {product.seller.rating}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400 truncate">
                  {product.seller.reviews}
                </span>
              </div>
            </div>
          </div>

          {/* Divider & Footer */}
          <div className="mt-4 pt-3.5 border-t border-[#F3F4F6] flex items-center justify-between">
            <span className="text-[20px] font-semibold leading-[120%] tracking-[0.5px] text-primary align-middle">
              ${product.price.toFixed(2)}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="relative z-10 px-5 py-2 bg-success hover:bg-success/90  text-white text-[12px] font-semibold leading-[130%] tracking-normal rounded-[10px] transition-colors shadow-2xs cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
