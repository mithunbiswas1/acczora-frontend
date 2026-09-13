// src/app/(home)/_components/TopSellers.jsx

"use client";

import { H2, P } from "@/components/ui/Typography";
import { LinkButton } from "@/components/ui/LinkButton";
import { ButtonArrowIcon } from "@/icons";
import SellerCard from "@/components/shared/SellerCard";

const defaultLogos = [
  "/logo_image/facebook.png",
  "/logo_image/figma.png",
  "/logo_image/apple.png",
];

const sellers = [
  {
    id: 1,
    name: "NovaStore",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    sales: "2.4K+ Sales",
    productsCount: "126 Products",
    rating: "4.5",
    reviews: "350+ Reviews",
    extraCount: "120+",
    logos: defaultLogos,
  },
  {
    id: 2,
    name: "NovaStore",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&auto=format&fit=crop&q=80",
    sales: "2.4K+ Sales",
    productsCount: "126 Products",
    rating: "4.5",
    reviews: "350+ Reviews",
    extraCount: "120+",
    logos: defaultLogos,
  },
  {
    id: 3,
    name: "NovaStore",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&auto=format&fit=crop&q=80",
    sales: "2.4K+ Sales",
    productsCount: "126 Products",
    rating: "4.5",
    reviews: "350+ Reviews",
    extraCount: "120+",
    logos: defaultLogos,
  },
  {
    id: 4,
    name: "NovaStore",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    sales: "2.4K+ Sales",
    productsCount: "126 Products",
    rating: "4.5",
    reviews: "350+ Reviews",
    extraCount: "120+",
    logos: defaultLogos,
  },
  {
    id: 5,
    name: "NovaStore",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    sales: "2.4K+ Sales",
    productsCount: "126 Products",
    rating: "4.5",
    reviews: "350+ Reviews",
    extraCount: "120+",
    logos: defaultLogos,
  },
  {
    id: 6,
    name: "NovaStore",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&auto=format&fit=crop&q=80",
    sales: "2.4K+ Sales",
    productsCount: "126 Products",
    rating: "4.5",
    reviews: "350+ Reviews",
    extraCount: "120+",
    logos: defaultLogos,
  },
  {
    id: 7,
    name: "NovaStore",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80",
    sales: "2.4K+ Sales",
    productsCount: "126 Products",
    rating: "4.5",
    reviews: "350+ Reviews",
    extraCount: "120+",
    logos: defaultLogos,
  },
  {
    id: 8,
    name: "NovaStore",
    verified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=600&auto=format&fit=crop&q=80",
    sales: "2.4K+ Sales",
    productsCount: "126 Products",
    rating: "4.5",
    reviews: "350+ Reviews",
    extraCount: "120+",
    logos: defaultLogos,
  },
];

export default function TopSellers() {
  return (
    <section className="w-full py-10 lg:py-16">
      <div className="site-container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <H2 className="text-primary font-bold text-[28px] sm:text-[32px] lg:text-[36px] leading-[120%]">
              Top Sellers
            </H2>
            <P className="mt-1 text-sm sm:text-base text-secondary">
              Meet trusted sellers from our growing marketplace.
            </P>
          </div>

          <LinkButton
            href="/sellers"
            variant="solid"
            size="md"
            className="self-start sm:self-auto"
          >
            <span>View All Sellers</span>
            <ButtonArrowIcon size={18} />
          </LinkButton>
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {sellers.map((seller) => (
            <SellerCard
              key={seller.id}
              seller={seller}
              href={`/sellers/${seller.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
