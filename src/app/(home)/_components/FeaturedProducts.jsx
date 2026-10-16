// src/app/(home)/_components/FeaturedProducts.jsx

"use client";

import { useMemo } from "react";
import { H2, P } from "@/components/ui/Typography";
import { LinkButton } from "@/components/ui/LinkButton";
import { ButtonArrowIcon } from "@/icons";
import ProductCard from "@/components/shared/ProductCard";
import { useGetAllProductsQuery } from "@/redux/api/productApi";

export default function FeaturedProducts() {
  const { data: apiResponse, isLoading } = useGetAllProductsQuery({
    limit: 8,
    sort: "popular",
    is_active: "true",
  });

  const productList = useMemo(() => {
    const list = apiResponse?.data?.products || apiResponse?.data || [];
    return Array.isArray(list) ? list : [];
  }, [apiResponse]);

  return (
    <section className="w-full py-8 md:py-15 lg:py-20 xl:py-24">
      <div className="site-container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10 lg:mb-15">
          {/* Header */}
          <div className="text-center md:text-left">
            <H2 className="ml-0 pl-0">Featured Products</H2>
            <P className="mt-2 md:mt-3 lg:mt-4 mx-auto md:mx-0">
              Handpicked offers from trusted sellers.
            </P>
          </div>

          <LinkButton href="/marketplace" variant="solid" size="lg">
            <span>View All Products</span>
            <ButtonArrowIcon size={18} />
          </LinkButton>
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4.5 xl:gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[380px] rounded-[12px] bg-gray-100 dark:bg-gray-800 animate-pulse border border-border"
              />
            ))}
          </div>
        ) : productList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4.5 xl:gap-6">
            {productList.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id || product.id || product.slug}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <P className="text-muted-foreground">
              No products available right now. Check back soon!
            </P>
          </div>
        )}
      </div>
    </section>
  );
}
