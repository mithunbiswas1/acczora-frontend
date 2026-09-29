// src/app/(auth)/verify-email/page.jsx

"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthCard, AuthButton } from "../_components";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "user@example.com";

  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = () => {
    toast.success("Email verified successfully! Redirecting...");
    setTimeout(() => {
      router.push("/login");
    }, 1200);
  };

  const handleResend = () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setCountdown(60);
      toast.success(`Verification link re-sent to ${email}`);
    }, 800);
  };

  return (
    <AuthCard>
      {/* Mail Envelope Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-13 h-13 flex items-center justify-center text-[#6558ff]">
          <svg
            className="w-12 h-12 stroke-[1.8]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="16" x="2" y="4" rx="3" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
      </div>

      <h1 className="text-2xl sm:text-[26px] font-bold text-gray-900 text-center tracking-tight">
        Verify your email
      </h1>

      <p className="text-sm text-gray-500 text-center mt-2">
        We've sent a verification link to
      </p>

      <p className="text-sm font-semibold text-gray-900 text-center my-1.5 break-all">
        {email}
      </p>

      <p className="text-xs sm:text-sm text-gray-500 text-center mb-6 leading-relaxed max-w-[280px] mx-auto">
        Please check your inbox and verify your email address.
      </p>

      <AuthButton type="button" onClick={handleVerify}>
        Verify Email
      </AuthButton>

      <div className="mt-5 text-center text-xs sm:text-sm text-gray-500">
        Didn't receive the email?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0 || resending}
          className="text-[#6558ff] hover:text-[#5345f5] font-semibold transition-colors disabled:opacity-50 cursor-pointer"
        >
          {countdown > 0 ? `Resend in ${countdown}s` : "Resend Email"}
        </button>
      </div>

      <div className="mt-3 text-center">
        <Link
          href="/registration"
          className="text-xs sm:text-sm font-semibold text-gray-800 hover:text-gray-950 transition-colors"
        >
          Change email address
        </Link>
      </div>
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#6558ff] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
