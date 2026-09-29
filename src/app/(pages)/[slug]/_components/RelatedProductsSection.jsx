// src/app/(pages)/[slug]/_components/RelatedProductsSection.jsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { H2 } from "@/components/ui/Typography";
import ProductCard from "@/components/shared/ProductCard";
import { products } from "@/app/(pages)/marketplace/_components/marketplaceData";

export default function RelatedProductsSection({ currentProductId }) {
  // Grab 4 items for related products
  const relatedList = products
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  return (
    <section className="mt-14 sm:mt-20 pt-10 border-t border-[#F0F2F5]">
      {/* Section Header */}
      <H2 className="text-xl sm:text-2xl font-bold text-[#1F2937] tracking-tight">
        Related Products
      </H2>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {relatedList.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            href={`/${product.slug || product.id}`}
          />
        ))}
      </div>

      {/* Centered CTA */}
      <div className="mt-10 sm:mt-12 flex justify-center">
        <Link
          href="/marketplace"
          className="px-6 py-2.5 rounded-xl bg-[#6658FF] hover:bg-[#5546F0] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors shadow-xs"
        >
          <span>View All Products</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
