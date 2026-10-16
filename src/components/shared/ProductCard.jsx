// src/components/shared/ProductCard.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { HeartIcon, HeartFillIcon, StarIcon, BadgeCheckIcon } from "@/icons";
import { H5, H6, Caption } from "@/components/ui/Typography";
import {
  singleAddToCartsList,
  setBuyNowItem,
  openCart,
} from "@/redux/slice/CartDrawerSlice";
import { getSafeImageSrc } from "@/utils/imageUtils";

export default function ProductCard({ product = {}, href }) {
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(false);

  // Normalize product properties
  const categoryName =
    typeof product?.category === "object"
      ? product.category?.name
      : product?.category || "Digital Product";

  const rawProductImage =
    product?.thumbnail ||
    (Array.isArray(product?.media) &&
      (typeof product.media[0] === "string"
        ? product.media[0]
        : product.media[0]?.url)) ||
    product?.image;

  const productImage = getSafeImageSrc(
    rawProductImage,
    "/product_demo_image.jpg"
  );

  const sellerName =
    product?.seller?.shopName ||
    product?.seller?.fullName ||
    product?.seller?.name ||
    "Verified Seller";

  const sellerAvatar = getSafeImageSrc(
    product?.seller?.image || product?.seller?.avatar,
    "/seller_avater.jpg"
  );

  const sellerRating = product?.seller?.rating || product?.rating || "5.0";

  const sellerReviews =
    product?.seller?.reviews || `${product?.reviewsCount ?? 0} reviews`;

  const specsList =
    Array.isArray(product?.specs) && product.specs.length > 0
      ? product.specs
      : Array.isArray(product?.features) && product.features.length > 0
      ? product.features
      : [product?.brand || "Instant Delivery", product?.region || "Global"].filter(
          Boolean
        );

  const isInStock =
    product?.inStock !== undefined
      ? Boolean(product.inStock)
      : (product?.stock ?? 0) > 0;

  const regularPrice = Number(product?.price || 0);
  const rawSalePrice = Number(
    product?.salePrice !== undefined && product?.salePrice !== null
      ? product.salePrice
      : product?.discountPrice || 0
  );
  const hasDiscount = rawSalePrice > 0 && rawSalePrice < regularPrice;
  const activePrice = hasDiscount ? rawSalePrice : regularPrice;
  const priceFormatted = activePrice.toFixed(2);
  const regularPriceFormatted = regularPrice.toFixed(2);

  // Link to /product/[slug] everywhere by default
  const targetHref =
    product?.slug
      ? `/product/${product.slug}`
      : href
      ? href
      : product?._id
      ? `/product/${product._id}`
      : product?.id
      ? `/product/${product.id}`
      : null;

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const cartItem = {
      productId: product?._id || product?.id || 1,
      name: product?.title || "Product",
      productTitle: product?.title,
      title: product?.title,
      price: activePrice,
      quantity: 1,
      image: productImage,
      sellerName: sellerName,
      category: categoryName,
    };

    dispatch(singleAddToCartsList(cartItem));
    dispatch(setBuyNowItem(cartItem));
    dispatch(openCart());
    toast.success(`Added ${product?.title || "product"} to cart`);
  };

  return (
    <div className="group relative bg-card rounded-[12px] border border-border cursor-pointer transition-all duration-200 hover:border-brand flex flex-col justify-between overflow-hidden">
      {/* Whole Card Link Overlay */}
      {targetHref && (
        <Link
          href={targetHref}
          className="absolute inset-0 z-10"
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
            {productImage ? (
              <Image
                src={productImage}
                alt={product.title || "Product"}
                width={56}
                height={56}
                className="size-14 object-contain rounded-lg"
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
            className="absolute top-[14px] right-[14px] z-20 p-1 rounded-full transition-colors cursor-pointer"
          >
            {isLiked ? (
              <HeartFillIcon size={20} color="#F43F5E" />
            ) : (
              <HeartIcon
                size={20}
                className="text-primary opacity-70 hover:opacity-100 transition-opacity"
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
            {categoryName}
          </span>

          {/* Title */}
          <H5 className="mt-2 transition-colors duration-200 group-hover:text-brand line-clamp-1 align-middle">
            {product.title}
          </H5>

          {/* Specs */}
          {specsList.length > 0 && (
            <Caption className="mt-1.5 line-clamp-1 align-middle">
              {specsList.join("\u00A0\u00A0 • \u00A0\u00A0")}
            </Caption>
          )}

          {/* Status Badges */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {hasDiscount && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200/80 rounded-full">
                {Math.round(((regularPrice - activePrice) / regularPrice) * 100)}% OFF
              </span>
            )}
            {isInStock ? (
              <span className="px-1.5 py-0.5 text-[10px] font-medium text-success bg-success/10 rounded-full">
                In Stock ({product.stock ?? "Available"})
              </span>
            ) : (
              <span className="px-1.5 py-0.5 text-[10px] font-medium text-rose-600 bg-rose-50 rounded-full">
                Out of Stock
              </span>
            )}
            <span className="px-1.5 py-0.5 text-[10px] font-medium text-secondary-600 bg-secondary-600/10 rounded-full">
              Instant Delivery
            </span>
          </div>

          {/* Seller Info Box */}
          <div className="mt-4 p-2.5 bg-[#F9FAFB] rounded-[16px] flex items-center gap-3">
            <Image
              src={sellerAvatar}
              alt={sellerName}
              width={32}
              height={32}
              className="size-8 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <H6 className="truncate align-middle font-semibold text-[12px] text-primary">
                  {sellerName}
                </H6>
                <span className="inline-flex text-[#2563EB] shrink-0" title="Verified Seller">
                  <BadgeCheckIcon size={14} color="#2563EB" />
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                <StarIcon size={12} color="#F59E0B" className="shrink-0" />
                <span className="font-semibold text-[#2563EB]">
                  {sellerRating}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400 truncate">
                  {sellerReviews}
                </span>
              </div>
            </div>
          </div>

          {/* Divider & Footer */}
          <div className="mt-4 pt-3.5 border-t border-[#F3F4F6] flex items-center justify-between">
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="text-[20px] font-bold leading-[120%] tracking-[0.5px] text-primary align-middle">
                ${priceFormatted}
              </span>
              {hasDiscount && (
                <span className="text-[13px] font-medium text-gray-400 line-through align-middle truncate">
                  ${regularPriceFormatted}
                </span>
              )}
            </div>
            <Link
              href={targetHref || "#"}
              className="relative z-20 px-5 py-2 bg-[#F3F4F6] hover:bg-brand hover:text-white text-[#374151] text-[12px] font-semibold leading-[130%] tracking-normal rounded-[10px] transition-all duration-200 shadow-2xs cursor-pointer flex items-center gap-1 flex-shrink-0"
            >
              <span>View</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
