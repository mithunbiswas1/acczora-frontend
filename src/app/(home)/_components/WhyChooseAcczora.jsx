// src/app/(home)/_components/WhyChooseAcczora.jsx

"use client";

import { cn } from "@/lib/cn";
import { H2, H3, H4, P } from "@/components/ui/Typography";
import {
  VerifiedSellersIcon,
  SecurePaymentsIcon,
  BuyerProtectionIcon,
  FastDeliveryIcon,
} from "@/icons";

const features = {
  verifiedSellers: {
    id: "verified-sellers",
    title: "Verified Sellers",
    description:
      "Buy with confidence from sellers who meet our verification standards.",
    Icon: VerifiedSellersIcon,
    color: "#16A34A",
    iconBg: "bg-[#E8F8EE]",
    size: 22,
  },
  securePayments: {
    id: "secure-payments",
    title: "Secure Payments",
    description:
      "Your payment is protected throughout the transaction with secure checkout.",
    Icon: SecurePaymentsIcon,
    color: "#2563EB",
    iconBg: "bg-[#EFF6FF]",
    size: 24,
  },
  buyerProtection: {
    id: "buyer-protection",
    title: "Buyer Protection",
    description:
      "If something goes wrong, our dispute process helps protect your purchase.",
    Icon: BuyerProtectionIcon,
    color: "#8B5CF6",
    iconBg: "bg-[#F5F1FE]",
    size: 22,
  },
  fastDelivery: {
    id: "fast-delivery",
    title: "Fast Delivery",
    description:
      "Get your digital products quickly with instant and reliable delivery options.",
    Icon: FastDeliveryIcon,
    color: "#F59E0B",
    iconBg: "bg-[#FFFBEB]",
    size: 24,
  },
};

function FeatureCard({ feature, className }) {
  const { title, description, Icon, color, iconBg, size } = feature;

  return (
    <div
      className={cn(
        " flex flex-col justify-between bg-card border border-border rounded-[16px] p-6",
        className
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0",
          iconBg
        )}
      >
        <Icon size={size} color={color} />
      </div>

      <H4 className="mt-6">{title}</H4>
      <P className="mt-2">{description}</P>
    </div>
  );
}

export default function WhyChooseAcczora() {
  const { verifiedSellers, securePayments, buyerProtection, fastDelivery } =
    features;

  return (
    <section className="w-full py-8 md:py-15 lg:py-20 xl:py-24">
      <div className="site-container">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10 lg:mb-15">
          <H2>Why Choose ACCZORA?</H2>
          <P className="mt-2 md:mt-3 lg:mt-4 mx-auto">
            A safer, simpler way to buy and sell digital accounts online.
          </P>
        </div>

        {/* ================= DESKTOP LAYOUT (lg:) ================= */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4 lg:gap-6 items-stretch">
          {/* Left Column: 2 cards */}
          <div className="grid grid-rows-2 gap-4 lg:gap-6">
            <FeatureCard feature={verifiedSellers} />
            <FeatureCard feature={securePayments} />
          </div>

          {/* Center Column: Video */}
          <div className="w-full h-full min-h-[460px] rounded-[20px] overflow-hidden">
            <video
              src="/video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover rounded-[20px]"
            />
          </div>

          {/* Right Column: 2 cards */}
          <div className="grid grid-rows-2 gap-6">
            <FeatureCard feature={buyerProtection} />
            <FeatureCard feature={fastDelivery} />
          </div>
        </div>

        {/* ================= TABLET & MOBILE LAYOUT (< lg:) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
          {/* Row 1: Left & Right cards on tablet, stacked on mobile */}
          <FeatureCard feature={verifiedSellers} />
          <FeatureCard feature={securePayments} />

          {/* Row 2: Center video spanning 2 columns on tablet, full width on mobile */}
          <div className="md:col-span-2 w-full h-[280px] sm:h-[340px] md:h-[400px] rounded-[20px] overflow-hidden">
            <video
              src="/video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover rounded-[20px]"
            />
          </div>

          {/* Row 3: Bottom Left & Right cards on tablet, stacked on mobile */}
          <FeatureCard feature={buyerProtection} />
          <FeatureCard feature={fastDelivery} />
        </div>
      </div>
    </section>
  );
}
