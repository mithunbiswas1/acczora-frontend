// src/components/common/navbar/SearchBar.jsx

"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { iconButtonVariants } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";
import SearchModal from "./SearchModal";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* lg and up: full search pill */}
      <div
        onClick={() => setIsOpen(true)}
        className="hidden 2xl:flex items-center gap-3 px-4 py-2.5 mr-3.5 rounded-[10px] border border-border transition-all cursor-pointer hover:border-brand focus-within:border-brand"
      >
        <Search className="size-5 text-primary" />
        <input
          type="text"
          readOnly
          placeholder="Search products"
          className="w-29 text-sm text-primary outline-none placeholder:text-primary cursor-pointer"
        />
      </div>

      {/* md only: icon-only trigger, matches the Wishlist/Cart IconButtons */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Search"
        className={cn(iconButtonVariants(), "hidden md:flex 2xl:hidden")}
      >
        <Search className="h-full w-full" strokeWidth={1.6} />
      </button>

      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
