// src/components/shared/RelatedProductsSection.jsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { H2 } from "@/components/ui/Typography";
import ProductCard from "@/components/shared/ProductCard";

export default function RelatedProductsSection({
  products = [],
  title = "Related Products",
  viewAllHref = "/marketplace",
  viewAllText = "View All Products",
}) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-14 sm:mt-20 pt-10 border-t border-[#F0F2F5]">
      {/* Section Header */}
      <H2 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
        {title}
      </H2>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            href={`/${product.slug || product.id}`}
          />
        ))}
      </div>

      {/* Centered CTA */}
      {viewAllHref && (
        <div className="mt-10 sm:mt-12 flex justify-center">
          <Link
            href={viewAllHref}
            className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors shadow-xs"
          >
            <span>{viewAllText}</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
