// src/app/(pages)/[slug]/_data/productDetailData.js

import { products } from "@/app/(pages)/marketplace/_components/marketplaceData";

export const defaultProduct = {
  id: 3,
  slug: "steam-gaming-account-level-50",
  category: "Gaming",
  categoryTags: "Gaming, Commercial & info",
  subcategory: "Steam",
  title: "Premium Steam Gaming Account – Level 50",
  rating: 4.8,
  reviewsCount: 127,
  stockLeft: 24,
  price: 24.99,
  seller: {
    name: "Harry Potter",
    verified: true,
    role: "Top Developer",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    rating: 4.9,
    sales: "1.2k+",
    productsCount: "50+",
  },
  deliveryTime: "Instant delivery",
  deliverySubtext: "Delivered just minute after order",
  guaranteeTime: "30 days guarantee",
  guaranteeSubtext: "Full refund within 30 days",
  gallery: [
    {
      id: 1,
      title: "Steam Gaming Account Card - View 1",
      image: "/images/product-steam-card.jpg",
      variant: "Steam Pass #01",
    },
    {
      id: 2,
      title: "Steam Gaming Account Card - View 2",
      image: "/images/product-steam-card.jpg",
      variant: "Steam Pass #02",
    },
    {
      id: 3,
      title: "Steam Gaming Account Card - View 3",
      image: "/images/product-steam-card.jpg",
      variant: "Steam Pass #03",
    },
    {
      id: 4,
      title: "Steam Gaming Account Card - View 4",
      image: "/images/product-steam-card.jpg",
      variant: "Steam Pass #04",
    },
    {
      id: 5,
      title: "Steam Gaming Account Card - View 5",
      image: "/images/product-steam-card.jpg",
      variant: "Steam Pass #05",
    },
    {
      id: 6,
      title: "Steam Gaming Account Card - View 6",
      image: "/images/product-steam-card.jpg",
      variant: "Steam Pass #06",
    },
  ],
  descriptionParagraphs: [
    "Premium secondary steam account with original creation email and credentials. Features a clean account history, zero bans, and instant access to a massive library of premier games. Includes top-tier titles like CS2, Cyberpunk 2077, GTA V, and more. Full primary email handover allows you to change password, security questions, and bind your own authenticator smoothly.",
    "This account has been verified by our security team and comes with full lifetime recovery guarantee. Fast delivery to your email immediately after payment verification. 24/7 dedicated support is available if you need any assistance during the account setup process.",
  ],
  whatsIncluded: [
    "Full email access",
    "Original email included",
    "2-step verification ready",
    "24/7 product support",
  ],
  productDetails: [
    { label: "Company", value: "Gaming" },
    { label: "Number", value: "Steam" },
    { label: "Plan", value: "Premium" },
    { label: "Region", value: "Global" },
  ],
  deliveryInfo: {
    title: "Instant Delivery",
    description:
      "Your account details will be sent to your email immediately after payment is confirmed by our automated system.",
  },
  buyerProtection: [
    { label: "Company", value: "Gaming" },
    { label: "Number", value: "Steam" },
    { label: "Plan", value: "Premium" },
    { label: "Region", value: "Global" },
  ],
  confidenceCards: [
    {
      id: "escrow",
      title: "Escrow Payment",
      description: "Funds securely held in escrow until you verify credentials.",
      icon: "ShieldCheck",
      isActive: false,
    },
    {
      id: "instant-delivery",
      title: "Instant Delivery",
      description: "Automated instant delivery right after payment completion.",
      icon: "Zap",
      isActive: true, // highlighted purple border in design
    },
    {
      id: "verified-sellers",
      title: "Verified Sellers",
      description: "Identity verified sellers with documented track records.",
      icon: "BadgeCheck",
      isActive: false,
    },
    {
      id: "buyer-protection",
      title: "Buyer Protection",
      description: "30-day money-back guarantee with zero transaction risk.",
      icon: "Headset",
      isActive: false,
    },
  ],
  reviewsData: {
    totalReviews: "10.0k",
    growth: "Growth 21%",
    growthSubtext: "Growth in reviews on this year",
    averageRating: "4.0",
    ratingSubtext: "Average ratings on this year",
    distribution: [
      { stars: 5, count: "9.1k", percentage: 91 },
      { stars: 4, count: "1.2k", percentage: 45 },
      { stars: 3, count: "400", percentage: 20 },
      { stars: 2, count: "150", percentage: 8 },
      { stars: 1, count: "80", percentage: 3 },
    ],
    items: [
      {
        id: 1,
        author: "Rosanna A.",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
        rating: 5,
        badge: "25k",
        comment:
          "Great transaction! Received my Steam credentials within seconds. Everything matched the description perfectly and support was friendly.",
      },
      {
        id: 2,
        author: "Rosanna A.",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
        rating: 5,
        badge: "25k",
        comment:
          "Great transaction! Received my Steam credentials within seconds. Everything matched the description perfectly and support was friendly.",
      },
      {
        id: 3,
        author: "Rosanna A.",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80",
        rating: 5,
        badge: "25k",
        comment:
          "Great transaction! Received my Steam credentials within seconds. Everything matched the description perfectly and support was friendly.",
      },
    ],
  },
};

export function getProductBySlug(slug) {
  if (!slug) return defaultProduct;

  const found = products.find(
    (p) =>
      p.slug?.toLowerCase() === slug.toLowerCase() ||
      String(p.id) === String(slug),
  );

  if (!found) {
    return defaultProduct;
  }

  return {
    ...defaultProduct,
    id: found.id,
    slug: found.slug || slug,
    category: found.category || defaultProduct.category,
    subcategory: found.subcategory || defaultProduct.subcategory,
    categoryTags: `${found.category}, Commercial & info`,
    title: found.title,
    price: found.price,
    seller: {
      ...defaultProduct.seller,
      ...(found.seller || {}),
    },
    gallery: defaultProduct.gallery.map((g, idx) => ({
      ...g,
      image: found.image || g.image,
      variant: `${found.subcategory || "Item"} #${idx + 1}`,
    })),
  };
}
