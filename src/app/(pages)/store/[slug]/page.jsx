// src/app/(pages)/store/[slug]/page.jsx

import Breadcrumb from "@/components/shared/Breadcrumb";
import StoreHeaderCard from "../_components/StoreHeaderCard";
import StoreProductsSection from "../_components/StoreProductsSection";
import StoreReviewsSection from "../_components/StoreReviewsSection";
import { storeData } from "../_data/storeData";
import { products } from "@/data";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const storeName =
    slug === "nova-store" || slug === "novastore"
      ? "NovaStore"
      : slug
        ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "Store";

  return {
    title: `${storeName} | ACCZORA`,
    description: `Browse digital products, accounts and licenses from ${storeName} on ACCZORA.`,
  };
}

export default async function StoreProfilePage({ params }) {
  const { slug } = await params;
  const { seller, categories, reviewsSummary, reviews } = storeData;

  const currentStoreName =
    slug === "nova-store" || slug === "novastore" || !slug
      ? seller.name
      : slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const currentSeller = {
    ...seller,
    name: currentStoreName,
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Stores", href: "/sellers" },
    { label: currentStoreName, href: "#", current: true },
  ];

  return (
    <main className="min-h-screen bg-white pb-16 sm:pb-24">
      <div className="site-container">
        {/* Breadcrumb Bar */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Top Seller Profile Card */}
        <StoreHeaderCard seller={currentSeller} />

        {/* All Products Section */}
        <StoreProductsSection
          products={products}
          categories={categories}
          totalCount="126 products"
        />

        {/* Seller Reviews Section */}
        <StoreReviewsSection
          reviewsSummary={reviewsSummary}
          reviews={reviews}
          totalCount="1,284 reviews"
        />
      </div>
    </main>
  );
}
