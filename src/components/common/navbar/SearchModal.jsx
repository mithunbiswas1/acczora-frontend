// src/components/common/navbar/SearchModal.jsx

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X } from "lucide-react";
import { H6, Caption } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// Demo/mock data - same shape and assets used across the site (see FeaturedProducts).
const DEMO_PRODUCTS = [
  {
    id: 1,
    category: "Social Media",
    title: "Facebook Account",
    specs: "USA • 10K+ Followers • Aged",
    price: 24.99,
    image: "/logo_image/facebook.png",
  },
  {
    id: 2,
    category: "Email",
    title: "Gmail Account",
    specs: "Premium • 5 Years Old • Verified",
    price: 39.99,
    image: "/logo_image/google.png",
  },
  {
    id: 3,
    category: "Gaming",
    title: "Steam Gaming Account",
    specs: "Level 80 • 25+ Games",
    price: 14.99,
    image: "/logo_image/steam.png",
  },
  {
    id: 4,
    category: "AI Tools",
    title: "Claude Account",
    specs: "Pro • 1 Month • Full Access",
    price: 19.99,
    image: "/logo_image/claude.png",
  },
  {
    id: 5,
    category: "Business",
    title: "Amazon Account",
    specs: "USA • Verified • Aged",
    price: 29.99,
    image: "/logo_image/amazon.png",
  },
  {
    id: 6,
    category: "Developer",
    title: "Visual Studio Account",
    specs: "Verified • Ready to Use",
    price: 49.99,
    image: "/logo_image/visual-studio-code.png",
  },
  {
    id: 7,
    category: "Streaming",
    title: "Netflix Premium",
    specs: "30 Days • Premium",
    price: 9.99,
    image: "/logo_image/netflix.png",
  },
  {
    id: 8,
    category: "Software",
    title: "Android Software License",
    specs: "1 Year • Full Access",
    price: 34.99,
    image: "/logo_image/android.png",
  },
];

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");

  // Lock body scroll + close on Escape while the modal is open.
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset the query each time the modal is (re)opened.
  useEffect(() => {
    if (isOpen) setQuery("");
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DEMO_PRODUCTS;
    return DEMO_PRODUCTS.filter(
      (product) =>
        product.title.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q),
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-xl rounded-[16px] border border-border bg-white shadow-2xl">
        {/* Header: close button */}
        {/* <div className="flex justify-end px-4 pt-4">
          <Button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="!p-0 h-auto w-auto text-tertiary hover:text-primary"
          >
            <X className="w-5 h-5" />
          </Button>
        </div> */}

        <div className="px-5 py-5 ">
          {/* Search input */}
          <Input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            prefix={<Search className="size-5 text-primary" />}
          />

          {/* Results */}
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {!query.trim() && (
              <Caption className="px-1 pb-2">Popular searches</Caption>
            )}

            {results.length === 0 ? (
              <p className="py-8 text-center text-sm text-tertiary">
                No results found for &ldquo;{query}&rdquo;
              </p>
            ) : (
              <ul className="flex flex-col gap-1">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-2.5 rounded-[10px] hover:bg-gray-50 transition-colors"
                    >
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={40}
                        height={40}
                        className="size-10 object-contain shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <H6 className="truncate">{product.title}</H6>
                        <Caption className="truncate">
                          {product.category} • {product.specs}
                        </Caption>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
