// src/app/(dashboard)/_components/Sidebar.jsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  X,
  Users,
  ShieldCheck,
  Wallet,
  ShoppingBag,
  LifeBuoy,
  ExternalLink,
  FolderTree,
} from "lucide-react";
import {
  GridSquareIcon,
  CubesIcon,
  CartFlatbedBoxesIcon,
  MoneyWithdrawalIcon,
  DashboardStarIcon,
  GearIcon,
  GridSquare2Icon,
  MoneyBillCardIcon,
} from "@/icons";
import Button from "@/components/ui/Button";

// Custom Categories Icon
const CategoriesIcon = ({ className = "w-[18px] h-[18px]" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
    <path d="M2 10h20" />
  </svg>
);

// 1. ADMIN NAVIGATION
const adminNavItems = [
  { name: "Overview", href: "/admin/overview", icon: GridSquareIcon },
  { name: "Categories", href: "/admin/categories", icon: CategoriesIcon },
  { name: "Sub-Categories", href: "/admin/subcategories", icon: FolderTree },
  { name: "Products", href: "/admin/products", icon: CubesIcon },
  { name: "Orders", href: "/admin/orders", icon: CartFlatbedBoxesIcon },
  { name: "Earnings", href: "/admin/earnings", icon: MoneyBillCardIcon },
  { name: "Withdrawals", href: "/admin/withdrawals", icon: MoneyWithdrawalIcon },
  { name: "Reviews", href: "/admin/reviews", icon: DashboardStarIcon },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Roles", href: "/admin/roles", icon: ShieldCheck },
  { name: "Support", href: "/admin/support", icon: LifeBuoy },
  { name: "Settings", href: "/admin/settings", icon: GearIcon },
];

// 2. SELLER NAVIGATION
const sellerNavItems = [
  { name: "Overview", href: "/seller/overview", icon: GridSquareIcon },
  { name: "Products", href: "/seller/products", icon: CubesIcon },
  { name: "Orders", href: "/seller/orders", icon: CartFlatbedBoxesIcon },
  { name: "Widra & Earnings", href: "/seller/widra-and-earnings", icon: MoneyWithdrawalIcon },
  { name: "Reviews", href: "/seller/reviews", icon: DashboardStarIcon },
  { name: "Support", href: "/seller/support", icon: LifeBuoy },
  { name: "Store Settings", href: "/seller/store-settings", icon: GearIcon },
];

// 3. BUYER NAVIGATION
const buyerNavItems = [
  { name: "Overview", href: "/buyer/overview", icon: GridSquareIcon },
  { name: "Purchases", href: "/buyer/purchases", icon: ShoppingBag },
  { name: "Wallet", href: "/buyer/wallet", icon: Wallet },
  { name: "Support", href: "/buyer/support", icon: LifeBuoy },
];

// BOTTOM NAVIGATION
const bottomNavItems = [
  { name: "Marketplace", href: "/marketplace", icon: GridSquare2Icon, isMarketplace: true },
];

export default function Sidebar({ isMobileOpen, onMobileClose }) {
  const pathname = usePathname();
  const { user } = useSelector((state) => state.auth);

  // Determine current active navigation strictly from authenticated user's role
  const userRole = (user?.role || "").toLowerCase();
  let activeRole = "buyer";
  if (userRole === "admin" || userRole === "super_admin") {
    activeRole = "admin";
  } else if (userRole === "seller") {
    activeRole = "seller";
  } else if (userRole === "buyer" || userRole === "customer") {
    activeRole = "buyer";
  } else if (pathname.startsWith("/admin")) {
    activeRole = "admin";
  } else if (pathname.startsWith("/seller")) {
    activeRole = "seller";
  }

  // Select items list based on role
  let navItems = buyerNavItems;
  if (activeRole === "admin") {
    navItems = adminNavItems;
  } else if (activeRole === "seller") {
    navItems = sellerNavItems;
  }

  const renderNavList = (items) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const isOverviewItem = item.href.endsWith("/overview");
        const baseHref = item.href.replace("/overview", "");
        const isActive =
          pathname === item.href ||
          (isOverviewItem && pathname === baseHref) ||
          (!isOverviewItem && pathname.startsWith(item.href));
        const Icon = item.icon;

        return (
          <li key={item.name}>
            <Link
              href={item.href}
              onClick={onMobileClose}
              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                isActive
                  ? "bg-brand/10 text-brand font-semibold shadow-xs"
                  : "text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <Icon
                  size={18}
                  className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                    isActive
                      ? "text-brand"
                      : "text-gray-400 group-hover:text-gray-700"
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    isActive
                      ? "bg-brand text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Brand Header with ACCZORA Logo */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-border flex-shrink-0">
        <Link
          href={
            activeRole === "admin"
              ? "/admin/overview"
              : activeRole === "buyer"
              ? "/buyer/overview"
              : "/seller/overview"
          }
          className="flex items-center"
        >
          <Image
            src="/logo.png"
            alt="ACCZORA - trade with confidence"
            width={140}
            height={36}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>

        {onMobileClose && (
          <Button
            variant="ghost"
            size="icon_sm"
            rounded="lg"
            onClick={onMobileClose}
            className="md:hidden text-gray-400 hover:text-gray-700"
            aria-label="Close navigation"
          >
            <X size={20} />
          </Button>
        )}
      </div>

      {/* Main Navigation Scroll Area */}
      <div className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        <div>{renderNavList(navItems)}</div>
      </div>

      {/* Bottom Fixed Section: Marketplace Link */}
      <div className="p-4 border-t border-border flex-shrink-0">
        <Link
          href="/marketplace"
          onClick={onMobileClose}
          className="group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:text-brand hover:bg-brand/5 border border-transparent hover:border-brand/20 transition-all duration-150"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <GridSquare2Icon
              size={18}
              className="w-[18px] h-[18px] flex-shrink-0 text-gray-400 group-hover:text-brand transition-colors"
            />
            <span className="truncate">Marketplace</span>
          </div>
          <ExternalLink size={14} className="text-gray-400 group-hover:text-brand transition-colors" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-border flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </div>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}
    </>
  );
}
