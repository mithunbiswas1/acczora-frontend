// src/app/(home)/_components/FeaturedProducts.jsx

"use client";

import { H2, P } from "@/components/ui/Typography";
import { LinkButton } from "@/components/ui/LinkButton";
import { ButtonArrowIcon } from "@/icons";
import ProductCard from "@/components/shared/ProductCard";
import { products } from "@/app/(pages)/marketplace/_components/marketplaceData";

export default function FeaturedProducts() {
  return (
    <section className="w-full py-8 md:py-15 lg:py-20 xl:py-24">
      <div className="site-container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10 lg:mb-15">
          {/* Header */}
          <div className="text-center md:text-left">
            <H2 className="ml-0 pl-0">Featured Products</H2>
            <P className="mt-2 md:mt-3 lg:mt-4 mx-auto">
              Handpicked offers from trusted sellers.
            </P>
          </div>

          <LinkButton href="/marketplace" variant="solid" size="lg">
            <span>View All Products</span>
            <ButtonArrowIcon size={18} />
          </LinkButton>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4.5 xl:gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
