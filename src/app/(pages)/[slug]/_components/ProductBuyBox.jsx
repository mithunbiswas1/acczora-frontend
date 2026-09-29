// src/app/(pages)/[slug]/_components/ProductBuyBox.jsx

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  Check,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Minus,
  Plus,
  Heart,
} from "lucide-react";
import {
  StarIcon,
  BadgeCheckIcon,
  ArrowUpRightFromSquareIcon,
} from "@/icons";
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
      avatar: "/seller_avater.jpg",
      verified: true,
      role: "Top Client",
    },
    deliveryTime = "Instant delivery",
    deliverySubtext = "Delivered just minute after order",
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
      image: product?.gallery?.[0]?.image || "/product_demo_image.jpg",
      sellerName: seller?.name || "NovaStore",
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
        {/* Category Pill Tag */}
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F3F4F6] text-xs font-medium text-[#4B5563] mb-3">
            {categoryTags || "Gaming / Game Accounts"}
          </span>
        </div>

        {/* Product Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-primary leading-tight mb-2.5">
          {title}
        </h1>

        {/* Rating & Sold Row */}
        <div className="flex items-center gap-2 mb-3.5">
          <div className="flex items-center gap-1.5 text-xs">
            <StarIcon size={14} color="#F59E0B" />
            <span className="font-semibold text-primary">{rating || 4.5}</span>
            <span className="text-tertiary">({reviewsCount || 124} Reviews)</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-border text-[11px] font-medium text-secondary">
            {product?.salesCount || "54,669 Sold"}
          </span>
        </div>

        {/* Seller Info */}
        <div className="flex items-center gap-2.5 mb-4">
          <Link
            href={`/seller/${seller?.slug || "nova-store"}`}
            className="relative size-7 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200 hover:opacity-80 transition-opacity"
            title={`Visit ${seller?.name || "NovaStore"}`}
          >
            <Image
              src={seller.avatar}
              alt={seller.name}
              fill
              sizes="28px"
              className="object-cover"
            />
          </Link>
          <div className="flex flex-col">
            <Link
              href={`/seller/${seller?.slug || "nova-store"}`}
              className="flex items-center gap-1 group hover:text-[#5B4DFB] transition-colors"
            >
              <span className="text-xs font-semibold text-primary group-hover:text-[#5B4DFB] transition-colors">
                Verified Seller
              </span>
              <BadgeCheckIcon size={14} color="#2563EB" />
            </Link>
            <Link
              href={`/seller/${seller?.slug || "nova-store"}`}
              className="text-[11px] font-medium text-info hover:underline flex items-center gap-1"
            >
              <span>{seller.name}</span>
              <ArrowUpRightFromSquareIcon size={10} color="#2563EB" />
            </Link>
          </div>
        </div>

        {/* Price Display */}
        <div className="mb-4">
          <span className="text-3xl font-bold text-primary tracking-tight">
            ${Number(price).toFixed(2)}
          </span>
        </div>

        {/* Features Info Bar (Instant Delivery | In Stock) */}
        <div className="flex flex-wrap items-center gap-6 py-2 mb-6">
          {/* Left: Instant Delivery */}
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="size-4 text-secondary mt-0.5 shrink-0 stroke-[1.75]" />
            <div>
              <p className="text-xs font-semibold text-primary">
                {deliveryTime || "Instant Delivery"}
              </p>
              <p className="text-[11px] text-tertiary">
                {deliverySubtext || "Delivered quickly and conveniently."}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-8 w-px bg-border" />

          {/* Right: In Stock */}
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="size-4 text-secondary mt-0.5 shrink-0 stroke-[1.75]" />
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-primary">
                  {product?.stockStatus || "In Stock"}
                </p>
                <span className="px-1.5 py-0.5 rounded-full bg-border text-[10px] font-medium text-secondary">
                  {stockLeft || 120}
                </span>
              </div>
              <p className="text-[11px] text-tertiary">
                {product?.stockSubtext || "Available now and ready to ship."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar (Wishlist, Stepper, Green Buy Now) */}
      <div className="flex items-center gap-3">
        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="h-11 w-11 rounded-[8px] bg-[#E2E8F0] hover:bg-gray-300 text-primary flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Heart
            className="size-4.5"
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        {/* Quantity Stepper */}
        <div className="h-11 px-3 rounded-[8px] border border-border flex items-center gap-3 bg-white select-none">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="p-1 text-tertiary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="min-w-[18px] text-center text-xs font-semibold text-primary">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            disabled={quantity >= (stockLeft || 99)}
            aria-label="Increase quantity"
            className="p-1 text-tertiary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" />
          </button>
        </div>

        {/* Green Buy Now Button */}
        <button
          type="button"
          onClick={handleBuyNow}
          className="h-11 px-8 rounded-[8px] bg-success hover:bg-emerald-700 text-white font-medium text-sm flex items-center justify-center transition-colors cursor-pointer"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
