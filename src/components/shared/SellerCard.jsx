// src/components/shared/SellerCard.jsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Check } from "lucide-react";
import { ButtonArrowIcon } from "@/icons";
import { H5 } from "@/components/ui/Typography";
import { LinkButton } from "@/components/ui/LinkButton";

const defaultLogos = [
  "/logo_image/facebook.png",
  "/logo_image/figma.png",
  "/logo_image/apple.png",
];

export default function SellerCard({ seller, href }) {
  const {
    name = "NovaStore",
    verified = true,
    avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    banner = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    sales = "2.4K+ Sales",
    productsCount = "126 Products",
    rating = "4.5",
    reviews = "350+ Reviews",
    extraCount = "120+",
    logos = defaultLogos,
  } = seller;

  return (
    <div className="group relative bg-card rounded-[12px] border border-border cursor-pointer transition-all duration-200 hover:border-brand flex flex-col justify-between overflow-hidden">
      {/* Whole-card link */}
      {href && (
        <Link href={href} className="absolute inset-0 z-0" aria-label={name} />
      )}

      {/* Top Banner Image */}
      <div className="relative w-full h-23 overflow-hidden bg-gray-100">
        <Image
          src={banner}
          alt={`${name} banner`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Card Body */}
      <div className="px-5 pb-5 pt-0 flex flex-col items-center">
        {/* Overlapping Avatar */}
        <div className="relative size-14 -mt-7 rounded-full border-1 border-white overflow-hidden shadow-sm shrink-0 bg-white z-10">
          <Image
            src={avatar}
            alt={name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>

        {/* Seller Name & Verified Badge */}
        <div className="mt-2.5 flex items-center justify-center gap-1.5">
          <H5 className="text-center font-semibold text-[16px] text-primary transition-colors duration-200 group-hover:text-brand">
            {name}
          </H5>
          {verified && (
            <span className="size-4 rounded-full bg-info text-white flex items-center justify-center shrink-0">
              <Check className="size-2.5" strokeWidth={3.5} />
            </span>
          )}
        </div>

        {/* Sales & Products info */}
        <p className="mt-1 text-[12px] font-medium text-secondary text-center">
          {sales} • {productsCount}
        </p>

        {/* Rating Line */}
        <div className="mt-1 flex items-center justify-center gap-1.5 text-[12px]">
          <Star className="size-3.5 fill-warning text-warning shrink-0" />
          <span className="font-semibold text-info">{rating}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-400">{reviews}</span>
        </div>

        {/* Platform / Product Badges (Using Image files) */}
        <div className="mt-3.5 flex items-center justify-center gap-2 w-full">
          {logos.map((logo, idx) => (
            <div
              key={idx}
              className="size-9 rounded-[6px] bg-gray-50 flex items-center justify-center shrink-0 p-1.5"
            >
              <Image
                src={typeof logo === "string" ? logo : logo.src}
                alt={typeof logo === "object" && logo.alt ? logo.alt : "platform"}
                width={20}
                height={20}
                className="size-5 object-contain"
              />
            </div>
          ))}
          <div className="h-9 px-2.5 rounded-[6px] bg-gray-50 flex items-center justify-center text-[11px] font-semibold text-gray-700 shrink-0">
            {extraCount}
          </div>
        </div>

        {/* Action Button (Transitions on card hover) */}
        <LinkButton
          href={href}
          variant="outline-group"
          rounded="xl"
          className="relative z-10 mt-4 w-full py-2.5"
        >
          <span>View Store</span>
          <span className="hidden group-hover:inline-flex transition-transform duration-200">
            <ButtonArrowIcon size={16} />
          </span>
        </LinkButton>
      </div>
    </div>
  );
}
