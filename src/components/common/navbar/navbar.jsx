// src/components/common/Navbar/Navbar.jsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBasket, ChevronDown, Menu, X } from "lucide-react";
import { LinkButton } from "@/components/ui/LinkButton";
import { IconButton } from "@/components/ui/IconButton";
import SearchBar from "./SearchBar";

const navLinks = [
  { name: "Marketplace", href: "/marketplace" },
  {
    name: "Categories",
    href: "/categories",
    subItems: [
      { name: "All Categories", href: "/categories" },
      { name: "Electronics", href: "/categories/electronics" },
      { name: "Fashion", href: "/categories/fashion" },
      { name: "Home & Living", href: "/categories/home-living" },
      { name: "Beauty", href: "/categories/beauty" },
    ],
  },
  { name: "How it works", href: "/how-it-works" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
        <nav className="container max-w-full mx-auto px-4 md:px-6 lg:px-12 py-5 flex items-center">
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
              className="h-auto w-20.5 xl:w-32 object-contain"
              sizes="(max-width: 768px) 128px, 129px"
              quality={90}
            />
          </Link>

          {/* Desktop Center Nav */}
          <div className="ml-6 xl:ml-10 mr-3 hidden items-center lg:flex">
            {navLinks.map((link) => {
              // Check if menu item has subItems (dropdown)
              if (link.subItems) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setSubmenuOpen(true)}
                    onMouseLeave={() => setSubmenuOpen(false)}
                  >
                    <button
                      type="button"
                      className="flex items-center gap-1 px-3 py-2 text-base font-medium text-primary hover:text-brand transition-colors"
                    >
                      {link.name}
                      <ChevronDown
                        className={`size-4 xl:size-5 transition-transform duration-200 ${submenuOpen ? "rotate-180" : ""
                          }`}
                        strokeWidth={1.8}
                      />
                    </button>

                    {/* Sub Menu */}
                    {submenuOpen && (
                      <div className="absolute left-1/2 top-full z-50 w-50 -translate-x-1/2 pt-4">
                        <div className="border border-gray-100 bg-white shadow-xl">
                          {link.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-primary transition-colors hover:bg-gray-50 hover:text-brand"
                            >
                              {subItem.name}
                            </Link>
                          ))}
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
                  className="px-2 py-1 xl:px-3 xl:py-1.5 text-sm xl:text-base font-medium text-primary hover:text-brand transition-colors "
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

          {/* Desktop Right Actions */}
          <div className="ml-auto items-center gap-8 flex">
            <div className="hidden md:flex items-center gap-3.5">
              <SearchBar />
              <IconButton href="/wishlist" icon={Heart} label="Wishlist" />
              <IconButton href="/cart" icon={ShoppingBasket} label="Cart" />
            </div>

            <div className="flex items-center gap-3.5">
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

      {/*  MOBILE DRAWER  */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
          />

          {/* Drawer */}
          <aside className="fixed left-0 top-0 z-[70] flex h-full w-[320px] max-w-[88vw] flex-col bg-white shadow-2xl lg:hidden">
            mobile nav
          </aside>
        </>
      )}
    </>
  );
}
