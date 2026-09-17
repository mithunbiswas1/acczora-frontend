// src/app/(home)/_components/FeaturedProducts.jsx

"use client";

import { H2, P } from "@/components/ui/Typography";
import { LinkButton } from "@/components/ui/LinkButton";
import { ButtonArrowIcon } from "@/icons";
import ProductCard from "@/components/shared/ProductCard";

const products = [
  {
    id: 1,
    category: "Social Media",
    title: "Facebook Account",
    specs: ["USA", "10K+ Followers", "Aged"],
    inStock: true,
    instantDelivery: true,
    isBestSeller: true,
    price: 24.99,
    logo_image: "/logo_image/facebook.png",
    image: "/logo_image/facebook.png",
    gradient: "linear-gradient(to top right, #066BDA22 0%, #066BDA00 100%)",
    bg: "#066BDA0F",
    seller: {
      name: "NovaStore",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
      rating: "4.5",
      reviews: "350+ Reviews",
    },
  },
  {
    id: 2,
    category: "Email",
    title: "Gmail Account",
    specs: ["Premium", "5 Years Old", "Verified"],
    inStock: true,
    instantDelivery: true,
    isBestSeller: true,
    price: 39.99,
    logo_image: "/logo_image/google.png",
    image: "/logo_image/google.png",
    gradient: "linear-gradient(to top right, #EA43351F 0%, #4285F400 100%)",
    bg: "#EA43350F",
    seller: {
      name: "DigitalHub",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80",
      rating: "4.5",
      reviews: "350+ Reviews",
    },
  },
  {
    id: 3,
    category: "Gaming",
    title: "Steam Gaming Account",
    specs: ["Level 80", "25+ Games"],
    inStock: true,
    instantDelivery: true,
    isBestSeller: true,
    price: 14.99,
    logo_image: "/logo_image/steam.png",
    image: "/logo_image/steam.png",
    gradient: "linear-gradient(to top right, #00ADEE20 0%, #00ADEE00 100%)",
    bg: "#00ADEE0F",
    seller: {
      name: "GameVault",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80",
      rating: "4.5",
      reviews: "350+ Reviews",
    },
  },
  {
    id: 4,
    category: "AI Tools",
    title: "Claude Account",
    specs: ["Pro", "1 Month", "Full Access"],
    inStock: true,
    instantDelivery: true,
    isBestSeller: true,
    price: 19.99,
    logo_image: "/logo_image/claude.png",
    image: "/logo_image/claude.png",
    gradient: "linear-gradient(to top right, #D9770620 0%, #D9770600 100%)",
    bg: "#D977060F",
    seller: {
      name: "TechMarket",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&auto=format&fit=crop&q=80",
      rating: "4.5",
      reviews: "350+ Reviews",
    },
  },
  {
    id: 5,
    category: "Business",
    title: "Amazon Account",
    specs: ["USA", "Verified", "Aged"],
    inStock: true,
    instantDelivery: true,
    isBestSeller: true,
    price: 29.99,
    logo_image: "/logo_image/amazon.png",
    image: "/logo_image/amazon.png",
    gradient: "linear-gradient(to top right, #FF990022 0%, #FF990000 100%)",
    bg: "#FF99000F",
    seller: {
      name: "ProAccounts",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&auto=format&fit=crop&q=80",
      rating: "4.5",
      reviews: "350+ Reviews",
    },
  },
  {
    id: 6,
    category: "Developer",
    title: "Visual Studio Account",
    specs: ["Verified", "Ready to Use"],
    inStock: true,
    instantDelivery: true,
    isBestSeller: true,
    price: 49.99,
    logo_image: "/logo_image/visual-studio-code.png",
    image: "/logo_image/visual-studio-code.png",
    gradient: "linear-gradient(to top right, #007ACC20 0%, #007ACC00 100%)",
    bg: "#007ACC0F",
    seller: {
      name: "DevStore",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&auto=format&fit=crop&q=80",
      rating: "4.5",
      reviews: "350+ Reviews",
    },
  },
  {
    id: 7,
    category: "Streaming",
    title: "Netflix Premium",
    specs: ["30 Days", "Premium"],
    inStock: true,
    instantDelivery: true,
    isBestSeller: true,
    price: 9.99,
    logo_image: "/logo_image/netflix.png",
    image: "/logo_image/netflix.png",
    gradient: "linear-gradient(to top right, #E5091420 0%, #E5091400 100%)",
    bg: "#E509140F",
    seller: {
      name: "StreamHub",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80",
      rating: "4.5",
      reviews: "350+ Reviews",
    },
  },
  {
    id: 8,
    category: "Software",
    title: "Software License",
    specs: ["1 Year", "Full Access"],
    inStock: true,
    instantDelivery: true,
    isBestSeller: true,
    price: 34.99,
    logo_image: "/logo_image/android.png",
    image: "/logo_image/android.png",
    gradient: "linear-gradient(to top right, #3DDC8424 0%, #3DDC8400 100%)",
    bg: "#3DDC840F",
    seller: {
      name: "SoftZone",
      verified: true,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80",
      rating: "4.5",
      reviews: "350+ Reviews",
    },
  },
];

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

          <LinkButton href="/products" variant="solid" size="lg">
            <span>View All Products</span>
            <ButtonArrowIcon size={18} />
          </LinkButton>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4.5 xl:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              href={`/products/${product.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
