// src/app/(dashboard)/dashboard/page.jsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { getCookie } from "@/utils/cookie";

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = getCookie("accessToken");
    if (!token && !isLoggedIn) {
      router.replace("/login");
      return;
    }

    const role = (user?.role || getCookie("userRole") || "").toLowerCase();
    if (role === "admin" || role === "super_admin") {
      router.replace("/admin/overview");
    } else if (role === "seller") {
      router.replace("/seller/overview");
    } else if (role === "buyer" || role === "customer") {
      router.replace("/buyer/overview");
    } else if (!role && token) {
      // Waiting for user rehydration
      return;
    } else {
      router.replace("/login");
    }
  }, [user, isLoggedIn, router]);

  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium text-gray-500">Redirecting to your dashboard overview...</p>
      </div>
    </div>
  );
}
