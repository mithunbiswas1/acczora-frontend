// src/app/(auth)/login/page.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Clock } from "lucide-react";
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
  const [pendingApprovalMsg, setPendingApprovalMsg] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (pendingApprovalMsg) {
      setPendingApprovalMsg("");
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email, username, or phone is required";
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
      const trimmedIdentifier = formData.email.trim();
      const payload = {
        email: trimmedIdentifier,
        userName: trimmedIdentifier,
        phone: trimmedIdentifier,
        password: formData.password,
      };

      const result = await login(payload).unwrap();

      if (result?.data) {
        dispatch(
          setLogin({
            user: result.data.user,
            token: result.data.accessToken,
            refreshToken: result.data.refreshToken,
          }),
        );
        toast.success(`Welcome back ${result.data.user?.fullName || "User"}!`);

        // Role-based routing to specific overview or validated redirect
        const role = (result.data.user?.role || "").toLowerCase();
        let targetPath = null;
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const redirectParam = params.get("redirect");
          if (redirectParam && redirectParam.startsWith("/")) {
            if ((role === "admin" || role === "super_admin") && redirectParam.startsWith("/admin")) {
              targetPath = redirectParam;
            } else if (role === "seller" && redirectParam.startsWith("/seller")) {
              targetPath = redirectParam;
            } else if ((role === "buyer" || role === "customer") && redirectParam.startsWith("/buyer")) {
              targetPath = redirectParam;
            }
          }
        }

        if (targetPath) {
          router.push(targetPath);
        } else if (role === "admin" || role === "super_admin") {
          router.push("/admin/overview");
        } else if (role === "seller") {
          router.push("/seller/overview");
        } else {
          router.push("/buyer/overview");
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      if (err?.status === "FETCH_ERROR" || err?.error?.includes?.("fetch")) {
        toast.error("Cannot connect to backend server at http://localhost:8005. Please ensure backend is running!");
      } else {
        const message =
          err?.data?.message ||
          err?.data?.errors?.[0] ||
          err?.message ||
          "Login failed. Please check your credentials.";

        if (err?.status === 403 || message.toLowerCase().includes("pending")) {
          setPendingApprovalMsg(message);
        }
        toast.error(message);
      }
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
      {pendingApprovalMsg && (
        <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 animate-in fade-in">
          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-0.5">
            <p className="font-bold text-amber-900">Account Pending Admin Approval</p>
            <p className="text-amber-700 leading-relaxed">{pendingApprovalMsg}</p>
          </div>
        </div>
      )}

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
