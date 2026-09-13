// src/app/(home)/_components/HowItWorks.jsx

"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { H2, P } from "@/components/ui/Typography";
import { LinkButton } from "@/components/ui/LinkButton";
import {
  ButtonArrowIcon,
  SearchBagIcon,
  ChooseReviewIcon,
  PayCardShieldIcon,
  ReceiveTrayIcon,
  VerifiedSellersIcon,
} from "@/icons";

const buyerSteps = [
  {
    id: 1,
    title: "Find What You Need",
    description:
      "Browse thousands of digital products or search for exactly what you're looking for.",
    Icon: SearchBagIcon,
  },
  {
    id: 2,
    title: "Choose & Review",
    description:
      "Compare offers, check seller ratings, and review product details before you buy.",
    Icon: ChooseReviewIcon,
  },
  {
    id: 3,
    title: "Pay Securely",
    description:
      "Complete your purchase through our secure checkout and protected payment options.",
    Icon: PayCardShieldIcon,
  },
  {
    id: 4,
    title: "Receive & Enjoy",
    description:
      "Get your digital product quickly, verify your purchase, and you're ready to go.",
    Icon: ReceiveTrayIcon,
  },
];

const sellerSteps = [
  {
    id: 1,
    title: "Create an Account",
    description:
      "Register as a seller and complete quick verification to start listing your assets.",
    Icon: VerifiedSellersIcon,
  },
  {
    id: 2,
    title: "List Your Products",
    description:
      "Set your price, add product details, and showcase your digital accounts with ease.",
    Icon: ChooseReviewIcon,
  },
  {
    id: 3,
    title: "Get Paid Safely",
    description:
      "Receive payments directly to your account with instant and secure payout options.",
    Icon: PayCardShieldIcon,
  },
  {
    id: 4,
    title: "Grow Your Business",
    description:
      "Build your seller reputation, earn positive reviews, and scale your digital sales.",
    Icon: ReceiveTrayIcon,
  },
];

export default function HowItWorks() {
  const [role, setRole] = useState("buyer"); // "buyer" | "seller"
  const [hoveredStep, setHoveredStep] = useState(null);

  const steps = role === "buyer" ? buyerSteps : sellerSteps;

  return (
    <section className="w-full py-12 lg:py-20">
      <div className="site-container">
        {/* Section Header */}
        <div className="text-center">
          <H2 className="text-primary font-bold text-[28px] sm:text-[32px] lg:text-[36px] leading-[120%]">
            How It Works
          </H2>
          <P className="mt-2.5 max-w-xl mx-auto text-base font-medium text-secondary leading-[160%]">
            Getting started with ACCZORA is simple.
            <br className="hidden sm:inline" /> Whether you're buying or
            selling, we've got you covered.
          </P>
        </div>

        {/* Role Switcher (Buyer / Seller) */}
        <div className="mt-7 flex justify-center">
          <div className="inline-flex p-1 bg-white border border-border rounded-xl shadow-xs">
            <button
              type="button"
              onClick={() => setRole("buyer")}
              className={cn(
                "px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer",
                role === "buyer"
                  ? "bg-[#EDE9FF] text-brand shadow-xs"
                  : "text-primary font-medium hover:text-brand"
              )}
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => setRole("seller")}
              className={cn(
                "px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer",
                role === "seller"
                  ? "bg-[#EDE9FF] text-brand shadow-xs"
                  : "text-primary font-medium hover:text-brand"
              )}
            >
              Seller
            </button>
          </div>
        </div>

        {/* Stepper Progression Bar */}
        <div className="mt-8 lg:mt-10 max-w-3xl mx-auto">
          {/* Desktop & Tablet Stepper */}
          <div className="hidden sm:flex items-center justify-between">
            {steps.map((step, idx) => {
              const isHovered = hoveredStep === step.id;
              const isLast = idx === steps.length - 1;

              return (
                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                  {/* Step Pill */}
                  <span
                    onMouseEnter={() => setHoveredStep(step.id)}
                    onMouseLeave={() => setHoveredStep(null)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 shrink-0 cursor-default select-none",
                      isHovered
                        ? "bg-[#EDE9FF] text-brand border border-brand/30 font-semibold shadow-xs"
                        : "bg-white text-gray-500 border border-gray-200 font-medium"
                    )}
                  >
                    Step {step.id}
                  </span>

                  {/* Connecting line with arrow */}
                  {!isLast && (
                    <div className="flex-1 mx-2 flex items-center">
                      <div className="flex-1 h-[1px] bg-gray-200" />
                      <svg
                        className="w-3 h-3 text-gray-300 -ml-1 shrink-0"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.5 2.5L8 6L4.5 9.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Stepper (compact circles) */}
          <div className="flex sm:hidden items-center justify-between px-2">
            {steps.map((step, idx) => {
              const isHovered = hoveredStep === step.id;
              const isLast = idx === steps.length - 1;

              return (
                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                  <span
                    className={cn(
                      "w-7 h-7 rounded-full text-xs transition-all duration-200 flex items-center justify-center shrink-0 cursor-default select-none",
                      isHovered
                        ? "bg-[#EDE9FF] text-brand border border-brand/30 font-semibold shadow-xs"
                        : "bg-white text-gray-500 border border-gray-200 font-medium"
                    )}
                  >
                    {step.id}
                  </span>

                  {!isLast && (
                    <div className="flex-1 mx-1.5 flex items-center">
                      <div className="flex-1 h-[1px] bg-gray-200" />
                      <svg
                        className="w-2.5 h-2.5 text-gray-300 -ml-0.5 shrink-0"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.5 2.5L8 6L4.5 9.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Steps Grid - following Popular Categories cards hover pattern */}
        <div className="mt-8 lg:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {steps.map((step) => {
            const { id, title, description, Icon } = step;

            return (
              <div
                key={id}
                onMouseEnter={() => setHoveredStep(id)}
                onMouseLeave={() => setHoveredStep(null)}
                className="group bg-card border border-border rounded-[20px] p-6 flex flex-col justify-start transition-all duration-200 cursor-pointer text-left hover:border-brand"
              >
                {/* Icon Badge - transforms on card hover */}
                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 bg-[#F3F4F6] text-gray-500 transition-all duration-200 group-hover:bg-brand group-hover:text-white">
                  <Icon size={22} />
                </div>

                {/* Title - changes color on card hover */}
                <h3 className="mt-6 text-[16px] font-semibold leading-[120%] text-primary transition-colors duration-200 group-hover:text-brand">
                  {title}
                </h3>

                {/* Description */}
                <p className="mt-2.5 text-[14px] font-medium text-secondary leading-[160%]">
                  {description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-8 lg:mt-10 flex justify-center">
          <LinkButton
            href={role === "buyer" ? "/become-seller" : "/explore"}
            variant="solid"
            size="lg"
            className="w-full sm:w-auto justify-center"
          >
            <span>
              {role === "buyer" ? "Become a Seller" : "Start Selling Now"}
            </span>
            <ButtonArrowIcon size={18} />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
