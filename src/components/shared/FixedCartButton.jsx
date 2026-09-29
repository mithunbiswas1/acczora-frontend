// src/components/shared/FixedCartButton.jsx

"use client";

import { useSelector, useDispatch } from "react-redux";
import { ShoppingBag } from "lucide-react";
import { toggleCart } from "@/redux/slice/CartDrawerSlice";

export default function FixedCartButton() {
  const dispatch = useDispatch();
  const { cartsList } = useSelector((state) => state.cartDrawer);

  // Calculate total items in cart
  const totalItems = cartsList.reduce((sum, item) => sum + item.quantity, 0);

  // Don't show button if cart is empty
  if (totalItems === 0) return null;

  return (
    <button
      onClick={() => dispatch(toggleCart())}
      className="fixed bottom-7 right-7 z-40 bg-[#6558ff] hover:bg-[#5446f5] active:bg-[#4839ee] text-white rounded-full p-3.5 sm:p-4 shadow-xl shadow-[#6558ff]/30 transition-all duration-200 hover:scale-105 group"
      aria-label="Open cart"
    >
      <div className="relative">
        <ShoppingBag
          size={24}
          className="group-hover:scale-105 transition-transform"
        />

        {/* Count Badge */}
        <span className="absolute -top-2.5 -right-2.5 bg-gray-900 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      </div>
    </button>
  );
}
