// src/app/(pages)/[slug]/_components/ProductGallery.jsx

"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ gallery = [], productTitle = "Product" }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeItem = gallery[selectedIndex] || gallery[0] || {};
  const currentImage = activeItem.image || "/product_demo_image.jpg";

  return (
    <div className="w-full select-none">
      {/* Main Showcase Image Card */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[1.15/1] rounded-[20px] overflow-hidden bg-[#7C8BA1] shadow-xs">
        <Image
          src={currentImage}
          alt={activeItem.title || productTitle}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover rounded-[20px] transition-all duration-300"
        />
      </div>

      {/* Thumbnails Row */}
      <div className="grid grid-cols-6 gap-2 sm:gap-2.5 mt-3 sm:mt-4">
        {gallery.map((item, idx) => {
          const isSelected = idx === selectedIndex;
          const thumbImage = item.image || "/product_demo_image.jpg";

          return (
            <button
              key={item.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Select product image ${idx + 1}`}
              className={`relative aspect-square rounded-[10px] overflow-hidden p-[2px] transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-2 border-primary shadow-xs"
                  : "border border-transparent hover:border-gray-300 opacity-90 hover:opacity-100"
              }`}
            >
              <div className="relative w-full h-full rounded-[8px] overflow-hidden bg-[#7C8BA1]">
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
