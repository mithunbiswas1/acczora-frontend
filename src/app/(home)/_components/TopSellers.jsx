// src/app/(home)/_components/TopSellers.jsx

"use client";

import { useMemo } from "react";
import { H2, P } from "@/components/ui/Typography";
import { LinkButton } from "@/components/ui/LinkButton";
import { ButtonArrowIcon } from "@/icons";
import SellerCard from "@/components/shared/SellerCard";
import { useGetAllStoresQuery } from "@/redux/api/storeApi";
import { sellersData as fallbackSellers } from "@/data";

export default function TopSellers() {
  const { data: storesResponse, isLoading } = useGetAllStoresQuery({ limit: 8 });

  const sellers = useMemo(() => {
    const apiStores = storesResponse?.data?.stores;
    if (Array.isArray(apiStores) && apiStores.length > 0) {
      return apiStores;
    }
    return fallbackSellers;
  }, [storesResponse]);

  return (
    <section className="w-full py-8 md:py-15 lg:py-20 xl:py-24">
      <div className="site-container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-10 lg:mb-15">
          {/* Header */}
          <div className="text-center md:text-left">
            <H2 className="ml-0 pl-0">Top Sellers</H2>
            <P className="mt-2 md:mt-3 lg:mt-4 mx-auto">
              Meet trusted sellers from our growing marketplace.
            </P>
          </div>

          <LinkButton href="/sellers" variant="solid" size="lg">
            <span>View All Sellers</span>
            <ButtonArrowIcon size={18} />
          </LinkButton>
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4.5 xl:gap-6">
          {sellers.slice(0, 4).map((seller) => (
            <SellerCard
              key={seller._id || seller.id}
              seller={seller}
              href={`/store/${seller.slug || seller.shopSlug || "nova-store"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
