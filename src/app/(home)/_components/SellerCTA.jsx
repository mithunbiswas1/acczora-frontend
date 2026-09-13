// src/app/(home)/_components/SellerCTA.jsx

"use client";

import Link from "next/link";
import { ButtonArrowIcon } from "@/icons";

export default function SellerCTA() {
  return (
    <section className="w-full py-10 lg:py-16">
      <div className="site-container">
        <div className="w-full bg-brand rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 lg:px-16 lg:py-14 flex flex-col lg:flex-row lg:items-center justify-between gap-8 shadow-sm">
          {/* Text Content */}
          <div className="max-w-2xl">
            <h2 className="text-[28px] sm:text-[36px] lg:text-[46px] font-bold text-white leading-[120%] tracking-normal">
              Have Digital
              <br className="hidden sm:inline" /> Products to Sell?
            </h2>
            <p className="mt-4 text-[16px] sm:text-[18px] lg:text-[20px] font-medium text-white/90 leading-[160%]">
              Reach more buyers, manage your products, and grow your business
              with ACCZORA.
            </p>
          </div>

          {/* Action Button */}
          <div className="shrink-0">
            <Link
              href="/seller"
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 bg-white text-brand hover:bg-gray-50 hover:shadow-md text-[15px] sm:text-[16px] font-semibold rounded-xl transition-all duration-200 cursor-pointer w-full sm:w-auto"
            >
              <span>Become a Seller</span>
              <ButtonArrowIcon size={18} color="#6658FF" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
