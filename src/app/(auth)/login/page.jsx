// src/app/(auth)/login/page.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useLoginMutation } from "@/redux/api/authApi";
import { setLogin } from "@/redux/slice/authSlice";
import {
  AuthCard,
  AuthInput,
  AuthButton,
  GoogleButton,
} from "../_components";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      const result = await login(payload).unwrap();

      if (result?.data) {
        dispatch(
          setLogin({
            user: result.data.user,
            token: result.data.accessToken,
          }),
        );
        toast.success(`Welcome back ${result.data.user?.fullName || "User"}!`);
        router.push("/");
      }
    } catch (err) {
      toast.error(
        err?.data?.message ||
          err?.data?.errors?.[0] ||
          "Login failed. Please check your credentials.",
      );
    }
  };

  const handleGoogleLogin = () => {
    toast.info("Google authentication will be connected soon.");
  };

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Access your verified accounts and digital products all in one place."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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
          autoComplete="current-password"
        />

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between pt-0.5 text-xs sm:text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600 hover:text-gray-900 transition-colors">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-border text-[#6558ff] focus:ring-[#6558ff] accent-[#6558ff] cursor-pointer"
            />
            <span>Remember me</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-[#6558ff] hover:text-[#5345f5] font-medium transition-colors"
          >
            Forget Password?
          </Link>
        </div>

        <div className="pt-2">
          <AuthButton type="submit" loading={isLoading}>
            Login
          </AuthButton>
        </div>
      </form>

      <GoogleButton onClick={handleGoogleLogin} />

      <div className="mt-6 text-center text-xs sm:text-sm text-gray-600">
        Not Registered on ACCZORA?{" "}
        <Link
          href="/registration"
          className="text-[#6558ff] hover:text-[#5345f5] font-semibold transition-colors"
        >
          Create your Account
        </Link>
      </div>
    </AuthCard>
  );
}
