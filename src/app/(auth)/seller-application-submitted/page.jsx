// src/app/(auth)/seller-application-submitted/page.jsx

"use client";

import Link from "next/link";
import { Check, ArrowLeft } from "lucide-react";
import { AuthCard, AuthButton } from "../_components";

export default function SellerApplicationSubmittedPage() {
  return (
    <AuthCard>
      {/* Top Green Circular Checkmark */}
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full border-2 border-emerald-500 text-emerald-500 flex items-center justify-center">
          <Check className="w-7 h-7 stroke-[2.5]" />
        </div>
      </div>

      <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 text-center tracking-tight">
        Application submitted
      </h1>

      <p className="text-xs sm:text-sm text-gray-500 text-center mt-2 leading-relaxed max-w-[320px] mx-auto">
        Thanks for applying to become an ACCZORA seller.
        <br />
        Our team will review your application and notify you once a decision is
        made.
      </p>

      {/* Status Pill Badge */}
      <div className="flex justify-center my-4">
        <span className="bg-amber-50 text-amber-500 text-xs px-3.5 py-1 rounded-full font-medium border border-amber-200/60 inline-flex items-center">
          Planning Review
        </span>
      </div>

      {/* Progress / Timeline Box */}
      <div className="border border-border rounded-xl p-4 bg-white mb-6 relative">
        <div className="space-y-4">
          {/* Step 1: Application Submitted (Done) */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-sm font-medium text-gray-900">
                Application Submitted
              </span>
            </div>
            <span className="text-xs font-semibold text-emerald-600">
              Done
            </span>
          </div>

          {/* Step 2: Under Review (In progress) */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-amber-400 bg-white flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              </div>
              <span className="text-sm font-medium text-gray-800">
                Under Review
              </span>
            </div>
            <span className="text-xs font-semibold text-amber-500">
              In progress
            </span>
          </div>

          {/* Step 3: Decision Pending (Waiting) */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center shrink-0" />
              <span className="text-sm font-medium text-gray-600">
                Decision Pending
              </span>
            </div>
            <span className="text-xs font-semibold text-gray-400">
              Waiting
            </span>
          </div>
        </div>

        {/* Connecting Lines Behind Indicators */}
        <div className="absolute left-[25px] top-[26px] w-0.5 h-[34px] bg-emerald-500" />
        <div className="absolute left-[25px] top-[64px] w-0.5 h-[34px] bg-gray-200" />
      </div>

      {/* Button: Go to My Account */}
      <Link href="/dashboard" className="block w-full">
        <AuthButton type="button">Go to My Account</AuthButton>
      </Link>

      {/* Back to Home Link */}
      <div className="mt-5 text-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-800 hover:text-gray-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
          <span>Back to Home</span>
        </Link>
      </div>
    </AuthCard>
  );
}
