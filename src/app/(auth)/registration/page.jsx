"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useRegistrationMutation } from "@/redux/api/authApi";
import { setLogin } from "@/redux/slice/authSlice";
import {
  AuthCard,
  AuthInput,
  AuthButton,
  GoogleButton,
} from "../_components";

export default function RegistrationPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [role, setRole] = useState("buyer");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    shopName: "",
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

    if (role === "seller" && !formData.shopName.trim()) {
      newErrors.shopName = "Store / Shop Name is required for sellers";
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
        role: role,
        ...(role === "seller" && { shopName: formData.shopName }),
      };

      const res = await registration(payload).unwrap();

      if (res?.data) {
        if (res.data.accessToken && res.data.user) {
          dispatch(
            setLogin({
              user: res.data.user,
              token: res.data.accessToken,
              refreshToken: res.data.refreshToken,
            })
          );
        }
        toast.success(`Account created as ${role}! Welcome to ACCZORA.`);
        if (role === "seller") {
          router.push("/seller/overview");
        } else if (role === "admin") {
          router.push("/admin/overview");
        } else {
          router.push("/buyer/overview");
        }
      } else {
        toast.success("Account created successfully! Please log in.");
        router.push("/login");
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
        {/* Account Role Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            I want to join as:
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              type="button"
              onClick={() => setRole("buyer")}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                role === "buyer"
                  ? "bg-white dark:bg-gray-700 text-[#6558ff] shadow-sm"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              🛍️ Buyer / Customer
            </button>
            <button
              type="button"
              onClick={() => setRole("seller")}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                role === "seller"
                  ? "bg-white dark:bg-gray-700 text-[#6558ff] shadow-sm"
                  : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              🏪 Seller (Shop Owner)
            </button>
          </div>
        </div>

        <AuthInput
          label="Full Name"
          id="fullName"
          name="fullName"
          type="text"
          placeholder="e.g. Alex Johnson"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          autoComplete="name"
        />

        {role === "seller" && (
          <AuthInput
            label="Store / Shop Name"
            id="shopName"
            name="shopName"
            type="text"
            placeholder="e.g. NovaStore"
            value={formData.shopName}
            onChange={handleChange}
            error={errors.shopName}
            autoComplete="organization"
          />
        )}

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
              className="mt-0.5 w-4 h-4 rounded border-border text-[#6558ff] focus:ring-[#6558ff] accent-[#6558ff] cursor-pointer"
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
