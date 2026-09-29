// src/app/(auth)/reset-password/page.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AuthCard, AuthInput, AuthButton } from "../_components";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "New Password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      // Simulate API call for password reset
      await new Promise((res) => setTimeout(res, 900));
      setLoading(false);
      toast.success("Password reset successfully! Please login with your new password.");
      router.push("/login");
    } catch {
      setLoading(false);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Create a new password for your ACCZORA account."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="New Password"
          id="newPassword"
          name="newPassword"
          type="password"
          placeholder="••••••••••"
          value={formData.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
          autoComplete="new-password"
        />

        <AuthInput
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <div className="pt-2">
          <AuthButton type="submit" loading={loading}>
            Reset Password
          </AuthButton>
        </div>
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
