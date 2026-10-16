// src/app/(pages)/store/[slug]/page.jsx

import Breadcrumb from "@/components/shared/Breadcrumb";
import StoreHeaderCard from "../_components/StoreHeaderCard";
import StoreProductsSection from "../_components/StoreProductsSection";
import StoreReviewsSection from "../_components/StoreReviewsSection";
import { storeData } from "../_data/storeData";
import { products as fallbackProducts } from "@/data";
import { API_BASE_URL } from "@/config/base-url";

async function fetchStoreData(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}get-store-by-slug/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const apiData = await fetchStoreData(slug);

  const storeName =
    apiData?.seller?.name ||
    (slug === "nova-store" || slug === "novastore"
      ? "NovaStore"
      : slug
      ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "Store");

  return {
    title: `${storeName} | ACCZORA`,
    description: `Browse digital products, accounts and licenses from ${storeName} on ACCZORA.`,
  };
}

export default async function StoreProfilePage({ params }) {
  const { slug } = await params;
  const apiData = await fetchStoreData(slug);

  // Fallback defaults
  const {
    seller: fallbackSeller,
    categories: fallbackCategories,
    reviewsSummary: fallbackReviewsSummary,
    reviews: fallbackReviews,
  } = storeData;

  const currentStoreName =
    apiData?.seller?.name ||
    (slug === "nova-store" || slug === "novastore" || !slug
      ? fallbackSeller.name
      : slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));

  const currentSeller = apiData?.seller
    ? {
        name: apiData.seller.name,
        avatar: apiData.seller.logo || "/seller_avater.jpg",
        verified: apiData.seller.verified ?? true,
        bio: apiData.seller.bio || "Verified digital accounts seller",
        rating: String(apiData.seller.rating || "5.0"),
        ratingLabel: "Seller rating",
        sales: String(apiData.seller.productsCount || "0"),
        salesLabel: "Products",
        positiveReviews: "99%",
        positiveLabel: "Positive reviews",
        since: apiData.seller.memberSince
          ? `Since ${new Date(apiData.seller.memberSince).getFullYear()}`
          : "Since 2025",
        sinceLabel: "Selling on ACCZORA",
        telegram: apiData.seller.telegram,
        email: apiData.seller.email,
      }
    : {
        ...fallbackSeller,
        name: currentStoreName,
      };

  const currentProducts =
    apiData?.products && apiData.products.length > 0
      ? apiData.products
      : fallbackProducts;

  const currentReviews =
    apiData?.reviews && apiData.reviews.length > 0
      ? apiData.reviews
      : fallbackReviews;

  const currentReviewsSummary = apiData?.reviewsSummary
    ? {
        totalReviews: String(apiData.reviewsSummary.totalReviews || 0),
        growth: "+100%",
        growthSubtext: "Growth in verified reviews",
        averageRating: String(apiData.reviewsSummary.averageRating || "5.0"),
        ratingSubtext: "Average rating on marketplace",
        distribution: [
          {
            stars: 5,
            count: String(apiData.reviewsSummary.distribution?.[5] || 0),
            percentage: 95,
          },
          {
            stars: 4,
            count: String(apiData.reviewsSummary.distribution?.[4] || 0),
            percentage: 5,
          },
          {
            stars: 3,
            count: String(apiData.reviewsSummary.distribution?.[3] || 0),
            percentage: 0,
          },
          {
            stars: 2,
            count: String(apiData.reviewsSummary.distribution?.[2] || 0),
            percentage: 0,
          },
          {
            stars: 1,
            count: String(apiData.reviewsSummary.distribution?.[1] || 0),
            percentage: 0,
          },
        ],
      }
    : fallbackReviewsSummary;

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
          products={currentProducts}
          categories={fallbackCategories}
          totalCount={`${currentProducts.length} products`}
        />

        {/* Seller Reviews Section (Approved Reviews Only) */}
        <StoreReviewsSection
          reviewsSummary={currentReviewsSummary}
          reviews={currentReviews}
          totalCount={`${currentReviews.length} reviews`}
        />
      </div>
    </main>
  );
}
