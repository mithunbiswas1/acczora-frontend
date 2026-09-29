// src/data/singleProductData.js

import { products } from "./productData";
import { productReviewsData } from "./reviewData";

export const defaultProduct = {
  id: 1,
  slug: "facebook-account",
  category: "Social Media",
  categoryTags: "Social Media / Facebook",
  subcategory: "Facebook",
  title: "Facebook Account",
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
    { label: "Category", value: "Social Media" },
    { label: "Platform", value: "Facebook" },
    { label: "Plan", value: "Verified Account" },
    { label: "Region", value: "Global" },
  ],
  deliveryInfo: {
    title: "Instant Delivery",
    description: "Your product will be delivered after successful payment.",
  },
  buyerProtection: [
    { label: "Category", value: "Social Media" },
    { label: "Platform", value: "Facebook" },
    { label: "Plan", value: "Verified Account" },
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
      isActive: true,
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
  reviewsData: productReviewsData,
};

export function getProductBySlug(slug) {
  if (!slug) return defaultProduct;

  const found = products.find(
    (p) =>
      p.slug?.toLowerCase() === slug.toLowerCase() ||
      String(p.id) === String(slug),
  );

  if (!found) {
    return {
      ...defaultProduct,
      title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      slug,
      category: "",
      subcategory: "",
      categoryTags: "",
    };
  }

  return {
    ...defaultProduct,
    id: found.id,
    slug: found.slug || slug,
    category: found.category || "",
    subcategory: found.subcategory || "",
    categoryTags:
      found.category && found.subcategory
        ? `${found.category} / ${found.subcategory}`
        : found.category || found.subcategory || "",
    title: found.title,
    price: found.price,
    seller: {
      ...defaultProduct.seller,
      ...(found.seller || {}),
    },
    gallery: defaultProduct.gallery.map((g, idx) => ({
      ...g,
      image: found.productImage || found.image || g.image || "/product_demo_image.jpg",
      variant: `${found.subcategory || found.category || "Item"} #${idx + 1}`,
    })),
    reviewsData: productReviewsData,
  };
}
