// src/app/(home)/_components/SellerCTA.jsx

"use client";

import { ButtonArrowIcon } from "@/icons";
import { H1, H4 } from "@/components/ui/Typography";
import { LinkButton } from "@/components/ui/LinkButton";

export default function SellerCTA() {
  return (
    <section className="w-full py-8 md:py-15 lg:py-20 xl:py-24">
      <div className="site-container">
        <div className="bg-brand rounded-[30px] p-8 sm:p-12 lg:p-15 flex flex-col lg:flex-row lg:items-end justify-between gap-8 shadow-sm">
          {/* Text Content */}
          <div className="max-w-2xl">
            <H1 className="text-white">
              Have Digital
              <br className="hidden sm:inline" /> Products to Sell?
            </H1>
            <H4 className="mt-4 text-white leading-relaxed font-normal">
              Reach more buyers, manage your products, and grow your business
              with ACCZORA.
            </H4>
          </div>

          {/* Action Button */}
          <div className="mt-8 md:mt-10 xl:mt-15 mt flex justify-center">
            <LinkButton className="w-full sm:w-auto bg-white text-brand" href="/become-a-seller" variant="solid" size="lg">
              <span>Become a Seller</span>
              <ButtonArrowIcon size={18} />
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
