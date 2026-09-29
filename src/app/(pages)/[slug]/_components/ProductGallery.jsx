// src/app/(pages)/[slug]/_components/ProductGallery.jsx

"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ gallery = [], productTitle = "Product" }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeItem = gallery[selectedIndex] || gallery[0] || {};
  const currentImage = activeItem.image || "/images/product-steam-card.jpg";

  return (
    <div className="w-full select-none">
      {/* Main Showcase Image Card */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[1.18/1] rounded-2xl overflow-hidden bg-[#7C8BA1] shadow-xs border border-gray-100">
        <Image
          src={currentImage}
          alt={activeItem.title || productTitle}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover rounded-2xl transition-all duration-300"
        />
      </div>

      {/* Thumbnails Row */}
      <div className="grid grid-cols-6 gap-2 sm:gap-3 mt-3 sm:mt-4">
        {gallery.map((item, idx) => {
          const isSelected = idx === selectedIndex;
          const thumbImage = item.image || "/images/product-steam-card.jpg";

          return (
            <button
              key={item.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Select product image ${idx + 1}`}
              className={`relative aspect-square rounded-xl overflow-hidden p-0.5 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-2 border-[#6658FF] ring-2 ring-[#6658FF]/25 shadow-xs"
                  : "border border-[#E5E7EB] hover:border-gray-400 opacity-85 hover:opacity-100 bg-white"
              }`}
            >
              <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-[#7C8BA1]">
                <Image
                  src={thumbImage}
                  alt={item.title || `Thumbnail ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 16vw, 80px"
                  className="object-cover"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
