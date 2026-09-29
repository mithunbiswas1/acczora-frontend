// src/app/(pages)/[slug]/_data/productDetailData.js

import { products } from "@/app/(pages)/marketplace/_components/marketplaceData";

export const defaultProduct = {
  id: 3,
  slug: "premium-steam-gaming-account-level-50",
  category: "Gaming",
  categoryTags: "Gaming / Game Accounts",
  subcategory: "Game Accounts",
  title: "Premium Steam Gaming Account – Level 50",
  rating: 4.5,
  reviewsCount: 124,
  salesCount: "54,669 Sold",
  stockLeft: 120,
  price: 24.99,
  seller: {
    name: "NovaStore",
    slug: "nova-store",
    verified: true,
    role: "Verified Seller",
    avatar: "/seller_avater.jpg",
    rating: 4.9,
    sales: "1,284",
    positiveRating: "98%",
    productsCount: "50+",
  },
  deliveryTime: "Instant Delivery",
  deliverySubtext: "Delivered quickly and conveniently.",
  stockStatus: "In Stock",
  stockSubtext: "Available now and ready to ship.",
  gallery: [
    {
      id: 1,
      title: "Product View 1",
      image: "/product_demo_image.jpg",
      variant: "Pass #01",
    },
    {
      id: 2,
      title: "Product View 2",
      image: "/product_demo_image.jpg",
      variant: "Pass #02",
    },
    {
      id: 3,
      title: "Product View 3",
      image: "/product_demo_image.jpg",
      variant: "Pass #03",
    },
    {
      id: 4,
      title: "Product View 4",
      image: "/product_demo_image.jpg",
      variant: "Pass #04",
    },
    {
      id: 5,
      title: "Product View 5",
      image: "/product_demo_image.jpg",
      variant: "Pass #05",
    },
    {
      id: 6,
      title: "Product View 6",
      image: "/product_demo_image.jpg",
      variant: "Pass #06",
    },
  ],
  descriptionParagraphs: [
    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.",
    "It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
  ],
  whatsIncluded: [
    "Premium access",
    "Account credentials",
    "Setup instructions",
    "Product support",
  ],
  productDetails: [
    { label: "Category", value: "Streaming" },
    { label: "Platform", value: "Netflix" },
    { label: "Plan", value: "Premium" },
    { label: "Region", value: "Global" },
  ],
  deliveryInfo: {
    title: "Instant Delivery",
    description: "Your product will be delivered after successful payment.",
  },
  buyerProtection: [
    { label: "Category", value: "Streaming" },
    { label: "Platform", value: "Netflix" },
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
    growth: "+21% ↑",
    growthSubtext: "Growth in reviews on this year",
    averageRating: "4.0",
    ratingSubtext: "Average Ratings on the year",
    distribution: [
      { stars: 5, count: "2.2k", percentage: 92 },
      { stars: 4, count: "1.0k", percentage: 55 },
      { stars: 3, count: "500", percentage: 25 },
      { stars: 2, count: "200", percentage: 10 },
      { stars: 1, count: "0", percentage: 2 },
    ],
    items: [
      {
        id: 1,
        author: "Farzana A.",
        avatar: "/review_avater.jpg",
        rating: 5,
        ratingFormatted: "5.0",
        comment:
          "Love this shampoo! My hair feels so fresh and smooth. Love this shampoo! My hair feels so fresh and smooth.Love this shampoo! My hair feels so fresh and smooth. Love this shampoo! My hair feels so fresh and smooth.",
      },
      {
        id: 2,
        author: "Farzana A.",
        avatar: "/review_avater.jpg",
        rating: 5,
        ratingFormatted: "5.0",
        comment:
          "Love this shampoo! My hair feels so fresh and smooth. Love this shampoo! My hair feels so fresh and smooth.Love this shampoo! My hair feels so fresh and smooth. Love this shampoo! My hair feels so fresh and smooth.",
      },
      {
        id: 3,
        author: "Farzana A.",
        avatar: "/review_avater.jpg",
        rating: 5,
        ratingFormatted: "5.0",
        comment:
          "Love this shampoo! My hair feels so fresh and smooth. Love this shampoo! My hair feels so fresh and smooth.Love this shampoo! My hair feels so fresh and smooth. Love this shampoo! My hair feels so fresh and smooth.",
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
      image: found.productImage || g.image || "/product_demo_image.jpg",
      variant: `${found.subcategory || "Item"} #${idx + 1}`,
    })),
  };
}
