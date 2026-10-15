// src/app/(dashboard)/layout.jsx

"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Bell, ChevronDown, LogOut, User as UserIcon, Store, Shield } from "lucide-react";
import Sidebar from "./_components/Sidebar";
import Link from "next/link";
import Image from "next/image";
import { setLogout } from "@/redux/slice/authSlice";
import { useLogoutMutation, useGetProfileQuery } from "@/redux/api/authApi";
import { toast } from "sonner";
import { getCookie } from "@/utils/cookie";
import Button from "@/components/ui/Button";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const [logoutApi] = useLogoutMutation();
  // Silently sync profile if cookie/token is present
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery(undefined, {
    skip: !isLoggedIn && !getCookie("accessToken"),
  });

  const currentUser = profileData?.data || user;

  useEffect(() => {
    // Check if token exists in cookie or localStorage
    const token = getCookie("accessToken") || (typeof window !== "undefined" && localStorage.getItem("accessToken"));
    if (!token && !isLoggedIn) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!currentUser) {
      // User info is still hydrating
      return;
    }

    const role = (currentUser.role || getCookie("userRole") || "").toLowerCase();

    // Strict Client-Side Role-Based Redirection
    if (role === "admin" || role === "super_admin") {
      if (pathname.startsWith("/seller") || pathname.startsWith("/buyer")) {
        router.replace("/admin/overview");
        return;
      }
    } else if (role === "seller") {
      if (pathname.startsWith("/admin") || pathname.startsWith("/buyer")) {
        router.replace("/seller/overview");
        return;
      }
    } else if (role === "buyer" || role === "customer") {
      if (pathname.startsWith("/admin") || pathname.startsWith("/seller")) {
        router.replace("/buyer/overview");
        return;
      }
    }

    setIsLoading(false);
  }, [isLoggedIn, currentUser, pathname, router]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch (e) {
      // ignore
    } finally {
      dispatch(setLogout());
      toast.success("Logged out successfully");
      router.push("/login");
    }
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case "super_admin":
        return { label: "Super Admin", color: "bg-purple-100 text-purple-700" };
      case "admin":
        return { label: "Admin", color: "bg-blue-100 text-blue-700" };
      case "seller":
        return { label: "Seller", color: "bg-emerald-100 text-emerald-700" };
      default:
        return { label: "Buyer", color: "bg-gray-100 text-gray-700" };
    }
  };

  const badge = getRoleBadge(currentUser?.role);

  // Check if current user is authorized for current route
  const isAuthorized = (() => {
    if (!currentUser) return false;
    const role = (currentUser.role || "").toLowerCase();
    if (role === "admin" || role === "super_admin") {
      return !pathname.startsWith("/seller") && !pathname.startsWith("/buyer");
    }
    if (role === "seller") {
      return !pathname.startsWith("/admin") && !pathname.startsWith("/buyer");
    }
    if (role === "buyer" || role === "customer") {
      return !pathname.startsWith("/admin") && !pathname.startsWith("/seller");
    }
    return true;
  })();

  if (isLoading || isProfileLoading || !currentUser || !isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-medium text-gray-500">
            {!isAuthorized && currentUser
              ? "Redirecting to your authorized dashboard..."
              : "Loading ACCZORA Dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#fafbfc] overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#fafbfc]">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between px-6 md:px-8 h-18 bg-white border-b border-border flex-shrink-0 z-30">
          {/* Left: Hamburger & Page Title */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon_sm"
              rounded="lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden -ml-1.5 text-gray-700 hover:text-gray-900"
              aria-label="Toggle Menu"
            >
              <Menu size={22} />
            </Button>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              {/* Admin Routes */}
              {pathname === "/admin" || pathname === "/admin/overview"
                ? "Dashboard"
                : pathname?.startsWith("/admin/products")
                ? "All Products (Admin)"
                : pathname?.startsWith("/admin/orders")
                ? "All Orders (Admin)"
                : pathname?.startsWith("/admin/earnings")
                ? "Platform Earnings"
                : pathname?.startsWith("/admin/withdrawals")
                ? "Withdrawal Requests & Payouts"
                : pathname?.startsWith("/admin/reviews")
                ? "Review Moderation"
                : pathname?.startsWith("/admin/users")
                ? "User Management"
                : pathname?.startsWith("/admin/roles")
                ? "Role Permissions"
                : pathname?.startsWith("/admin/support")
                ? "Support Desk"
                : pathname?.startsWith("/admin/settings")
                ? "Platform Settings"
                : /* Seller Routes */
                pathname === "/seller" || pathname === "/seller/overview"
                ? "Dashboard"
                : pathname?.startsWith("/seller/products/add")
                ? "Add Digital Product"
                : pathname?.startsWith("/seller/products")
                ? "My Products"
                : pathname?.startsWith("/seller/orders")
                ? "My Orders"
                : pathname?.startsWith("/seller/widra-and-earnings")
                ? "Widra & Earnings"
                : pathname?.startsWith("/seller/reviews")
                ? "Store Reviews"
                : pathname?.startsWith("/seller/support")
                ? "Seller Support"
                : pathname?.startsWith("/seller/store-settings")
                ? "Store Settings"
                : /* Buyer Routes */
                pathname === "/buyer" || pathname === "/buyer/overview"
                ? "Buyer Overview"
                : pathname?.startsWith("/buyer/purchases")
                ? "My Purchases"
                : pathname?.startsWith("/buyer/wallet")
                ? "Wallet"
                : pathname?.startsWith("/buyer/support")
                ? "Buyer Support"
                : /* Fallbacks */
                pathname?.includes("/categories")
                ? "Categories"
                : "Dashboard"}
            </h1>
          </div>

          {/* Right: Notifications & Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Notification Bell */}
            <Button
              variant="ghost"
              size="icon_sm"
              rounded="full"
              className="text-amber-500 hover:bg-amber-50"
              title="Notifications"
            >
              <Bell size={20} className="fill-amber-400 text-amber-500" />
            </Button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2.5 p-1 rounded-full hover:bg-gray-50 transition-all select-none cursor-pointer"
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-border flex-shrink-0">
                  <Image
                    src={currentUser?.image || "/seller_avater.jpg"}
                    alt={currentUser?.fullName || currentUser?.shopName || "User"}
                    fill
                    className="object-cover"
                  />
                </div>

                <span className="hidden sm:block text-sm font-semibold text-gray-900">
                  {currentUser?.fullName || currentUser?.shopName || "User"}
                </span>

                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform duration-200 ${
                    isProfileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-border p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User Identity Header */}
                  <div className="p-3 border-b border-border mb-1">
                    <p className="font-semibold text-sm text-gray-900 truncate">
                      {currentUser?.fullName || currentUser?.shopName || "User"}
                    </p>
                    <p className="text-xs text-gray-400 truncate mb-2">
                      {currentUser?.email}
                    </p>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
                      <Shield size={12} />
                      {badge.label}
                    </span>
                  </div>

                  {/* Menu Links */}
                  <div className="space-y-0.5">
                    {(currentUser?.role === "admin" || currentUser?.role === "super_admin") && (
                      <>
                        <Link
                          href="/admin/settings"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                          <Store size={16} />
                          Platform Settings
                        </Link>
                        <Link
                          href="/admin/roles"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-brand hover:bg-brand/10 rounded-xl transition-colors"
                        >
                          <Shield size={16} />
                          Admin Role & Permissions
                        </Link>
                      </>
                    )}

                    {currentUser?.role === "seller" && (
                      <>
                        <Link
                          href="/seller/store-settings"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                          <Store size={16} />
                          Store Settings
                        </Link>
                        <Link
                          href="/seller/support"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                          <UserIcon size={16} />
                          Help & Support
                        </Link>
                      </>
                    )}

                    {(currentUser?.role === "buyer" || currentUser?.role === "customer") && (
                      <>
                        <Link
                          href="/buyer/purchases"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                          <UserIcon size={16} />
                          My Purchases
                        </Link>
                        <Link
                          href="/buyer/support"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                          <Shield size={16} />
                          Buyer Support
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Logout Button */}
                  <div className="border-t border-border mt-1 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      rounded="xl"
                      onClick={handleLogout}
                      className="w-full justify-start text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      icon={<LogOut size={16} />}
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-thin">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
