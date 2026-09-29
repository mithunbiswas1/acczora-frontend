// src/components/shared/CartDrawer.jsx

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { baseUriBackend } from "@/config/base-url";
import {
  closeCart,
  updateQuantity,
  removeFromCartsList,
  clearCartsList,
} from "@/redux/slice/CartDrawerSlice";

const getImageUrl = (path) => {
  if (!path) return "/logo.png";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }
  const cleanPath = path.replace(/^\/+/, "");
  return `${baseUriBackend}${cleanPath}`;
};

export default function CartDrawer() {
  const dispatch = useDispatch();
  const { open, cartsList } = useSelector((state) => state.cartDrawer);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [open]);

  const handleClose = () => {
    dispatch(closeCart());
  };

  const handleRemove = (productId, variationName) => {
    dispatch(removeFromCartsList({ productId, variationName }));
  };

  const handleUpdateQuantity = (productId, variationName, quantity) => {
    dispatch(updateQuantity({ productId, variationName, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCartsList());
  };

  // Calculate totals
  const totalQuantity = cartsList.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartsList.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const totalDiscount = cartsList.reduce((sum, item) => {
    if (item.discountedPrice && item.discountedPrice < item.price) {
      return sum + (item.price - item.discountedPrice) * item.quantity;
    }
    return sum;
  }, 0);

  const netTotal = cartsList.reduce(
    (sum, item) => sum + (item.discountedPrice || item.price) * item.quantity,
    0,
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity duration-300 ease-in-out ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white border-l border-border z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#6558ff] flex items-center justify-center">
              <ShoppingBag className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-none">
                Your Cart
              </h2>
              <span className="text-xs text-gray-400 mt-1 inline-block">
                {totalQuantity} {totalQuantity === 1 ? "item" : "items"} selected
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartsList.length > 0 && (
              <button
                type="button"
                onClick={handleClearCart}
                className="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Items / Empty State */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartsList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-[#6558ff] flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h3 className="text-gray-900 text-lg font-bold">
                Your cart is empty
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 mb-6 max-w-[240px] leading-relaxed">
                Explore verified digital accounts and products in our marketplace.
              </p>
              <Link
                href="/marketplace"
                onClick={handleClose}
                className="bg-[#6558ff] hover:bg-[#5446f5] active:bg-[#4839ee] text-white font-medium text-xs sm:text-sm py-2.5 px-6 rounded-lg transition-colors shadow-sm"
              >
                Explore Marketplace
              </Link>
            </div>
          ) : (
            cartsList.map((item, index) => {
              const hasDiscount =
                item.discountedPrice && item.discountedPrice < item.price;
              const displayPrice = hasDiscount
                ? item.discountedPrice
                : item.price;

              return (
                <div
                  key={`${item.productId}-${item.variationName || index}`}
                  className="flex gap-3 bg-white rounded-xl p-3 border border-border hover:border-gray-300 transition-all shadow-xs"
                >
                  {/* Image */}
                  <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-border bg-gray-50 flex items-center justify-center p-1.5">
                    <Image
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                          {item.name}
                        </h4>
                        {item.variationName && (
                          <span className="text-[11px] text-gray-400 block truncate mt-0.5">
                            {item.variationName}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(item.productId, item.variationName)
                        }
                        className="text-gray-400 hover:text-red-500 transition-colors p-0.5 shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-border rounded-lg bg-gray-50/70 overflow-hidden">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.variationName,
                              item.quantity - 1,
                            )
                          }
                          className="px-2 py-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold text-gray-800 w-6 text-center select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.variationName,
                              item.quantity + 1,
                            )
                          }
                          className="px-2 py-1 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">
                          ${(displayPrice * item.quantity).toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-[11px] text-gray-400 line-through ml-1.5">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartsList.length > 0 && (
          <div className="border-t border-border p-4 sm:p-5 bg-white space-y-3">
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-semibold">
                    -${totalDiscount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-gray-500">
                <span>Delivery</span>
                <span className="font-semibold text-emerald-600">
                  Instant (FREE)
                </span>
              </div>

              <div className="flex justify-between text-base font-bold pt-2.5 border-t border-border text-gray-900">
                <span>Total Amount</span>
                <span className="text-[#6558ff]">
                  ${netTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={handleClose}
              className="w-full bg-[#6558ff] hover:bg-[#5446f5] active:bg-[#4839ee] text-white text-sm font-semibold py-3 rounded-lg text-center transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Instant digital delivery & 100% buyer protection</span>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
