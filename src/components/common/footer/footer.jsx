// src/components/common/footer/footer.jsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa6";

const marketplaceLinks = [
  { label: "Browse Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Featured Products", href: "/#featured" },
  { label: "Top Sellers", href: "/sellers" },
];

const buyerLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Buyer Guide", href: "/buyer-guide" },
  { label: "Buyer Protection", href: "/buyer-protection" },
  { label: "FAQ", href: "/faq" },
];

const sellerLinks = [
  { label: "Become a Seller", href: "/seller" },
  { label: "Seller Guide", href: "/seller-guide" },
  { label: "Seller Dashboard", href: "/dashboard" },
  { label: "Seller FAQ", href: "/seller-faq" },
];

const supportLinks = [
  { label: "Help Center", href: "/help" },
  { label: "Contact Us", href: "/contact" },
  { label: "Report an Issue", href: "/report" },
  { label: "Safety Center", href: "/safety" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/refund" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#111827] text-white">
      {/* Upper Main Footer */}
      <div className="site-container py-14 lg:py-18">
        {/* Row 1: Brand/Tagline + Marketplace, For Buyers, For Sellers */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & Tagline */}
          <div className="md:col-span-12 lg:col-span-5">
            <Link href="/" className="inline-block" aria-label="ACCZORA Home">
              <Image
                src="/logo.png"
                alt="ACCZORA"
                width={140}
                height={36}
                className="h-9 w-auto object-contain brightness-0 invert"
                priority
              />
            </Link>
            <p className="mt-6 text-[20px] sm:text-[24px] font-normal leading-[160%] text-white max-w-sm">
              Buy and sell digital products
              <br />
              with confidence.
            </p>
          </div>

          {/* Right Link Columns */}
          <div className="md:col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Marketplace */}
            <div>
              <h3 className="text-[16px] font-semibold text-white leading-[150%] mb-4 sm:mb-5">
                Marketplace
              </h3>
              <ul className="space-y-3">
                {marketplaceLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[16px] font-normal text-gray-400 hover:text-white transition-colors duration-200 leading-[150%]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Buyers */}
            <div>
              <h3 className="text-[16px] font-semibold text-white leading-[150%] mb-4 sm:mb-5">
                For Buyers
              </h3>
              <ul className="space-y-3">
                {buyerLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[16px] font-normal text-gray-400 hover:text-white transition-colors duration-200 leading-[150%]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Sellers */}
            <div>
              <h3 className="text-[16px] font-semibold text-white leading-[150%] mb-4 sm:mb-5">
                For Sellers
              </h3>
              <ul className="space-y-3">
                {sellerLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[16px] font-normal text-gray-400 hover:text-white transition-colors duration-200 leading-[150%]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Horizontal Divider */}
        <div className="border-t border-white/10 my-10 lg:my-12" />

        {/* Row 2: Follow Us/Tagline + Support, Company, Legal */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Follow Us & Repeated Tagline */}
          <div className="md:col-span-12 lg:col-span-5">
            <h3 className="text-[16px] font-semibold text-white leading-[150%] mb-4">
              Follow Us
            </h3>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="size-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-xs"
              >
                <FaFacebookF className="size-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="size-8 rounded-full bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#C13584] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-xs"
              >
                <FaInstagram className="size-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="size-8 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-xs"
              >
                <FaTwitter className="size-4" />
              </a>
            </div>

            <p className="mt-8 text-[20px] sm:text-[24px] font-normal leading-[160%] text-white max-w-sm">
              Buy and sell digital products
              <br />
              with confidence.
            </p>
          </div>

          {/* Right Link Columns */}
          <div className="md:col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Support */}
            <div>
              <h3 className="text-[16px] font-semibold text-white leading-[150%] mb-4 sm:mb-5">
                Support
              </h3>
              <ul className="space-y-3">
                {supportLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[16px] font-normal text-gray-400 hover:text-white transition-colors duration-200 leading-[150%]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-[16px] font-semibold text-white leading-[150%] mb-4 sm:mb-5">
                Company
              </h3>
              <ul className="space-y-3">
                {companyLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[16px] font-normal text-gray-400 hover:text-white transition-colors duration-200 leading-[150%]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-[16px] font-semibold text-white leading-[150%] mb-4 sm:mb-5">
                Legal
              </h3>
              <ul className="space-y-3">
                {legalLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[16px] font-normal text-gray-400 hover:text-white transition-colors duration-200 leading-[150%]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-footer Bar (#0F1117) */}
      <div className="w-full bg-[#0F1117] py-6 border-t border-white/5">
        <div className="site-container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Copyright */}
          <p className="text-[14px] sm:text-[16px] font-normal text-gray-400 leading-[150%] order-3 md:order-1">
            © 2026 ACCZORA. All rights reserved.
          </p>

          {/* Quick Legal Links */}
          <div className="flex items-center justify-center gap-6 text-[14px] sm:text-[16px] font-normal text-gray-400 order-1 md:order-2">
            <Link
              href="/terms"
              className="hover:text-white transition-colors duration-200"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link
              href="/refund"
              className="hover:text-white transition-colors duration-200"
            >
              Refund Policy
            </Link>
          </div>

          {/* Language & Currency */}
          <div className="flex items-center justify-center gap-4 text-[14px] sm:text-[16px] font-normal text-gray-400 order-2 md:order-3">
            <span className="hover:text-white transition-colors duration-200 cursor-pointer">
              English
            </span>
            <span className="hover:text-white transition-colors duration-200 cursor-pointer">
              USD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
