// src/app/(pages)/product/[slug]/page.jsx

import { notFound } from "next/navigation";
import Breadcrumb from "@/components/shared/Breadcrumb";
import ProductGallery from "./_components/ProductGallery";
import ProductBuyBox from "./_components/ProductBuyBox";
import ProductAbout from "./_components/ProductAbout";
import ConfidenceBanner from "./_components/ConfidenceBanner";
import SellerShowcaseCard from "./_components/SellerShowcaseCard";
import ProductReviews from "@/components/shared/ProductReviews";
import RelatedProductsSection from "@/components/shared/RelatedProductsSection";
import { API_BASE_URL } from "@/config/base-url";
import {
  getProductBySlug as getMockProductBySlug,
  products as mockProducts,
} from "@/data";
import { getSafeImageSrc } from "@/utils/imageUtils";

async function getProduct(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}get-product-by-slug/${slug}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data) return json.data;
    }
  } catch (err) {
    // ignore
  }

  return getMockProductBySlug(slug) || null;
}

async function getRelatedProducts(currentId) {
  try {
    const res = await fetch(`${API_BASE_URL}get-all-products?limit=6`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const list = json?.data?.products || json?.data || [];
      if (Array.isArray(list) && list.length > 0) {
        return list
          .filter((p) => (p._id || p.id) !== currentId)
          .slice(0, 4);
      }
    }
  } catch (err) {
    // ignore
  }
  return mockProducts.filter((p) => p.id !== currentId).slice(0, 4);
}

async function getProductReviews(productId) {
  if (!productId) return null;
  try {
    const res = await fetch(`${API_BASE_URL}get-product-reviews/${productId}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const reviews = json?.data?.reviews || json?.data || [];
      if (Array.isArray(reviews) && reviews.length > 0) {
        const total = reviews.length;
        const avg = (
          reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / total
        ).toFixed(1);

        return {
          totalReviews: `${total} Reviews`,
          growth: "+15%",
          growthSubtext: "Growth in reviews this year",
          averageRating: avg,
          ratingSubtext: "Average rating on this product",
          distribution: [5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter(
              (r) => Math.round(r.rating || 5) === stars
            ).length;
            return {
              stars,
              count,
              percentage: total > 0 ? Math.round((count / total) * 100) : 0,
            };
          }),
          items: reviews.map((r) => ({
            id: r._id,
            author: r.buyer?.fullName || r.buyer?.userName || "Verified Buyer",
            avatar: r.buyer?.image || "/review_avater.jpg",
            rating: r.rating || 5,
            ratingFormatted: Number(r.rating || 5).toFixed(1),
            comment: r.comment || "",
          })),
        };
      }
    }
  } catch (err) {
    // ignore
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.title,
    description: `Buy ${product.title} on ACCZORA with instant auto-delivery, buyer protection, and secure escrow payments.`,
    openGraph: {
      title: `${product.title} | ACCZORA`,
      description: `Buy verified ${product.title} with instant delivery & 30-day guarantee.`,
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const categoryName =
    typeof product.category === "object"
      ? product.category?.name
      : product.categoryName || product.category || "";
  const subcategoryName =
    typeof product.subcategory === "object"
      ? product.subcategory?.name
      : product.subcategoryName || product.subcategory || "";

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Marketplace", href: "/marketplace" },
    ...(categoryName
      ? [
          {
            label: categoryName,
            href: `/marketplace?category=${encodeURIComponent(categoryName)}`,
          },
        ]
      : []),
    ...(subcategoryName
      ? [
          {
            label: subcategoryName,
            href: `/marketplace?category=${encodeURIComponent(categoryName)}&subcategory=${encodeURIComponent(subcategoryName)}`,
          },
        ]
      : []),
    { label: product.title, href: "#", current: true },
  ];

  // Gallery normalization
  const gallery =
    Array.isArray(product.gallery) && product.gallery.length > 0
      ? product.gallery.map((g, idx) => ({
          id: g.id || idx,
          image: getSafeImageSrc(g.image || g.url || g, "/product_demo_image.jpg"),
          title: g.title || product.title,
        }))
      : Array.isArray(product.media) && product.media.length > 0
      ? product.media.map((m, idx) => ({
          id: idx,
          image: getSafeImageSrc(typeof m === "string" ? m : m.url || m.image, "/product_demo_image.jpg"),
          title: product.title,
        }))
      : [
          {
            id: 0,
            image: getSafeImageSrc(product.thumbnail, "/product_demo_image.jpg"),
            title: product.title,
          },
        ];

  // Fetch reviews and related products
  const liveReviews = await getProductReviews(product._id);
  const reviewsData = liveReviews || product.reviewsData;
  const relatedProducts = await getRelatedProducts(product._id || product.id);

  return (
    <main className="min-h-screen bg-white pb-16 sm:pb-24">
      <div className="site-container">
        {/* Breadcrumb Bar */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Hero Top Grid: Left Gallery + Right Purchase Box */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mt-2">
          <ProductGallery
            gallery={gallery}
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
        {reviewsData && <ProductReviews reviewsData={reviewsData} />}

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
