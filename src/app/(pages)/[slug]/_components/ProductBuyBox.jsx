// src/app/(pages)/[slug]/_components/ProductBuyBox.jsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  Star,
  Check,
  Clock,
  ShieldCheck,
  Minus,
  Plus,
  Heart,
} from "lucide-react";
import { H1 } from "@/components/ui/Typography";
import {
  singleAddToCartsList,
  setBuyNowItem,
  openCart,
} from "@/redux/slice/CartDrawerSlice";

export default function ProductBuyBox({ product }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const {
    id,
    title,
    categoryTags = "Gaming, Commercial & info",
    rating = 4.8,
    reviewsCount = 127,
    stockLeft = 24,
    price = 24.99,
    seller = {
      name: "Harry Potter",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80",
      verified: true,
      role: "Top Client",
    },
    deliveryTime = "Instant delivery",
    deliverySubtext = "Delivered just minute after order",
    guaranteeTime = "30 days guarantee",
    guaranteeSubtext = "Full refund within 30 days",
  } = product || {};

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < (stockLeft || 99)) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.warning(`Maximum available stock is ${stockLeft}`);
    }
  };

  const handleToggleWishlist = () => {
    setIsWishlisted((prev) => {
      const next = !prev;
      if (next) {
        toast.success("Added to your wishlist");
      } else {
        toast.info("Removed from wishlist");
      }
      return next;
    });
  };

  const handleBuyNow = () => {
    const cartItem = {
      productId: id || 3,
      productTitle: title,
      title: title,
      price: price,
      quantity: quantity,
      image: product?.gallery?.[0]?.image || "/logo_image/steam.png",
      sellerName: seller?.name || "Verified Seller",
      category: product?.category || "Gaming",
    };

    dispatch(singleAddToCartsList(cartItem));
    dispatch(setBuyNowItem(cartItem));
    dispatch(openCart());
    toast.success(`Added ${quantity} ${title} to cart`);
  };

  return (
    <div className="flex flex-col justify-between h-full py-0.5">
      <div>
        {/* Category Tag */}
        <p className="text-xs font-semibold text-[#9CA3AF] tracking-wide mb-1.5">
          {categoryTags}
        </p>

        {/* Product Title */}
        <H1 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#1F2937] leading-tight">
          {title}
        </H1>

        {/* Rating & Stock Row */}
        <div className="flex items-center gap-2 mt-2.5 text-xs text-[#9CA3AF]">
          <div className="flex items-center gap-1">
            <Star className="size-3.5 fill-[#F59E0B] text-[#F59E0B]" />
            <span className="font-semibold text-[#1F2937]">{rating}</span>
            <span>({reviewsCount} Reviews)</span>
          </div>
          <span className="text-gray-300">•</span>
          <span className="font-medium text-[#6B7280]">
            {stockLeft} left
          </span>
        </div>

        {/* Seller Bar with Top Client Badge */}
        <div className="mt-3.5 flex items-center gap-2.5">
          <div className="relative size-7 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
            <Image
              src={seller.avatar}
              alt={seller.name}
              fill
              sizes="28px"
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[#1F2937]">
              {seller.name}
            </span>
            {seller.verified && (
              <span className="size-3.5 rounded-full bg-[#2563EB] text-white flex items-center justify-center">
                <Check className="size-2.5 stroke-[3.5]" />
              </span>
            )}
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[11px] font-semibold leading-none">
            {seller.role || "Top Client"}
          </span>
        </div>

        {/* Price Display */}
        <div className="mt-5">
          <span className="text-3xl sm:text-[34px] font-extrabold text-[#1F2937] tracking-tight">
            ${Number(price).toFixed(2)}
          </span>
        </div>

        {/* Delivery & Guarantee Info */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-start gap-2.5">
            <div className="size-7 rounded-full bg-[#F3F4F6] flex items-center justify-center shrink-0 mt-0.5 text-[#6B7280]">
              <Clock className="size-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1F2937]">
                {deliveryTime}
              </p>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                {deliverySubtext}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="size-7 rounded-full bg-[#F3F4F6] flex items-center justify-center shrink-0 mt-0.5 text-[#6B7280]">
              <ShieldCheck className="size-3.5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1F2937]">
                {guaranteeTime}
              </p>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                {guaranteeSubtext}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar (Wishlist, Stepper, Green Buy Now) */}
      <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-3">
        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`size-10 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-xs ${
            isWishlisted
              ? "border-rose-200 bg-rose-50 text-rose-500"
              : "border-[#E5E7EB] hover:border-gray-400 text-[#6B7280] bg-white"
          }`}
        >
          <Heart
            className="size-4.5"
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        {/* Quantity Stepper */}
        <div className="h-10 px-3 rounded-lg border border-[#E5E7EB] flex items-center gap-3 bg-white select-none shadow-xs">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="p-0.5 text-[#6B7280] hover:text-[#111827] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="min-w-[18px] text-center text-xs font-semibold text-[#1F2937]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            disabled={quantity >= (stockLeft || 99)}
            aria-label="Increase quantity"
            className="p-0.5 text-[#6B7280] hover:text-[#111827] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="size-3.5" />
          </button>
        </div>

        {/* Green Buy Now Button */}
        <button
          type="button"
          onClick={handleBuyNow}
          className="h-10 px-8 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors shadow-xs flex items-center justify-center cursor-pointer"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
