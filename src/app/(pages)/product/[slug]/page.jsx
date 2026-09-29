// src/app/(pages)/[slug]/page.jsx

import Breadcrumb from "@/components/shared/Breadcrumb";
import ProductGallery from "./_components/ProductGallery";
import ProductBuyBox from "./_components/ProductBuyBox";
import ProductAbout from "./_components/ProductAbout";
import ConfidenceBanner from "./_components/ConfidenceBanner";
import SellerShowcaseCard from "./_components/SellerShowcaseCard";
import ProductReviews from "@/components/shared/ProductReviews";
import RelatedProductsSection from "@/components/shared/RelatedProductsSection";

import { getProductBySlug, products } from "@/data";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  return {
    title: product.title,
    description: `Buy ${product.title} on ACCZORA with instant delivery, buyer protection, and secure escrow payments.`,
    openGraph: {
      title: `${product.title} | ACCZORA`,
      description: `Buy verified ${product.title} with instant delivery & 30-day guarantee.`,
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Marketplace", href: "/marketplace" },
    ...(product.category
      ? [
          {
            label: product.category,
            href: `/marketplace?category=${encodeURIComponent(product.category)}`,
          },
        ]
      : []),
    ...(product.subcategory
      ? [
          {
            label: product.subcategory,
            href: `/marketplace?category=${encodeURIComponent(product.category)}&subcategory=${encodeURIComponent(product.subcategory)}`,
          },
        ]
      : []),
    { label: product.title, href: "#", current: true },
  ];

  // Prepare related products to pass down
  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-white pb-16 sm:pb-24">
      <div className="site-container">
        {/* Breadcrumb Bar */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Hero Top Grid: Left Gallery + Right Purchase Box */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-2">
          <ProductGallery
            gallery={product.gallery}
            productTitle={product.title}
          />
          <ProductBuyBox product={product} />
        </div>

        {/* About This Product & 4-Column Feature Grid */}
        <ProductAbout product={product} />

        {/* Shop with confidence on ACCZORA (4 Value Prop Cards) */}
        <ConfidenceBanner />

        {/* Seller Showcase Card */}
        <SellerShowcaseCard seller={product.seller} />

        {/* Total Reviews, Average Ratings & Customer Testimonials */}
        <ProductReviews reviewsData={product.reviewsData} />

        {/* Related Products Grid & View All CTA */}
        <RelatedProductsSection
          products={relatedProducts}
          title="Related Products"
          viewAllHref="/marketplace"
        />
      </div>
    </main>
  );
}
