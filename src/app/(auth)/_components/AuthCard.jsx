// src/app/(auth)/_components/AuthCard.jsx

import Link from "next/link";
import Image from "next/image";

export default function AuthCard({
  title,
  subtitle,
  children,
  headerExtra,
  className = "",
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 sm:py-14 px-4">
      {/* Top Logo */}
      <div className="mb-6 sm:mb-8 text-center">
        <Link href="/" className="inline-flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="ACCZORA"
            width={160}
            height={42}
            className="h-9 sm:h-10 w-auto object-contain"
            priority
          />
        </Link>
      </div>

      {/* Main Card */}
      <div
        className={`w-full max-w-[430px] sm:max-w-[452px] bg-white rounded-2xl border border-gray- shadow-[0_2px_16px_rgba(0,0,0,0.03)] p-6 sm:p-9 ${className}`}
      >
        {headerExtra}

        {title && (
          <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 text-center tracking-tight">
            {title}
          </h1>
        )}

        {subtitle && (
          <p className="text-xs sm:text-sm text-gray-500 text-center mt-1.5 mb-6 leading-relaxed max-w-[320px] mx-auto">
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
