// src/components/common/footer/footer.jsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { H3, H5 } from "@/components/ui/Typography";

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

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: "/social/facebook.png",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: "/social/instagram.png",
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: "/social/twitter.png",
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#111827] text-white">
      {/* Upper Main Footer */}
      <div className="site-container py-14 lg:py-18">
        {/* Row 1: Brand/Tagline + Marketplace, For Buyers, For Sellers */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand & Tagline */}
          <div className="md:col-span-12 lg:col-span-5 h-full flex flex-col">
            <Link href="/" className="inline-block" aria-label="ACCZORA Home">
              <Image
                src="/logo.png"
                alt="ACCZORA"
                width={161}
                height={40}
                className="h-10 w-auto object-contain brightness-0 invert"
                priority
              />
            </Link>
            <H3 className="mt-auto font-normal text-gray-100">
              Buy and sell digital products
              <br />
              with confidence.
            </H3>
          </div>

          {/* Right Link Columns */}
          <div className="md:col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Marketplace */}
            <div>
              <H5 className="font-semibold text-white mb-4 lg:mb-6">
                Marketplace
              </H5>
              <ul className="space-y-2">
                {marketplaceLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-[16px] font-normal text-gray-300 hover:text-white transition-colors duration-200 leading-[150%]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Buyers */}
            <div>
              <H5 className="font-semibold text-white mb-4 lg:mb-6">
                For Buyers
              </H5>
              <ul className="space-y-2">
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
              <H5 className="font-semibold text-white mb-4 lg:mb-6">
                For Sellers
              </H5>
              <ul className="space-y-2">
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
            <div className="flex items-center gap-6 mb-4 lg:mb-6">
              <H5 className="font-semibold text-white">
                Follow Us
              </H5>
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {socialLinks.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                  >
                    <Image src={icon} alt={label} width={24} height={24} />
                  </a>
                ))}
              </div>
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
              <H5 className="font-semibold text-white mb-4 lg:mb-6">
                Support
              </H5>
              <ul className="space-y-2">
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
              <H5 className="font-semibold text-white mb-4 lg:mb-6">
                Company
              </H5>
              <ul className="space-y-2">
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
              <H5 className="font-semibold text-white mb-4 lg:mb-6">
                Legal
              </H5>
              <ul className="space-y-2">
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
