// src/app/(pages)/[slug]/_components/ProductAbout.jsx

import { Check } from "lucide-react";
import { H2, H4 } from "@/components/ui/Typography";

export default function ProductAbout({ product }) {
  const {
    descriptionParagraphs = [],
    whatsIncluded = [],
    productDetails = [],
    deliveryInfo = {},
    buyerProtection = [],
  } = product || {};

  return (
    <section className="mt-12 sm:mt-16 pt-10 border-t border-[#F0F2F5]">
      {/* Section Heading */}
      <H2 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight">
        About This Product
      </H2>

      {/* Description Paragraphs */}
      <div className="mt-4 space-y-3.5 max-w-4xl text-xs sm:text-sm text-[#4B5563] leading-relaxed">
        {descriptionParagraphs.map((para, index) => (
          <p key={index}>{para}</p>
        ))}
      </div>

      {/* 4-Column Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-10">
        {/* Column 1: What's Included */}
        <div>
          <H4 className="text-sm font-bold text-[#1F2937] mb-3.5">
            What&apos;s included
          </H4>
          <ul className="space-y-2.5">
            {whatsIncluded.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2.5 text-xs text-[#374151]">
                <span className="size-4 rounded-full bg-[#16A34A]/15 text-[#16A34A] flex items-center justify-center shrink-0">
                  <Check className="size-2.5 stroke-[3]" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Product Details */}
        <div>
          <H4 className="text-sm font-bold text-[#1F2937] mb-3.5">
            Product Details
          </H4>
          <dl className="space-y-2 text-xs">
            {productDetails.map((detail, idx) => (
              <div key={idx} className="flex items-center justify-between text-[#4B5563] py-0.5 border-b border-gray-50">
                <dt className="text-[#9CA3AF]">{detail.label}</dt>
                <dd className="font-semibold text-[#1F2937]">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Column 3: Delivery Information */}
        <div>
          <H4 className="text-sm font-bold text-[#1F2937] mb-3.5">
            Delivery Information
          </H4>
          <div className="p-3.5 rounded-xl bg-[#F9FAFB] border border-[#F0F2F5]">
            <p className="text-xs font-semibold text-[#1F2937]">
              {deliveryInfo.title || "Instant Delivery"}
            </p>
            <p className="mt-1.5 text-[11px] text-[#6B7280] leading-relaxed">
              {deliveryInfo.description}
            </p>
          </div>
        </div>

        {/* Column 4: Buyer Protection */}
        <div>
          <H4 className="text-sm font-bold text-[#1F2937] mb-3.5">
            Buyer Protection
          </H4>
          <dl className="space-y-2 text-xs">
            {buyerProtection.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[#4B5563] py-0.5 border-b border-gray-50">
                <dt className="text-[#9CA3AF]">{item.label}</dt>
                <dd className="font-semibold text-[#1F2937]">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
