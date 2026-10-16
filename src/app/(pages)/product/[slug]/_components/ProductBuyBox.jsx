// src/app/(pages)/[slug]/_components/ProductBuyBox.jsx

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Check,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Minus,
  Plus,
  Heart,
  Loader2,
  Coins,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import {
  StarIcon,
  BadgeCheckIcon,
  ArrowUpRightFromSquareIcon,
} from "@/icons";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  useCreateOrderMutation,
  useBuyPointsMutation,
  useGetMyPointsQuery,
} from "@/redux/api/orderApi";
import { getSafeImageSrc } from "@/utils/imageUtils";

export default function ProductBuyBox({ product = {} }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  // Queries & Mutations
  const { data: myPointsRes, refetch: refetchPoints } = useGetMyPointsQuery(
    undefined,
    { skip: !isLoggedIn }
  );
  const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();
  const [buyPoints, { isLoading: isBuyingPoints }] = useBuyPointsMutation();

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Buy Points Modal State
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
  const [pointsInput, setPointsInput] = useState("");

  // Success Modal State
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [purchasedOrder, setPurchasedOrder] = useState(null);

  const {
    _id,
    id,
    title = "Product",
    category,
    subcategory,
    categoryTags,
    rating = 4.8,
    reviewsCount = 127,
    stock = 1,
    stockLeft,
    price = 0,
    salePrice,
    discountPrice,
    seller = {},
    deliveryTime = "Instant delivery",
    deliverySubtext = "Delivered just minute after order",
  } = product || {};

  const availableStock =
    stock !== undefined ? stock : stockLeft !== undefined ? stockLeft : 1;

  const currentPoints = Number(
    myPointsRes?.data?.points ?? user?.points ?? 0
  );

  const regularPrice = Number(
    product?.price !== undefined ? product.price : price || 0
  );
  const rawSalePrice = Number(
    product?.salePrice !== undefined && product?.salePrice !== null
      ? product.salePrice
      : product?.discountPrice !== undefined
      ? product.discountPrice
      : salePrice !== undefined
      ? salePrice
      : discountPrice || 0
  );
  const hasDiscount = rawSalePrice > 0 && rawSalePrice < regularPrice;
  const unitPrice = hasDiscount ? rawSalePrice : regularPrice;
  const totalAmount = unitPrice * quantity;
  const totalPointsNeeded = totalAmount; // 1 dollar = 1 unit, 0.90 dollar = 0.90 unit
  const pointsShortage = Math.max(0, totalPointsNeeded - currentPoints);

  const categoryName =
    typeof category === "object" ? category?.name : category || "";
  const subcategoryName =
    typeof subcategory === "object" ? subcategory?.name : subcategory || "";

  const resolvedCategoryTags =
    categoryTags ||
    (categoryName && subcategoryName
      ? `${categoryName} / ${subcategoryName}`
      : categoryName || subcategoryName || "");

  const sellerName =
    seller?.shopName || seller?.fullName || seller?.name || "Verified Seller";
  const sellerSlug =
    seller?.shopSlug || seller?.userName || seller?.slug || "store";
  const sellerAvatar = getSafeImageSrc(
    seller?.image || seller?.avatar,
    "/seller_avater.jpg"
  );

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < availableStock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.warning(`Maximum available stock is ${availableStock}`);
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

  // Open Points Modal with prefilled shortage
  const handleOpenBuyPointsModal = () => {
    setPointsInput(
      pointsShortage > 0 ? pointsShortage.toFixed(2) : "10"
    );
    setIsPointsModalOpen(true);
  };

  // Add funds action (1 dollar = 1 unit, initially entering number adds it)
  const handleBuyPointsSubmit = async (e) => {
    e?.preventDefault();
    const num = parseFloat(pointsInput);
    if (isNaN(num) || num <= 0) {
      toast.error("Please enter a valid positive dollar amount");
      return;
    }

    try {
      const res = await buyPoints({ points: num }).unwrap();
      toast.success(
        res?.message || `Successfully added $${num.toFixed(2)} to your balance!`
      );
      if (refetchPoints) refetchPoints();
      setIsPointsModalOpen(false);
    } catch (err) {
      toast.error(
        err?.data?.message || err?.message || "Failed to add funds"
      );
    }
  };

  // Immediate Buy Now using Points
  const handleBuyNow = async () => {
    if (availableStock <= 0) {
      toast.error("This product is currently out of stock");
      return;
    }

    if (!isLoggedIn || !user) {
      toast.info("Please log in to purchase this product");
      router.push(`/login?redirect=/product/${product?.slug || _id || id}`);
      return;
    }

    // Check if user has sufficient funds
    if (currentPoints < totalPointsNeeded) {
      handleOpenBuyPointsModal();
      toast.info(
        `Your balance is $${currentPoints.toFixed(2)} but this order requires $${totalPointsNeeded.toFixed(2)}. Please add funds to proceed.`
      );
      return;
    }

    if (_id) {
      try {
        const res = await createOrder({
          productId: _id,
          quantity: quantity,
        }).unwrap();

        toast.success(
          `Purchase successful! $${totalPointsNeeded.toFixed(2)} deducted from your wallet.`
        );
        if (refetchPoints) refetchPoints();
        setPurchasedOrder(
          res?.data?.order || {
            productTitle: title,
            quantity: quantity,
            totalAmount: totalPointsNeeded,
            orderNumber: res?.data?.order?.orderNumber,
          }
        );
        setIsSuccessModalOpen(true);
      } catch (err) {
        if (
          err?.data?.message?.toLowerCase().includes("insufficient points")
        ) {
          handleOpenBuyPointsModal();
        }
        toast.error(
          err?.data?.message || err?.message || "Failed to complete purchase"
        );
      }
    } else {
      setPurchasedOrder({
        productTitle: title,
        quantity: quantity,
        totalAmount: totalPointsNeeded,
        orderNumber: `ORD-${Date.now().toString(36).toUpperCase()}`,
      });
      setIsSuccessModalOpen(true);
      toast.success("Demo item purchased successfully!");
    }
  };

  return (
    <div className="flex flex-col justify-between h-full py-0.5">
      <div>
        {/* Category Pill Tag */}
        {resolvedCategoryTags && (
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F3F4F6] text-xs font-medium text-[#4B5563] mb-3">
              {resolvedCategoryTags}
            </span>
          </div>
        )}

        {/* Product Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-primary leading-tight mb-2.5">
          {title}
        </h1>

        {/* Rating & Sold Row */}
        <div className="flex items-center gap-2 mb-3.5">
          <div className="flex items-center gap-1.5 text-xs">
            <StarIcon size={14} color="#F59E0B" />
            <span className="font-semibold text-primary">{rating || 5.0}</span>
            <span className="text-tertiary">
              ({reviewsCount ?? 0} Reviews)
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-border text-[11px] font-medium text-secondary">
            {product?.salesCount || `${product?.sales ?? 0} Sold`}
          </span>
        </div>

        {/* Seller Info */}
        <div className="flex items-center gap-2.5 mb-4">
          <Link
            href={`/store/${sellerSlug}`}
            className="relative size-7 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200 hover:opacity-80 transition-opacity"
            title={`Visit ${sellerName}`}
          >
            <Image
              src={sellerAvatar}
              alt={sellerName}
              fill
              sizes="28px"
              className="object-cover"
            />
          </Link>
          <div className="flex flex-col">
            <Link
              href={`/store/${sellerSlug}`}
              className="flex items-center gap-1 group hover:text-[#5B4DFB] transition-colors"
            >
              <span className="text-xs font-semibold text-primary group-hover:text-[#5B4DFB] transition-colors">
                Verified Seller
              </span>
              <BadgeCheckIcon size={14} color="#2563EB" />
            </Link>
            <Link
              href={`/store/${sellerSlug}`}
              className="text-[11px] font-medium text-info hover:underline flex items-center gap-1"
            >
              <span>{sellerName}</span>
              <ArrowUpRightFromSquareIcon size={10} color="#2563EB" />
            </Link>
          </div>
        </div>

        {/* Price Display */}
        <div className="mb-4 flex flex-wrap items-baseline gap-3">
          <span className="text-3xl font-black text-primary tracking-tight">
            ${unitPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-lg font-medium text-gray-400 line-through">
              ${regularPrice.toFixed(2)}
            </span>
          )}
          {hasDiscount && (
            <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
              {Math.round(((regularPrice - unitPrice) / regularPrice) * 100)}% OFF
            </span>
          )}
          <span className="text-xs font-semibold text-gray-500">
            Instant digital delivery
          </span>
        </div>

        {/* User's Available Balance Bar */}
        {isLoggedIn && (
          <div className="mb-5 p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Coins className="size-4" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium">
                  Your Available Balance
                </p>
                <p className="text-sm font-bold text-gray-900">
                  ${currentPoints.toFixed(2)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenBuyPointsModal}
              className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-xs font-semibold text-gray-700 hover:border-brand hover:text-brand transition-colors cursor-pointer shadow-2xs"
            >
              + Add Funds
            </button>
          </div>
        )}

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
                {deliverySubtext || "Delivered automatically after payment."}
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
                  {availableStock > 0 ? "In Stock" : "Out of Stock"}
                </p>
                <span className="px-1.5 py-0.5 rounded-full bg-border text-[10px] font-medium text-secondary">
                  {availableStock}
                </span>
              </div>
              <p className="text-[11px] text-tertiary">
                {availableStock > 0
                  ? "Available now and ready for auto-delivery."
                  : "Currently waiting for inventory restock."}
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
            disabled={quantity <= 1 || availableStock <= 0}
            aria-label="Decrease quantity"
            className="p-1 text-tertiary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="min-w-[18px] text-center text-xs font-semibold text-primary">
            {availableStock > 0 ? quantity : 0}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            disabled={quantity >= availableStock || availableStock <= 0}
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
          disabled={isOrdering || availableStock <= 0}
          className="h-11 px-8 rounded-[8px] bg-success hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          {isOrdering ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : availableStock <= 0 ? (
            <span>Out of Stock</span>
          ) : (
            <span>Buy Now (${totalPointsNeeded.toFixed(2)})</span>
          )}
        </button>
      </div>

      {/* ADD FUNDS / TOP-UP MODAL */}
      <Modal
        isOpen={isPointsModalOpen}
        onClose={() => setIsPointsModalOpen(false)}
        title="Add Funds to Wallet"
        subtitle="Deposit funds to your wallet for instant digital account delivery"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 pt-2">
          {/* Balance info card */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <div className="flex items-center justify-between text-xs text-amber-900 font-medium">
              <span>Your Current Balance:</span>
              <span className="font-bold">${currentPoints.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-amber-900 font-medium mt-1.5">
              <span>Required for Purchase:</span>
              <span className="font-bold">${totalPointsNeeded.toFixed(2)}</span>
            </div>
            {pointsShortage > 0 && (
              <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs text-rose-700 font-bold">
                <span>Shortage:</span>
                <span>+${pointsShortage.toFixed(2)} Needed</span>
              </div>
            )}
          </div>

          {/* Quick preset buttons */}
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-2">
              Quick Presets:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {pointsShortage > 0 && (
                <button
                  type="button"
                  onClick={() => setPointsInput(pointsShortage.toFixed(2))}
                  className="px-2 py-1.5 rounded-lg border border-brand bg-brand/5 text-[11px] font-bold text-brand hover:bg-brand/10 transition-colors"
                >
                  Exact (${pointsShortage.toFixed(2)})
                </button>
              )}
              {["5", "10", "20", "50", "100"].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPointsInput(val)}
                  className={`px-2 py-1.5 rounded-lg border text-[11px] font-semibold transition-colors ${
                    pointsInput === val
                      ? "border-brand bg-brand text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>
          </div>

          {/* Point Input Form */}
          <form onSubmit={handleBuyPointsSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                Amount to Deposit ($ USD):
              </label>
              <Input
                type="number"
                step="0.01"
                min="0.1"
                value={pointsInput}
                onChange={(e) => setPointsInput(e.target.value)}
                placeholder="Enter amount (e.g. 10 or 0.90)"
                required
                className="h-10"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Enter any amount to immediately top up your wallet balance.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsPointsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="solid"
                size="sm"
                disabled={isBuyingPoints || !pointsInput || parseFloat(pointsInput) <= 0}
              >
                {isBuyingPoints ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1.5" />
                    <span>Adding Funds...</span>
                  </>
                ) : (
                  <span>Deposit Funds (${pointsInput || "0"})</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* SUCCESS PURCHASE MODAL */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        maxWidth="max-w-md"
        showClose={true}
      >
        <div className="text-center py-4 px-2">
          {/* Success Check Icon */}
          <div className="size-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75 duration-200">
            <CheckCircle2 className="size-9 text-emerald-600 stroke-[2.2]" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            Purchase Successful!
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
            Your digital account credentials have been auto-delivered and are ready in your dashboard.
          </p>

          {/* Details Box */}
          <div className="my-5 p-4 rounded-xl bg-gray-50 border border-gray-200/80 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between text-gray-600">
              <span>Item:</span>
              <span className="font-semibold text-gray-900 truncate max-w-[200px]">
                {purchasedOrder?.productTitle || title}
              </span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Quantity:</span>
              <span className="font-semibold text-gray-900">
                {purchasedOrder?.quantity || quantity} account(s)
              </span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Total Paid:</span>
              <span className="font-bold text-emerald-600">
                ${Number(purchasedOrder?.totalAmount || totalPointsNeeded).toFixed(2)}
              </span>
            </div>
            {purchasedOrder?.orderNumber && (
              <div className="flex items-center justify-between text-gray-500 pt-1.5 border-t border-gray-200">
                <span>Order ID:</span>
                <span className="font-mono text-[11px] font-semibold text-gray-700">
                  {purchasedOrder.orderNumber}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons: Go to Dashboard & Marketplace */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <Link
              href={
                purchasedOrder?._id || purchasedOrder?.id
                  ? `/buyer/purchases/${purchasedOrder._id || purchasedOrder.id}`
                  : "/buyer/purchases"
              }
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <span>Go to Dashboard</span>
              <ArrowUpRightFromSquareIcon size={12} color="#ffffff" />
            </Link>

            <Link
              href="/marketplace"
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-gray-300 hover:border-gray-400 bg-white text-gray-700 text-xs sm:text-sm font-semibold flex items-center justify-center transition-colors"
            >
              <span>Marketplace</span>
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
