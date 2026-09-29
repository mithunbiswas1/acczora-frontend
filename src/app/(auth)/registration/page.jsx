// src/app/(auth)/registration/page.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRegistrationMutation } from "@/redux/api/authApi";
import {
  AuthCard,
  AuthInput,
  AuthButton,
  GoogleButton,
} from "../_components";

export default function RegistrationPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});

  const [registration, { isLoading: regLoading }] = useRegistrationMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreed) {
      newErrors.agreed = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const userName = formData.fullName
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "");

      const payload = {
        userName: userName || `user_${Date.now()}`,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: "customer",
      };

      const res = await registration(payload).unwrap();

      if (res?.success || res?.status === "success" || res?.data) {
        toast.success("Account created successfully!");
        router.push(
          `/verify-email?email=${encodeURIComponent(formData.email)}`,
        );
      } else {
        if (res?.errors && Array.isArray(res.errors)) {
          res.errors.forEach((errorMessage) => toast.error(errorMessage));
        } else {
          toast.success("Registration initiated! Please verify your email.");
          router.push(
            `/verify-email?email=${encodeURIComponent(formData.email)}`,
          );
        }
      }
    } catch (err) {
      toast.error(
        err?.data?.message ||
          err?.data?.errors?.[0] ||
          err?.message ||
          "Registration failed. Please try again.",
      );
    }
  };

  const handleGoogleSignUp = () => {
    toast.info("Google registration will be connected soon.");
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join ACCZORA and start exploring digital products."
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <AuthInput
          label="Full Name"
          id="fullName"
          name="fullName"
          type="text"
          placeholder="skzllc@gmail.com"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          autoComplete="name"
        />

        <AuthInput
          label="Email Address"
          id="email"
          name="email"
          type="email"
          placeholder="skzllc@gmail.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <AuthInput
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
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

        {/* Terms & Conditions Checkbox */}
        <div className="pt-0.5">
          <label className="flex items-start gap-2 cursor-pointer select-none text-xs sm:text-sm text-gray-600">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (errors.agreed) {
                  setErrors((prev) => ({ ...prev, agreed: "" }));
                }
              }}
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#6558ff] focus:ring-[#6558ff] accent-[#6558ff] cursor-pointer"
            />
            <span>
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-[#6558ff] hover:underline font-medium"
              >
                Terms & conditions
              </Link>
            </span>
          </label>
          {errors.agreed && (
            <p className="text-xs text-red-500 mt-1">{errors.agreed}</p>
          )}
        </div>

        <div className="pt-2">
          <AuthButton type="submit" loading={regLoading}>
            Create Account
          </AuthButton>
        </div>
      </form>

      <GoogleButton onClick={handleGoogleSignUp} />

      <div className="mt-6 text-center text-xs sm:text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#6558ff] hover:text-[#5345f5] font-semibold transition-colors"
        >
          Sign in
        </Link>
      </div>
    </AuthCard>
  );
}
