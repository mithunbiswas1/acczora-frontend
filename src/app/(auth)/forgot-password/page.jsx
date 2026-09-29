// src/app/(auth)/forgot-password/page.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AuthCard, AuthInput, AuthButton } from "../_components";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email Address is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Simulate API call for password reset link
      await new Promise((res) => setTimeout(res, 900));
      setLoading(false);
      setIsSent(true);
      toast.success("Password reset link has been sent to your email!");
    } catch {
      setLoading(false);
      toast.error("Failed to send reset link. Please try again.");
    }
  };

  return (
    <AuthCard
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a password reset link."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          label="Email Address"
          id="email"
          name="email"
          type="email"
          placeholder="skzllc@gmail.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          error={error}
          autoComplete="email"
          disabled={loading || isSent}
        />

        <AuthButton type="submit" loading={loading}>
          {isSent ? "Resend Reset Link" : "Send Reset Link"}
        </AuthButton>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-800 hover:text-gray-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2]" />
          <span>Back to Login</span>
        </Link>
      </div>
    </AuthCard>
  );
}
