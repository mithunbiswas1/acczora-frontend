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
      {/* Section Heading matching Image 3 */}
      <H2 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
        About This Product
      </H2>

      {/* Description Paragraphs matching Image 3 */}
      <div className="mt-3.5 space-y-4 max-w-5xl text-xs sm:text-sm text-secondary leading-relaxed">
        {descriptionParagraphs.map((para, index) => (
          <p key={index}>{para}</p>
        ))}
      </div>

      {/* 4-Column Feature Grid matching Image 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mt-12 pt-8 border-t border-[#F0F2F5]">
        {/* Column 1: What's Included */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-primary mb-4">
            What&apos;s Included
          </h3>
          <ul className="space-y-3">
            {whatsIncluded.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#374151]">
                <span className="size-4.5 rounded-full bg-success text-white flex items-center justify-center shrink-0">
                  <Check className="size-3 stroke-[3]" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Product Details */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-primary mb-4">
            Product Details
          </h3>
          <div className="space-y-3 text-xs sm:text-sm">
            {productDetails.map((detail, idx) => (
              <div key={idx} className="grid grid-cols-[85px_16px_1fr] items-center text-secondary">
                <span className="text-secondary">{detail.label}</span>
                <span className="text-secondary">:</span>
                <span className="text-primary font-medium">{detail.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Delivery Information */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-primary mb-4">
            Delivery Information
          </h3>
          <div className="p-4 rounded-[10px] bg-[#F0F2F5]">
            <p className="text-xs sm:text-sm font-semibold text-primary">
              {deliveryInfo.title || "Instant Delivery"}
            </p>
            <p className="mt-1 text-xs text-secondary leading-relaxed">
              {deliveryInfo.description || "Your product will be delivered after successful payment."}
            </p>
          </div>
        </div>

        {/* Column 4: Buyer Protection */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-primary mb-4">
            Buyer Protection
          </h3>
          <div className="space-y-3 text-xs sm:text-sm">
            {buyerProtection.map((item, idx) => (
              <div key={idx} className="grid grid-cols-[85px_16px_1fr] items-center text-secondary">
                <span className="text-secondary">{item.label}</span>
                <span className="text-secondary">:</span>
                <span className="text-primary font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
