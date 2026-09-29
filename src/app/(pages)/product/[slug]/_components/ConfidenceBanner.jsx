// src/app/(pages)/[slug]/_components/ConfidenceBanner.jsx

import {
  CardShieldIcon,
  HeadsetIcon,
  StoreCheckCircleIcon,
  UserShieldIcon,
} from "@/icons";

const confidenceItems = [
  {
    id: "secure-payment",
    title: "Secure Payment",
    icon: CardShieldIcon,
    isActive: false,
  },
  {
    id: "order-support",
    title: "Order Support",
    icon: HeadsetIcon,
    isActive: true, // highlighted purple card in design
  },
  {
    id: "verified",
    title: "Verified Sellers",
    icon: StoreCheckCircleIcon,
    isActive: false,
  },
  {
    id: "protection",
    title: "Buyer Protection",
    icon: UserShieldIcon,
    isActive: false,
  },
];

export default function ConfidenceBanner() {
  return (
    <section className="mt-14 sm:mt-16">
      {/* Pill Badge matching Image 1 */}
      <div>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F3F4F6] text-xs font-medium text-secondary mb-2">
          Buyer Protection
        </span>
      </div>

      {/* Main Heading */}
      <h2 className="text-xl sm:text-2xl font-bold text-primary tracking-tight mb-6">
        Shop with confidence on ACCZORA.
      </h2>

      {/* 4 Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {confidenceItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;

          return (
            <div
              key={item.id}
              className={`p-6 sm:p-7 rounded-[16px] flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-white border border-brand shadow-xs"
                  : "bg-white border border-border hover:border-gray-300"
              }`}
            >
              {/* Icon Container */}
              <div
                className={`size-11 rounded-[10px] flex items-center justify-center transition-colors mb-3.5 ${
                  isActive
                    ? "bg-brand text-white shadow-xs"
                    : "bg-[#F0F2F5] text-[#667085]"
                }`}
              >
                <Icon size={20} />
              </div>

              {/* Title */}
              <span
                className={`text-xs sm:text-sm font-semibold ${
                  isActive ? "text-brand" : "text-primary"
                }`}
              >
                {item.title}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
