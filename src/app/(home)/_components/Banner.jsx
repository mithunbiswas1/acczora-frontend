// src/app/(home)/_components/Banner.jsx

"use client";

import { Check } from "lucide-react";
import { LinkButton } from "@/components/ui/LinkButton";
import { H1, P } from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import { ButtonArrowIcon, SearchIcon } from "@/icons";

const benefits = [
  "Verified Sellers",
  "Secure Payments",
  "Buyer Protection",
  "Fast Delivery",
];

export default function Banner() {
  return (
    <section className="w-full">
      <div className="site-container py-8 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-20 lg:gap-0">
          {/* ================= LEFT CONTENT ================= */}
          <div className="">
            <div className="max-w-143.75">
              {/* Small Label */}
              <span className="px-3 py-1 text-xs font-semibold text-gray-900 bg-gray-100 rounded-full uppercase">
                The Digital Marketplace
              </span>

              {/* Heading */}
              <H1 className="mt-3 text-[46px] font-bold leading-[1.2] text-primary">
                Your Trusted Marketplace for{" "}
                <span className="text-brand">Digital Accounts</span>
              </H1>

              {/* Description */}
              <P className="mt-6 text-base leading-[1.6]">
                Buy and sell digital accounts &amp; assets from trusted sellers
                with secure payments, buyer protection, and fast delivery.
              </P>

              {/* Search */}
              <Input
                type="text"
                placeholder="Search accounts, games, software & more..."
                containerClassName="mt-6"
                className="h-[60px] rounded-[14px] border-border bg-white text-base leading-[1.2] text-tertiary placeholder:text-tertiary pl-14 pr-16 focus:ring-1 focus:ring-brand focus:border-brand shadow-none"
                prefix={
                  <div
                    aria-label="Search"
                    className="size-11 flex items-center justify-center -ml-1"
                  >
                    <SearchIcon size={22} color="#2B2F38" />
                  </div>
                }
                suffix={
                  <button
                    type="button"
                    aria-label="Search"
                    className="px-4 py-2.5 text-white bg-primary-2 rounded-lg transition hover:opacity-95"
                  >
                    <ButtonArrowIcon size={18} />
                  </button>
                }
              />

              {/* CTA Buttons */}
              <div className="mt-12.5 flex items-center gap-3.5">
                <LinkButton href="/#" variant="solid" size="lg">
                  Explore Marketplace
                </LinkButton>

                <LinkButton href="/#" variant="outline-secondary" size="lg">
                  Start Selling
                </LinkButton>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-12.5 flex flex-wrap gap-x-7 gap-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-white">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>

                  <P className="text-base text-primary font-medium leading-[1.6]">
                    {benefit}
                  </P>
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT VISUAL ================= */}
          <div className="flex h-full justify-center lg:justify-end">
            <video
              src="/video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full max-w-100 object-cover rounded-[20px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
