// src/components/common/Navbar/Navbar.jsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBasket, ChevronDown, Menu, X } from "lucide-react";
import { SearchIcon, ButtonArrowIcon } from "@/icons";
import { LinkButton } from "@/components/ui/LinkButton";
import { IconButton } from "@/components/ui/IconButton";
import SearchBar from "./SearchBar";
import SearchModal from "./SearchModal";

import { popularCategories } from "@/data";

const navLinks = [
  { name: "Marketplace", href: "/marketplace" },
  {
    name: "Categories",
    href: "/marketplace",
    isCategories: true,
  },
  { name: "How it works", href: "/how-it-works" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
        <nav className="site-container py-5 flex items-center">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="mr-5.5 flex items-center justify-center text-gray-800 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-7 w-7" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center"
            aria-label="Acczora home"
          >
            <Image
              src="/logo.png"
              alt="Acczora"
              width={129}
              height={32}
              priority
              className="h-6 w-auto lg:h-auto lg:w-24 xl:w-32 object-contain"
              sizes="(max-width: 768px) 128px, 129px"
              quality={90}
            />
          </Link>

          {/* Desktop Center Nav */}
          <div className="ml-6 xl:ml-10 mr-3 hidden items-center lg:flex">
            {navLinks.map((link) => {
              // Check if menu item is Categories (desktop mega menu)
              if (link.isCategories) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setSubmenuOpen(true)}
                    onMouseLeave={() => setSubmenuOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setSubmenuOpen((prev) => !prev)}
                      className="flex items-center gap-1 px-3 py-2 text-base font-medium text-primary hover:text-brand transition-colors cursor-pointer"
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        className={`size-4 xl:size-5 transition-transform duration-200 ${submenuOpen ? "rotate-180 text-brand" : ""
                          }`}
                        strokeWidth={1.8}
                      />
                    </button>

                    {/* Desktop Mega Menu */}
                    {submenuOpen && (
                      <div className="absolute left-0 top-full z-50 w-[680px] xl:w-[740px] pt-3">
                        <div className="rounded-2xl border border-border bg-white p-5 animate-in fade-in-50 zoom-in-95 duration-150">
                          {/* Categories Grid (2 Columns) */}
                          <div className="grid grid-cols-2 gap-2">
                            {popularCategories.map((cat) => (
                              <Link
                                key={cat.id}
                                href={`/marketplace?category=${encodeURIComponent(cat.name)}`}
                                onClick={() => setSubmenuOpen(false)}
                                className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50/90 border border-transparent hover:border-gray-100 transition-all duration-150"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105"
                                    style={{ backgroundColor: cat.bg }}
                                  >
                                    {cat.Icon && (
                                      <cat.Icon size={18} color={cat.color} />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 group-hover:text-brand transition-colors truncate">
                                      {cat.name}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">
                                      {cat.subcategories?.join(", ") || cat.count}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // Regular link without subItems
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-2 py-1 xl:px-3 xl:py-1.5 text-sm xl:text-base font-medium text-primary hover:text-brand transition-colors"
                >
                  {link.name}
                </Link>
              );
            })}

            <LinkButton
              href="/become-a-seller"
              variant="pill"
              size="sm"
              className="mx-3"
            >
              Become a Seller
            </LinkButton>
          </div>

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-3.5 sm:gap-6 xl:gap-8">
            <div className="flex items-center gap-3 sm:gap-3.5">
              <SearchBar />
              <IconButton href="/wishlist" icon={Heart} label="Wishlist" />
              <IconButton href="/cart" icon={ShoppingBasket} label="Cart" />
            </div>

            <div className="hidden md:flex items-center gap-3.5">
              <LinkButton href="/login" variant="outline">
                Login
              </LinkButton>

              <LinkButton href="/signup" variant="solid">
                Sign Up
              </LinkButton>
            </div>
          </div>
        </nav>
      </header>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${mobileMenuOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
        aria-hidden={!mobileMenuOpen}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        />

        {/* Drawer Panel */}
        <aside
          className={`fixed left-0 top-0 z-10 flex h-full w-[310px] max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center"
              aria-label="Acczora home"
            >
              <Image
                src="/logo.png"
                alt="Acczora"
                width={120}
                height={24}
                priority
                className="h-6 w-auto object-contain"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-secondary hover:bg-gray-100 hover:text-primary transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="flex h-[40px] w-full items-center justify-between gap-3 rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-[10px] text-left transition-colors hover:border-brand cursor-pointer"
              aria-label="Search products"
            >
              <div className="flex items-center gap-3">
                <SearchIcon size={20} color="#2B2F38" />
                <span className="text-sm font-medium text-primary">Search products</span>
              </div>
              <ButtonArrowIcon size={14} className="text-primary" />
            </button>

            {/* Navigation Links */}
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                if (link.isCategories) {
                  return (
                    <div key={link.name} className="flex flex-col">
                      <button
                        type="button"
                        onClick={() => setMobileSubmenuOpen((prev) => !prev)}
                        className="flex min-h-[44px] w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-medium text-primary hover:bg-gray-50 hover:text-brand transition-colors text-left"
                        aria-expanded={mobileSubmenuOpen}
                      >
                        <span>{link.name}</span>
                        <ChevronDown
                          className={`h-4.5 w-4.5 text-secondary transition-transform duration-200 ${mobileSubmenuOpen ? "rotate-180 text-brand" : ""
                            }`}
                          strokeWidth={1.8}
                        />
                      </button>

                      {/* Sub Items Accordion with same popular categories */}
                      {mobileSubmenuOpen && (
                        <div className="ml-2 mt-1 flex flex-col space-y-1 pl-1 max-h-[360px] overflow-y-auto">
                          {popularCategories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/marketplace?category=${encodeURIComponent(cat.name)}`}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setMobileSubmenuOpen(false);
                              }}
                              className="flex items-center justify-between rounded-lg p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div
                                  className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: cat.bg }}
                                >
                                  {cat.Icon && (
                                    <cat.Icon size={15} color={cat.color} />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <span className="block text-sm font-medium text-gray-800 truncate">
                                    {cat.name}
                                  </span>
                                  <span className="block text-[11px] text-gray-400 truncate">
                                    {cat.count}
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs text-gray-400">→</span>
                            </Link>
                          ))}

                          <Link
                            href="/marketplace"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileSubmenuOpen(false);
                            }}
                            className="mt-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold text-brand hover:underline"
                          >
                            <span>View All in Marketplace</span>
                            <ButtonArrowIcon size={12} />
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-[44px] items-center rounded-lg px-3 py-2.5 text-base font-medium text-primary hover:bg-gray-50 hover:text-brand transition-colors"
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Become a Seller CTA */}
            <div className="pt-2">
              <LinkButton
                href="/become-a-seller"
                variant="pill"
                size="default"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full justify-center"
              >
                Become a Seller
              </LinkButton>
            </div>

            {/* Quick Actions (Wishlist & Cart) */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-primary hover:border-brand hover:text-brand transition-colors"
              >
                <Heart className="h-4.5 w-4.5 text-secondary" strokeWidth={1.8} />
                <span>Wishlist</span>
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-primary hover:border-brand hover:text-brand transition-colors"
              >
                <ShoppingBasket className="h-4.5 w-4.5 text-secondary" strokeWidth={1.8} />
                <span>Cart</span>
              </Link>
            </div>
          </div>

          {/* Footer Auth Buttons */}
          <div className="mt-auto border-t border-gray-100 p-5 space-y-2.5 bg-gray-50/50">
            <LinkButton
              href="/login"
              variant="outline"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full justify-center py-2.5"
            >
              Login
            </LinkButton>
            <LinkButton
              href="/signup"
              variant="solid"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full justify-center py-2.5"
            >
              Sign Up
            </LinkButton>
          </div>
        </aside>
      </div>

      {/* Mobile Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
